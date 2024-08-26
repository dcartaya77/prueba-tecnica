import { useEffect, useRef, useState } from "react"
import { fetchApi } from "../services/fetchApi"
import { type User } from "../users.d"


export function useGetUsers({currentPage}:{currentPage:number}) {
  const initialList = useRef<User[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleDelete = (email: string) => {
    const fiterUsers = users.filter((user) => user.email !== email)
    setUsers(fiterUsers)
  }

  const toogleState = () => {
    setUsers(initialList.current)
}

  
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
  return {users, error, loading, initialList, handleDelete, toogleState}
}