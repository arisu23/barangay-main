import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Avatar,
  Box
} from '@mui/material'
import { createResident, updateResident } from '../api/residentsApi'

const initialForm = {
  first_name: '',
  middle_name: '',
  last_name: '',
  dob: '',
  gender: '',
  civil_status: '',
  place_of_birth: '',
  address: '',
  household_no: '',
  phone: '',
  email: '',
  photo: null
}

export default function ResidentForm({ open, resident, onClose }) {
  const [form, setForm] = useState(initialForm)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    if (resident && resident.id) {
      setForm({
        ...resident,
        dob: resident.dob ? String(resident.dob).substring(0, 10) : '',
        photo: null // Reset for new upload
      })
      setPreview(resident.photo ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}${resident.photo}` : null)
    } else {
      setForm(initialForm)
      setPreview(null)
      setError('')
    }
  }, [open, resident])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, photo: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    setError('')
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError('First name and last name are required.')
      return
    }

    setLoading(true)
    try {
      if (resident && resident.id) {
        await updateResident(resident.id, form)
      } else {
        await createResident(form)
      }
      setLoading(false)
      if (onClose) onClose()
      setForm(initialForm)
      setPreview(null)
    } catch (err) {
      setLoading(false)
      const msg = err?.response?.data?.message || err.message || 'Failed to save resident'
      setError(msg)
    }
  }

  const handleCancel = () => {
    setForm(initialForm)
    setPreview(null)
    setError('')
    if (onClose) onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>{resident ? 'Edit Resident' : 'Add Resident'}</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2}>
          {/* Image Upload */}
          <Grid item xs={12} textAlign="center">
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <Avatar
                src={preview}
                alt="Resident photo"
                sx={{ width: 100, height: 100 }}
              />
              <Button variant="contained" component="label">
                Upload Photo
                <input hidden accept="image/*" type="file" onChange={handleFileChange} />
              </Button>
            </Box>
          </Grid>

          {/* Form Fields */}
          <Grid item xs={12} sm={4}>
            <TextField label="First name" name="first_name" value={form.first_name} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Middle name" name="middle_name" value={form.middle_name} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Last name" name="last_name" value={form.last_name} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Date of birth" name="dob" type="date" value={form.dob} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Gender" name="gender" value={form.gender} onChange={handleChange} fullWidth>
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Civil status" name="civil_status" value={form.civil_status} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Place of birth" name="place_of_birth" value={form.place_of_birth} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Household No." name="household_no" value={form.household_no} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ResidentForm.propTypes = {
  open: PropTypes.bool,
  resident: PropTypes.object,
  onClose: PropTypes.func
}
