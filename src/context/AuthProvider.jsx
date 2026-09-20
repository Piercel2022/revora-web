import { useMemo, useState } from 'react'
import apiClient from '../api/client'
import { AuthContext } from './AuthContext'

const AuthProvider = ({ children }) => {
  const hasToken = Boolean(localStorage.getItem('revora_token'))

  const [user, setUser] = useState(null)
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(hasToken)

  const restoreSession = async () => {
    try {
      const response = await apiClient.get('/auth/me')

      const {
        user: authenticatedUser,
        organization: authenticatedOrganization,
      } = response.data

      setUser(authenticatedUser)
      setOrganization(authenticatedOrganization)
    } catch {
      localStorage.removeItem('revora_token')
      setUser(null)
      setOrganization(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)

    const {
      token,
      user: authenticatedUser,
      organization: authenticatedOrganization,
    } = response.data

    localStorage.setItem('revora_token', token)

    setUser(authenticatedUser)
    setOrganization(authenticatedOrganization)

    return response.data
  }

  const register = async (registrationData) => {
    const response = await apiClient.post(
      '/auth/register',
      registrationData,
    )

    const {
      token,
      user: registeredUser,
      organization: registeredOrganization,
    } = response.data

    localStorage.setItem('revora_token', token)

    setUser(registeredUser)
    setOrganization(registeredOrganization)

    return response.data
  }

  const logout = () => {
    localStorage.removeItem('revora_token')
    setUser(null)
    setOrganization(null)
    setLoading(false)
  }

  const value = useMemo(
    () => ({
      user,
      organization,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
    }),
    [user, organization, loading],
  )

  if (loading) {
    restoreSession()
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
