import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';

export default function ResetPassword() {
  const location = useLocation();
  const state = (location.state || {}) as { email?: string };
  const [form, setForm] = useState({ email: state.email || '', otp: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    if (form.newPassword !== form.confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
    try {
      await resetPassword({ email: form.email, otp: form.otp, newPassword: form.newPassword });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error resetting password');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-slate-900/80 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
        <form onSubmit={submit} className="space-y-4">
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 rounded bg-slate-800"
            readOnly={Boolean(state.email)}
            disabled={Boolean(state.email)}
          />
          {state.email && (
            <div className="text-sm text-slate-400">Password reset OTP has been sent to this email.</div>
          )}
          <input name="otp" value={form.otp} onChange={handleChange} placeholder="6-digit OTP" className="w-full p-3 rounded bg-slate-800" />
          <input name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="New password" type="password" className="w-full p-3 rounded bg-slate-800" />
          <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" type="password" className="w-full p-3 rounded bg-slate-800" />
          {error && <div className="text-red-400">{error}</div>}
          <button disabled={loading} className="w-full bg-cyan-500 py-3 rounded text-slate-900 font-semibold">{loading ? 'Updating...' : 'Reset Password'}</button>
        </form>
      </div>
    </div>
  );
}
