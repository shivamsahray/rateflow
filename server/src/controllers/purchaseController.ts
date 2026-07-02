import { Response } from "express";
import Purchase from "../models/Purchase";
import Product from "../models/Product";
import Vendor from "../models/Vendor";
import StockLedger from "../models/StockLedger";
import { AuthRequest } from "../middleware/authMiddleware";

const recalculateVendorOutstanding = async (tenantId: string, vendorId: string) => {
  const purchases = await Purchase.find({ tenantId, vendorId }).select("outstandingAmount");
  const outstanding = purchases.reduce((sum, purchase) => sum + Number(purchase.outstandingAmount || 0), 0);
  await Vendor.findByIdAndUpdate(vendorId, { $set: { outstandingAmount: outstanding } });
};

const resolvePaymentStatus = (paidAmount: number, grandTotal: number) => {
  if (grandTotal <= 0) {
    return "Pending";
  }

  if (paidAmount >= grandTotal) {
    return "Paid";
  }

  if (paidAmount > 0) {
    return "Partial";
  }

  return "Pending";
};

export const createPurchase = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { vendorId, items = [], purchaseNumber, purchaseDate, invoiceNumber, invoiceDate, dueDate, warehouse, notes } = req.body;

    if (!tenantId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!vendorId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Vendor and items are required" });
    }

    const normalizedItems = items.map((item: any) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const discountPercent = Number(item.discountPercent) || 0;
      const gstPercent = Number(item.gstPercent) || 0;
      const subtotal = quantity * price;
      const discountAmount = (subtotal * discountPercent) / 100;
      const taxableAmount = Number((subtotal - discountAmount).toFixed(2));
      const gstAmount = Number((taxableAmount * (gstPercent / 100)).toFixed(2));
      const lineTotal = Number((taxableAmount + gstAmount).toFixed(2));

      return {
        productId: item.productId,
        quantity,
        price,
        discountPercent,
        gstPercent,
        taxableAmount,
        gstAmount,
        lineTotal,
      };
    });

    const subtotal = Number(
      normalizedItems.reduce((sum: number, item: any) => sum + item.quantity * item.price, 0).toFixed(2)
    );
    const discountAmount = Number(
      normalizedItems.reduce((sum: number, item: any) => sum + (item.quantity * item.price * item.discountPercent) / 100, 0).toFixed(2)
    );
    const gstAmount = Number(
      normalizedItems.reduce((sum: number, item: any) => sum + item.gstAmount, 0).toFixed(2)
    );
    const rawGrandTotal = Number((subtotal - discountAmount + gstAmount).toFixed(2));
    const roundedGrandTotal = Number(Math.round(rawGrandTotal));
    const roundOff = Number((roundedGrandTotal - rawGrandTotal).toFixed(2));

    const purchase = await Purchase.create({
      tenantId,
      vendorId,
      purchaseNumber: purchaseNumber || `PUR-${Date.now().toString().slice(-6)}`,
      purchaseDate,
      invoiceNumber,
      invoiceDate,
      dueDate,
      warehouse,
      notes,
      items: normalizedItems,
      subtotal,
      discountAmount,
      cgstAmount: Number((gstAmount / 2).toFixed(2)),
      sgstAmount: Number((gstAmount / 2).toFixed(2)),
      igstAmount: 0,
      roundOff,
      grandTotal: roundedGrandTotal,
      paidAmount: 0,
      outstandingAmount: roundedGrandTotal,
      paymentStatus: "Pending",
      status: "Completed",
    });

    await recalculateVendorOutstanding(tenantId, vendorId);

    for (const item of normalizedItems) {
      if (!item.productId) {
        continue;
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        continue;
      }

      const newStock = Number(product.stock || 0) + Number(item.quantity || 0);

      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });

      await StockLedger.create({
        tenantId,
        productId: item.productId,
        type: "Purchase",
        quantity: item.quantity,
        balance: newStock,
        referenceType: "Purchase",
        referenceId: purchase._id.toString(),
        notes: `Purchased via ${purchase.purchaseNumber}`,
      });
    }

    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate("vendorId")
      .populate("items.productId");

    return res.status(201).json(populatedPurchase);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getPurchases = async (req: AuthRequest, res: Response) => {
  try {
    const purchases = await Purchase.find({ tenantId: req.user?.tenantId })
      .populate("vendorId")
      .populate("items.productId")
      .sort({ purchaseDate: -1 });

    return res.json(purchases);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getPurchaseById = async (req: AuthRequest, res: Response) => {
  try {
    const purchase = await Purchase.findOne({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    })
      .populate("vendorId")
      .populate("items.productId");

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    return res.json(purchase);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deletePurchase = async (req: AuthRequest, res: Response) => {
  try {
    const purchase = await Purchase.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    });

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    await recalculateVendorOutstanding(purchase.tenantId.toString(), purchase.vendorId.toString());

    for (const item of purchase.items) {
      if (!item.productId) {
        continue;
      }

      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -Number(item.quantity || 0) },
      });
    }

    return res.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
