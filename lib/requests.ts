import { Category } from './types'

export interface PublicRequest {
  id: string
  category: Category
  requestedAt: string
  status: 'pending' | 'approved' | 'rejected'
  adminNote?: string
  reviewedAt?: string
}

const KEY = 'pick_public_requests'

export const getRequests = (): PublicRequest[] => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const saveRequests = (list: PublicRequest[]) => {
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch {}
}

export const addRequest = (category: Category): PublicRequest => {
  const req: PublicRequest = {
    id: `req_${Date.now()}`,
    category,
    requestedAt: new Date().toISOString(),
    status: 'pending',
  }
  saveRequests([...getRequests(), req])
  return req
}

export const updateRequest = (
  id: string,
  patch: Partial<Pick<PublicRequest, 'status' | 'adminNote' | 'reviewedAt'>>
) => {
  saveRequests(getRequests().map(r => (r.id === id ? { ...r, ...patch } : r)))
}

export const deleteRequest = (id: string) => {
  saveRequests(getRequests().filter(r => r.id !== id))
}
