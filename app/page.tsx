
import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import MembersSection from './dashboard/MembersSection'
import MembersTable from './dashboard/MembersTable'

async function DashboardContent() {
  const { data: members, error } = await supabase
    .from('end_users')
    .select('id, full_name, phone, created_at, amount_paid, payment_method')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error cargando socios:', error.message)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Aura Systems Dashboard</h1>
          <p className="text-sm text-zinc-400">Control de socios y operaciones</p>
        </div>
      </header>

      <main className="space-y-8">
        <MembersSection />
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">Registros Recientes</h2>
          <Suspense fallback={<p className="text-zinc-500">Cargando datos...</p>}>
            <MembersTable members={members || []} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

export default function Page() {
  return <DashboardContent />
}
