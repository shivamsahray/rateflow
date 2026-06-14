// src/pages/AdminPaymentRequests.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface PaymentRequest {
  _id: string;
  tenantId: string;
  planType: string;
  amount: number;
  status: string;
  createdAt: string;
}

const AdminPaymentRequests: React.FC = () => {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);

  useEffect(() => {
    axios.get("/api/subscription/admin/requests")
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAction = (id: string, approve: boolean) => {
    const url = `/api/subscription/admin/requests/${id}/${approve ? "approve" : "reject"}`;
    axios.post(url)
      .then(() => {
        setRequests(prev => prev.filter(r => r._id !== id));
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Payment Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Tenant ID</th>
            <th>Plan</th>
            <th>Amount</th>
            <th>Requested</th>
            <th>Status</th>
            <th>Approve</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req._id}>
              <td>{req.tenantId}</td>
              <td>{req.planType}</td>
              <td>₹{req.amount}</td>
              <td>{new Date(req.createdAt).toLocaleString()}</td>
              <td>{req.status}</td>
              <td>
                <button onClick={() => handleAction(req._id, true)}>Approve</button>
              </td>
              <td>
                <button onClick={() => handleAction(req._id, false)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPaymentRequests;
