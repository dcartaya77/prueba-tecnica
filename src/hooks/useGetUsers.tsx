import { useEffect, useRef, useState } from "react"
import { fetchApi } from "../services/fetchApi"
import { type User } from "../users.d"

export function useGetUsers() {
    const initialList = useRef<User[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const lastItemRef = useRef<HTMLElement | null>(null)
    const observer = useRef<IntersectionObserver | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const handleDelete = (email: string) => {
        const fiterUsers = users.filter((user) => user.email !== email)
        setUsers(fiterUsers)
    }

    const toogleState = () => {
        setUsers(initialList.current)
    }

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

    useEffect(() => {
        setLoading(true)
        setError(false)
        fetchApi(currentPage)
            .then((res) => {
                setUsers((prev) => prev.concat(res))
                initialList.current = initialList.current.concat(res)
            })
            .catch((error) => {
                setError(error)
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [currentPage])

    return { users, error, loading, handleDelete, toogleState, lastItemRef }
}
