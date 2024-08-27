import { useMemo } from "react"
import { SortBy, type User } from "../users.d"

interface Props{
  sorting: SortBy
  filterUsers:User[]
}
export function useSortedUsers({sorting, filterUsers}:Props){
  const sortedUsers = useMemo(() => {
      if (sorting === SortBy.NAME) {
          return filterUsers.toSorted((a, b) =>
              a.name.first.localeCompare(b.name.first)
          )
      }
      if (sorting === SortBy.LAST) {
          return filterUsers.toSorted((a, b) =>
              a.name.last.localeCompare(b.name.last)
          )
      }
      if (sorting === SortBy.COUNTRY) {
          return filterUsers.toSorted((a, b) =>
              a.location.country.localeCompare(b.location.country)
          )
      } else return filterUsers
  }, [filterUsers, sorting])

  return {sortedUsers}
}