import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
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
      const data = await registerUser(formData);

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-slate-900/90 ring-1 ring-slate-700/80 shadow-2xl backdrop-blur-xl rounded-[32px] overflow-hidden grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="px-10 py-12 lg:px-14 lg:py-16 bg-slate-950/80">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-200">
              New business onboarding
            </span>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white">
              Launch your billing workspace
            </h1>
            <p className="mt-4 text-slate-300 leading-7 sm:text-lg">
              Join RateFlow to automate invoices, track payments, and keep every client account aligned with your finance operations.
            </p>
            <div className="mt-10 grid gap-4">
              <div className="rounded-[28px] border border-slate-700/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-300">What you get</p>
                <ul className="mt-5 space-y-3 text-slate-200 text-sm">
                  <li>• Custom invoice workflows for teams</li>
                  <li>• Client and subscription management</li>
                  <li>• Detailed cash-flow reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 py-12 lg:px-12 lg:py-16 bg-slate-950">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-400">Create a new account</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Start billing with confidence</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-slate-300">Company name</span>
                <input
                  name="companyName"
                  placeholder="Your company"
                  onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-300">Full name</span>
                <input
                  name="name"
                  placeholder="First Last"
                  onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-300">Work email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-300">Password</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Choose a strong password"
                  onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-3xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-lg shadow-sky-500/20 transition hover:opacity-95"
              >
                Register
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/" className="font-semibold text-sky-300 transition hover:text-sky-200">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
