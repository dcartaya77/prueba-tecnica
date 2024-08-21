import { useEffect, useMemo, useRef, useState } from "react"
import { SortBy, type User } from "./users.d"
import { UserList } from "./components/UserList.js"
import "./App.css"

function App() {
    const [users, setUsers] = useState<User[]>([])
    const [colorMe, setColor] = useState(false)
    //const [order, setOrder] = useState(false)
    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
    const [filterCountry, setFilterCountry] = useState<string | null>(null)

    const initialList = useRef<User[]>([])

    useEffect(() => {
        fetch("https://randomuser.me/api/?results=100")
            .then((res) => res.json())
            .then((res) => {
                setUsers(res.results)
                initialList.current = res.results
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

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
        }
        if (sorting === SortBy.NONE) return filterUsers
        else 
            return filterUsers
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
                <UserList
                    users={sortedUsers}
                    handleDelete={handleDelete}
                    color={colorMe}
                    changeSorting={handleChangeSort}
                />
            </main>
        </>
    )
}

export default App
