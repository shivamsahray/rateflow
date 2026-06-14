
import React, { useState } from "react";
import axios from "axios";

const SubscriptionRequestForm: React.FC = () => {
  const [plan, setPlan] = useState<"MONTHLY"|"YEARLY">("MONTHLY");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please upload a payment screenshot.");
      return;
    }
    const formData = new FormData();
    formData.append("planType", plan);
    formData.append("screenshot", file);

    try {
      const res = await axios.post("/api/subscription/request", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage(res.data.message || "Submitted successfully");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upgrade Subscription</h2>
      <div>
        <label>
          <input
            type="radio"
            value="MONTHLY"
            checked={plan === "MONTHLY"}
            onChange={() => setPlan("MONTHLY")}
          />
          Monthly - ₹149
        </label>
        <label style={{ marginLeft: 20 }}>
          <input
            type="radio"
            value="YEARLY"
            checked={plan === "YEARLY"}
            onChange={() => setPlan("YEARLY")}
          />
          Yearly - ₹1299
        </label>
      </div>
      <div>
        <label>
          Upload Payment Screenshot:
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>
      <button type="submit">Submit Payment Proof</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default SubscriptionRequestForm;
