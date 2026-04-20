import React, { useState, useEffect } from 'react'
export default function TopProgressBar() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let requests = 0
    let timeoutId

    const startLoading = () => {
      requests++
      setLoading(true)
      clearTimeout(timeoutId)
    }

    const endLoading = () => {
      requests = Math.max(0, requests - 1)
      if (requests === 0) {
        // Delay hide slightly to let the bar finish its transition across screen
        timeoutId = setTimeout(() => {
          setLoading(false)
        }, 500)
      }
    }

    window.addEventListener('api_request_start', startLoading)
    window.addEventListener('api_request_end', endLoading)

    return () => {
      window.removeEventListener('api_request_start', startLoading)
      window.removeEventListener('api_request_end', endLoading)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[999999] pointer-events-none overflow-hidden">
      {loading && (
        <div className="h-full bg-indigo-500 w-full animate-pulse transition-all duration-300" />
      )}
    </div>
  )
}
