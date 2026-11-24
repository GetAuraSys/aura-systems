'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function MembersTable({ members }: { members?: any[] }) {
  const router = useRouter()
  const rows = Array.isArray(members) ? members : []
  const [busyId, setBusyId] = useState<string | null>(null)

  async function toggleStatus(item: any) {
    if (!item?.id) return
    setBusyId(item.id)
    const nextStatus = item.status === 'active' ? 'inactive' : 'active'

    const { error } = await supabase
      .from('members')
      .update({ status: nextStatus })
      .eq('id', item.id)

    setBusyId(null)
    if (error) {
      alert(`Error al actualizar: ${error.message}`)
      return
    }
    router.refresh()
  }

  async function deleteMember(item: any) {
    if (!item?.id) return
    const ok = window.confirm(`¿Eliminar a ${item.name || 'este miembro'}?`)
    if (!ok) return

    setBusyId(item.id)
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', item.id)

    setBusyId(null)
    if (error) {
      alert(`Error al eliminar: ${error.message}`)
      return
    }
    router.refresh()
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/70">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-950/60 text-xs uppercase tracking-wider text-zinc-400">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Correo</th>
            <th className="px-4 py-3">Teléfono</th>
            <th className="px-4 py-3">Negocio</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-zinc-500" colSpan={6}>
                Sin registros todavía.
              </td>
            </tr>
          ) : (
            rows.map((item, idx) => {
              const isActive = item?.status === 'active'
              const isBusy = busyId === item?.id
              return (
                <tr key={item?.id ?? idx} className="transition hover:bg-zinc-800/40">
                  <td className="px-4 py-3 font-medium text-white">
                    {item?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{item?.email ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-300">{item?.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-300">{item?.business ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                          : 'bg-zinc-700/40 text-zinc-300 ring-1 ring-zinc-600/40'
                      }`}
                    >
                      {isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => toggleStatus(item)}
                        className="rounded-md border border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-200 transition hover:bg-zinc-800 disabled:opacity-50"
                      >
                        {isActive ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => deleteMember(item)}
                        className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
