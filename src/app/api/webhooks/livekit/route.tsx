import {WebhookReceiver} from "livekit-server-sdk";
import {headers} from "next/headers";
import {db} from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

const receiver = new WebhookReceiver(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!)

export async function POST(req: NextRequest) {
    const body = await req.text();
    const headerPayload = headers()
    const authorization = headerPayload.get("Authorization");
    if (!authorization) return new NextResponse("No authorization header", {status: 400});
    const event = await receiver.receive(body, authorization);

    if (event.event === "ingress_started") await db.stream.update({
        data: {
            isLive: true
        },
        where: {
            ingressId: event.ingressInfo?.ingressId
        }
    })

    if (event.event === "ingress_ended") await db.stream.update({
        data: {
            isLive: false
        },
        where: {
            ingressId: event.ingressInfo?.ingressId
        }
    })
    return new NextResponse('', {status: 200});
}