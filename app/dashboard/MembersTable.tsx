import React from 'react'

export default function MembersTable({ members }: { members?: any[] }) {
  const rows = Array.isArray(members) ? members : []

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
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-zinc-500" colSpan={5}>
                Sin registros todavía.
              </td>
            </tr>
          ) : (
            rows.map((item, idx) => {
              const isActive = item?.status === 'active'
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
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
