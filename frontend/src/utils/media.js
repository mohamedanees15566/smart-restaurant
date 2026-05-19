/** Backend origin for uploaded files (menu images, etc.) */
export function getApiOrigin() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  return apiUrl.replace(/\/api\/?$/, '')
}

/** Full URL for a path stored on the public disk, e.g. "menu/photo.jpg" */
export function getStorageUrl(path) {
  if (!path) return null
  const clean = String(path).replace(/^\//, '')
  return `${getApiOrigin()}/storage/${clean}`
}

/** Menu item image — built from API base URL so it matches where uploads are served */
export function getMenuImageUrl(item) {
  if (!item?.image) return null
  return getStorageUrl(item.image)
}
