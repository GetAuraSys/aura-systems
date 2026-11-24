'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AddMemberForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('active')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setErrorMsg(null)

    const { error } = await supabase.from('members').insert([
      {
        name: name.trim(),
        email: email.trim(),
        status,
      },
    ])

    setLoading(false)

    if (error) {
      setErrorMsg(`No se pudo guardar: ${error.message}`)
      return
    }

    setName('')
    setEmail('')
    setStatus('active')
    setMessage('Miembro guardado correctamente.')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-lg border p-4">
      <h2 className="mb-3 text-base font-semibold">Agregar miembro</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          required
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        />
        <input
          type="email"
          required
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded border px-4 py-2 text-sm font-medium"
        >
          {loading ? 'Guardando...' : 'Guardar miembro'}
        </button>
        {message && <span className="text-sm">{message}</span>}
        {errorMsg && <span className="text-sm">{errorMsg}</span>}
      </div>
    </form>
  )
}
