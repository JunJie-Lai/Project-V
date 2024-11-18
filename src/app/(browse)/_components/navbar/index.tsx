import {Logo} from "@/app/(browse)/_components/navbar/logo";
import {Search} from "@/app/(browse)/_components/navbar/search";
import {MultiStream} from "@/app/(browse)/_components/navbar/multistream";
import {Actions} from "@/app/(browse)/_components/navbar/actions";
import { getUsernames } from "@/lib/user-service";

export const Navbar = async () => {
    const usernames = await getUsernames()
    
    return (
        <nav className={"fixed top-0 w-full h-20 z-[49] navbar-bg px-2 lg:px-4 flex justify-between items-center shadow-sm"}>
            <Logo/>
            <div className="relative w-full flex justify-center gap-x-2">
                <Search/>
                <MultiStream userList={usernames}/>
            </div>
            <Actions/>
        </nav>
    )
}