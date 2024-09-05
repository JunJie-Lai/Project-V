"use client"

import {Button} from "@/components/ui/button";
import {onFollow, onUnfollow} from "@/actions/follow";
import {useTransition} from "react";
import {toast} from "sonner";
import {onBlock, onUnblock} from "@/actions/block";

interface ActionsProps {
    isFollowing: boolean;
    userId: string
}

export const Actions = ({isFollowing, userId}: ActionsProps) => {
    const [isPending, startTransition] = useTransition()

    const handleFollow = () => {
        startTransition(() => {
            onFollow(userId)
                .then((data) => toast.success(`Followed ${data.following.username}`))
                .catch(() => toast.error("Something went wrong"))
        })
    };

    const handleUnfollow = () => {
        startTransition(() => {
            onUnfollow(userId)
                .then((data) => toast.success(`Unfollowed ${data.following.username}`))
                .catch(() => toast.error("Something went wrong"))
        })
    };

    const onClick = () => {
        if (isFollowing) handleUnfollow()
        else handleFollow()
    }

    const handleBlock = () => {
        startTransition(() => {
            onUnblock(userId)
                .then(data => toast.success(`Unblocked user ${data.blocked.username}`))
                .catch(() => toast.error("Something went wrong"))
        })
    }

    return (
        <>
            <Button disabled={isPending} onClick={onClick} variant={"primary"}>
                {isFollowing ? "Unfollow" : "Follow"}
            </Button>
            <Button disabled={isPending} onClick={handleBlock}>
                Unblock
            </Button>
        </>
    )
}