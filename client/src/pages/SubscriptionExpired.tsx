// SubscriptionExpired.tsx
// Ye screen tab dikhti hai jab API 403 + subscriptionExpired: true return kare

import { useState } from "react";
import api from "../services/api";

export default function SubscriptionExpired() {
  const [copied, setCopied] = useState(false);

  const upiId = ""; // apna UPI ID yahan dalo .env se ya hardcode

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">

        {/* Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Subscription Expired
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Aapka RateFlow subscription expire ho gaya hai.
          Dobara access ke liye payment karein aur hume contact karein.
        </p>

        {/* Plans */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border border-slate-200 rounded-xl p-4 text-left">
            <p className="text-xs text-slate-400 mb-1">Monthly</p>
            <p className="text-2xl font-bold text-slate-800">₹149</p>
            <p className="text-xs text-slate-400 mt-1">30 days access</p>
          </div>
          <div className="border-2 border-blue-500 rounded-xl p-4 text-left relative">
            <span className="absolute -top-2.5 left-3 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              Best Value
            </span>
            <p className="text-xs text-slate-400 mb-1">Yearly</p>
            <p className="text-2xl font-bold text-slate-800">₹1299</p>
            <p className="text-xs text-slate-400 mt-1">365 days access</p>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-slate-50 rounded-xl p-5 text-left mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">Payment karne ka tarika:</p>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <span>UPI se payment karein is ID pe:</span>
            </div>
            <div className="flex items-center gap-2 ml-7">
              <code className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-mono text-slate-800">
                {upiId}
              </code>
              <button
                onClick={copyUpi}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <span>Screenshot ya transaction ID WhatsApp pe bhejein:</span>
            </div>
            <a
              href="https://wa.me/919318345144"  // apna WhatsApp number
              target="_blank"
              rel="noreferrer"
              className="ml-7 inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 font-medium text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp pe contact karein
            </a>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <span>Verification ke baad 1-2 ghante mein access restore ho jaayega.</span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full text-sm text-slate-500 hover:text-slate-700 py-2 transition-colors"
        >
          Logout
        </button>

      </div>
    </div>
  );
}