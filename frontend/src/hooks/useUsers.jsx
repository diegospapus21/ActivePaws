import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { users as initialUsers } from '../data/data'

/**
 * useUsers
 * ─────────
 * Custom hook que centraliza toda la lógica del CRUD de usuarios.
 */
export function useUsers() {
  const { showToast } = useToast()

  const EMPTY_FORM = { name: '', email: '', role: 'Cliente', status: 'Activo' }

  const [users, setUsers]       = useState(initialUsers)
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [page, setPage]         = useState(1)
  const [sortBy, setSortBy]     = useState('default')
  const PER_PAGE = 8

  //Filtrado y paginacion 
  const filtered = users
    .filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name')   return a.name.localeCompare(b.name)
      if (sortBy === 'role')   return a.role.localeCompare(b.role)
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      return 0
    })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Estadísticas rápidas 
  const activeCount = users.filter(u => u.status === 'Activo').length
  const adminCount  = users.filter(u => u.role === 'Administrador').length

  //  Abrir modals
  const openAdd = () => {
    setForm(EMPTY_FORM)
    setSelected(null)
    setModal('add')
  }

  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status })
    setSelected(user)
    setModal('edit')
  }

  const openDelete = (user) => {
    setSelected(user)
    setModal('delete')
  }

  const closeModal = () => {
    setModal(null)
    setSelected(null)
  }

  // Operaciones CRUD
  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return

    if (modal === 'add') {
      setUsers(prev => [{ id: Date.now(), ...form }, ...prev])
      showToast(`Usuario "${form.name}" creado correctamente.`, 'success')
    } else {
      setUsers(prev =>
        prev.map(u => u.id === selected.id ? { ...u, ...form } : u)
      )
      showToast(`Usuario "${form.name}" actualizado.`, 'info')
    }

    closeModal()
  }

  const handleDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== selected.id))
    showToast(`Usuario "${selected.name}" eliminado.`, 'error')
    closeModal()
  }

  const setField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  return {
    // Estado
    users, filtered, paginated, totalPages,
    activeCount, adminCount,
    search, setSearch,
    modal, selected, form,
    page, setPage,
    sortBy, setSortBy,
    PER_PAGE,
    // Acciones
    openAdd, openEdit, openDelete, closeModal,
    handleSave, handleDelete,
    setField,
  }
}
