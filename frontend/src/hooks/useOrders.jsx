import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { useToast } from '../context/ToastContext'

/**
 * useOrders (panel admin)
 * ────────────────────────
 * Custom hook que centraliza el CRUD de pedidos contra el backend real.
 */
export function useOrders() {
  const { showToast } = useToast()

  const STATUS_OPTIONS = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado']

  const todayStr = () => {
    const d = new Date()
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
  }

  const EMPTY_FORM = {
    orderNumber: '', client: '', total: '',
    currency: 'MXN', status: 'Pendiente', date: '',
  }

  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [page, setPage]         = useState(1)
  const PER_PAGE = 8

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get('/orders')
      setOrders(data)
    } catch (err) {
      showToast(err.message || 'No se pudieron cargar los pedidos.', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { loadOrders() }, [loadOrders])

  // ── Filtrado y paginación ──────────────────────────────────────────────────
  const filtered = orders.filter(o =>
    o.client.toLowerCase().includes(search.toLowerCase()) ||
    o.id?.includes?.(search)
  )
  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // ── Abrir modals ────────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm({ ...EMPTY_FORM, date: todayStr() })
    setSelected(null)
    setModal('add')
  }

  const openEdit = (order) => {
    setForm({
      orderNumber: order.id,
      client: order.client,
      total: order.total,
      currency: order.currency,
      status: order.status,
      date: order.date,
    })
    setSelected(order)
    setModal('edit')
  }

  const openDelete = (order) => { setSelected(order); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null) }

  // ── Operaciones CRUD ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.client.trim() || !form.total) return

    const payload = {
      client: form.client,
      total: Number(form.total),
      currency: form.currency,
      status: form.status,
      date: form.date,
    }

    try {
      if (modal === 'add') {
        const res = await api.post('/orders', payload)
        showToast(`Pedido #${res.order.id} creado correctamente.`, 'success')
      } else {
        await api.put(`/orders/${selected.id}`, payload)
        showToast(`Pedido #${selected.id} actualizado.`, 'info')
      }
      await loadOrders()
      closeModal()
    } catch (err) {
      showToast(err.message || 'Ocurrió un error al guardar el pedido.', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await api.del(`/orders/${selected.id}`)
      showToast(`Pedido #${selected.id} eliminado.`, 'error')
      await loadOrders()
      closeModal()
    } catch (err) {
      showToast(err.message || 'No se pudo eliminar el pedido.', 'error')
    }
  }

  const setField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  return {
    orders, loading, filtered, paginated, totalPages,
    search, setSearch,
    modal, selected, form,
    page, setPage,
    STATUS_OPTIONS,
    PER_PAGE,
    openAdd, openEdit, openDelete, closeModal,
    handleSave, handleDelete,
    setField, reload: loadOrders,
  }
}
