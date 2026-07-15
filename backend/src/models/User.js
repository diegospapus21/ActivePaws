const { mongoose } = require('../db/connection')
const { Schema } = mongoose

const userSchema = new Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'client'], default: 'client' },
  status:   { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },

  emailConfirmed:     { type: Boolean, default: false },

  // Verificación de cuenta por código (enviado al correo al registrarse)
  confirmCode:         { type: String, default: null },
  confirmCodeExpires:  { type: Date,   default: null },

  // Recuperación de contraseña
  resetToken:          { type: String, default: null },
  resetTokenExpires:   { type: Date,   default: null },
}, { timestamps: true })

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.password
    delete ret.confirmCode
    delete ret.confirmCodeExpires
    delete ret.resetToken
    delete ret.resetTokenExpires
    return ret
  },
})

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
