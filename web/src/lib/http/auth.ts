import { apiFetch } from './wrapper'
import type { User } from '@/types/user'

export const auth = {
  async getMe() {
    try {
      const data = (await apiFetch('/auth/me')) as { user: User }
      return data.user
    } catch (e) {
      return null
    }
  },
  async login(email: string, password: string) {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      if (res.status == 500) throw new Error(res.statusText)
      const errorResponse = await res.json()
      throw new Error(errorResponse.error || 'Unknown error')
    }
    const { user } = (await res.json()) as { user: User }
    return user
  },
  async logout() {
    const res = await fetch('/auth/logout', {
      method: 'POST',
    })
    if (!res.ok) {
      const errorResponse = await res.json()
      throw new Error(errorResponse.error || 'Unknown error')
    }
  },
}
