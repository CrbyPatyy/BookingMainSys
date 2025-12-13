export interface Guest {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  id_type?: string
  id_number?: string
  nationality?: string
  special_requests?: string
  created_at: string
}

export async function getGuests(status?: string): Promise<Guest[]> {
  // TODO: Backend teammate - implement Supabase query
  return []
}