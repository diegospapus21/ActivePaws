import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { products as initialProducts } from '../data/data'

/**
 * useProducts
 * 
 * Custom hook que centraliza toda la lógica del CRUD de productos.
 * Los componentes solo llaman a las funciones y reciben el estado.
 *
 * Uso:
 *   const { products, openAdd, openEdit, openDelete, handleSave, handleDelete, ... } = useProducts()
 */
export function useProducts() {
  const { showToast } = useToast()

  const EMPTY_FORM = {
    name: '', category: 'Ropa para Perros', price: '', currency: 'MXN',
    stock: '', description: '', status: 'Activo', image: '',
  }

  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(null)      // null || 'add' | 'edit' || 'delete'
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [page, setPage]         = useState(1)
  const [menuOpen, setMenuOpen] = useState(null)
  const PER_PAGE = 8

  //  Filtrado y paginación 
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Abrir modals
  const openAdd = () => {
    setForm(EMPTY_FORM)
    setSelected(null)
    setModal('add')
  }

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

  const openDelete = (product) => {
    setSelected(product)
    setModal('delete')
    setMenuOpen(null)
  }

  const closeModal = () => {
    setModal(null)
    setSelected(null)
  }

  //  Operaciones CRUD
  const handleSave = () => {
    if (!form.name.trim() || !form.price || !form.stock) return

    if (modal === 'add') {
      const newProduct = {
        ...form,
        id: Date.now(),
        price: Number(form.price),
        stock: Number(form.stock),
        sold: 0,
        tags: [],
        image: form.image ||
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop',
      }
      setProducts(prev => [newProduct, ...prev])
      showToast(`Producto "${form.name}" agregado correctamente.`, 'success')
    } else if (modal === 'edit') {
      setProducts(prev =>
        prev.map(p =>
          p.id === selected.id
            ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock) }
            : p
        )
      )
      showToast(`Producto "${form.name}" actualizado.`, 'info')
    }

    closeModal()
  }

  const handleDelete = () => {
    setProducts(prev => prev.filter(p => p.id !== selected.id))
    showToast(`Producto "${selected.name}" eliminado.`, 'error')
    closeModal()
  }

  // Helper para actualizar campos del formulario
  const setField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  return {
    // Estado
    products, filtered, paginated, totalPages,
    search, setSearch,
    modal, selected, form,
    page, setPage,
    menuOpen, setMenuOpen,
    PER_PAGE,
    // Acciones
    openAdd, openEdit, openDelete, closeModal,
    handleSave, handleDelete,
    setField,
  }
}
