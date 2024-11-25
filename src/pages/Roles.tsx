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
import { Checkbox } from '../components/ui/checkbox'

// Dummy data
const initialRoles = [
  { id: 1, name: 'Admin', permissions: ['read', 'write', 'delete'] },
  { id: 2, name: 'Editor', permissions: ['read', 'write'] },
  { id: 3, name: 'Viewer', permissions: ['read'] },
]

const allPermissions = ['read', 'write', 'delete']

// Mock API functions
const fetchRoles = () => Promise.resolve(initialRoles)
const addRole = (role) => Promise.resolve({ id: Date.now(), ...role })
const updateRole = (role) => Promise.resolve(role)
const deleteRole = (id) => Promise.resolve(id)

export default function Roles() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const queryClient = useQueryClient()

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  })

  const addRoleMutation = useMutation({
    mutationFn: addRole,
    onSuccess: (newRole) => {
      queryClient.setQueryData(['roles'], (oldRoles) => [...oldRoles, newRole])
      setIsOpen(false)
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: (updatedRole) => {
      queryClient.setQueryData(['roles'], (oldRoles) =>
        oldRoles.map((role) => (role.id === updatedRole.id ? updatedRole : role))
      )
      setIsOpen(false)
      setEditingRole(null)
    },
  })

  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['roles'], (oldRoles) =>
        oldRoles.filter((role) => role.id !== deletedId)
      )
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name')
    const permissions = allPermissions.filter(perm => formData.get(perm))
    const roleData = { name, permissions }
    
    if (editingRole) {
      updateRoleMutation.mutate({ ...editingRole, ...roleData })
    } else {
      addRoleMutation.mutate(roleData)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingRole(null)}>Add Role</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRole ? 'Edit Role' : 'Add Role'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={editingRole?.name} required />
              </div>
              <div>
                <Label>Permissions</Label>
                {allPermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission}
                      name={permission}
                      defaultChecked={editingRole?.permissions.includes(permission)}
                    />
                    <Label htmlFor={permission}>{permission}</Label>
                  </div>
                ))}
              </div>
              <Button type="submit">{editingRole ? 'Update' : 'Add'} Role</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.permissions.join(', ')}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => {
                    setEditingRole(role)
                    setIsOpen(true)
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteRoleMutation.mutate(role.id)}
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

