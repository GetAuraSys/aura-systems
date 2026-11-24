import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.AURA_WEBHOOK_SECRET

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : null
    const business = typeof body?.business === 'string' ? body.business.trim() : null
    const status = body?.status === 'inactive' ? 'inactive' : 'active'

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Los campos name y email son obligatorios.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('members')
      .insert([{ name, email, phone, business, status }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, member: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'JSON inválido en la petición' }, { status: 400 })
  }
}
