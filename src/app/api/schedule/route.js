// app/api/schedule/route.js
import { db } from "@/lib/db";

export async function POST(req) {
    try {
        const { username, schedule } = await req.json();
        console.log(schedule)
        if (!username || !schedule) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        await db.user.update({
            where: { username },
            data: { schedule },
        });

        return new Response(JSON.stringify({ message: "Schedule saved to DB successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error saving schedule:", error);
        return new Response(JSON.stringify({ error: "Failed to save schedule to DB" }), { status: 500 });
    }
}
