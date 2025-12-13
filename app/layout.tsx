import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import PageLoader from '@/components/PageLoader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Booking Inn - Your Perfect Stay Awaits',
    description: 'Experience luxury and comfort at Booking Inn. Book your perfect stay today.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen flex flex-col`} suppressHydrationWarning>
                <PageLoader />
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
            </body>
        </html>
    )
}
