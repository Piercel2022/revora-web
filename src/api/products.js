import apiClient from './client'

export const getProducts = async () => {
  const response = await apiClient.get('/products')
  return response.data
}

export const getProduct = async (id) => {
  const response = await apiClient.get(`/products/${id}`)
  return response.data
}

export const createProduct = async (product) => {
  const response = await apiClient.post('/products', {
    product,
  })
  return response.data
}

export const updateProduct = async (id, product) => {
  const response = await apiClient.patch(`/products/${id}`, {
    product,
  })
  return response.data
}

export const deleteProduct = async (id) => {
  await apiClient.delete(`/products/${id}`)
}
