// scripts/migrateTenants.js (run with `node` or via a CLI script)
import mongoose from 'mongoose';
import Tenant from '../models/Tenant';

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  const now = new Date();
  const trialEnd = new Date(now.getTime() + 7*24*60*60*1000);
  const res = await Tenant.updateMany(
    { subscriptionEndDate: { $exists: false } },
    {
      $set: {
        plan: "TRIAL",
        accountStatus: "ACTIVE",
        subscriptionType: "TRIAL",
        trialEndDate: trialEnd,
        subscriptionEndDate: trialEnd
      }
    }
  );
  console.log(`Migrated ${res.modifiedCount} tenants to TRIAL status.`);
  mongoose.disconnect();
}
migrate();
