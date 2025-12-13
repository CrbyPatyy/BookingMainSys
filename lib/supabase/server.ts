import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Simplified for Next.js 16
        get(name: string) {
          // This will be handled by middleware
          return undefined
        },
        set(name: string, value: string, options: any) {
          // This will be handled by middleware
        },
        remove(name: string, options: any) {
          // This will be handled by middleware
        }
      }
    }
  )
}