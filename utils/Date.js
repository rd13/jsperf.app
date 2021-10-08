export const datetimeLong = datetime => new Date(datetime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
