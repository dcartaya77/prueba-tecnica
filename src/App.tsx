import { useEffect, useMemo, useRef, useState } from "react"
import { SortBy, type User } from "./users.d"
import { UserList } from "./components/UserList"
//import Infinity from "./components/Infinity"
import { fetchApi } from "./services/fetchApi"
import "./App.css"

function App() {
    const [users, setUsers] = useState<User[]>([])
    const [colorMe, setColor] = useState(false)
    //const [order, setOrder] = useState(false)
    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
    const [filterCountry, setFilterCountry] = useState<string | null>(null)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const initialList = useRef<User[]>([])

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
    }, [lastItemRef])

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

    const handleDelete = (email: string) => {
        const fiterUsers = users.filter((user) => user.email !== email)
        setUsers(fiterUsers)
    }

    const toogleColor = () => {
        setColor(!colorMe)
    }

    const toogleOrder = () => {
        const newSorting =
            sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
        setSorting(newSorting)
    }

    const toogleState = () => {
        setUsers(initialList.current)
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
                            <button onClick={toogleOrder}>
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
                {!loading && !error && (
                    <button onClick={() => setCurrentPage(currentPage + 1)}>
                        Cargar más resultados
                    </button>
                )}
            </main>
            <section ref={lastItemRef}></section>
            {/* <section>
                <Infinity />
            </section> */}
        </>
    )
}

export default App
