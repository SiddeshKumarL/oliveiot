import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";
import OliveLogo from "./components/OliveLogo";
import { Mail, Lock, User, CheckCircle2, ShieldAlert } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password })
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-warm flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-5xl bg-background-lowest rounded-2xl shadow-stitch border border-outline/10 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left branding side – identical to Login page */}
        <div className="md:col-span-5 bg-gradient-to-br from-primary to-primary-container p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-10 w-60 h-60 rounded-full bg-white/5" />
          <div className="relative">
            <OliveLogo className="w-28 h-auto" />
            <span className="text-[8px] uppercase tracking-widest text-[#00600a] font-bold mt-1.5 block">Enterprise System</span>
            <h1 className="text-2xl sm:text-3xl font-semibold leading-tight mt-10">Join OliveIoT Community</h1>
            <p className="text-sm text-white/80 mt-4 leading-relaxed font-medium">
              Create a personal account to access the industrial monitoring console.
            </p>
          </div>
        </div>
        {/* Right form side – mirrors Login form styling */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-text-main mb-8">Create Account</h2>
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-stitch bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-stitch bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Registration successful! Redirecting to login…</span>
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-background-container border border-outline/10 rounded-stitch text-sm text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-background-container border border-outline/10 rounded-stitch text-sm text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-background-container border border-outline/10 rounded-stitch text-sm text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-background-container border border-outline/10 rounded-stitch text-sm text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-stitch font-bold text-sm shadow-md hover:bg-primary/95 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <p className="mt-4 text-sm text-text-muted">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;