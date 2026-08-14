import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/authService';

export default function VerifyEmail() {
  const location = useLocation();
  const state = (location.state || {}) as { email?: string; message?: string };
  const [form, setForm] = useState({ email: state.email || '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success] = useState(state.message || '');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyEmail(form);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-slate-900/80 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-4">Verify Email</h2>
        {success && <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-emerald-200">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-3 rounded bg-slate-800" />
          <input name="otp" placeholder="Enter 6-digit OTP" value={form.otp} onChange={handleChange} className="w-full p-3 rounded bg-slate-800" />
          {error && <div className="text-red-400">{error}</div>}
          <button disabled={loading} className="w-full bg-cyan-500 py-3 rounded text-slate-900 font-semibold">{loading ? 'Verifying...' : 'Verify'}</button>
        </form>
      </div>
    </div>
  );
}
