const mongoose = require('mongoose');
const { CATEGORIES, PRIORITIES, STATUSES } = require('../constants');

const ticketSchema = new mongoose.Schema(
  {
    title: {
         type: String,
          required: true,
          trim: true,
          maxlength: 120 
    },
    description: { 
        type: String, 
        required: true, 
        trim: true, 
        maxlength: 2000 
    },

    category: 
    { type: String, 
        enum: CATEGORIES, 
        default: 'Other' 
    },

    priority: { 
        type: String, 
        enum: PRIORITIES, 
        default: 'Medium' 
    },

    status: { 
        type: String, 
        enum: STATUSES, 
        default: 'Open'
    },

    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', 
        required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);