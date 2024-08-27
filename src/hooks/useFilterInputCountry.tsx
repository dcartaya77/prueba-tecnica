import { useMemo } from "react";
import { type User } from "../users.d"

interface Props{
  filterCountry:string | null
  users:User[]
}

export function useFilterInputCountry({filterCountry, users}:Props) {
  const filterUsers = useMemo(() => {
      return typeof filterCountry === "string" && filterCountry.length > 0
          ? users.filter((user) =>
                user.location.country
                    .toLowerCase()
                    .includes(filterCountry.toLowerCase())
            )
          : users
  }, [filterCountry, users])
  return {filterUsers}
}