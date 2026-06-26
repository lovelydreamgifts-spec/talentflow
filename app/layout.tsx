import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'TalentFlow — MBO Stageprofiel',
  description: 'Bouw je professionele BPV-profiel in 6 stappen',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      </head>
      <body style={{ margin: 0, fontFamily: 'Inter,-apple-system,sans-serif', background: '#F5F4F1' }}>
        {children}
      </body>
    </html>
  )
}