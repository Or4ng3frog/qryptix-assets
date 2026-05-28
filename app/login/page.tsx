'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SUPABASE_CONFIGURED } from '@/lib/data';
import { Icon } from '@/components/Icon';

function LoginInner() {
  const params = useSearchParams();
  const redirect = params.get('redirect') ?? '/dashboard';

  const [mode, setMode] = useState<'magic' | 'password'>('magic');
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const previewMode = !SUPABASE_CONFIGURED;

  const handleMagic = async () => {
    setErr(null); setMsg(null);
    if (previewMode) {
      setMsg('Preview mode: Supabase not configured. In production this sends a magic link to your email.');
      return;
    }
    if (!email) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
      });
      if (error) throw error;
      setMsg('Check your email for the magic link.');
    } catch (e: any) {
      setErr(e.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async () => {
    setErr(null); setMsg(null);
    if (previewMode) {
      setMsg('Preview mode: Supabase not configured. In production this signs you in.');
      return;
    }
    if (!email || !password) return;
    setLoading(true);
    try {
      const supabase = createClient();
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
        });
        if (error) throw error;
        setMsg('Account created. Check your email to confirm, then sign in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = redirect;
      }
    } catch (e: any) {
      setErr(e.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-violet/10">
        <div className="mx-auto max-w-6xl px-6 py-3.5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/Q_Only.png" alt="Qryptix" className="h-8 w-8" />
            <span className="font-display font-semibold">QRYPTIX</span>
          </a>
          <a href="/" className="text-sm text-mist hover:text-ghost transition-colors">← Back to home</a>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="glass rounded-3xl p-8">
            <h1 className="font-display font-semibold text-2xl mb-1">
              {isSignup ? 'Create your account' : 'Sign in'}
            </h1>
            <p className="text-sm text-mist mb-6">
              Access your Qryptix dashboard, PreSale participation, and refund requests.
            </p>

            {previewMode && (
              <div className="mb-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] px-4 py-3 text-xs text-amber-200/80">
                Preview mode — Supabase isn&apos;t configured. Auth is stubbed; you can still explore the dashboard UI.
              </div>
            )}

            {/* mode toggle */}
            <div className="flex gap-2 mb-5 p-1 rounded-xl bg-void/50 border border-white/5">
              <button
                onClick={() => setMode('magic')}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === 'magic' ? 'bg-brand-gradient text-void' : 'text-mist'}`}
              >
                Magic link
              </button>
              <button
                onClick={() => setMode('password')}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === 'password' ? 'bg-brand-gradient text-void' : 'text-mist'}`}
              >
                Email + password
              </button>
            </div>

            <label className="block text-xs text-mist mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl bg-void/60 border border-white/8 px-4 py-3 text-ghost focus:outline-none focus:border-violet/50 transition-colors mb-3"
            />

            {mode === 'password' && (
              <>
                <label className="block text-xs text-mist mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-void/60 border border-white/8 px-4 py-3 text-ghost focus:outline-none focus:border-violet/50 transition-colors mb-3"
                />
              </>
            )}

            {msg && <p className="text-sm text-cyan-bright mb-3">{msg}</p>}
            {err && <p className="text-sm text-red-400 mb-3">{err}</p>}

            <button
              onClick={mode === 'magic' ? handleMagic : handlePassword}
              disabled={loading}
              className="w-full rounded-xl bg-brand-gradient py-3.5 font-semibold text-void transition-transform enabled:hover:scale-[1.02] disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? 'Please wait…' : mode === 'magic' ? 'Send magic link' : isSignup ? 'Create account' : 'Sign in'}
              {!loading && <Icon name="arrow" size={16} />}
            </button>

            {mode === 'password' && (
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="w-full text-center text-sm text-mist hover:text-ghost transition-colors mt-4"
              >
                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </button>
            )}
          </div>

          <p className="text-xs text-fog text-center mt-5 leading-relaxed">
            By signing in you agree to the{' '}
            <a href="/terms" className="text-mist hover:text-ghost underline">Terms</a>,{' '}
            <a href="/refund-policy" className="text-mist hover:text-ghost underline">Refund Policy</a>, and{' '}
            <a href="/risk-disclosure" className="text-mist hover:text-ghost underline">Risk Disclosure</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginInner />
    </Suspense>
  );
}
