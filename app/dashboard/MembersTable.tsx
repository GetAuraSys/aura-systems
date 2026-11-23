import React from 'react'

export default function MembersTable({ members }: { members?: any[] }) {
  const rows = Array.isArray(members) ? members : []

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-3">ID</th>
            <th className="p-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="p-3 opacity-70" colSpan={2}>
                No members found.
              </td>
            </tr>
          ) : (
            rows.map((item, idx) => (
              <tr key={item?.id ?? idx} className="border-b last:border-b-0">
                <td className="p-3">{item?.id ?? idx + 1}</td>
                <td className="p-3">{JSON.stringify(item)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
