import { StatusBadge, PriorityText } from './Badges';
import { shortId, fmtDate } from '../constants';

export default function TicketModal({ ticket, onClose }) {
  if (!ticket) {
    return null;
  }

  return (
    <div
      className="modal d-block"
      style={{ background: 'rgba(23,36,47,.55)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">

          <div className="modal-header">
            <div>
              <div className="id-tag small">
                Ticket #{shortId(ticket)}
              </div>

              <h5 className="modal-title">
                {ticket.title}
              </h5>
            </div>

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body">

            <div className="d-flex flex-wrap gap-3 mb-3 small">

              <StatusBadge
                status={ticket.status}
              />

              <span>
                Priority:{' '}
                <PriorityText
                  priority={ticket.priority}
                />
              </span>

              <span>
                Category: {ticket.category}
              </span>

            </div>

            <p className="pre-wrap">
              {ticket.description}
            </p>

            <hr />

            <div className="small text-secondary">

              {ticket.createdBy?.name && (
                <div>
                  Raised by {ticket.createdBy.name} (
                  {ticket.createdBy.email}
                  )
                </div>
              )}

              <div>
                Created {fmtDate(ticket.createdAt)} · Last updated{' '}
                {fmtDate(ticket.updatedAt)}
              </div>

            </div>

          </div>

          <div className="modal-footer">

            <button
              className="btn btn-outline-primary"
              onClick={onClose}
            >
              Close
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}