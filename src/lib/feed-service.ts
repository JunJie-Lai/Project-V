import {getSelf} from "@/lib/auth-service";
import {db} from "@/lib/db";

export const getStreams = async () => {
    let userId
    try {
        const self = await getSelf()
        userId = self.id
    } catch {
        userId = null
    }

    let streams = []
    if (userId) {
        streams = await db.stream.findMany({
            orderBy: [{
                isLive: "desc"
            }, {
                updatedAt: "desc"
            }],
            select: {
                user: {
                    select: {
                        username: true,
                        imageURL: true
                    }
                },
                id: true,
                thumbnailUrl: true,
                isLive: true,
                name: true,
            },
            where: {
                user: {
                    NOT: {
                        blocking: {
                            some: {
                                blockedId: userId
                            }
                        }
                    }
                }
            }
        })
    } else {
        streams = await db.stream.findMany({
            orderBy: [{
                isLive: "desc"
            }, {
                updatedAt: "desc"
            }],
            select: {
                user: {
                    select: {
                        username: true,
                        imageURL: true
                    }
                },
                id: true,
                thumbnailUrl: true,
                isLive: true,
                name: true,
            }
        })
    }
    return streams;
}