import express from 'express';
import {
  createTicket,
  getMyTickets,
  getStats,
  getAllTickets,
  loadTicket,
  getTicket,
  updateStatus,
  deleteTicket,
} from '../controllers/ticketController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// User: create ticket
router.post('/', createTicket);

// User: own tickets
router.get('/mine', getMyTickets);

// Admin: statistics
router.get('/stats', adminOnly, getStats);

// Admin: all tickets
router.get('/', adminOnly, getAllTickets);

// Single ticket
router.get('/:id', loadTicket, getTicket);

// Admin: update status
router.patch('/:id/status', adminOnly, loadTicket, updateStatus);

// Admin: delete ticket
router.delete('/:id', adminOnly, loadTicket, deleteTicket);

export default router;