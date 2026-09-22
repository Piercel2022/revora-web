import apiClient from './client'

export const getOpportunities = async () => {
  const response = await apiClient.get('/opportunities')

  return response.data
}

export const getOpportunity = async (id) => {
  const response = await apiClient.get(`/opportunities/${id}`)

  return response.data
}

export const createOpportunity = async (opportunity) => {
  const response = await apiClient.post('/opportunities', {
    opportunity,
  })

  return response.data
}

export const updateOpportunity = async (id, opportunity) => {
  const response = await apiClient.patch(`/opportunities/${id}`, {
    opportunity,
  })

  return response.data
}

export const deleteOpportunity = async (id) => {
  await apiClient.delete(`/opportunities/${id}`)
}
