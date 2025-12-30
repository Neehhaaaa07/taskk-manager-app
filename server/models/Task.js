const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const TaskSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    dueDate: { 
        type: Date 
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed'], 
        default: 'pending' 
    },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        default: 'medium' 
    }
}, { timestamps: true });

// Enable Pagination
TaskSchema.plugin(mongoosePaginate);

module.exports = mongoose.models.Task || mongoose.model('Task', TaskSchema);