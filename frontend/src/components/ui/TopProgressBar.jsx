import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

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
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ x: '-100%', opacity: 1 }}
            animate={{ x: '0%', opacity: 1, transition: { duration: 1.5, ease: 'easeOut' } }}
            exit={{ x: '100%', opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } }}
            className="h-full bg-gradient-to-r from-brand-purple via-brand-accent to-brand-violet shadow-[0_0_20px_rgba(124,92,255,0.8)]"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
