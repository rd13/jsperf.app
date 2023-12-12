export const datetimeLong = date => {
  return (new Date(date)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
}
