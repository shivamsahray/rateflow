import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getSettings,
  updateSettings,
} from "../services/settingsService";
import api from "../services/api";
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
      defaultTerms: "", // ✅ NEW
    });

  const [isSaving, setIsSaving] =
    useState(false);
  const [qr, setQr] = useState("");
  const [isConnected,
    setIsConnected] =
    useState(false);

    const loadStatus =
      async () => {

        const data =
          await api.get(
            "/settings/whatsapp/status"
          );

        setIsConnected(
          data.data.connected
        );
      };

  const [uploadingField, setUploadingField] =
    useState<"logo" | "signature" | null>(
      null
    );
    const loadQR = async () => {

         try {
            const data = await api.get(
              "/settings/whatsapp/qr"
            );

            setQr(data.data.qr);

            const interval = setInterval(
              async () => {
                const status =
                  await api.get(
                    "/settings/whatsapp/status"
                  );

                if (
                  status.data.connected
                ) {
                  setIsConnected(true);
                  setQr("");

                  clearInterval(
                    interval
                  );
                }
              },
              3000
            );
          } catch (err) {
            console.log(err);
          }
      };

  const handleDisconnect = async () => {
    if (!confirm("WhatsApp disconnect karna chahte ho?")) return;
    try {
      await api.post("/settings/whatsapp/disconnect");
      setIsConnected(false);
      setQr("");
      alert("WhatsApp disconnected successfully");
    } catch (err) {
      console.error(err);
      alert("Disconnect failed");
    }
  };

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
          defaultTerms:
            data?.defaultTerms || "", // ✅ NEW
        });
      };

    loadSettings();
    loadStatus();
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

            {/* ✅ NEW: Default Terms & Conditions — applies to ALL invoices */}
            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Default Terms & Conditions
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Ye lines har invoice ke PDF mein "Terms & Conditions" section mein dikhengi.
                Har naya point ek nayi line mein likhein.
              </p>

              <textarea
                name="defaultTerms"
                placeholder={"Goods once sold will not be taken back.\nSubject to local jurisdiction.\nPayment due within agreed credit period."}
                value={formData.defaultTerms}
                onChange={handleChange}
                rows={5}
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
          <div>
            {/* <button
            type="button"
              onClick={loadQR}
              className="mt-4 rounded bg-green-600 px-4 py-2 text-white"
            >
              Connect WhatsApp
            </button> */}
            {isConnected ? (
              <div className="mt-6 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold text-green-700">WhatsApp Connected</p>
                    <p className="text-xs text-green-600 mt-0.5">Messages will be sent automatically</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 bg-white hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-5">
                <p className="text-sm font-semibold text-slate-700 mb-1">Connect WhatsApp</p>
                <p className="text-xs text-slate-500 mb-4">Scan QR code from WhatsApp → Linked Devices → Link a Device</p>
                {!qr ? (
                  <button
                    type="button"
                    onClick={loadQR}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Show QR Code
                  </button>
                ) : (
                  <div className="text-center">
                    <img src={qr} alt="WhatsApp QR" className="mx-auto w-48 h-48 rounded-lg border border-slate-200" />
                    <p className="text-xs text-slate-500 mt-2 animate-pulse">Waiting for scan...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;