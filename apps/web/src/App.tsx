import { io } from "socket.io-client"

export const socket = io('http://localhost:3000')

function App() {
  const initiatePairing = () =>{
    console.log('clicked')
    socket.emit('initiate-pairing')
  }
return(
    <main className="flex w-screen h-screen flex-col justify-start">
      <nav className="top-0 p-2 border-zinc-200 border-b-2 h-max w-full font-semibold text-xl">
       <span className="text-indigo-500"> Talk Zone - </span>
       Talk to strangers <span className="text-yellow-500">!!!</span>
      </nav>
      <div className="flex w-full h-max">
        <button className="p-2 border-zinc-300 border-2" onClick={initiatePairing}>
          Start
        </button>
      </div>
    </main>
  )
}

export default App