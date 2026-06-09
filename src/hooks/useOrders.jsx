import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { orders as initialOrders } from '../data/data'

/**
 * useOrders
 * ──────────
 * Custom hook que centraliza toda la lógica del CRUD de pedidos.
 */
export function useOrders() {
  const { showToast } = useToast()

  const STATUS_OPTIONS = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado']

  const makeOrderNumber = () =>
    String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6).padStart(6, '0')

  const todayStr = () => {
    const d = new Date()
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
  }

  const EMPTY_FORM = {
    orderNumber: '', client: '', total: '',
    currency: 'USD', status: 'Pendiente', date: '',
  }

  const [orders, setOrders]     = useState(initialOrders)
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [page, setPage]         = useState(1)
  const PER_PAGE = 8

  // ── Filtrado y paginación 
  const filtered = orders.filter(o =>
    o.client.toLowerCase().includes(search.toLowerCase()) ||
    o.id?.includes?.(search) ||
    o.orderNumber?.includes?.(search)
  )
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // ── Abrir modals 
  const openAdd = () => {
    setForm({ ...EMPTY_FORM, date: todayStr(), orderNumber: makeOrderNumber() })
    setSelected(null)
    setModal('add')
  }

  const openEdit = (order) => {
    setForm({
      orderNumber: order.id || order.orderNumber,
      client: order.client,
      total: order.total,
      currency: order.currency,
      status: order.status,
      date: order.date,
    })
    setSelected(order)
    setModal('edit')
  }

  const openDelete = (order) => {
    setSelected(order)
    setModal('delete')
  }

  const closeModal = () => {
    setModal(null)
    setSelected(null)
  }

  //  Operaciones CRUD 
  const handleSave = () => {
    if (!form.client.trim() || !form.total) return

    if (modal === 'add') {
      const newOrder = {
        id: form.orderNumber,
        client: form.client,
        avatar: form.client.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        total: Number(form.total),
        currency: form.currency,
        status: form.status,
        date: form.date,
        items: 1,
      }
      setOrders(prev => [newOrder, ...prev])
      showToast(`Pedido #${form.orderNumber} creado correctamente.`, 'success')
    } else {
      setOrders(prev =>
        prev.map(o =>
          (o.id || o.orderNumber) === (selected.id || selected.orderNumber)
            ? { ...o, ...form, id: form.orderNumber, total: Number(form.total) }
            : o
        )
      )
      showToast(`Pedido #${form.orderNumber} actualizado.`, 'info')
    }

    closeModal()
  }

  const handleDelete = () => {
    setOrders(prev => prev.filter(o => o.id !== selected.id))
    showToast(`Pedido #${selected.id} eliminado.`, 'error')
    closeModal()
  }

  const setField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  return {
    // Estado
    orders, filtered, paginated, totalPages,
    search, setSearch,
    modal, selected, form,
    page, setPage,
    STATUS_OPTIONS,
    PER_PAGE,
    // Acciones
    openAdd, openEdit, openDelete, closeModal,
    handleSave, handleDelete,
    setField,
  }
}
