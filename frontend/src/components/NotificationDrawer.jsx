import React, { useState } from 'react';

export default function NotificationDrawer({
  isOpen,
  onClose,
  user,
  notifications,
  onMarkAllRead,
  onNotificationClick,
  onClearAll,
}) {
  const [filterType, setFilterType] = useState('all'); // 'all' or 'unread'

  if (!isOpen) return null;

  const isRecruiter = user?.role === 'ROLE_RECRUITER';
  const unreadCount = notifications.filter((n) => !n.read).length;

  const displayedNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    return true;
  });

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(10,25,47,0.55)', backdropFilter: 'blur(3px)', zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-scrollable modal-sm modal-md modal-dialog-end position-fixed top-0 end-0 m-3"
        style={{ width: '430px', maxWidth: '92vw', height: 'calc(100vh - 24px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content h-100 shadow-lg border-0 rounded-4 overflow-hidden d-flex flex-column">
          {/* Header */}
          <div className="modal-header bg-dark text-white p-3 border-0">
            <div className="d-flex align-items-center gap-2">
              <div className="position-relative">
                <i className={`bi ${isRecruiter ? 'bi-briefcase-fill' : 'bi-bell-fill'} text-primary fs-5`}></i>
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                )}
              </div>
              <div>
                <h6 className="modal-title fw-bold text-white mb-0">
                  {isRecruiter ? 'Recruiter Inbound & ATS Alerts' : 'Career & Application Updates'}
                </h6>
                <small className="text-secondary" style={{ fontSize: '0.72rem' }}>
                  {isRecruiter ? 'Candidate applications & talent matches' : 'Status changes & interview invites'}
                </small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Subheader / Filter bar */}
          <div className="bg-light px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
            <div className="btn-group btn-group-sm">
              <button
                className={`btn btn-sm py-0 px-2 ${filterType === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ fontSize: '0.75rem' }}
                onClick={() => setFilterType('all')}
              >
                All ({notifications.length})
              </button>
              <button
                className={`btn btn-sm py-0 px-2 ${filterType === 'unread' ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ fontSize: '0.75rem' }}
                onClick={() => setFilterType('unread')}
              >
                Unread ({unreadCount})
              </button>
            </div>

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
          <div className="modal-body p-0 flex-grow-1 overflow-y-auto">
            {displayedNotifications.length === 0 ? (
              <div className="text-center py-5 px-3">
                <i className="bi bi-bell-slash text-muted display-4 mb-2 d-block"></i>
                <h6 className="fw-bold text-dark">No Notifications</h6>
                <p className="text-muted small mb-0">
                  {isRecruiter
                    ? 'No new candidate applications or ATS alerts.'
                    : 'You are completely caught up with your job applications!'}
                </p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {displayedNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`list-group-item list-group-item-action p-3 border-bottom cursor-pointer transition-all ${
                      !notif.read ? 'bg-primary-subtle bg-opacity-25' : ''
                    }`}
                    onClick={() => onNotificationClick(notif)}
                  >
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className={`rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 ${
                          notif.type === 'status'
                            ? 'bg-success text-white'
                            : notif.type === 'sourcing'
                            ? 'bg-primary text-white'
                            : notif.type === 'interview'
                            ? 'bg-info text-white'
                            : notif.type === 'application'
                            ? 'bg-primary text-white'
                            : 'bg-secondary text-white'
                        }`}
                        style={{ width: '38px', height: '38px' }}
                      >
                        <i className={`bi ${notif.icon}`}></i>
                      </div>

                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-dark small">{notif.title}</strong>
                          <small className="text-muted" style={{ fontSize: '0.68rem' }}>
                            {notif.time}
                          </small>
                        </div>
                        <p className="text-muted small mb-2" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                          {notif.message}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          {notif.category && (
                            <span className="badge bg-light text-dark border small" style={{ fontSize: '0.65rem' }}>
                              {notif.category}
                            </span>
                          )}
                          {!notif.read ? (
                            <span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>
                              New
                            </span>
                          ) : (
                            <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                              Click to view &rarr;
                            </span>
                          )}
                        </div>
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
              <i className="bi bi-shield-check text-success me-1"></i> Connected to {isRecruiter ? 'Recruiter ATS' : 'Candidate Career Tracker'}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
