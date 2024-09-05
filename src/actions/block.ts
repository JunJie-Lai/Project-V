"use server"

import {blockUser, unblockUser} from "@/lib/block-service";
import {revalidatePath} from "next/cache";
import {getSelf} from "@/lib/auth-service";
import {RoomServiceClient} from "livekit-server-sdk";

const roomService = new RoomServiceClient(
    process.env.NEXT_PUBLIC_LIVEKIT_URL!,
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
)

export const onBlock = async (id: string) => {
    // TODO: Adapt to disconnect from livestream
    const self = await getSelf()

    let blockedUser
    try {
        blockedUser = await blockUser(id);
    } catch {
        // user is guest
    }

    try {
        await roomService.removeParticipant(self.id, id)
    } catch {
        // user not in room
    }

    revalidatePath(`/u/${self.username}/community`)
    return blockedUser;
}

export const onUnblock = async (id: string) => {
    const self = await getSelf()
    const unblockedUser = await unblockUser(id);
    revalidatePath(`/u/${self.username}/community`)
    return unblockedUser;
}