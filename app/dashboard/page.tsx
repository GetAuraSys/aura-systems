import { Suspense } from 'react'
import Link from 'next/link'
import AddMemberForm from './AddMemberForm'
import MembersSection from './MembersSection'
import MembersTable from './MembersTable'
import { supabase } from '@/lib/supabase'

async function DashboardView() {
  const { data: members, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })

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

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Aura Systems
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">
              Panel de Miembros
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-zinc-700 px-3.5 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
          >
            Inicio
          </Link>
        </div>
        <Suspense fallback={<div className="p-4 text-sm text-zinc-400">Cargando panel...</div>}>
          <DashboardView />
        </Suspense>
      </main>
    </div>
  )
}
