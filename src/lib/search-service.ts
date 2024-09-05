import {getSelf} from "@/lib/auth-service";
import {db} from "@/lib/db";

export const getSearch = async (term?: string) => {
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
                isLive: "desc",
            }, {
                updatedAt: "desc",
            }],
            select: {
                user: {
                    select: {
                        username: true,
                        imageURL: true
                    }
                },
                id: true,
                name: true,
                isLive: true,
                thumbnailUrl: true,
                updatedAt: true
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
                },
                OR: [{
                    name: {
                        contains: term
                    }
                }, {
                    user: {
                        username: {
                            contains: term
                        }
                    }
                }]
            }
        })
    } else {
        streams = await db.stream.findMany({
            orderBy: [{
                isLive: "desc",
            }, {
                updatedAt: "desc",
            }],
            select: {
                id: true,
                isLive: true,
                name: true,
                thumbnailUrl: true,
                updatedAt: true,
                user: {
                    select: {
                        imageURL: true,
                        username: true
                    }
                }
            },
            where: {
                OR: [{
                    name: {
                        contains: term
                    }
                }, {
                    user: {
                        username: {
                            contains: term
                        }
                    }
                }]
            }
        })
    }
    return streams;
}