import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Loader2, ShieldCheck, Sprout } from 'lucide-react';
import { loginAdmin } from '../../api/auth';
import { toast } from 'react-toastify';
import { FieldInput, FieldLabel } from '../../components/admin/ui';
import './adminAuth.css';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobile.trim() || !password) {
      setError('Enter your mobile number and password to continue.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const data = await loginAdmin(mobile, password);

      if (data.role !== 'admin') {
        setError('This account does not have Admin Portal access.');
        return;
      }

      localStorage.setItem("admin-token", data.token);
      localStorage.setItem("admin-role", data.role);
      localStorage.setItem("admin-user", JSON.stringify({
        _id: data._id,
        name: data.name,
        mobile: data.mobile,
        role: data.role,
      }));

      toast.success(`Welcome back, ${data.name}`);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'We could not sign you in. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-theme admin-auth-page">
      <section className="admin-auth-aside">
        <div className="admin-brand"><span className="admin-brand-mark"><Sprout size={21} /></span><span><strong>KisanSetu</strong><small>Admin operations</small></span></div>
        <div className="admin-auth-message"><p className="admin-kicker"><ShieldCheck size={15} /> Secure workspace</p><h1>Keep every mandi moving.</h1><p>One calm workspace for the people coordinating farmers, queues, procurement, and payments.</p></div>
        <div className="admin-auth-aside-footer"><LockKeyhole size={15} /> Protected access for authorized administrators</div>
      </section>

      <main className="admin-auth-main">
        <div className="admin-auth-card">
          <div className="admin-auth-card-header"><span className="admin-mobile-mark"><Sprout size={19} /></span><p className="admin-kicker">Admin Portal</p><h2>Sign in to your workspace</h2><p>Manage daily mandi operations with clarity and confidence.</p></div>
          <form onSubmit={handleSubmit} className="admin-auth-form" noValidate>
            <div><FieldLabel>Mobile number</FieldLabel><FieldInput type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit mobile number" autoComplete="username" /></div>
            <div><div className="admin-field-label-row"><FieldLabel>Password</FieldLabel></div><div className="admin-password-field"><FieldInput type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
            {error && <p className="admin-auth-error" role="alert">{error}</p>}
            <button type="submit" disabled={loading} className="admin-primary-button">{loading ? <><Loader2 size={17} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowRight size={17} /></>}</button>
          </form>
          <p className="admin-auth-note">Admin access is provisioned by the system administrator.</p>
        </div>
      </main>
    </div>
  );
};

export default Login;
