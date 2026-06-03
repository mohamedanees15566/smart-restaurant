const statusClass = {
  placed: 'badge-placed',
  confirmed: 'badge-confirmed',
  preparing: 'badge-preparing',
  ready: 'badge-ready',
  served: 'badge-served',
  cancelled: 'badge-cancelled',
  pending: 'badge-pending',
}

const StatusBadge = ({ status, icon }) => (
  <span className={`badge ${statusClass[status] || 'badge-served'}`}>
    {icon && <span>{icon}</span>}
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
)

export default StatusBadge
