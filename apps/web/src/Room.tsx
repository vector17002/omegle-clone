import { useCallback, useEffect, useState } from "react"
import { socket } from "./App"
import { useNavigate } from "react-router-dom"
import Loading from "./Loading"
import peer from "./peer"
import ReactPlayer from "react-player"

const Room = () => {
    const [loading,setLoading] = useState<boolean>(false)
    const [stream , setStream] = useState<MediaStream | null>(null)
    const [remoteId , setRemoteId] = useState<string | null>(null)
    const [remoteStream , setRemoteStream] = useState(null)
    const navigate = useNavigate()
    function initiatePairing(){
      setLoading(true)
      socket.emit('initiate-pairing')
    }

    //@ts-ignore
    const handleCreateOffer = useCallback(async ({to}) => {
      setRemoteId(to)
      const offer = await peer.getOffer()
      socket.emit('offer', {to , offer})
    },[])

     //@ts-ignore
     const handleAcceptOffer = useCallback(async ({from , offer}) => {
      setRemoteId(from)
      const answer = await peer.getAnswer(offer)
      socket.emit('offer-accepted', {to : from , answer})
    },[])

    //@ts-ignore
    const handleAcceptAnswer = useCallback(async ({from , answer}) => {
      setRemoteId(from)
      await peer.setLocalRemoteDescription(answer)
      console.log('Answer accepted')
      //@ts-ignore
      for(const track of stream.getTracks()){
       //@ts-ignore
       peer.peer.addTrack(track, stream)
      }
    },[stream])

    //Negotiation for finalising the webrtc-connection
    const handleNegotiationNeeded = useCallback( async ()=> {
      const offer = await peer.getOffer()
      socket.emit('negotiation-needed' , ({to : remoteId , offer}))
    },[remoteId])


    //@ts-ignore
    const handleNegotiationAnswer = useCallback(async ({from , offer}) => {
      setRemoteId(from)
      const answer = await peer.getAnswer(offer)
      socket.emit('negotiation-accepted' , ({to : socket.id , answer}))
    },[])

    //@ts-ignore
    const handleFinalNegotiation = useCallback(async ({answer}) => {
      await peer.setLocalRemoteDescription(answer)
    },[])

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
        navigate(`/${room}`)
      })

      //Create offer if user is user1
      socket.on('create-offer', handleCreateOffer)

      //Accept offer if user is user2
      socket.on('accept-offer' , handleAcceptOffer)

      //Receiving answer from user2
      socket.on('accept-answer', handleAcceptAnswer)

      //Accept negotiation 
      socket.on('accept-negotiation', handleNegotiationAnswer)

      //Accepted negotiation from other user
      socket.on('negotiation-answer-accepted', handleFinalNegotiation)

      return () =>{
        socket.off('send-to-room')
        socket.off('create-offer', handleCreateOffer)
        socket.off('accept-offer', handleAcceptOffer)
        socket.off('accept-answer', handleAcceptAnswer)
        socket.on('accept-negotiation', handleNegotiationAnswer)
        socket.on('negotiation-answer-accepted', handleFinalNegotiation)
      }
    },[socket , handleAcceptOffer, peer, handleCreateOffer , handleAcceptAnswer, handleNegotiationAnswer, handleFinalNegotiation])

    useEffect(() => {
      //@ts-ignore
      peer.peer.addEventListener('track', async (ev) => {
        const remoteStream = ev.streams
        //@ts-ignore
        setRemoteStream(remoteStream[0])
      })
    },[])

    useEffect(() =>{
      peer.peer.addEventListener('negotiation-needed', handleNegotiationNeeded)

      return () => {
        peer.peer.removeEventListener('negotiation-needed' , handleNegotiationNeeded)
      }
    })

  return (
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
          {remoteStream && (
            <ReactPlayer url={remoteStream} height={'50vh'} width={'50vh'} playing/>
          )}
        </div>
        <button className="p-2 border-zinc-300 border-2 h-max" onClick={initiatePairing}>
          {loading ? <Loading/> : "Next"}
        </button>
      </div>
  </main>
  )
}

export default Room