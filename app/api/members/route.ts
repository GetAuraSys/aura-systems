import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.AURA_WEBHOOK_SECRET

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    const body = await request.json()
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : null
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : null
    const business = typeof body?.business === 'string' ? body.business.trim() : null
    const status = body?.status === 'inactive' ? 'inactive' : 'active'

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Se requiere name y al menos email o phone.' },
        { status: 400 }
      )
    }

    if (phone) {
      const { data: existing } = await adminClient
        .from('members')
        .select('id')
        .eq('phone', phone)
        .maybeSingle()

      if (existing?.id) {
        const { data: updated, error: updateError } = await adminClient
          .from('members')
          .update({
            name,
            ...(email ? { email } : {}),
            ...(business ? { business } : {}),
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 500 })
        }
        return NextResponse.json({ ok: true, updated: true, member: updated }, { status: 200 })
      }
    }

    const { data, error } = await adminClient
      .from('members')
      .insert([{ name, email: email || null, phone, business, status }])
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
