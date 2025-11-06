// import axios from 'axios'


// const base = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' })


// export const getResidents = () => base.get('/residents')
// export const getResident = (id) => base.get(`/residents/${id}`)
// export const createResident = (payload) => base.post('/residents', payload)
// export const updateResident = (id, payload) => base.put(`/residents/${id}`, payload)
// export const deleteResident = (id) => base.delete(`/residents/${id}`)



import axios from 'axios'

const base = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
})

export const getResidents = () => base.get('/residents')
export const getResident = (id) => base.get(`/residents/${id}`)

// ✅ Modified to handle file uploads
export const createResident = (payload) => {
  const formData = new FormData()
  for (const key in payload) {
    if (payload[key] !== undefined && payload[key] !== null) {
      formData.append(key, payload[key])
    }
  }
  return base.post('/residents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const updateResident = (id, payload) => {
  const formData = new FormData()
  for (const key in payload) {
    if (payload[key] !== undefined && payload[key] !== null) {
      formData.append(key, payload[key])
    }
  }
  return base.put(`/residents/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deleteResident = (id) => base.delete(`/residents/${id}`)
