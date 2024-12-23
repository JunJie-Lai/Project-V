"use client"

import {usePathname} from "next/navigation";
import {useSidebar} from "@/store/use-sidebar";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {UserAvatar} from "@/components/user-avatar";
import {LiveBadge} from "@/components/live-badge";
import {Skeleton} from "@/components/ui/skeleton";

interface UserItemProps {
    username: string,
    imageURL: string,
    isLive?: boolean
}

export const UserItem = ({username, imageURL, isLive}: UserItemProps) => {
    const pathname = usePathname()
    const {collapsed} = useSidebar((state) => state)
    const href = `/${username}`
    const isActive = pathname === href

    return (
        <Button className={cn("w-full h-12", collapsed ? "justify-center" : "justify-start", isActive && "bg-accent")}
                variant={"ghost"} asChild>
            <Link href={href}>
                <div className={cn("flex items-center w-full gap-x-4", collapsed && "justify-center")}>
                    <UserAvatar username={username} imageURL={imageURL} isLive={isLive} /*showBadge*//>
                    {!collapsed && (
                        <p className={"truncate"}>
                            {username}
                        </p>
                    )}
                    {!collapsed && isLive && (
                        <LiveBadge className={"ml-auto"}/>
                    )}
                </div>
            </Link>
        </Button>
    )
}

export const UserItemSkeleton = () => {
    return (
        <li className={"flex items-center gap-x-4 px-3 py-2"}>
            <Skeleton className={"min-h-[32px] min-w-[32px] rounded-full"}/>
            <div className="flex-1 ">
                <Skeleton className={"h-6"}/>
            </div>
        </li>
    )
}