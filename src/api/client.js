import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('revora_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getDashboard = async () => {
  const response = await apiClient.get('/dashboard')

  return response.data
}

export default apiClient
