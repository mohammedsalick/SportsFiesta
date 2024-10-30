const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        enum: ['indoor', 'outdoor', 'fun'], 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    maxRegistrations: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    imageUrl: { 
        type: String, 
        required: true, 
        validate: {
            validator: function(v) {
                return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
