import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-slate-900/90 ring-1 ring-slate-700/80 shadow-2xl backdrop-blur-xl rounded-[32px] overflow-hidden grid gap-0 lg:grid-cols-[1.2fr_0.9fr]">
        <div className="relative px-10 py-12 lg:px-14 lg:py-16 bg-slate-950/80">
          <div className="absolute inset-y-0 left-0 w-2 bg-cyan-500/90 rounded-r-[32px]" />
          <div className="relative max-w-xl ml-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              B2B Billing Software
            </span>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white">
              Business-grade login for RateFlow
            </h1>
            <p className="mt-4 text-slate-300 leading-7 sm:text-lg">
              Secure access for finance teams, accountants, and operations. Manage invoices, payments, and customer accounts from one intelligent portal.
            </p>
            <div className="mt-10 grid gap-4">
              <div className="rounded-[28px] border border-slate-700/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Designed for enterprise teams</p>
                <ul className="mt-5 space-y-3 text-slate-200 text-sm">
                  <li>• Multi-company billing workflows</li>
                  <li>• Audit-ready reports and approvals</li>
                  <li>• Bank-grade security and SSO-ready layout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 py-12 lg:px-12 lg:py-16 bg-slate-950">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-400">Secure sign in</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Enter your company credentials</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-slate-300">Work email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-300">Password</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter password"
                  onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-3xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
              >
                Login
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              New to RateFlow?{' '}
              <Link to="/register" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
