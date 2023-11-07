import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = '__user_uuid'

// export const getUUID = () => typeof window !== 'undefined' ? useState(localStorage.getItem(STORAGE_KEY)) : []

const UUID = () => {
  const [uuid, setUUID] = useState(null)

  useEffect(() => {
    try {
      let userId = localStorage.getItem(STORAGE_KEY) 

      if (!userId) {
        const newUUID = uuidv4()
        localStorage.setItem(STORAGE_KEY, newUUID)
        userId = newUUID
      }

      setUUID(userId)

    } catch (e) {
      console.log('unable to set uuid', e)
    }
  }, [])

  return uuid
}

export default UUID
