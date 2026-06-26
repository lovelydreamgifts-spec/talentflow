'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()
  useEffect(() => {
    const check = async () => {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: p } = await sb.from('profiles').select('role').eq('id', user.id).single()
      router.push(p?.role === 'docent' ? '/dashboard/docent' : '/dashboard/student')
    }
    check()
  }, [router])
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:24, fontWeight:800 }}>Talent<span style={{ color:'#534AB7' }}>Flow</span></div>
        <div style={{ fontSize:13, color:'#6B6860', marginTop:8 }}>Laden...</div>
      </div>
    </div>
  )
}