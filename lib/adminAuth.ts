const TOKEN_KEY = 'pick_admin_auth'

export const adminLogin = (user: string, pass: string): boolean => {
  if (user === 'admin' && pass === 'pick@admin') {
    try { localStorage.setItem(TOKEN_KEY, '1') } catch {}
    return true
  }
  return false
}

export const adminLogout = () => {
  try { localStorage.removeItem(TOKEN_KEY) } catch {}
}

export const isAdminAuthenticated = (): boolean => {
  try { return localStorage.getItem(TOKEN_KEY) === '1' } catch { return false }
}
