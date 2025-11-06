import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const accountsApi = axios.create({
  baseURL: `${API_URL}/accounts`
})

// Get all accounts
export const getAccounts = async () => {
  try {
    const response = await accountsApi.get('/')
    return response
  } catch (error) {
    console.error('Error fetching accounts:', error)
    throw error
  }
}

// Get single account by user_id
export const getAccountById = async (userId) => {
  try {
    const response = await accountsApi.get(`/${userId}`)
    return response
  } catch (error) {
    console.error('Error fetching account:', error)
    throw error
  }
}

// Create new account
export const createAccount = async (accountData) => {
  try {
    const response = await accountsApi.post('/', accountData)
    return response
  } catch (error) {
    console.error('Error creating account:', error)
    throw error
  }
}

// Update account
export const updateAccount = async (userId, accountData) => {
  try {
    const response = await accountsApi.put(`/${userId}`, accountData)
    return response
  } catch (error) {
    console.error('Error updating account:', error)
    throw error
  }
}

// Delete account
export const deleteAccount = async (userId) => {
  try {
    const response = await accountsApi.delete(`/${userId}`)
    return response
  } catch (error) {
    console.error('Error deleting account:', error)
    throw error
  }
}

export default accountsApi
