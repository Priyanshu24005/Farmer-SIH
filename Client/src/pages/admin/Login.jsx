import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../api/auth';
import { toast } from 'react-toastify';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobile || !password) {
      toast.error('Please enter mobile and password');
      return;
    }

    setLoading(true);
    try {
      const data = await loginAdmin(mobile, password);

      if (data.role !== 'admin') {
        toast.error('This login is for admin accounts only');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        mobile: data.mobile,
        role: data.role,
      }));

      toast.success(`Welcome back, ${data.name}`);
      navigate('/admin/dashboard');
    } catch (err) {
      // axios instance's interceptor already toasts on error;
      // this catch just stops the loading spinner
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm bg-surface border border-border rounded-2xl shadow-sm p-8">
        <h1 className="font-display text-2xl text-ink text-center mb-1">
          Admin Login
        </h1>
        <p className="text-muted text-sm text-center mb-6">
          Sign in to manage mandi operations
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1">Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full rounded-lg border border-border bg-surface-soft text-ink px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-surface-soft text-ink px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-medium rounded-lg py-2.5
                       hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-muted text-center mt-6">
          Admin accounts are provisioned by the system administrator.
          No self-registration.
        </p>
      </div>
    </div>
  );
};

export default Login;