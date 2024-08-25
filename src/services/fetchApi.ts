export const fetchApi = async (currentPage: number) => {
  return await fetch(
      `https://randomuser.me/api/?results=10&seed=midudev&page=${currentPage}`
  )
      .then(async (res) => {
          console.log(res.ok, res.status, res.statusText)
          if (!res.ok) {
              throw new Error("Error en la petición")
          }
          return await res.json()
      })
      .then((res) => res.results)
}