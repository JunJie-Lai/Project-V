import {db} from "@/lib/db";

export const getUserByUsername = async (username: string) => {
    const user = await db.user.findUnique({
        where: {
            username
        },
        select: {
            id: true,
            externalUserID: true,
            username: true,
            bio: true,
            imageURL: true,
            stream: {
                select: {
                    id: true,
                    isLive: true,
                    isChatDelayed: true,
                    isChatFollowersOnly: true,
                    isChatEnabled: true,
                    thumbnailUrl: true,
                    name: true
                }
            },
            _count: {
                select: {
                    followedBy: true
                }
            }
        }
    })
    return user
}

export const getUserById = async (id: string) => {
    const user = await db.user.findUnique({
        where: {
            id
        },
        include: {
            stream: true
        }
    })
    return user
}
export const getUsernames = async () => {
    const users = await db.user.findMany({
        select: {
            username: true,
        }
    });
    return users.map(user => user.username);
}