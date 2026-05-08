import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { PlatformShellWrapper } from '@/components/layout/platform-shell-wrapper'
import { AnnotationEditProvider } from '@/lib/annotation-edit-context'
import { AnnotationEditToolbar } from '@/components/annotation-edit-toolbar'
import { FloatingAnnotations } from '@/components/floating-annotations'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: '实践场景学习平台',
  description: '专业的教研配置与场景化学习管理平台',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="bg-background">
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{if(window.location.search.includes('embedded=1')||window.self!==window.top){document.documentElement.classList.add('embedded')}}catch(e){}})();`
        }} />
        <AnnotationEditProvider>
          <PlatformShellWrapper>{children}</PlatformShellWrapper>
          <AnnotationEditToolbar />
          <FloatingAnnotations />
        </AnnotationEditProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
