import { useState, useEffect } from "react"

export const datetimeLong = (date) => {
  const [formattedDate, setFormattedDate] = useState(null)

  useEffect(
    () => setFormattedDate(new Date(date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })),
    []
  )

  return formattedDate
}

