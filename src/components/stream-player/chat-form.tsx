"use client"

import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {ChatInfo} from "@/components/stream-player/chat-info";

interface ChatFormProps {
    onSubmit: () => void,
    value: string,
    onChange: (value: string) => void,
    isHidden: boolean,
    isChatFollowersOnly: boolean,
    isChatDelayed: boolean,
    isFollowing: boolean
}

export const ChatForm = (props: ChatFormProps) => {
    const [isDelayBlocked, setIsDelayBlocked] = useState(false)
    const isFollowersOnlyAndNotFollowing = props.isChatFollowersOnly && !props.isFollowing
    const isDisabled = props.isHidden || isDelayBlocked || isFollowersOnlyAndNotFollowing
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (!props.value || isDisabled) return
        if (props.isChatDelayed && !isDelayBlocked) {
            setIsDelayBlocked(true)
            setTimeout(() => {
                setIsDelayBlocked(false)
                props.onSubmit()
            }, 3000)
        } else props.onSubmit()
    }

    if (props.isHidden) return null

    return (
        <form onSubmit={handleSubmit} className={"flex flex-col items-center gap-y-4 px-3"}>
            <div className={"w-full"}>
                <ChatInfo isDelayed={props.isChatDelayed} isFollowersOnly={props.isChatFollowersOnly} />
                <Input onChange={(e) => {
                    props.onChange(e.target.value)
                }} value={props.value} disabled={isDisabled} placeholder={"Send a message"}
                       className={cn("border-white/10", (props.isChatFollowersOnly || props.isChatDelayed) && "rounded-t-none border-t-0")}/>
            </div>
            <div className={"ml-auto"}>
                <Button type={"submit"} variant={"primary"} size={"sm"} disabled={isDisabled}>
                    Chat
                </Button>
            </div>
        </form>
    )
}

export const ChatFormSkeleton = () => {
    return (
        <div className={"flex flex-col items-center gap-y-4 p-3"}>
            <Skeleton className={"w-full h-10"}/>
            <div className={"flex items-center gap-x-2 ml-auto"}>
                <Skeleton className={"h-7 w-7"}/>
                <Skeleton className={"h-7 w-12"}/>
            </div>
        </div>
    )
}