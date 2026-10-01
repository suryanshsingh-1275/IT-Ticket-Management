import { StatusBadge, PriorityText } from './Badges';
import { shortId, fmtDate } from '../constants';

// Popup box that shows full ticket details.
// Pass ticket={null} to keep it hidden.
export default function TicketModal({ ticket, onClose }) {
  if (!ticket) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="id-tag small">Ticket #{shortId(ticket)}</div>
            <h5>{ticket.title}</h5>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="flex flex-wrap gap-3 mb-3 small">
            <StatusBadge status={ticket.status} />
            <span>Priority: <PriorityText priority={ticket.priority} /></span>
            <span>Category: {ticket.category}</span>
          </div>

          <p className="pre-wrap">{ticket.description}</p>

          <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '16px 0' }} />

          <div className="small text-muted">
            {ticket.createdBy && ticket.createdBy.name && (
              <div>Raised by {ticket.createdBy.name} ({ticket.createdBy.email})</div>
            )}
            <div>Created {fmtDate(ticket.createdAt)} · Last updated {fmtDate(ticket.updatedAt)}</div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline-brand" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}