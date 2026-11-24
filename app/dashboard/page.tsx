import { Suspense } from 'react'
import Link from 'next/link'
import AddMemberForm from './AddMemberForm'
import MembersSection from './MembersSection'
import MembersTable from './MembersTable'
import { supabase } from '@/lib/supabase'

async function DashboardView() {
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

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel de Miembros</h1>
        <Link href="/" className="text-sm underline">
          Inicio
        </Link>
      </div>
      <Suspense fallback={<div className="p-4 text-sm opacity-70">Cargando panel...</div>}>
        <DashboardView />
      </Suspense>
    </main>
  )
}
