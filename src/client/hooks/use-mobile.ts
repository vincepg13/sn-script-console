import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(customBreakpoint?: number) {
  const BREAKPOINT = customBreakpoint || MOBILE_BREAKPOINT
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
