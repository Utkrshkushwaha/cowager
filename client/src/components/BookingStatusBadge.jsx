import React from 'react';

const statusConfig = {
  pending:     { label: 'Pending',     cls: 'badge-yellow' },
  accepted:    { label: 'Accepted',    cls: 'badge-blue'   },
  in_progress: { label: 'In Progress', cls: 'badge-blue'   },
  completed:   { label: 'Completed',   cls: 'badge-green'  },
  cancelled:   { label: 'Cancelled',   cls: 'badge-red'    },
  rejected:    { label: 'Rejected',    cls: 'badge-red'    },
};

const BookingStatusBadge = ({ status }) => {
  const config = statusConfig[status] || { label: status, cls: 'badge-yellow' };
  return <span className={config.cls}>{config.label}</span>;
};

export default BookingStatusBadge;
