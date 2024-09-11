import { useEffect, useState } from "react"

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState(initialValue)

  useEffect(() => {
    if(!window) {
      console.error('window is not defined in useLocalStorage')
      return
    }
    // Get from local storage by key
    const item = window.localStorage.getItem(key)
    if (item) {
      setStoredValue(JSON.parse(item))
    }
  }, [key])

  // Set to local storage
  const setValue = (value: T) => {
    setStoredValue(value)
    if(!window) {
      console.log('window is not defined in setValue')
      return
    }
    window.localStorage.setItem(key, JSON.stringify(value))
  }
  return [storedValue, setValue]
}
