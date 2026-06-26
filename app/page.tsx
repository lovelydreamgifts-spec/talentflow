

'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://rhpqznyfnxrjlrsjiyfw.supabase.co',
  'sb_publishable_lblRq1p075VdzLkWBA3fDA_IfWLx6kF'
)

const inp: React.CSSProperties = {
  width: '100%', fontSize: 14, padding: '10px 12px',
  border: '1.5px solid #D0CCC5', borderRadius: 6,
  background: 'white', fontFamily: 'inherit',
  boxSizing: 'border-box', outline: 'none', marginBottom: 14
}
const lbl: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '.05em', color: '#6B6860', display: 'block', marginBottom: 4
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    voornaam: '', achternaam: '', email: '',
    password: '', klascode: '', role: 'student'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const register = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (form.role === 'student' && form.klascode) {
      const { data: klas } = await supabase
        .from('klassen')
        .select('id')
        .eq('code', form.klascode.toUpperCase())
        .single()
      if (!klas) {
        setError('Klascode niet gevonden. Vraag je docent.')
        setLoading(false)
        return
      }
    }

    const { data, error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          voornaam: form.voornaam,
          achternaam: form.achternaam,
          role: form.role
        }
      }
    })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    if (form.role === 'student' && form.klascode && data.user) {
      const { data: klas } = await supabase
        .from('klassen')
        .select('id')
        .eq('code', form.klascode.toUpperCase())
        .single()
      if (klas) {
        await supabase.from('klas_studenten').insert({
          klas_id: klas.id, student_id: data.user.id
        })
        await supabase.from('student_profielen')
          .update({ klas_id: klas.id })
          .eq('student_id', data.user.id)
      }
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => { window.location.href = '/auth/login' }, 2000)
  }

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4F1', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 12, padding: '32px 28px', maxWidth: 420, width: '100%', textAlign: 'center', border: '1px solid #E8E6E1' }}>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
          Talent<span style={{ color: '#534AB7' }}>Flow</span>
        </div>
        <div style={{ background: '#E1F5EE', border: '1px solid #5DCAA5', borderRadius: 6, padding: 12, fontSize: 13, color: '#085041', marginBottom: 16 }}>
          ✓ Account aangemaakt! Je wordt doorgestuurd...
        </div>
        <a href="/auth/login" style={{ color: '#534AB7', fontSize: 13 }}>Klik hier als je niet automatisch wordt doorgestuurd</a>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4F1', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E8E6E1', padding: '32px 28px', width: '100%', maxWidth: 460, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 800, textAlign: 'center', marginBottom: 4 }}>
          Talent<span style={{ color: '#534AB7' }}>Flow</span>
        </div>
        <div style={{ fontSize: 13, color: '#6B6860', textAlign: 'center', marginBottom: 24 }}>Account aanmaken</div>

        {error && (
          <div style={{ background: '#FAECE7', border: '1px solid #FBCDC5', borderRadius: 6, padding: '10px 12px', fontSize: 13, color: '#E03D2D', marginBottom: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={register}>
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Ik ben</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['student', 'docent'].map(r => (
                <button key={r} type="button" onClick={() => set('role', r)}
                  style={{
                    flex: 1, padding: '10px 8px', fontSize: 13, fontWeight: 600,
                    borderRadius: 6, cursor: 'pointer',
                    border: form.role === r ? '2px solid #534AB7' : '2px solid #D0CCC5',
                    background: form.role === r ? '#EEEDFE' : 'white',
                    color: form.role === r ? '#3C3489' : '#6B6860'
                  }}>
                  {r === 'student' ? 'Student' : 'Docent'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>Voornaam</label>
              <input style={inp} required value={form.voornaam}
                onChange={e => set('voornaam', e.target.value)} placeholder="Jayden" />
            </div>
            <div>
              <label style={lbl}>Achternaam</label>
              <input style={inp} required value={form.achternaam}
                onChange={e => set('achternaam', e.target.value)} placeholder="Vermeer" />
            </div>
          </div>

          <div>
            <label style={lbl}>E-mailadres</label>
            <input style={inp} type="email" required value={form.email}
              onChange={e => set('email', e.target.value)} placeholder="naam@school.nl" />
          </div>

          <div>
            <label style={lbl}>Wachtwoord (min. 6 tekens)</label>
            <input style={inp} type="password" required minLength={6} value={form.password}
              onChange={e => set('password', e.target.value)} placeholder="••••••••" />
          </div>

          {form.role === 'student' && (
            <div>
              <label style={lbl}>Klascode van docent</label>
              <input style={inp} value={form.klascode}
                onChange={e => set('klascode', e.target.value.toUpperCase())}
                placeholder="bijv. COMM4A" maxLength={10} />
            </div>
          )}

          <button style={{ width: '100%', padding: 11, fontSize: 14, fontWeight: 600, background: '#534AB7', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 4 }}
            type="submit" disabled={loading}>
            {loading ? 'Account aanmaken...' : 'Account aanmaken →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13 }}>
          Al een account? <a href="/auth/login" style={{ color: '#534AB7' }}>Inloggen</a>
        </div>
      </div>
    </div>
  )
}
