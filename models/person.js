const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to Atlas')
  })
  .catch((error) => {
    console.log('Error connecting to Atlas:', error.message)
  })

const personEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (v) {
        if (v.split('-').length - 1 !== 1) {
          return false
        }

        const [a, b] = v.split('-')

        if (a.length < 2 || a.length > 3 || !/^\d+$/.test(b)) {
          return false
        }

        return true
      },
      message: (props) =>
        `Provided phone number "${props.value}" is not valid.`,
    },
  },
})

personEntrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('PersonEntry', personEntrySchema)
