export default function StatusBadge({ status }) {
  const map = {
    'Activo':     'status-active',
    'Inactivo':   'status-inactive',
    'Pendiente':  'status-pending',
    'Enviado':    'status-sent',
    'Entregado':  'status-delivered',
    'Cancelado':  'status-cancelled',
    'Cliente':    'bg-amber-100 text-amber-700 border border-amber-200',
    'Administrador': 'bg-blue-100 text-blue-700 border border-blue-200',
  }
  const cls = map[status] || 'bg-gray-100 text-gray-600 border border-gray-200'

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {['Activo', 'Inactivo'].includes(status) && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1 ${status === 'Activo' ? 'bg-green-500' : 'bg-red-400'}`} />
      )}
      {status}
    </span>
  )
}
