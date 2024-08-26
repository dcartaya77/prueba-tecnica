import { useEffect, useRef, useState } from "react"

interface Props{
  loading:boolean
  error: object | false
}
export function useInfinityScrollUsers({loading, error}:Props) {
  const lastItemRef = useRef<HTMLElement | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  
  const observerCallback: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting && !loading) {
          setCurrentPage((prev) => prev + 1)
      }
  }
  useEffect(() => {
      if (!error) {
          observer.current = new IntersectionObserver(observerCallback)
          if (lastItemRef.current) {
              observer.current.observe(lastItemRef.current)
          }
          return () => {
              if (lastItemRef.current) {
                  observer.current?.disconnect()
              }
          }
      }
  }, [lastItemRef, loading])
  return {lastItemRef, currentPage}
}