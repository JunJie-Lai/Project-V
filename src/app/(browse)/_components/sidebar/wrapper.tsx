"use client"

import {useSidebar} from "@/store/use-sidebar";
import {cn} from "@/lib/utils";
import {ToggleSkeleton} from "@/app/(browse)/_components/sidebar/toggle";
import {RecommendedSkeleton} from "@/app/(browse)/_components/sidebar/recommended";
import {useIsClient} from "usehooks-ts";
import {FollowingSkeleton} from "@/app/(browse)/_components/sidebar/following";

interface WrapperProps {
    children: React.ReactNode
}

export const Wrapper = ({children}: WrapperProps) => {
    const isClient = useIsClient();
    const {collapsed} = useSidebar((state) => state)

    return (
        !isClient ? (
            <aside
                className={"fixed left-0 flex flex-col w-60 h-full bg-background border-r border-[#2D2E35] z-50"}>
                <ToggleSkeleton/>
                <FollowingSkeleton/>
                <RecommendedSkeleton/>
            </aside>
        ) : (
            <aside
                className={cn("fixed left-0 flex flex-col w-60 h-full bg-background border-r border-[#2D2E35] z-49", collapsed && "w-[70px]")}>
                {children}
            </aside>
        )
    )
}