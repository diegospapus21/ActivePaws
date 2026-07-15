const { mongoose } = require('../db/connection')
const { Schema } = mongoose

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  qty:       { type: Number, required: true, min: 1 },
}, { _id: false })

const orderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },   // ej. "001256"
  userId:      { type: Schema.Types.ObjectId, ref: 'User', default: null },
  client:      { type: String, required: true },
  avatar:      { type: String, default: '' },
  total:       { type: Number, required: true, min: 0 },
  currency:    { type: String, default: 'MXN' },
  status:      { type: String, enum: ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'], default: 'Pendiente' },
  date:        { type: String, required: true },   // formato DD/MM/AAAA, para mostrar tal cual en la UI
  items:       { type: [orderItemSchema], default: [] },
  shipping:    { type: Schema.Types.Mixed, default: null },
}, { timestamps: true })

orderSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema)
