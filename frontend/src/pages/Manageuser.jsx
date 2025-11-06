import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import UserForm from '../components/UserForm'
import { getAccounts, deleteAccount } from '../api/accountsApi'

export default function ManageUser() {
  const [users, setUsers] = useState([])
  const [editing, setEditing] = useState(null)
  const [openForm, setOpenForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load accounts from backend
  const loadAccounts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAccounts()
      setUsers(response.data)
    } catch (err) {
      console.error('Error loading accounts:', err)
      setError('Failed to load accounts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return
    try {
      await deleteAccount(userId)
      setUsers(users.filter(u => u.user_id !== userId))
    } catch (err) {
      console.error('Error deleting account:', err)
      setError('Failed to delete account. Please try again.')
    }
  }

  const handleSaveUser = async (userData) => {
    try {
      await loadAccounts()
      setOpenForm(false)
      setEditing(null)
    } catch (err) {
      console.error('Error saving user:', err)
      setError('Failed to save account. Please try again.')
    }
  }

  // Filter users based on search query
  const filteredUsers = users.filter((u) => {
    const searchText = searchQuery.toLowerCase()
    return (
      u.username.toLowerCase().includes(searchText) ||
      u.role.toLowerCase().includes(searchText)
    )
  })

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'error'
      case 'staff':
        return 'primary'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Manage Users
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Add, edit, or remove user accounts and manage their roles
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          {/* Search and Add User Section */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
            <TextField
              placeholder="Search by username or role..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => {
                setEditing(null)
                setOpenForm(true)
              }}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Add User
            </Button>
          </Box>

          {/* Users Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow 
                    key={user.user_id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.username}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        color={getRoleColor(user.role)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => {
                          setEditing(user)
                          setOpenForm(true)
                        }}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(user.user_id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* User Form Dialog */}
      <UserForm
        open={openForm}
        user={editing}
        onClose={() => {
          setOpenForm(false)
          setEditing(null)
        }}
        onSave={handleSaveUser}
      />
    </Container>
  )
}
