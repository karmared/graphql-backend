export const normalizePhone = phone => {
  phone = phone.replace(/\D/g, '')

  if (phone.length > 11 || phone.length < 10) return null

  if (phone.length === 10) phone = `7${phone}`
  if (phone.length === 11 && phone[0] === "8") phone = `7${phone.slice(1)}`

  if (phone[0] !== "7") return null

  return phone
}
