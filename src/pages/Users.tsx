import { useState, useEffect } from 'react'
import { User } from '../types'
import { api } from '../api/dummyApi'
import { Button } from '../components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', role: 'user', status: 'active' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const fetchedUsers = await api.getUsers()
    setUsers(fetchedUsers)
  }

  const handleCreateUser = async () => {
    await api.createUser(newUser)
    setNewUser({ name: '', email: '', role: 'user', status: 'active' })
    fetchUsers()
  }

  const handleUpdateUser = async (id: string, updates: Partial<User>) => {
    await api.updateUser(id, updates)
    fetchUsers()
  }

  const handleDeleteUser = async (id: string) => {
    await api.deleteUser(id)
    fetchUsers()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <Input
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <Select
          value={newUser.role}
          onValueChange={(value) => setNewUser({ ...newUser, role: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleCreateUser}>Add User</Button>
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
                <Select
                  value={user.status}
                  onValueChange={(value) => handleUpdateUser(user.id, { status: value as 'active' | 'inactive' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

