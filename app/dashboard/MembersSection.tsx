import React from 'react'

export default function MembersSection({ members }: { members?: any[] }) {
  const total = Array.isArray(members) ? members.length : 0

  return (
    <section className="mb-6 rounded-lg border p-4">
      <h2 className="text-lg font-semibold">Members</h2>
      <p className="text-sm opacity-80">Total records: {total}</p>
    </section>
  )
}
