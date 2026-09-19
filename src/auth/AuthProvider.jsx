import { useCallback, useMemo, useState } from 'react'
import apiClient from '../api/client'
import AuthContext from './AuthContext'

const TOKEN_KEY = 'revora_token'

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)
  const [organization, setOrganization] = useState(null)

  const persistSession = useCallback((session) => {
    localStorage.setItem(TOKEN_KEY, session.token)
    setToken(session.token)
    setUser(session.user)
    setOrganization(session.organization)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setOrganization(null)
  }, [])

  const login = useCallback(
    async (credentials) => {
      const response = await apiClient.post('/auth/login', credentials)

      persistSession(response.data)

      return response.data
    },
    [persistSession],
  )

  const register = useCallback(
    async (payload) => {
      const response = await apiClient.post('/auth/register', payload)

      persistSession(response.data)

      return response.data
    },
    [persistSession],
  )

  const loadProfile = useCallback(async () => {
    const response = await apiClient.get('/profile')

    setUser(response.data.user)
    setOrganization(response.data.organization)

    return response.data
  }, [])

  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  const value = useMemo(
    () => ({
      token,
      user,
      organization,
      isAuthenticated: Boolean(token),
      login,
      register,
      loadProfile,
      logout,
    }),
    [
      token,
      user,
      organization,
      login,
      register,
      loadProfile,
      logout,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}