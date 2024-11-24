import { User, Role, Permission } from '../types'

let users: User[] = [
  { id: '1', name: 'Ram s', email: 'ram@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'sita j', email: 'sita@example.com', role: 'user', status: 'active' },
]

let roles: Role[] = [
  { id: '1', name: 'admin', permissions: ['read', 'write', 'delete'] },
  { id: '2', name: 'user', permissions: ['read'] },
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const api = {
  getUsers: async (): Promise<User[]> => {
    await delay(500)
    return users
  },
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    await delay(500)
    const newUser = { ...user, id: String(users.length + 1) }
    users.push(newUser)
    return newUser
  },
  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    await delay(500)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) throw new Error('User not found')
    users[index] = { ...users[index], ...updates }
    return users[index]
  },
  deleteUser: async (id: string): Promise<void> => {
    await delay(500)
    users = users.filter(u => u.id !== id)
  },
  getRoles: async (): Promise<Role[]> => {
    await delay(500)
    return roles
  },
  createRole: async (role: Omit<Role, 'id'>): Promise<Role> => {
    await delay(500)
    const newRole = { ...role, id: String(roles.length + 1) }
    roles.push(newRole)
    return newRole
  },
  updateRole: async (id: string, updates: Partial<Role>): Promise<Role> => {
    await delay(500)
    const index = roles.findIndex(r => r.id === id)
    if (index === -1) throw new Error('Role not found')
    roles[index] = { ...roles[index], ...updates }
    return roles[index]
  },
  deleteRole: async (id: string): Promise<void> => {
    await delay(500)
    roles = roles.filter(r => r.id !== id)
  },
}

