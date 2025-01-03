import { useEffect, useState } from "react"
import { socket } from "./App"
import { useNavigate } from "react-router-dom"
import Loading from "./Loading"

const Room = () => {
    const [loading,setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    function initiatePairing(){
      setLoading(true)
      socket.emit('initiate-pairing')
    }
    useEffect(() => {
      socket.on('send-to-room', ({room}) => {
        setLoading(false)
        navigate(`/${room}`)
      })
  
      return () =>{
        socket.off('send-to-room')
      }
    },[socket])
  return (
    <main className="flex w-screen h-screen flex-col justify-start">
    <nav className="top-0 p-2 border-zinc-200 border-b-2 h-max w-full font-semibold text-xl">
     <span className="text-indigo-500"> Talk Zone - </span>
     Talk to strangers <span className="text-yellow-500">!!!</span>
    </nav>
    <div className="flex w-full h-max">
      <button className="p-2 border-zinc-300 border-2" onClick={initiatePairing}>
        {loading ? <Loading/> : "Next"}
      </button>
    </div>
  </main>
  )
}

export default Room