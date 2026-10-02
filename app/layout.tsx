import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'AMDV-016 — A Menina do Vídeo 016',description:'Direção criativa, histórias e imagens em movimento. Portfólio audiovisual da AMDV-016, São Carlos / SP.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="pt-BR"><body>{children}</body></html>}
