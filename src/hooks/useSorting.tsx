import { useState } from "react"
import { SortBy } from "../users.d"

export function useSorting() {
    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)

    const toogleOrderByCountry = () => {
        const newSorting =
            sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
        setSorting(newSorting)
    }

    const handleChangeSort = (sort: SortBy) => {
        setSorting(sort)
    }
    return { sorting, toogleOrderByCountry, handleChangeSort }
}
