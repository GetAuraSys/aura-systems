import { Suspense } from 'react'
import Link from 'next/link'
import AddMemberForm from './dashboard/AddMemberForm'
import MembersSection from './dashboard/MembersSection'
import MembersTable from './dashboard/MembersTable'
import { supabase } from '@/lib/supabase'

async function DashboardContent() {
  const { data: members, error } = await supabase.from('members').select('*')

  if (error) {
    return (
      <div className="rounded-lg border p-4 text-sm">
        Error cargando datos: {error.message}
      </div>
    )
  }

  return (
    <>
      <AddMemberForm />
      <MembersSection members={members ?? []} />
      <MembersTable members={members ?? []} />
    </>
  )
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Aura Systems Dashboard</h1>
        <Link href="/dashboard" className="text-sm underline">
          Dashboard
        </Link>
      </div>
      <Suspense fallback={<div className="p-4 text-sm opacity-70">Cargando dashboard...</div>}>
        <DashboardContent />
      </Suspense>
    </main>
  )
}
