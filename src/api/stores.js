import apiClient from './client'

export const getStores = async () => {
  const response = await apiClient.get('/stores')

  return response.data
}

export const getStore = async (id) => {
  const response = await apiClient.get(`/stores/${id}`)

  return response.data
}

export const createStore = async (store) => {
  const response = await apiClient.post('/stores', {
    store,
  })

  return response.data
}

export const updateStore = async (id, store) => {
  const response = await apiClient.patch(`/stores/${id}`, {
    store,
  })

  return response.data
}

export const deleteStore = async (id) => {
  await apiClient.delete(`/stores/${id}`)
}
