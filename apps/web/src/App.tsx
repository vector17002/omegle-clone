import {  useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import Loading from "./Loading"
import ReactPlayer from "react-player"

export const socket = io('http://localhost:3000')

function App() {
  const [loading,setLoading] = useState<boolean>(false)
  const [stream , setStream] = useState<MediaStream | null>(null)
  const navigate = useNavigate()

  function initiatePairing(){
    setLoading(true)
    socket.emit('initiate-pairing')
  }

  useEffect(() => {
    const handleStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      setStream(stream)
    }
    handleStream()
    socket.on('send-to-room', ({room}) => {
      setLoading(false)
      setStream(null)
      navigate(`/${room}`)
    })

    return () =>{
      socket.off('send-to-room')
    }
  },[socket])
return(
    <main className="flex w-screen h-screen flex-col justify-start">
      <nav className="top-0 p-2 border-zinc-200 border-b-2 h-max w-full font-semibold text-xl">
       <span className="text-indigo-500"> Talk Zone - </span>
       Talk to strangers <span className="text-yellow-500">!!!</span>
      </nav>
      <div className="flex w-full h-max flex-row items-center gap-10 justify-between my-10 max-w-4xl mx-auto">
        <div className="w-max h-full">
          {stream && (
            <ReactPlayer url={stream} height={'50vh'} width={'50vh'} playing={true} muted/>
          )}
        </div>
        <button className="p-2 border-zinc-300 border-2 h-max" onClick={initiatePairing}>
          {loading ? <Loading/> : "Start"}
        </button>
      </div>
    </main>
  )
}

export default App