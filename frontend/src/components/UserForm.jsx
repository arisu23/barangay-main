import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { createAccount, updateAccount } from '../api/accountsApi'

export default function UserForm({ open, user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Staff'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: '', // Don't pre-fill password for security
        role: user.role
      })
    } else {
      setFormData({
        username: '',
        password: '',
        role: 'Staff'
      })
    }
    setError(null)
  }, [user, open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    // Validation
    if (!formData.username.trim()) {
      setError('Username is required')
      return
    }

    if (!user && !formData.password.trim()) {
      setError('Password is required for new users')
      return
    }

    try {
      setLoading(true)

      if (user) {
        // Update existing user
        await updateAccount(user.user_id, {
          username: formData.username,
          ...(formData.password && { password: formData.password }),
          role: formData.role
        })
      } else {
        // Create new user (user_id is auto-generated)
        await createAccount({
          username: formData.username,
          password: formData.password,
          role: formData.role
        })
      }

      onSave()
      
      // Reset form
      setFormData({
        username: '',
        password: '',
        role: 'Staff'
      })
    } catch (err) {
      console.error('Error saving account:', err)
      setError(err.response?.data?.message || 'Failed to save account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      username: '',
      password: '',
      role: 'Staff'
    })
    setError(null)
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        {user ? 'Edit User' : 'Add New User'}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
              autoFocus
              variant="outlined"
              helperText="Enter a unique username"
              disabled={loading}
            />

            <TextField
              label={user ? 'New Password (leave blank to keep current)' : 'Password'}
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required={!user}
              variant="outlined"
              helperText={user ? 'Only fill this if you want to change the password' : 'Enter a secure password'}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              helperText="Select the user's role"
              disabled={loading}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} variant="outlined" disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
            sx={{ position: 'relative' }}
          >
            {loading ? <CircularProgress size={24} sx={{ position: 'absolute' }} /> : (user ? 'Update User' : 'Add User')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
