import { useState, useEffect } from 'react'
import { Role, Permission } from '../types'
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
import { Checkbox } from '../components/ui/checkbox'

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [newRole, setNewRole] = useState<Omit<Role, 'id'>>({ name: '', permissions: [] })

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    const fetchedRoles = await api.getRoles()
    setRoles(fetchedRoles)
  }

  const handleCreateRole = async () => {
    await api.createRole(newRole)
    setNewRole({ name: '', permissions: [] })
    fetchRoles()
  }

  const handleUpdateRole = async (id: string, updates: Partial<Role>) => {
    await api.updateRole(id, updates)
    fetchRoles()
  }

  const handleDeleteRole = async (id: string) => {
    await api.deleteRole(id)
    fetchRoles()
  }

  const togglePermission = (role: Role, permission: Permission) => {
    const updatedPermissions = role.permissions.includes(permission)
      ? role.permissions.filter(p => p !== permission)
      : [...role.permissions, permission]
    handleUpdateRole(role.id, { permissions: updatedPermissions })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Roles</h1>
      
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Role name"
          value={newRole.name}
          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
        />
        <Button onClick={handleCreateRole}>Add Role</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Read</TableHead>
            <TableHead>Write</TableHead>
            <TableHead>Delete</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                <Checkbox
                  checked={role.permissions.includes('read')}
                  onCheckedChange={() => togglePermission(role, 'read')}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={role.permissions.includes('write')}
                  onCheckedChange={() => togglePermission(role, 'write')}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={role.permissions.includes('delete')}
                  onCheckedChange={() => togglePermission(role, 'delete')}
                />
              </TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeleteRole(role.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

