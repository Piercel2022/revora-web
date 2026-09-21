import apiClient from './client'

export const getOrders = async () => {
  const response = await apiClient.get('/orders')
  return response.data
}

export const getOrder = async (id) => {
  const response = await apiClient.get(`/orders/${id}`)
  return response.data
}

export const createOrder = async (order) => {
  const response = await apiClient.post('/orders', {
    order,
  })
  return response.data
}

export const updateOrder = async (id, order) => {
  const response = await apiClient.patch(`/orders/${id}`, {
    order,
  })
  return response.data
}

export const deleteOrder = async (id) => {
  await apiClient.delete(`/orders/${id}`)
}

export const getOrderItems = async (orderId) => {
  const response = await apiClient.get(`/orders/${orderId}/order_items`)
  return response.data
}

export const getOrderItem = async (orderId, itemId) => {
  const response = await apiClient.get(
    `/orders/${orderId}/order_items/${itemId}`,
  )
  return response.data
}

export const createOrderItem = async (orderId, orderItem) => {
  const response = await apiClient.post(
    `/orders/${orderId}/order_items`,
    {
      order_item: orderItem,
    },
  )
  return response.data
}

export const updateOrderItem = async (orderId, itemId, orderItem) => {
  const response = await apiClient.patch(
    `/orders/${orderId}/order_items/${itemId}`,
    {
      order_item: orderItem,
    },
  )
  return response.data
}

export const deleteOrderItem = async (orderId, itemId) => {
  await apiClient.delete(`/orders/${orderId}/order_items/${itemId}`)
}
