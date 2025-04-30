import { createContext, useContext, useState } from 'react'
import { Cliente } from '../types/cliente'

interface ClientesContextType {
  clientes: Cliente[]
  setClientes: (clientes: Cliente[]) => void
}

const ClientesContext = createContext<ClientesContextType | undefined>(undefined)

export const ClientesProvider = ({ children }: { children: React.ReactNode }) => {
  const [clientes, setClientes] = useState<Cliente[]>([])

  return (
    <ClientesContext.Provider value={{ clientes, setClientes }}>
      {children}
    </ClientesContext.Provider>
  )
}

export const useClientes = () => {
  const context = useContext(ClientesContext)
  if (!context) {
    throw new Error('useClientes deve ser usado dentro de um ClientesProvider');
  }
  return context
}
