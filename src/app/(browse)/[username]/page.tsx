import {getUserByUsername} from "@/lib/user-service";
import {notFound} from "next/navigation";
import {isFollowingUser} from "@/lib/follow-service";
import {isBlockedByUser} from "@/lib/block-service";
import {StreamPlayer} from "@/components/stream-player";
import {MultiStreamPlayer} from "@/components/stream-player/multi-stream";

interface UserPageProps {
    params: {
        username: string;
    }
    searchParams?: {
        multi: string;
    }
}

const UserPage = async ({params, searchParams}: UserPageProps) => {
    const user = await getUserByUsername(params.username)
    if (!user || !user.stream) notFound()

    const isFollowing = await isFollowingUser(user.id)
    const isBlocked = await isBlockedByUser(user.id)

    if (isBlocked) notFound()

    const multiParam = searchParams?.multi
    let additionalUsernames: (string)[];
    if (multiParam) {
        additionalUsernames = multiParam.split(',')
    } else {
        additionalUsernames = []
    }

    const additionalUsers = await Promise.all(
        additionalUsernames.map((username) => getUserByUsername(username))
    );
    const filteredUsers = additionalUsers.filter(user => user !== null);

    if (filteredUsers.length === 0) {
        return <StreamPlayer user={user} stream={user.stream} isFollowing={isFollowing}/>
    }

    const additionalFollows = await Promise.all(
        filteredUsers.map(async (user) => {
            if (user) {
                return await isFollowingUser(user.id);
            }
            return false;
        })
    );

    return (
        <MultiStreamPlayer user={user} users={filteredUsers}/>
    )
}

export default UserPage