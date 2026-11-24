import React from 'react'

export default function MembersTable({ members }: { members?: any[] }) {
  const rows = Array.isArray(members) ? members : []

  const formatStatus = (status?: string) => {
    if (status === 'active') return 'Activo'
    if (status === 'inactive') return 'Inactivo'
    return status ?? '—'
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-3">Nombre</th>
            <th className="p-3">Correo</th>
            <th className="p-3">Teléfono</th>
            <th className="p-3">Negocio</th>
            <th className="p-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="p-3 opacity-70" colSpan={5}>
                Sin registros todavía.
              </td>
            </tr>
          ) : (
            rows.map((item, idx) => (
              <tr key={item?.id ?? idx} className="border-b last:border-b-0">
                <td className="p-3">{item?.name ?? '—'}</td>
                <td className="p-3">{item?.email ?? '—'}</td>
                <td className="p-3">{item?.phone ?? '—'}</td>
                <td className="p-3">{item?.business ?? '—'}</td>
                <td className="p-3">{formatStatus(item?.status)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
