import apiClient from './client'

export const getCustomers = async () => {
  const response = await apiClient.get('/customers')

  return response.data
}

export const getCustomer = async (id) => {
  const response = await apiClient.get(`/customers/${id}`)

  return response.data
}

export const createCustomer = async (customer) => {
  const response = await apiClient.post('/customers', {
    customer,
  })

  return response.data
}

export const updateCustomer = async (id, customer) => {
  const response = await apiClient.patch(`/customers/${id}`, {
    customer,
  })

  return response.data
}

export const deleteCustomer = async (id) => {
  await apiClient.delete(`/customers/${id}`)
}
