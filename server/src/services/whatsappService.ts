import { Client, LocalAuth } from "whatsapp-web.js";
import Tenant from "../models/Tenant";

const clients = new Map<string, Client>();
export const whatsappStatus =
  new Map<string, boolean>();

export const getOrCreateClient = (tenantId: string) => {
  if (clients.has(tenantId)) {
    return clients.get(tenantId)!;
  }

  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: tenantId,
    }),
  });

  client.on("qr", () => {
    console.log(
        `QR Generated For Tenant ${tenantId}`
    );
    });

    client.on("authenticated", () => {
    console.log(
        `WhatsApp Authenticated For Tenant ${tenantId}`
    );
    });

    client.on("ready", async () => {
        await Tenant.findByIdAndUpdate(
            tenantId,
            {
                whatsappConnected: true
            }
            
        );
    console.log(
        `WhatsApp Ready For Tenant ${tenantId}`
    );
    });

    client.on("auth_failure", (msg) => {
    console.log(
        `Auth Failed: ${msg}`
    );
    });

    client.on("disconnected", async(reason) => {
        await Tenant.findByIdAndUpdate(
            tenantId,
            {
                whatsappConnected: false
            }
        );
    console.log(
        `Disconnected: ${reason}`
    );
    });

  client.initialize();

  clients.set(tenantId, client);

  return client;
};