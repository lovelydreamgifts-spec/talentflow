'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const inp: React.CSSProperties = { width:'100%', fontSize:14, padding:'10px 12px', border:'1.5px solid #D0CCC5', borderRadius:6, background:'white', fontFamily:'inherit', boxSizing:'border-box', outline:'none' }
const lbl: React.CSSProperties = { fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', color:'#6B6860', display:'block', marginBottom:4 }

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: err } = await createClient().auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    router.push('/')
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F5F4F1', padding:16 }}>
      <div style={{ background:'white', borderRadius:12, border:'1px solid #E8E6E1', padding:'32px 28px', width:'100%', maxWidth:420, boxShadow:'0 2px 8px rgba(0,0,0,.06)' }}>
        <div style={{ fontSize:24, fontWeight:800, textAlign:'center', marginBottom:6 }}>Talent<span style={{ color:'#534AB7' }}>Flow</span></div>
        <div style={{ fontSize:13, color:'#6B6860', textAlign:'center', marginBottom:28 }}>Inloggen op je stageprofiel</div>
        {error && <div style={{ background:'#FAECE7', border:'1px solid #FBCDC5', borderRadius:6, padding:'10px 12px', fontSize:13, color:'#E03D2D', marginBottom:14 }}>{error}</div>}
        <form onSubmit={login}>
          <div style={{ marginBottom:14 }}><label style={lbl}>E-mailadres</label><input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="naam@school.nl" required /></div>
          <div style={{ marginBottom:14 }}><label style={lbl}>Wachtwoord</label><input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required /></div>
          <button style={{ width:'100%', padding:'11px', fontSize:14, fontWeight:600, background:'#534AB7', color:'white', border:'none', borderRadius:6, cursor:'pointer' }} disabled={loading}>
            {loading ? 'Inloggen...' : 'Inloggen →'}
          </button>
        </form>
        <div style={{ textAlign:'center', marginTop:16, fontSize:13 }}>
          Nog geen account? <a href="/auth/register" style={{ color:'#534AB7' }}>Registreren</a>
        </div>
        <div style={{ borderTop:'1px solid #E8E6E1', marginTop:16, paddingTop:14, fontSize:12, color:'#B4B2A9', textAlign:'center' }}>
          Docent? Registreer en kies "Ik ben docent"
        </div>
      </div>
    </div>
  )
}