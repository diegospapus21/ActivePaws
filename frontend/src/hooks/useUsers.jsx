import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { useToast } from '../context/ToastContext'

// Backend usa 'admin'/'client' en inglés; la UI históricamente muestra
// 'Administrador'/'Cliente'. Estas funciones traducen entre ambos mundos.
const toLabel = (role) => (role === 'admin' ? 'Administrador' : 'Cliente')
const toRole  = (label) => (label === 'Administrador' ? 'admin' : 'client')

/**
 * useUsers (panel admin)
 * ────────────────────────
 * Custom hook que centraliza el CRUD de usuarios contra el backend real.
 */
export function useUsers() {
  const { showToast } = useToast()

  const EMPTY_FORM = { name: '', email: '', username: '', password: '', role: 'Cliente', status: 'Activo' }

  const [rawUsers, setRawUsers] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [page, setPage]         = useState(1)
  const [sortBy, setSortBy]     = useState('default')
  const PER_PAGE = 8

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get('/users')
      setRawUsers(data)
    } catch (err) {
      showToast(err.message || 'No se pudieron cargar los usuarios.', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { loadUsers() }, [loadUsers])

  // Usuarios con el rol traducido a español para la UI
  const users = rawUsers.map(u => ({ ...u, role: toLabel(u.role) }))

  //  Filtrado y paginacion
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

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // ── Estadísticas rápidas ────────────────────────────────────────────────────
  const activeCount = users.filter(u => u.status === 'Activo').length
  const adminCount  = users.filter(u => u.role === 'Administrador').length

  // ── Abrir modals ────────────────────────────────────────────────────────────
  const openAdd = () => { setForm(EMPTY_FORM); setSelected(null); setModal('add') }

  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, username: user.username, password: '', role: user.role, status: user.status })
    setSelected(user)
    setModal('edit')
  }

  const openDelete = (user) => { setSelected(user); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null) }

  // ── Operaciones CRUD ────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return

    const payload = {
      name: form.name,
      email: form.email,
      username: form.username || form.email.split('@')[0],
      role: toRole(form.role),
      status: form.status,
      ...(form.password && { password: form.password }),
    }

    try {
      if (modal === 'add') {
        await api.post('/users', payload)
        showToast(`Usuario "${form.name}" creado correctamente.`, 'success')
      } else {
        await api.put(`/users/${selected.id}`, payload)
        showToast(`Usuario "${form.name}" actualizado.`, 'info')
      }
      await loadUsers()
      closeModal()
    } catch (err) {
      showToast(err.message || 'Ocurrió un error al guardar el usuario.', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await api.del(`/users/${selected.id}`)
      showToast(`Usuario "${selected.name}" eliminado.`, 'error')
      await loadUsers()
      closeModal()
    } catch (err) {
      showToast(err.message || 'No se pudo eliminar el usuario.', 'error')
    }
  }

  const setField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  return {
    users, loading, filtered, paginated, totalPages,
    activeCount, adminCount,
    search, setSearch,
    modal, selected, form,
    page, setPage,
    sortBy, setSortBy,
    PER_PAGE,
    openAdd, openEdit, openDelete, closeModal,
    handleSave, handleDelete,
    setField, reload: loadUsers,
  }
}
