'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function MembersTable({ members }: { members?: any[] }) {
  const router = useRouter()
  const rows = Array.isArray(members) ? members : []
  const [busyId, setBusyId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editBusiness, setEditBusiness] = useState('')

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((item) => {
      const matchesStatus =
        statusFilter === 'all' ? true : item?.status === statusFilter
      if (!matchesStatus) return false
      if (!q) return true

      const haystack = [
        item?.name,
        item?.email,
        item?.phone,
        item?.business,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(q)
    })
  }, [rows, search, statusFilter])

  function startEdit(item: any) {
    if (!item?.id) return
    setEditingId(item.id)
    setEditName(item.name ?? '')
    setEditEmail(item.email ?? '')
    setEditPhone(item.phone ?? '')
    setEditBusiness(item.business ?? '')
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit(id: string) {
    if (!editName.trim() || !editEmail.trim()) {
      alert('Nombre y correo son obligatorios.')
      return
    }

    setBusyId(id)
    const { error } = await supabase
      .from('members')
      .update({
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim() || null,
        business: editBusiness.trim() || null,
      })
      .eq('id', id)

    setBusyId(null)
    if (error) {
      alert(`Error al guardar cambios: ${error.message}`)
      return
    }

    setEditingId(null)
    router.refresh()
  }

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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Buscar por nombre, correo, teléfono o negocio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none sm:max-w-sm"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              statusFilter === 'all'
                ? 'bg-white text-zinc-950'
                : 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Todos ({rows.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              statusFilter === 'active'
                ? 'bg-emerald-400 text-zinc-950'
                : 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Activos
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('inactive')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              statusFilter === 'inactive'
                ? 'bg-zinc-200 text-zinc-950'
                : 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Inactivos
          </button>
        </div>
      </div>

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
            {filteredRows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-zinc-500" colSpan={6}>
                  {rows.length === 0
                    ? 'Sin registros todavía.'
                    : 'No hay coincidencias con tu búsqueda.'}
                </td>
              </tr>
            ) : (
              filteredRows.map((item, idx) => {
                const isActive = item?.status === 'active'
                const isBusy = busyId === item?.id
                const isEditing = editingId === item?.id

                if (isEditing) {
                  return (
                    <tr key={item?.id ?? idx} className="bg-zinc-800/40">
                      <td className="px-3 py-2.5">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded border border-zinc-600 bg-zinc-950 px-2.5 py-1 text-xs text-white focus:border-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full rounded border border-zinc-600 bg-zinc-950 px-2.5 py-1 text-xs text-white focus:border-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <input
                          type="text"
                          placeholder="Teléfono"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full rounded border border-zinc-600 bg-zinc-950 px-2.5 py-1 text-xs text-white focus:border-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <input
                          type="text"
                          placeholder="Negocio"
                          value={editBusiness}
                          onChange={(e) => setEditBusiness(e.target.value)}
                          className="w-full rounded border border-zinc-600 bg-zinc-950 px-2.5 py-1 text-xs text-white focus:border-white focus:outline-none"
                        />
                      </td>
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
                            onClick={() => saveEdit(item.id)}
                            className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
                          >
                            {isBusy ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={cancelEdit}
                            className="rounded-md border border-zinc-600 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                }

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
                          onClick={() => startEdit(item)}
                          className="rounded-md border border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-200 transition hover:bg-zinc-800 disabled:opacity-50"
                        >
                          Editar
                        </button>
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
    </div>
  )
}
