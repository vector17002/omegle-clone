//@ts-nocheck
class Peer{
    public peer : RTCPeerConnection

    constructor(){
        if(!this.peer){
            this.peer = new RTCPeerConnection({
                iceServers:[
                    { urls: 'stun:stun.l.google.com:19302' },
                ]
            })
        }
    }

     async getOffer(){
        if(this.peer){
            const offer = await this.peer.createOffer();
            await this.peer?.setLocalDescription(new RTCSessionDescription(offer))
            return offer
        }
    }

    async getAnswer(offer : unknown){
        if(this.peer){
            await this.peer.setRemoteDescription(offer)
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(answer)

            return answer
        }
    }

    async setLocalRemoteDescription(answer){
        if(this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(answer))
        }
    }
}


export default new Peer()