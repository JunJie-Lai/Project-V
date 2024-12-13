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

export async function GET(req) {
    try {
        // Parse URL parameters from the request
        const url = new URL(req.url);
        const username = url.searchParams.get("username");

        if (!username) {
            return new Response(JSON.stringify({ error: "Username is required" }), { status: 400 });
        }

        // Fetch the user's schedule from the database
        const user = await db.user.findUnique({
            where: { username },
            //select: { schedule: true },
        });

        if (!user || !user.schedule) {
            return new Response(
                JSON.stringify({ error: "Schedule not found for the given username" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify({ schedule: user.schedule }), { status: 200 });
    } catch (error) {
        console.error("In route.js Error fetching schedule:", error);
        return new Response(JSON.stringify({ error: "In route.js Failed to fetch schedule from DB" }), { status: 500 });
    }
}
