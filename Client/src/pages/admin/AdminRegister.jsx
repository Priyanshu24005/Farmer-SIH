import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, ShieldCheck, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerAdmin } from '../../api/auth';
import { toast } from 'react-toastify';
import { FieldInput, FieldLabel } from '../../components/admin/ui';
import './adminAuth.css';

export default function AdminRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', mobile: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.mobile.trim() || !form.password) {
      setError('Complete all fields to create the administrator account.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await registerAdmin(form.name.trim(), form.mobile.trim(), form.password);
      if (data.role !== 'admin' || !data.token) throw new Error('The account could not be created with Admin access.');
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, mobile: data.mobile, role: data.role }));
      toast.success(`Welcome to KisanSetu, ${data.name}`);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'We could not create the admin account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-theme admin-auth-page admin-register-page">
      <section className="admin-auth-aside"><div className="admin-brand"><span className="admin-brand-mark"><Sprout size={21} /></span><span><strong>KisanSetu</strong><small>Admin operations</small></span></div><div className="admin-auth-message"><p className="admin-kicker"><ShieldCheck size={15} /> Admin Portal</p><h1>Build the team behind the mandi.</h1><p>Create an account for the operations workspace.</p></div></section>
      <main className="admin-auth-main"><div className="admin-auth-card">
        <button type="button" className="admin-back-link" onClick={() => navigate('/admin/login')}><ArrowLeft size={16} /> Back to sign in</button>
        <div className="admin-auth-card-header"><span className="admin-mobile-mark"><Sprout size={19} /></span><p className="admin-kicker">Admin Portal</p><h2>Create Admin Account</h2><p>Set up an account for the administration workspace.</p></div>
        <form onSubmit={handleSubmit} className="admin-auth-form" noValidate>
          <div><FieldLabel>Full name</FieldLabel><FieldInput value={form.name} onChange={update('name')} placeholder="Enter full name" autoComplete="name" /></div>
          <div><FieldLabel>Mobile number</FieldLabel><FieldInput type="tel" value={form.mobile} onChange={update('mobile')} placeholder="10-digit mobile number" autoComplete="tel" /></div>
          <div><FieldLabel>Password</FieldLabel><div className="admin-password-field"><FieldInput type={showPassword ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="Create a password" autoComplete="new-password" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
          {error && <p className="admin-auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="admin-primary-button">{loading ? <><Loader2 size={17} className="animate-spin" /> Creating account...</> : <>Create account <ArrowRight size={17} /></>}</button>
        </form>
        <p className="admin-auth-note">Use a strong password. Your credentials are handled by the existing Admin authentication service.</p>
      </div></main>
    </div>
  );
}