
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

// Create a ticket
const createTicket = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      priority
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: 'Title and description are required'
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category: CATEGORIES.includes(category)
        ? category
        : 'Other',
      priority: PRIORITIES.includes(priority)
        ? priority
        : 'Medium',
      createdBy: req.user._id
    });

    sendEmail({
      to: req.user.email,
      subject: `Ticket #${shortId(ticket)} received: ${ticket.title}`,
      text: `Hi ${req.user.name},

We received your ticket "${ticket.title}" (priority: ${ticket.priority}). The IT team will update you as it progresses.

- Nettech Help Desk`
    });

    res.status(201).json({ ticket });

  } catch (err) {
    next(err);
  }
};

// Get logged-in user's tickets
const getMyTickets = async (req, res, next) => {
  try {
    const filter = await buildFilter(req, {
      mine: true
    });

    const tickets = await Ticket.find(filter)
      .sort('-createdAt');

    res.json({ tickets });

  } catch (err) {
    next(err);
  }
};

// Admin dashboard statistics
const getStats = async (req, res, next) => {
  try {
    const [
      byStatus,
      byPriority,
      total,
      users,
      recent
    ] = await Promise.all([
      Ticket.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),

      Ticket.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]),

      Ticket.countDocuments(),

      User.countDocuments({
        role: 'user'
      }),

      Ticket.find()
        .sort('-createdAt')
        .limit(5)
        .populate(
          'createdBy',
          'name email'
        )
    ]);

    const toMap = (keys, rows) => {
      return keys.reduce(
        (acc, key) => ({
          ...acc,
          [key]:
            rows.find(
              (row) => row._id === key
            )?.count || 0
        }),
        {}
      );
    };

    res.json({
      total,
      users,
      byStatus: toMap(STATUSES, byStatus),
      byPriority: toMap(PRIORITIES, byPriority),
      recent
    });

  } catch (err) {
    next(err);
  }
};


