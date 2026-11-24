'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AddMemberForm from './AddMemberForm'
import MembersSection from './MembersSection'
import MembersTable from './MembersTable'

export default function ProtectedDashboard() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const loadMembers = useCallback(async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMsg(error.message)
    } else {
      setErrorMsg(null)
      setMembers(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadMembers()

    const channel = supabase
      .channel('members-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members' },
        () => {
          loadMembers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadMembers])

  if (loading) {
    return <div className="p-4 text-sm text-zinc-400">Cargando miembros...</div>
  }

  if (errorMsg) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
        Error cargando datos: {errorMsg}
      </div>
    )
  }

  return (
    <>
      <AddMemberForm />
      <MembersSection members={members} />
      <MembersTable members={members} />
    </>
  )
}
