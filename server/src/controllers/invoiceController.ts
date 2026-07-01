// import { Response } from "express";

// import Invoice from "../models/Invoice";
// import PriceHistory from "../models/PriceHistory";

// import { AuthRequest } from "../middleware/authMiddleware";
// import Tenant from "../models/Tenant";
// import Product from "../models/Product";

// export const createInvoice = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {

//     const {
//       customerId,
//       items,
//       invoiceDate,
//       notes,
//       vehicleNumber,
//       ewayBillNumber
//     } = req.body;
//     const tenant =
//     await Tenant.findById(
//         req.user?.tenantId
//     );

//     const invoiceNumber =
//   `${String(            //INV REMOVED
//     tenant!.invoiceCounter
//   ).padStart(3, "0")}`;

//     const subtotal =
//       items.reduce(
//         (
//           sum: number,
//           item: any
//         ) =>
//           sum +
//           item.quantity *
//           item.price,
//         0
//       );

//     const gstAmount =
//       items.reduce(
//         (
//           sum:number,
//           item:any
//         ) =>
//           sum +
//           (
//             item.quantity *
//             item.price *
//             item.gstPercent
//           ) / 100,
//         0
//       );

//     const grandTotal =
//       subtotal + gstAmount;

//     const invoice =
//       await Invoice.create({
//         tenantId:
//           req.user?.tenantId,

//         customerId,

//         invoiceNumber:
//           invoiceNumber,

//         items,

//         subtotal,
//         vehicleNumber,
//         gstAmount,
//         grandTotal,
//         ewayBillNumber,
//         totalAmount:
//           subtotal,
//         paidAmount:
//           0,
//         outstandingAmount:
//           grandTotal,
//         paymentStatus:
//           "Pending",
//         invoiceDate,
//         notes
//       });
      
//     for (const item of invoice.items) {
//       await Product.findByIdAndUpdate(
//         item.productId,
//         { $inc: { stock: -item.quantity } }
//       );
//     }

//     for (const item of items) {

//       await PriceHistory.create({
//         tenantId:
//           req.user?.tenantId,

//         customerId,

//         productId:
//           item.productId,

//         soldPrice:
//           item.price,

//         quantity:
//           item.quantity,
//       });

//     }
//     tenant!.invoiceCounter += 1;

//     await tenant!.save();

//     return res.status(201).json(
//       invoice
//     );

//   } catch (error) {

//     console.error(error);

//     return res.status(500).json({
//       message: "Server Error",
//     });

//   }
// };

// export const getInvoices = async (
//   req: AuthRequest,
//   res: Response
// ) => {

//   const invoices =
//     await Invoice.find({
//       tenantId:
//         req.user?.tenantId,
//     })
//     .populate(
//       "customerId",
//       "name"
//     );

//   res.json(invoices);
// };

// export const getInvoiceById = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {

//     const invoice =
//       await Invoice.findOne({
//         _id: req.params.id,
//         tenantId:
//           req.user?.tenantId,
//       })
//       .populate(
//         "customerId"
//       )
//       .populate(
//         "items.productId"
//       )
//       .populate("tenantId");

//     if (!invoice) {
//       return res.status(404).json({
//         message:
//           "Invoice not found",
//       });
//     }

//     return res.status(200).json(
//       invoice
//     );

//   } catch (error) {

//     console.error(error);

//     return res.status(500).json({
//       message:
//         "Server Error",
//     });

//   }
// };

// export const getNextInvoiceNumber =
// async (
//   req: AuthRequest,
//   res: Response
// ) => {

//   const tenant =
//     await Tenant.findById(
//       req.user?.tenantId
//     );

//   return res.json({
//     invoiceNumber:
//       `${String(      //INV REMOVED
//         tenant?.invoiceCounter || 1
//       ).padStart(3, "0")}`,
//   });

// };

// export const updateInvoice = async (req: AuthRequest, res: Response) => {
//   try {
//     const { id } = req.params;
 
//     // Ensure invoice belongs to this tenant
//     const existing = await Invoice.findOne({
//       _id: id,
//       tenantId: req.user?.tenantId,
//     });
 
//     if (!existing) {
//       return res.status(404).json({ message: "Invoice not found" });
//     }
 
//     const { items, notes, vehicleNumber, ewayBillNumber, invoiceDate, paymentTerms } =
//       req.body;
 
//     // Recalculate totals if items are being updated
//     let subtotal = existing.subtotal;
//     let gstAmount = existing.gstAmount;
//     let grandTotal = existing.grandTotal;
 
//     if (items && items.length > 0) {
//       subtotal = items.reduce(
//         (sum: number, item: any) => sum + item.quantity * item.price,
//         0
//       );
 
//       gstAmount = items.reduce(
//         (sum: number, item: any) =>
//           sum + (item.quantity * item.price * item.gstPercent) / 100,
//         0
//       );
 
//       grandTotal = subtotal + gstAmount;

//       // ✅ FIX 1: Pehle purane items ka stock WAPAS karo
//       for (const oldItem of existing.items) {
//         await Product.findByIdAndUpdate(
//           oldItem.productId,
//           { $inc: { stock: +oldItem.quantity } }
//         );
//       }
 
//       // ✅ FIX 2: Ab naye items ka stock GHATA do
//       for (const newItem of items) {
//         await Product.findByIdAndUpdate(
//           newItem.productId,
//           { $inc: { stock: -newItem.quantity } }
//         );
//       }
//     }
    
 
//     // outstandingAmount = grandTotal - paidAmount (keep paidAmount intact)
//     const outstandingAmount = grandTotal - (existing.paidAmount || 0);
 
//     // Determine payment status based on outstanding
//     let paymentStatus = existing.paymentStatus;
//     if (outstandingAmount <= 0) {
//       paymentStatus = "Paid";
//     } else if ((existing.paidAmount || 0) > 0) {
//       paymentStatus = "Partial";
//     } else {
//       paymentStatus = "Pending";
//     }
 
//     const updated = await Invoice.findByIdAndUpdate(
//       id,
//       {
//         ...(items && { items }),
//         ...(invoiceDate && { invoiceDate }),
//         ...(notes !== undefined && { notes }),
//         ...(vehicleNumber !== undefined && { vehicleNumber }),
//         ...(ewayBillNumber !== undefined && { ewayBillNumber }),
//         ...(paymentTerms !== undefined && { paymentTerms }),
//         subtotal,
//         gstAmount,
//         grandTotal,
//         totalAmount: subtotal,
//         outstandingAmount,
//         paymentStatus,
//       },
//       { new: true }
//     )
//       .populate("customerId")
//       .populate("items.productId");
 
//     return res.status(200).json(updated);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server Error" });
//   }
// };
 
// // ─── DELETE INVOICE ────────────────────────────────────────────────────────────
// export const deleteInvoice = async (req: AuthRequest, res: Response) => {
//   try {
//     const { id } = req.params;
 
//     const invoice = await Invoice.findOneAndDelete({
//       _id: id,
//       tenantId: req.user?.tenantId,
//     });
 
//     if (!invoice) {
//       return res.status(404).json({ message: "Invoice not found" });
//     }

//     for (const item of invoice.items) {
//       await Product.findByIdAndUpdate(
//         item.productId,
//         { $inc: { stock: +item.quantity } }
//       );
//     }
 
//     return res.status(200).json({ message: "Invoice deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server Error" });
//   }
// };
 

import { Response } from "express";

import Invoice from "../models/Invoice";
import PriceHistory from "../models/PriceHistory";

import { AuthRequest } from "../middleware/authMiddleware";
import Tenant from "../models/Tenant";
import Product from "../models/Product";
import Customer from "../models/Customer";
import {
  sendWhatsAppMessage,
  buildInvoiceMessage,
} from "../services/whatsappService";

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
      vehicleNumber,
      ewayBillNumber
    } = req.body;

    const tenant = await Tenant.findById(req.user?.tenantId);

    const invoiceNumber =
      `${String(tenant!.invoiceCounter).padStart(3, "0")}`;

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.price, 0
    );

    const gstAmount = items.reduce(
      (sum: number, item: any) =>
        sum + (item.quantity * item.price * item.gstPercent) / 100, 0
    );

    const grandTotal = subtotal + gstAmount;

    const invoice = await Invoice.create({
      tenantId:         req.user?.tenantId,
      customerId,
      invoiceNumber,
      items,
      subtotal,
      vehicleNumber,
      gstAmount,
      grandTotal,
      ewayBillNumber,
      totalAmount:      subtotal,
      paidAmount:       0,
      outstandingAmount: grandTotal,
      paymentStatus:    "Pending",
      invoiceDate,
      notes,
    });

    for (const item of invoice.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    for (const item of items) {
      await PriceHistory.create({
        tenantId:  req.user?.tenantId,
        customerId,
        productId: item.productId,
        soldPrice: item.price,
        quantity:  item.quantity,
      });
    }

    tenant!.invoiceCounter += 1;
    await tenant!.save();

    // ✅ WhatsApp: invoice create hone pe customer ko message bhejo
    if (tenant?.whatsappConnected && customerId) {
      try {
        const customer = await Customer.findById(customerId);
        if (customer?.phone && !customer.isDefault) {
          const formattedDate = invoiceDate
            ? new Date(invoiceDate).toLocaleDateString("en-IN")
            : new Date().toLocaleDateString("en-IN");

          const message = buildInvoiceMessage(
            tenant.companyName,
            customer.name,
            invoiceNumber,
            grandTotal,
            formattedDate
          );

          await sendWhatsAppMessage(
            req.user?.tenantId as string,
            customer.phone,
            message
          );
        }
      } catch (waError) {
        // WhatsApp fail hone pe invoice create fail nahi hona chahiye
        console.error("WhatsApp notification failed:", waError);
      }
    }

    return res.status(201).json(invoice);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getInvoices = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tenantId = req.user?.tenantId;
    const { page, limit } = req.query;

    // Agar page query param nahi bheja, purana behavior hi rahega (saari invoices, sorted latest-first)
    if (!page) {
      const invoices = await Invoice.find({ tenantId })
        .populate("customerId", "name")
        .sort({ invoiceDate: -1, createdAt: -1 });

      return res.json(invoices);
    }

    const pageNum = Math.max(parseInt(page as string) || 1, 1);
    const limitNum = Math.max(parseInt((limit as string) || "10") || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    const [invoices, total] = await Promise.all([
      Invoice.find({ tenantId })
        .populate("customerId", "name")
        .sort({ invoiceDate: -1, createdAt: -1 }) // latest invoices sabse pehle
        .skip(skip)
        .limit(limitNum),
      Invoice.countDocuments({ tenantId }),
    ]);

    return res.json({
      invoices,
      total,
      page: pageNum,
      totalPages: Math.max(Math.ceil(total / limitNum), 1),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getInvoiceById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    })
      .populate("customerId")
      .populate("items.productId")
      .populate("tenantId");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getNextInvoiceNumber = async (
  req: AuthRequest,
  res: Response
) => {
  const tenant = await Tenant.findById(req.user?.tenantId);
  return res.json({
    invoiceNumber: `${String(tenant?.invoiceCounter || 1).padStart(3, "0")}`,
  });
};

export const updateInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await Invoice.findOne({
      _id: id,
      tenantId: req.user?.tenantId,
    });

    if (!existing) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const { items, notes, vehicleNumber, ewayBillNumber, invoiceDate, paymentTerms } =
      req.body;

    let subtotal   = existing.subtotal;
    let gstAmount  = existing.gstAmount;
    let grandTotal = existing.grandTotal;

    if (items && items.length > 0) {
      subtotal = items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.price, 0
      );
      gstAmount = items.reduce(
        (sum: number, item: any) =>
          sum + (item.quantity * item.price * item.gstPercent) / 100, 0
      );
      grandTotal = subtotal + gstAmount;

      for (const oldItem of existing.items) {
        await Product.findByIdAndUpdate(
          oldItem.productId,
          { $inc: { stock: +oldItem.quantity } }
        );
      }
      for (const newItem of items) {
        await Product.findByIdAndUpdate(
          newItem.productId,
          { $inc: { stock: -newItem.quantity } }
        );
      }
    }

    const outstandingAmount = grandTotal - (existing.paidAmount || 0);

    let paymentStatus = existing.paymentStatus;
    if (outstandingAmount <= 0) {
      paymentStatus = "Paid";
    } else if ((existing.paidAmount || 0) > 0) {
      paymentStatus = "Partial";
    } else {
      paymentStatus = "Pending";
    }

    const updated = await Invoice.findByIdAndUpdate(
      id,
      {
        ...(items && { items }),
        ...(invoiceDate && { invoiceDate }),
        ...(notes !== undefined && { notes }),
        ...(vehicleNumber !== undefined && { vehicleNumber }),
        ...(ewayBillNumber !== undefined && { ewayBillNumber }),
        ...(paymentTerms !== undefined && { paymentTerms }),
        subtotal,
        gstAmount,
        grandTotal,
        totalAmount: subtotal,
        outstandingAmount,
        paymentStatus,
      },
      { new: true }
    )
      .populate("customerId")
      .populate("items.productId");

    // ✅ WhatsApp: invoice update hone pe bhi message bhejo
    if (updated) {
      try {
        const tenant = await Tenant.findById(req.user?.tenantId);
        if (tenant?.whatsappConnected) {
          const customer = await Customer.findById(existing.customerId);
          if (customer?.phone && !customer.isDefault) {
            const formattedDate = invoiceDate
              ? new Date(invoiceDate).toLocaleDateString("en-IN")
              : new Date().toLocaleDateString("en-IN");

            const message = buildInvoiceMessage(
              tenant.companyName,
              customer.name,
              existing.invoiceNumber,
              grandTotal,
              formattedDate
            );

            await sendWhatsAppMessage(
              req.user?.tenantId as string,
              customer.phone,
              message
            );
          }
        }
      } catch (waError) {
        console.error("WhatsApp notification failed:", waError);
      }
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findOne({
      _id: id,
      tenantId: req.user?.tenantId,
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    for (const item of invoice.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: +item.quantity } }
      );
    }

    await invoice.deleteOne();

    return res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};