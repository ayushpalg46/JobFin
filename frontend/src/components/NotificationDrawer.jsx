import React from 'react';

export default function NotificationDrawer({
  isOpen,
  onClose,
  user,
  notifications,
  onMarkAllRead,
  onNotificationClick,
  onClearAll,
}) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(10,25,47,0.5)', zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-scrollable modal-sm modal-md modal-dialog-end position-fixed top-0 end-0 m-3"
        style={{ width: '420px', maxWidth: '92vw', height: 'calc(100vh - 24px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content h-100 shadow-lg border-0 rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-white border-bottom p-3">
            <div className="d-flex align-items-center gap-2">
              <div className="position-relative">
                <i className="bi bi-bell-fill text-primary fs-5"></i>
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                )}
              </div>
              <h6 className="modal-title fw-bold text-dark mb-0">
                Notifications ({unreadCount} New)
              </h6>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Subheader action bar */}
          <div className="bg-light px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
            <small className="text-muted fw-semibold">
              Role: <span className="badge bg-primary-subtle text-primary">{user?.role === 'ROLE_RECRUITER' ? 'Recruiter Alerts' : 'Candidate Alerts'}</span>
            </small>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-decoration-none text-primary fw-semibold"
                style={{ fontSize: '0.75rem' }}
                onClick={onMarkAllRead}
              >
                Mark all read
              </button>
              <span className="text-muted small">&bull;</span>
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-decoration-none text-danger fw-semibold"
                style={{ fontSize: '0.75rem' }}
                onClick={onClearAll}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Body List */}
          <div className="modal-body p-0">
            {notifications.length === 0 ? (
              <div className="text-center py-5 px-3">
                <i className="bi bi-bell-slash text-muted display-4 mb-2 d-block"></i>
                <h6 className="fw-bold text-dark">No Notifications</h6>
                <p className="text-muted small mb-0">You're completely caught up with your recruitment updates!</p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`list-group-item list-group-item-action p-3 border-bottom cursor-pointer ${
                      !notif.read ? 'bg-primary-subtle bg-opacity-25' : ''
                    }`}
                    onClick={() => onNotificationClick(notif)}
                  >
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className={`rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 ${
                          notif.type === 'status'
                            ? 'bg-success text-white'
                            : notif.type === 'application'
                            ? 'bg-primary text-white'
                            : notif.type === 'interview'
                            ? 'bg-info text-white'
                            : 'bg-warning text-dark'
                        }`}
                        style={{ width: '38px', height: '38px' }}
                      >
                        <i className={`bi ${notif.icon}`}></i>
                      </div>

                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-dark small">{notif.title}</strong>
                          <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {notif.time}
                          </small>
                        </div>
                        <p className="text-muted small mb-1" style={{ fontSize: '0.8rem' }}>
                          {notif.message}
                        </p>
                        {!notif.read && (
                          <span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light p-2 border-top text-center justify-content-center">
            <small className="text-muted" style={{ fontSize: '0.72rem' }}>
              <i className="bi bi-shield-check text-success me-1"></i> Real-time alerts connected to JobFins MySQL event bus
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
