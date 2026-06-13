import QRCode from "qrcode";
import { getOrCreateClient, whatsappStatus } from "../services/whatsappService";
import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import Tenant from "../models/Tenant";

export const getWhatsAppQR = async (
  req: AuthRequest,
  res: Response
) => {

  const tenantId = req.user?.tenantId as string;
  if (!tenantId) {
    return res.status(401).json({
      message: "Tenant not found",
    });
  }

  const client = getOrCreateClient(tenantId);

  client.once("qr", async (qr) => {

    const qrImage =
      await QRCode.toDataURL(qr);

    return res.json({
      qr: qrImage,
    });

  });

};

export const getWhatsAppStatus =
async (
  req: AuthRequest,
  res: Response
) => {

  const tenant =
    await Tenant.findById(
      req.user?.tenantId
    );

  return res.json({
    connected:
      tenant?.whatsappConnected || false
  });

};