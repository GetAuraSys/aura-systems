'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthGuard({
  children,
  title,
  subtitle,
  navHref,
  navLabel,
}: {
  children: React.ReactNode
  title: string
  subtitle: string
  navHref: string
  navLabel: string
}) {
  const [session, setSession] = useState<any>(null)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)
    if (error) {
      setErrorMsg('Correo o contraseña incorrectos.')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-zinc-400">
        Verificando sesión...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Aura Systems
          </p>
          <h1 className="mt-1 text-xl font-bold text-white">Iniciar sesión</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Acceso exclusivo para administración del panel.
          </p>

          <div className="mt-5 space-y-3">
            <input
              type="email"
              required
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none"
            />
            <input
              type="password"
              required
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none"
            />
          </div>

          {errorMsg && (
            <p className="mt-3 text-xs text-rose-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar al panel'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              {subtitle}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <a
              href={navHref}
              className="rounded-lg border border-zinc-700 px-3.5 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
            >
              {navLabel}
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
