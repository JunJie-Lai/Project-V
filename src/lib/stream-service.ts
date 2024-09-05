import {db} from "@/lib/db";

export const getStreamByUserId = async (userId: string) => {
    const stream = await db.stream.findUnique({
        where: {
            userId
        },
        select: {
            isChatEnabled: true,
            isChatFollowersOnly: true,
            isChatDelayed: true,
            serverUrl: true,
            streamKey: true
        }
    });
    return stream
}