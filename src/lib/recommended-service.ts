import {db} from "@/lib/db";
import {getSelf} from "@/lib/auth-service";

export const getRecommended = async () => {
    let userId: string | null;

    try {
        const self = await getSelf();
        userId = self.id;
    } catch {
        userId = null
    }

    let users = []

    users = userId ? await db.user.findMany({
        select: {
            stream: {
                select: {
                    isLive: true
                }
            },
            id: true,
            username: true,
            imageURL: true,
        },
        orderBy: {
            createdAt: "desc"
        },
        where: {
            AND: [{
                NOT: {
                    id: userId
                },
            }, {
                NOT: {
                    followedBy: {
                        some: {
                            followerId: userId
                        }
                    }
                }
            }, {
                NOT: {
                    blocking: {
                        some: {
                            blockedId: userId
                        }
                    }
                }
            }]
        }
    }) : await db.user.findMany({
        select: {
            stream: {
                select: {
                    isLive: true
                }
            },
            id: true,
            username: true,
            imageURL: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return users;
}