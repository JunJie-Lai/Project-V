import {db} from "@/lib/db";

export const getScheduleByUsername = async (username: string) => {
    const schedule = await db.user.findUnique({
        where: {
            username
        }
    })
    return schedule
}