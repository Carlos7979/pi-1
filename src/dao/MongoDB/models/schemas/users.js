const { Schema } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const users = new Schema({
	first_name: {
		type: String,
		required: true,
		index: true
	},
	last_name: {
		type: String,
		required: true
	},
	email: {
        type: String,
        required: true,
		unique: true,
        validate: {
            validator: function (value) {
                const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                if (!re.test(value)) {
                    return false
                }
                return true
            }
        }
    },
	gender: String
})

users.plugin(mongoosePaginate)

module.exports = users