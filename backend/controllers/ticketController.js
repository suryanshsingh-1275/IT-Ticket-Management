import mongoose from 'mongoose';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmails.js';
import { CATEGORIES, PRIORITIES, STATUSES } from '../constants.js';

const escapeRegex = (s) => {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const shortId = (ticket) => {
  return String(ticket._id).slice(-6).toUpperCase();
};

const buildFilter = async (req, { mine }) => {
  const { search, status, priority, category } = req.query;
  const filter = {};

  if (mine) filter.createdBy = req.user._id;
  if (STATUSES.includes(status)) filter.status = status;
  if (PRIORITIES.includes(priority)) filter.priority = priority;
  if (CATEGORIES.includes(category)) filter.category = category;

  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    const or = [{ title: rx }, { description: rx }];

    if (!mine) {
      const users = await User.find({
        $or: [{ name: rx }, { email: rx }],
      }).select('_id');

      if (users.length) {
        or.push({ createdBy: { $in: users.map((user) => user._id) } });
      }
    }

    filter.$or = or;
  }

  return filter;
};

export const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category: CATEGORIES.includes(category) ? category : 'Other',
      priority: PRIORITIES.includes(priority) ? priority : 'Medium',
      createdBy: req.user._id,
    });

    sendEmail({
      to: req.user.email,
      subject: `Ticket #${shortId(ticket)} received: ${ticket.title}`,
      text: `Hi ${req.user.name},\n\nWe received your ticket "${ticket.title}" (priority: ${ticket.priority}). The IT team will update you as it progresses.\n\n- Nettech Help Desk`,
    });

    res.status(201).json({ ticket });
  } catch (err) {
    next(err);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const filter = await buildFilter(req, { mine: true });
    const tickets = await Ticket.find(filter).sort('-createdAt');
    res.json({ tickets });
  } catch (err) {
    next(err);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const [byStatus, byPriority, total, users, recent] = await Promise.all([
      Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Ticket.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Ticket.find().sort('-createdAt').limit(5).populate('createdBy', 'name email'),
    ]);

    const toMap = (keys, rows) => {
      return keys.reduce((acc, key) => {
        const match = rows.find((row) => row._id === key);
        acc[key] = match ? match.count : 0;
        return acc;
      }, {});
    };

    res.json({
      total,
      users,
      byStatus: toMap(STATUSES, byStatus),
      byPriority: toMap(PRIORITIES, byPriority),
      recent,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllTickets = async (req, res, next) => {
  try {
    const filter = await buildFilter(req, { mine: false });
    const tickets = await Ticket.find(filter)
      .sort('-createdAt')
      .populate('createdBy', 'name email department');
    res.json({ tickets });
  } catch (err) {
    next(err);
  }
};

export const loadTicket = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticket = await Ticket.findById(req.params.id).populate(
      'createdBy',
      'name email department'
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    req.ticket = ticket;
    next();
  } catch (err) {
    next(err);
  }
};

export const getTicket = (req, res) => {
  const isOwner = String(req.ticket.createdBy._id) === String(req.user._id);

  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You cannot view this ticket' });
  }

  res.json({ ticket: req.ticket });
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${STATUSES.join(', ')}` });
    }

    const ticket = req.ticket;
    const changed = ticket.status !== status;
    ticket.status = status;
    await ticket.save();

    if (changed) {
      sendEmail({
        to: ticket.createdBy.email,
        subject: `Ticket #${shortId(ticket)} is now ${status}`,
        text: `Hi ${ticket.createdBy.name},\n\nYour ticket "${ticket.title}" was updated to: ${status}.\n\n- Nettech Help Desk`,
      });
    }

    res.json({ ticket });
  } catch (err) {
    next(err);
  }
};

export const deleteTicket = async (req, res, next) => {
  try {
    await req.ticket.deleteOne();
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    next(err);
  }
};