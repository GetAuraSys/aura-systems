import React from 'react'

export default function MembersSection({ members }: { members?: any[] }) {
  const list = Array.isArray(members) ? members : []
  const activeCount = list.filter((m) => m?.status === 'active').length

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          Total de miembros
        </p>
        <p className="mt-2 text-3xl font-bold text-white">{list.length}</p>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          Miembros activos
        </p>
        <p className="mt-2 text-3xl font-bold text-emerald-400">{activeCount}</p>
      </div>
    </div>
  )
}
