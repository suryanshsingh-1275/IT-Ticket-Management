
const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const {
  CATEGORIES,
  PRIORITIES,
  STATUSES
} = require('../constants');

const escapeRegex = (s) => {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const shortId = (ticket) => {
  return String(ticket._id).slice(-6).toUpperCase();
};

const buildFilter = async (req, { mine }) => {
  const { search, status, priority, category } = req.query;

  const filter = {};

  if (mine) {
    filter.createdBy = req.user._id;
  }

  if (STATUSES.includes(status)) {
    filter.status = status;
  }

  if (PRIORITIES.includes(priority)) {
    filter.priority = priority;
  }

  if (CATEGORIES.includes(category)) {
    filter.category = category;
  }

  if (search && search.trim()) {
    const rx = new RegExp(
      escapeRegex(search.trim()),
      'i'
    );

    const or = [
      { title: rx },
      { description: rx }
    ];

    if (!mine) {
      const users = await User.find({
        $or: [
          { name: rx },
          { email: rx }
        ]
      }).select('_id');

      if (users.length) {
        or.push({
          createdBy: {
            $in: users.map((user) => user._id)
          }
        });
      }
    }

    filter.$or = or;
  }

  return filter;
};

