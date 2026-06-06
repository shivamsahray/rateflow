import { useState } from "react";

interface Props {
  onSubmit: (data: any) => void;
}

function CustomerForm({
  onSubmit,
}: Props) {

  const [formData, setFormData] =
    useState({
      name: "",
      gstNumber: "",
      phone: "",
      address: "",
      creditLimit: 0,
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    onSubmit(formData);

    setFormData({
      name: "",
      gstNumber: "",
      phone: "",
      address: "",
      creditLimit: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Customer Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        name="gstNumber"
        placeholder="GST Number"
        value={formData.gstNumber}
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <input
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />

      <input
        name="creditLimit"
        type="number"
        placeholder="Credit Limit"
        value={formData.creditLimit}
        onChange={handleChange}
      />

      <button type="submit">
        Add Customer
      </button>
    </form>
  );
}

export default CustomerForm;