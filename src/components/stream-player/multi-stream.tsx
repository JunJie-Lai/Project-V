/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import {LiveKitRoom} from "@livekit/components-react";
import {Video, VideoSkeleton} from "@/components/stream-player/video";
import {useChatSidebar} from "@/store/use-chat-sidebar";
import {ChatSkeleton} from "@/components/stream-player/chat";
import {HeaderSkeleton} from "@/components/stream-player/header";
import {useMultipleViewerToken} from "@/hooks/use-multiple-viewer-tokens";
import {useState} from "react";
import Link from "next/link";

type CustomStream = {
    id: string
    isChatEnabled: boolean
    isChatDelayed: boolean
    isChatFollowersOnly: boolean
    isLive: boolean
    thumbnailUrl: string | null
    name: string
}

type CustomUser = {
    id: string
    username: string
    bio: string | null
    stream: CustomStream | null
    imageURL: string
    _count: {
        followedBy: number
    }
}

interface StreamPlayerProps {
    user: CustomUser
    users: (CustomUser)[]
}

export const MultiStreamPlayer = ({user, users}: StreamPlayerProps) => {
    const allUsers = [user, ...users];
    const uniqueUsers = Array.from(new Set(allUsers.map((u) => u.id))).map(
        (id) => allUsers.find((u) => u.id === id)!
    );
    const {tokens, names, identities} = useMultipleViewerToken(uniqueUsers.map((user) => user.id));
    if (!tokens || !names || !identities) return <MultiStreamPlayerSkeleton/>
    const [activeTab, setActiveTab] = useState('All');

    return (
        <>
            <div className={"grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full"}>
                <div className={"space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10"}>
                    <div className={uniqueUsers.length > 1 ? "grid grid-cols-2" : ""}>
                        {activeTab === 'All' ? (
                            uniqueUsers.map((user, index) => (
                                <LiveKitRoom key={user.id} serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL} token={tokens[index]}>
                                    <Video hostName={user.username} hostIdentity={user.id} />
                                </LiveKitRoom>
                            ))
                        ) : (
                            uniqueUsers.map((user, index) => (
                                activeTab === user.username && (
                                    <LiveKitRoom key={user.id} serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL} token={tokens[index]} className="col-span-full">
                                        <Video hostName={user.username} hostIdentity={user.id} />
                                    </LiveKitRoom>
                                )
                            ))
                        )}
                    </div>
                    <div>
                        <div className="mx-auto">
                            <div className="flex">
                                <button onClick={() => setActiveTab('All')} className={`flex-1 p-2 text-center ${activeTab === 'All' ? "border-b-2 border-[#FF7590] font-bold" : "text-gray-500"}`}>
                                    All
                                </button>
                                {uniqueUsers.map((tab) => (
                                    <button key={tab.username} onClick={() => setActiveTab(tab.username!)} className={`flex-1 p-2 text-center ${activeTab === tab.username? "border-b-2 border-[#FF7590] font-bold": "text-gray-500"}`}>
                                        {tab.username}
                                    </button>
                                ))}
                            </div>
                            <div>
                                {uniqueUsers.map((tab) => (
                                    <div key={tab.username} className={`tab-pane ${activeTab === tab.username}`}>
                                        {activeTab === tab.username && (
                                            <div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>   
                        </div>
                    </div>
                    <p className="text-center text-lg font-semibold">Adjust stream perspectives</p>
                </div>
                <div className={"col-span-1 bg-background"}>
                    <div className="p-4">
                        <h2 className="text-lg font-bold">Profile Navigation</h2>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            {uniqueUsers.map((user) => (
                                <Link key={user.username} href={`/${user.username}`} className="block p-4 border rounded-lg hover:bg-gray-500 hover:bg-opacity-10">
                                    <img src={user.imageURL} alt={user.username} className="w-16 h-16 rounded-full mx-auto" />
                                    <h3 className="mt-2 text-center text-lg font-semibold">{user.username}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const MultiStreamPlayerSkeleton = () => {
    return (
        <div className={"grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full "}>
            <div
                className={"space-y-2 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10"}>
                <VideoSkeleton/>
                <HeaderSkeleton/>
            </div>
            <div className={"col-span-1 bg-background"}>
                <ChatSkeleton/>
            </div>
        </div>
    )
}