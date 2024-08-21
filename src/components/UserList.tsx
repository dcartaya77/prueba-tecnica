import { SortBy, type User } from "../users.d"

interface Props {
    changeSorting(sort:SortBy): void;
    users: User[]
    handleDelete: (email: string) => void
    color: boolean
}
export function UserList({changeSorting, handleDelete, color, users }: Props) {
    return (
        <table width={"100%"}>
            <thead>
                <tr>
                    <td>Foto</td>
                    <td className="pointer" onClick={()=>changeSorting(SortBy.NAME)}>Nombre</td>
                    <td className="pointer" onClick={()=>changeSorting(SortBy.LAST)}>Apellido</td>
                    <td className="pointer" onClick={()=>changeSorting(SortBy.COUNTRY)}>País</td>
                    <td>Acción</td>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => {
                    return (
                        <tr
                            key={user.email}
                            className={(color && "color") || ""}
                        >
                            <td>
                                <img
                                    src={user.picture.thumbnail}
                                    alt={`Thumbnail for user ${user.email}`}
                                />
                            </td>
                            <td>{user.name.first}</td>
                            <td>{user.name.last}</td>
                            <td>{user.location.country}</td>
                            <td>
                                <button
                                    onClick={() => {
                                        handleDelete(user.email)
                                    }}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
