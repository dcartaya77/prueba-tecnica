import { useState } from "react"
export function useColor(){
  const [colorMe, setColor] = useState(false)

  const toogleColor = () => {
    setColor(!colorMe)
  }
  return {colorMe, toogleColor}
}
