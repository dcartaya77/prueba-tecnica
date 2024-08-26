import { useEffect, useMemo, useRef, useState } from "react"
import { SortBy } from "./users.d"
import { useGetUsers } from "./hooks/useGetUsers"
import { UserList } from "./components/UserList"
import "./App.css"

function App() {
    const [colorMe, setColor] = useState(false)
    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
    const [filterCountry, setFilterCountry] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const {error, users, loading, handleDelete, toogleState} = useGetUsers({currentPage})

    //InfinityScroll
    const lastItemRef = useRef<HTMLElement | null>(null)
    const observer = useRef<IntersectionObserver | null>(null)


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
    //End InfinityScroll

    const toogleColor = () => {
        setColor(!colorMe)
    }

    const toogleOrderByCountry = () => {
        const newSorting =
            sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
        setSorting(newSorting)
    }

    const handleChangeSort = (sort: SortBy) => {
        setSorting(sort)
    }

    const filterUsers = useMemo(() => {
        return typeof filterCountry === "string" && filterCountry.length > 0
            ? users.filter((user) =>
                  user.location.country
                      .toLowerCase()
                      .includes(filterCountry.toLowerCase())
              )
            : users
    }, [filterCountry, users])

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

    return (
        <>
            <header>
                <h1>Lista de Usuarios</h1>
                <nav>
                    <ul
                        style={{
                            listStyle: "none",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                        }}
                    >
                        <li>
                            <button onClick={toogleColor}>
                                Colorear Filas
                            </button>
                        </li>
                        <li>
                            <button onClick={toogleOrderByCountry}>
                                {sorting === SortBy.COUNTRY
                                    ? "No ordenar"
                                    : "Ordenar por país"}
                            </button>
                        </li>
                        <li>
                            <button onClick={toogleState}>
                                Restaurar estado inicial
                            </button>
                        </li>
                        <li>
                            <input
                                type="text"
                                placeholder="Filtrar por país ..."
                                style={{ height: "40px" }}
                                onChange={(e) => {
                                    setFilterCountry(e.target.value)
                                }}
                            />
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                {users.length > 0 && (
                    <UserList
                        users={sortedUsers}
                        handleDelete={handleDelete}
                        color={colorMe}
                        changeSorting={handleChangeSort}
                    />
                )}
                {loading && <p>Cargando ...</p>}
                {error && <p>Ha habido un error</p>}
                {!loading && !error && users.length === 0 && (
                    <p>No hay usuarios</p>
                )}
            </main>
            <section ref={lastItemRef} className="lastitem"></section>
        </>
    )
}

export default App
