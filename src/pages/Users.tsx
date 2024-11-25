import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '../components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'

// Dummy data
const initialUsers = [
  { id: 1, name: 'ram patil', email: 'ram@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'sita rao', email: 'sita@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'lakhan mane', email: 'lakhan@example.com', role: 'Viewer', status: 'Inactive' },
]

const roles = ['Admin', 'Editor', 'Viewer']

// Mock API functions
const fetchUsers = () => Promise.resolve(initialUsers)
const addUser = (user) => Promise.resolve({ id: Date.now(), ...user })
const updateUser = (user) => Promise.resolve(user)
const deleteUser = (id) => Promise.resolve(id)

export default function Users() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const queryClient = useQueryClient()

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: (newUser) => {
      queryClient.setQueryData(['users'], (oldUsers) => [...oldUsers, newUser])
      setIsOpen(false)
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['users'], (oldUsers) =>
        oldUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      )
      setIsOpen(false)
      setEditingUser(null)
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['users'], (oldUsers) =>
        oldUsers.filter((user) => user.id !== deletedId)
      )
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const userData = Object.fromEntries(formData.entries())
    
    if (editingUser) {
      updateUserMutation.mutate({ ...editingUser, ...userData })
    } else {
      addUserMutation.mutate(userData)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)}>Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={editingUser?.name} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={editingUser?.email} required />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue={editingUser?.role || roles[0]}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={editingUser?.status || 'Active'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">{editingUser ? 'Update' : 'Add'} User</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => {
                    setEditingUser(user)
                    setIsOpen(true)
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteUserMutation.mutate(user.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

