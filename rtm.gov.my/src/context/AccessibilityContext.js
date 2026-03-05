import { createContext, useContext, useState, useEffect } from 'react'

const AccessibilityContext = createContext()

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState('normal') // small, normal, large, xlarge
  const [highContrast, setHighContrast] = useState(false)
  const [linkTracking, setLinkTracking] = useState(false)
  const [titleTracking, setTitleTracking] = useState(false)
  const [dyslexiaFont, setDyslexiaFont] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('a11y-settings')
    if (saved) {
      const settings = JSON.parse(saved)
      setFontSize(settings.fontSize || 'normal')
      setHighContrast(settings.highContrast || false)
      setLinkTracking(settings.linkTracking || false)
      setTitleTracking(settings.titleTracking || false)
      setDyslexiaFont(settings.dyslexiaFont || false)
      setReducedMotion(settings.reducedMotion || false)
    }
  }, [])

  // Save to localStorage and apply to document
  useEffect(() => {
    if (!mounted) return

    const settings = {
      fontSize,
      highContrast,
      linkTracking,
      titleTracking,
      dyslexiaFont,
      reducedMotion,
    }
    localStorage.setItem('a11y-settings', JSON.stringify(settings))

    // Apply to document
    const root = document.documentElement
    root.setAttribute('data-a11y-font-size', fontSize)
    root.setAttribute('data-a11y-high-contrast', highContrast)
    root.setAttribute('data-a11y-link-tracking', linkTracking)
    root.setAttribute('data-a11y-title-tracking', titleTracking)
    root.setAttribute('data-a11y-dyslexia-font', dyslexiaFont)
    root.setAttribute('data-a11y-reduced-motion', reducedMotion)
  }, [fontSize, highContrast, linkTracking, titleTracking, dyslexiaFont, reducedMotion, mounted])

  const toggleHighContrast = () => setHighContrast(!highContrast)
  const toggleLinkTracking = () => setLinkTracking(!linkTracking)
  const toggleTitleTracking = () => setTitleTracking(!titleTracking)
  const toggleDyslexiaFont = () => setDyslexiaFont(!dyslexiaFont)
  const toggleReducedMotion = () => setReducedMotion(!reducedMotion)

  const resetAll = () => {
    setFontSize('normal')
    setHighContrast(false)
    setLinkTracking(false)
    setTitleTracking(false)
    setDyslexiaFont(false)
    setReducedMotion(false)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        toggleHighContrast,
        linkTracking,
        toggleLinkTracking,
        titleTracking,
        toggleTitleTracking,
        dyslexiaFont,
        toggleDyslexiaFont,
        reducedMotion,
        toggleReducedMotion,
        resetAll,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}
