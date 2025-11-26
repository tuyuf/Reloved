import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(form);
    setLoading(false);
    if (error) setErr(error.message);
    else navigate("/");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-[0.16em] uppercase">
        Login
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-2">
          <label className="block text-[11px] uppercase tracking-[0.2em]">
            Email
          </label>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            value={form.email}
            className="w-full border border-black/10 px-3 py-2 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[11px] uppercase tracking-[0.2em]">
            Password
          </label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            value={form.password}
            className="w-full border border-black/10 px-3 py-2 outline-none"
          />
        </div>
        {err && <div className="text-[11px] text-red-500">{err}</div>}
        <button
          type="submit"
          disabled={loading}
          className="btn-minimal w-full mt-2 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="text-[11px] opacity-70">
        Don&apos;t have an account?{" "}
        <Link to="/auth/register" className="underline">
          Register
        </Link>
      </div>
    </div>
  );
}
