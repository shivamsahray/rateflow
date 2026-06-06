import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getSettings,
  updateSettings,
} from "../services/settingsService";
import { uploadImage } from "../services/uploadService";

function Settings() {

  const [formData, setFormData] =
    useState({
      companyName: "",
      gstNumber: "",
      phone: "",
      email: "",
      address: "",
      logo: "",
      signature: "",
    });

  const [isSaving, setIsSaving] =
    useState(false);

  const [uploadingField, setUploadingField] =
    useState<"logo" | "signature" | null>(
      null
    );

  useEffect(() => {
    const loadSettings =
      async () => {
        const data =
          await getSettings();

        setFormData({
          companyName:
            data?.companyName || "",
          gstNumber:
            data?.gstNumber || "",
          phone:
            data?.phone || "",
          email:
            data?.email || "",
          address:
            data?.address || "",
          logo:
            data?.logo || "",
          signature:
            data?.signature || "",
        });
      };

    loadSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (
      e: any
    ) => {

      e.preventDefault();

      setIsSaving(true);

      try {
        await updateSettings(
          formData
        );

        alert(
          "Settings Saved"
        );
      } catch (error) {
        console.log(error);

        alert(
          "Settings save failed"
        );
      } finally {
        setIsSaving(false);
      }
    };

  const handleImageUpload =
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      field: "logo" | "signature"
    ) => {

      const file =
        e.target.files?.[0];

      if (!file) return;

      setUploadingField(field);

      try {
        const imageUrl =
          await uploadImage(file);

        setFormData((prev) => ({
          ...prev,
          [field]: imageUrl,
        }));

        alert(
          `${field} uploaded successfully`
        );
      } catch (error) {
        console.log(error);

        alert(
          "Upload failed"
        );
      } finally {
        setUploadingField(null);
      }
    };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Company Profile
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              Edit Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Update the company details used across invoices and customer documents.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            Back to Dashboard
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Company Name
              </span>

              <input
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                GST Number
              </span>

              <input
                name="gstNumber"
                placeholder="GST Number"
                value={formData.gstNumber}
                onChange={handleChange}
                className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Phone
              </span>

              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Email
              </span>

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Address
              </span>

              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Company Logo
              </label>

              {formData.logo && (
                <img
                  src={formData.logo}
                  alt="logo"
                  className="mb-3 h-24 rounded border border-slate-200 bg-white object-contain p-2"
                />
              )}

              <input
                type="file"
                accept="image/*"
                disabled={uploadingField === "logo"}
                onChange={(e) =>
                  handleImageUpload(
                    e,
                    "logo"
                  )
                }
                className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {uploadingField === "logo" && (
                <p className="mt-2 text-sm text-slate-500">
                  Uploading logo...
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Signature
              </label>

              {formData.signature && (
                <img
                  src={formData.signature}
                  alt="signature"
                  className="mb-3 h-20 rounded border border-slate-200 bg-white object-contain p-2"
                />
              )}

              <input
                type="file"
                accept="image/*"
                disabled={
                  uploadingField === "signature"
                }
                onChange={(e) =>
                  handleImageUpload(
                    e,
                    "signature"
                  )
                }
                className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {uploadingField === "signature" && (
                <p className="mt-2 text-sm text-slate-500">
                  Uploading signature...
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSaving
                ? "Saving..."
                : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
