export const getHackathonStatus = (event) => {
  const now = new Date()
  const start = event?.start_date ? new Date(event.start_date) : null
  const end = event?.end_date ? new Date(event.end_date) : null

  if (end && end < now) return 'completed'
  if (start && start > now) return 'upcoming'
  return event?.status?.toLowerCase?.() || 'active'
}

export const formatDate = (value) => {
  if (!value) return 'TBD'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'TBD' : date.toLocaleDateString()
}
