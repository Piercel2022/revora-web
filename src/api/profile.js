import apiClient from './client'

export async function getProfile() {
  const response = await apiClient.get('/profile')

  return response.data
}

export async function updateProfile(user) {
  const response = await apiClient.patch('/profile', {
    user,
  })

  return response.data
}