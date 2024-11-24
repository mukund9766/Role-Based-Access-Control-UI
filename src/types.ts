export type User = {
    id: string
    name: string
    email: string
    role: string
    status: 'active' | 'inactive'
  }
  
  export type Role = {
    id: string
    name: string
    permissions: Permission[]
  }
  
  export type Permission = 'read' | 'write' | 'delete'
  
  