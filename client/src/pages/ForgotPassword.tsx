import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');
    try {
      await forgotPassword({ email });
      setMessage('OTP sent. Check your email.');
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-slate-900/80 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
        <form onSubmit={submit} className="space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your account email" className="w-full p-3 rounded bg-slate-800" />
          {message && <div className="text-green-400">{message}</div>}
          {error && <div className="text-red-400">{error}</div>}
          <button disabled={loading} className="w-full bg-cyan-500 py-3 rounded text-slate-900 font-semibold">{loading ? 'Sending...' : 'Send OTP'}</button>
        </form>
      </div>
    </div>
  );
}
