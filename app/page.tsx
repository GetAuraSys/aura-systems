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
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Aura Systems
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">
              Panel de Control
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-700 px-3.5 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
          >
            Vista Miembros
          </Link>
        </div>
        <Suspense fallback={<div className="p-4 text-sm text-zinc-400">Cargando panel...</div>}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  )
}
