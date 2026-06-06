import { useState } from "react";

interface Props {
  onSubmit: (data: any) => void;
}

function ProductForm({
  onSubmit,
}: Props) {

  const [formData, setFormData] =
    useState({
      name: "",
      sku: "",
      unit: "",
      gstPercent: 18,
      defaultPrice: 0,
      stock: 0,
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
      sku: "",
      unit: "",
      gstPercent: 18,
      defaultPrice: 0,
      stock: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit}>

      <input
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        name="sku"
        placeholder="SKU"
        value={formData.sku}
        onChange={handleChange}
      />

      <input
        name="unit"
        placeholder="Unit"
        value={formData.unit}
        onChange={handleChange}
      />

      <input
        name="gstPercent"
        type="number"
        placeholder="GST %"
        value={formData.gstPercent}
        onChange={handleChange}
      />

      <input
        name="defaultPrice"
        type="number"
        placeholder="Default Price"
        value={formData.defaultPrice}
        onChange={handleChange}
      />

      <input
        name="stock"
        type="number"
        placeholder="Opening Stock"
        value={formData.stock}
        onChange={handleChange}
      />

      <button type="submit">
        Add Product
      </button>

    </form>
  );
}

export default ProductForm;