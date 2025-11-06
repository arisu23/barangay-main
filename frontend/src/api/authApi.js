import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const authApi = axios.create({
  baseURL: `${API_URL}/auth`
})

// Get token from localStorage
const getToken = () => localStorage.getItem('token')

// Set token in axios headers
const setAuthHeader = (token) => {
  if (token) {
    authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

// Clear token from axios headers
const clearAuthHeader = () => {
  delete authApi.defaults.headers.common['Authorization']
  delete axios.defaults.headers.common['Authorization']
}

// Initialize token on app load
const token = getToken()
if (token) {
  setAuthHeader(token)
}

// Login
export const login = async (username, password) => {
  try {
    const response = await authApi.post('/login', { username, password })
    const { token, user } = response.data

    // Store token in localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    // Set token in headers
    setAuthHeader(token)

    return { token, user }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

// Logout
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  clearAuthHeader()
}

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

// Get token
export const getAuthToken = () => getToken()

// Check if user is logged in
export const isLoggedIn = () => getToken() !== null

// Check if user is Admin
export const isAdmin = () => {
  const user = getCurrentUser()
  return user?.role === 'Admin'
}

// Check if user is Staff
export const isStaff = () => {
  const user = getCurrentUser()
  return user?.role === 'Staff'
}

// Verify token (optional endpoint call)
export const verifyToken = async () => {
  try {
    const response = await authApi.get('/me')
    return response.data
  } catch (error) {
    console.error('Token verification error:', error)
    logout()
    throw error
  }
}

export default authApi
