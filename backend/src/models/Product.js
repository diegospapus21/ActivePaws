const { mongoose } = require('../db/connection')
const { Schema } = mongoose

const productSchema = new Schema({
  name:        { type: String, required: true, trim: true },
  category:    { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  currency:    { type: String, default: 'MXN' },
  stock:       { type: Number, required: true, min: 0, default: 0 },
  sold:        { type: Number, default: 0 },
  status:      { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },
  description: { type: String, default: '' },
  tags:        { type: [String], default: [] },
  image:       { type: String, default: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop' },
}, { timestamps: true })

productSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema)
