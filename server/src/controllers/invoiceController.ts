import { Response } from "express";

import Invoice from "../models/Invoice";
import PriceHistory from "../models/PriceHistory";

import { AuthRequest } from "../middleware/authMiddleware";
import Tenant from "../models/Tenant";

export const createInvoice = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const {
      customerId,
      items,
      invoiceDate,
      notes,
      vehicleNumber
    } = req.body;
    const tenant =
    await Tenant.findById(
        req.user?.tenantId
    );

    const invoiceNumber =
  `${String(            //INV REMOVED
    tenant!.invoiceCounter
  ).padStart(3, "0")}`;

    const subtotal =
      items.reduce(
        (
          sum: number,
          item: any
        ) =>
          sum +
          item.quantity *
          item.price,
        0
      );

    const gstAmount =
      items.reduce(
        (
          sum:number,
          item:any
        ) =>
          sum +
          (
            item.quantity *
            item.price *
            item.gstPercent
          ) / 100,
        0
      );

    const grandTotal =
      subtotal + gstAmount;

    const invoice =
      await Invoice.create({
        tenantId:
          req.user?.tenantId,

        customerId,

        invoiceNumber:
          invoiceNumber,

        items,

        subtotal,
        vehicleNumber,
        gstAmount,
        grandTotal,
        totalAmount:
          subtotal,
        paidAmount:
          0,
        outstandingAmount:
          grandTotal,
        paymentStatus:
          "Pending",
        invoiceDate,
        notes
      });
      

    for (const item of items) {

      await PriceHistory.create({
        tenantId:
          req.user?.tenantId,

        customerId,

        productId:
          item.productId,

        soldPrice:
          item.price,

        quantity:
          item.quantity,
      });

    }
    tenant!.invoiceCounter += 1;

    await tenant!.save();

    return res.status(201).json(
      invoice
    );

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }
};

export const getInvoices = async (
  req: AuthRequest,
  res: Response
) => {

  const invoices =
    await Invoice.find({
      tenantId:
        req.user?.tenantId,
    })
    .populate(
      "customerId",
      "name"
    );

  res.json(invoices);
};

export const getInvoiceById = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const invoice =
      await Invoice.findOne({
        _id: req.params.id,
        tenantId:
          req.user?.tenantId,
      })
      .populate(
        "customerId"
      )
      .populate(
        "items.productId"
      )
      .populate("tenantId");

    if (!invoice) {
      return res.status(404).json({
        message:
          "Invoice not found",
      });
    }

    return res.status(200).json(
      invoice
    );

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message:
        "Server Error",
    });

  }
};

export const getNextInvoiceNumber =
async (
  req: AuthRequest,
  res: Response
) => {

  const tenant =
    await Tenant.findById(
      req.user?.tenantId
    );

  return res.json({
    invoiceNumber:
      `${String(      //INV REMOVED
        tenant?.invoiceCounter || 1
      ).padStart(3, "0")}`,
  });

};