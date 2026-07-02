import { Response } from "express";
import Purchase from "../models/Purchase";
import Vendor from "../models/Vendor";
import { AuthRequest } from "../middleware/authMiddleware";

const recalculateVendorOutstanding = async (tenantId: string, vendorId: string) => {
  const purchases = await Purchase.find({ tenantId, vendorId }).select("outstandingAmount");
  const outstanding = purchases.reduce((sum, purchase) => sum + Number(purchase.outstandingAmount || 0), 0);
  await Vendor.findByIdAndUpdate(vendorId, { $set: { outstandingAmount: outstanding } });
  return outstanding;
};

export const getVendors = async (req: AuthRequest, res: Response) => {
  try {
    const vendors = await Vendor.find({ tenantId: req.user?.tenantId }).sort({ createdAt: -1 });
    const enrichedVendors = await Promise.all(
      vendors.map(async (vendor) => {
        const outstandingAmount = await recalculateVendorOutstanding(req.user?.tenantId as string, vendor._id.toString());
        return { ...vendor.toObject(), outstandingAmount };
      })
    );
    res.json(enrichedVendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getVendorById = async (req: AuthRequest, res: Response) => {
  try {
    const vendor = await Vendor.findOne({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const outstandingAmount = await recalculateVendorOutstanding(req.user?.tenantId as string, vendor._id.toString());

    return res.json({ ...vendor.toObject(), outstandingAmount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const createVendor = async (req: AuthRequest, res: Response) => {
  try {
    const vendor = await Vendor.create({
      ...req.body,
      tenantId: req.user?.tenantId,
      outstandingAmount: Number(req.body.openingBalance || 0),
    });

    res.status(201).json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateVendor = async (req: AuthRequest, res: Response) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      {
        _id: req.params.id,
        tenantId: req.user?.tenantId,
      },
      req.body,
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    return res.json(vendor);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteVendor = async (req: AuthRequest, res: Response) => {
  try {
    const vendor = await Vendor.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    return res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
