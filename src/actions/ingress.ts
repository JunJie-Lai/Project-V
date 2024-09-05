"use server"

import {
    type CreateIngressOptions,
    IngressInput,
    IngressClient,
    IngressVideoEncodingPreset,
    RoomServiceClient,
    TrackSource,
    IngressAudioEncodingPreset,
    IngressVideoOptions,
    IngressAudioOptions
} from "livekit-server-sdk";
import {getSelf} from "@/lib/auth-service";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";

const roomService = new RoomServiceClient(
    process.env.NEXT_PUBLIC_LIVEKIT_URL!,
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
)

const ingressClient = new IngressClient(process.env.NEXT_PUBLIC_LIVEKIT_URL!);

export const resetIngresses = async (hostIdentity: string) => {
    const ingresses = await ingressClient.listIngress({
        roomName: hostIdentity,
    })
    const rooms = await roomService.listRooms([hostIdentity])
    for (const room of rooms) await roomService.deleteRoom(room.name)
    for (const ingress of ingresses) if (ingress.ingressId) await ingressClient.deleteIngress(ingress.ingressId)
}

export const createIngress = async (ingressType: IngressInput) => {
    const self = await getSelf()
    await resetIngresses(self.id)
    const options: CreateIngressOptions = {
        name: self.username,
        roomName: self.id,
        participantName: self.username,
        participantIdentity: self.id,
    }
    if (ingressType === IngressInput.WHIP_INPUT) options.enableTranscoding = true
    else {
        options.video = new IngressVideoOptions({
            source: TrackSource.CAMERA,
            encodingOptions: {
                value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
                case: "preset"
            }
        })
        options.audio = new IngressAudioOptions({
            source: TrackSource.MICROPHONE,
            encodingOptions: {
                value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
                case: "preset"
            }
        })
    }
    const ingress = await ingressClient.createIngress(ingressType, options)
    if (!ingress || !ingress.url || !ingress.streamKey) throw new Error("Failed to create Ingress")
    await db.stream.update({
        where: {
            userId: self.id,
        },
        data: {
            ingressId: ingress.ingressId,
            serverUrl: ingress.url,
            streamKey: ingress.streamKey,
        }
    })
    revalidatePath(`/u/${self.username}/keys`)
    return JSON.parse(JSON.stringify(ingress))
}