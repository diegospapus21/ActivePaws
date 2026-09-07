const { mongoose } = require('../db/connection')
const { Schema } = mongoose

const reviewSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName:  { type: String, required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true, trim: true },
  date:      { type: String, required: true },
}, { timestamps: true })

reviewSchema.index({ productId: 1, userId: 1 }, { unique: true })

reviewSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema)
