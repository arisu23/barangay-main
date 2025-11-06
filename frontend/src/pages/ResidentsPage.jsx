// import React, { useEffect, useState } from 'react'
// import { Container, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
// import { getResidents, deleteResident } from '../api/residentsApi'
// import ResidentForm from '../components/ResidentForm'


// export default function ResidentsPage() {
// const [residents, setResidents] = useState([])
// const [editing, setEditing] = useState(null)
// const [openForm, setOpenForm] = useState(false)


// const load = async () => {
// const res = await getResidents();
// setResidents(res.data);
// }


// useEffect(() => { load() }, [])


// return (
// <Container>
// <Typography variant="h4" my={2}>Residents</Typography>
// <Button variant="contained" onClick={() => { setEditing(null); setOpenForm(true) }}>Add Resident</Button>


// <Table sx={{ mt: 2 }}>
// <TableHead>
// <TableRow>
// <TableCell>ID</TableCell>
// <TableCell>Name</TableCell>
// <TableCell>Address</TableCell>
// <TableCell>Actions</TableCell>
// </TableRow>
// </TableHead>
// <TableBody>
// {residents.map(r => (
// <TableRow key={r.id}>
// <TableCell>{r.id}</TableCell>
// <TableCell>{r.first_name} {r.middle_name || ''} {r.last_name}</TableCell>
// <TableCell>{r.address}</TableCell>
// <TableCell>
// <Button onClick={() => { setEditing(r); setOpenForm(true) }}>Edit</Button>
// <Button onClick={async () => { await deleteResident(r.id); load(); }}>Delete</Button>
// </TableCell>
// </TableRow>
// ))}
// </TableBody>
// </Table>


// <ResidentForm
// open={openForm}
// resident={editing}
// onClose={() => { setOpenForm(false); load(); }}
// />
// </Container>
// )
// }


import React, { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Box
} from '@mui/material'
import { getResidents, deleteResident } from '../api/residentsApi'
import ResidentForm from '../components/ResidentForm'

export default function ResidentsPage() {
  const [residents, setResidents] = useState([])
  const [editing, setEditing] = useState(null)
  const [openForm, setOpenForm] = useState(false)

  const load = async () => {
    try {
      const res = await getResidents()
      setResidents(res.data)
    } catch (err) {
      console.error('Error loading residents:', err)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resident?')) return
    await deleteResident(id)
    load()
  }

  // Base URL for photo
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

  return (
    <Container>
      <Typography variant="h4" my={2}>
        Residents
      </Typography>

      <Button
        variant="contained"
        onClick={() => {
          setEditing(null)
          setOpenForm(true)
        }}
      >
        Add Resident
      </Button>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Photo</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {residents.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              
              {/* Photo Column */}
              {/* <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={
                      r.photo
                        ? `${baseURL}${r.photo}`
                        : 'https://via.placeholder.com/80x80?text=No+Photo'
                    }
                    alt={`${r.first_name} ${r.last_name}`}
                    sx={{ width: 56, height: 56, mr: 1 }}
                  />
                </Box>
              </TableCell> */}

<TableCell>
  <Box display="flex" alignItems="center">
    <Avatar
      src={
        // ✅ Use r.photo directly because backend now returns the full URL
        r.photo
          ? r.photo
          : 'https://via.placeholder.com/80x80?text=No+Photo'
      }
      alt={`${r.first_name} ${r.last_name}`}
      sx={{ width: 56, height: 56, mr: 1 }}
    />
  </Box>
</TableCell>




              <TableCell>
                {r.first_name} {r.middle_name || ''} {r.last_name}
              </TableCell>
              <TableCell>{r.address}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    setEditing(r)
                    setOpenForm(true)
                  }}
                >
                  Edit
                </Button>
                <Button color="error" onClick={() => handleDelete(r.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ResidentForm
        open={openForm}
        resident={editing}
        onClose={() => {
          setOpenForm(false)
          load()
        }}
      />
    </Container>
  )
}
