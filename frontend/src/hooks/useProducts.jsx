import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { useToast } from '../context/ToastContext'

/**
 * useProducts (panel admin)
 * ──────────────────────────
 * Custom hook que centraliza el CRUD de productos contra el backend real.
 */
export function useProducts() {
  const { showToast } = useToast()

  const EMPTY_FORM = {
    name: '', category: 'Ropa para Perros', price: '', currency: 'MXN',
    stock: '', description: '', status: 'Activo', image: '',
  }

  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(null)      // null | 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [page, setPage]         = useState(1)
  const [menuOpen, setMenuOpen] = useState(null)
  const PER_PAGE = 8

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get('/products')
      setProducts(data)
    } catch (err) {
      showToast(err.message || 'No se pudieron cargar los productos.', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { loadProducts() }, [loadProducts])

  // ── Filtrado y paginación ──────────────────────────────────────────────────
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // ── Abrir modals ────────────────────────────────────────────────────────────
  const openAdd = () => { setForm(EMPTY_FORM); setSelected(null); setModal('add') }

  const openEdit = (product) => {
    setForm({
      name: product.name, category: product.category,
      price: product.price, currency: product.currency,
      stock: product.stock, description: product.description,
      status: product.status, image: product.image,
    })
    setSelected(product)
    setModal('edit')
    setMenuOpen(null)
  }

  const openDelete = (product) => { setSelected(product); setModal('delete'); setMenuOpen(null) }
  const closeModal = () => { setModal(null); setSelected(null) }

  // ── Operaciones CRUD ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.stock) return

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    }

    try {
      if (modal === 'add') {
        await api.post('/products', payload)
        showToast(`Producto "${form.name}" agregado correctamente.`, 'success')
      } else if (modal === 'edit') {
        await api.put(`/products/${selected.id}`, payload)
        showToast(`Producto "${form.name}" actualizado.`, 'info')
      }
      await loadProducts()
      closeModal()
    } catch (err) {
      showToast(err.message || 'Ocurrió un error al guardar el producto.', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await api.del(`/products/${selected.id}`)
      showToast(`Producto "${selected.name}" eliminado.`, 'error')
      await loadProducts()
      closeModal()
    } catch (err) {
      showToast(err.message || 'No se pudo eliminar el producto.', 'error')
    }
  }

  const setField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  return {
    products, loading, filtered, paginated, totalPages,
    search, setSearch,
    modal, selected, form,
    page, setPage,
    menuOpen, setMenuOpen,
    PER_PAGE,
    openAdd, openEdit, openDelete, closeModal,
    handleSave, handleDelete,
    setField, reload: loadProducts,
  }
}
