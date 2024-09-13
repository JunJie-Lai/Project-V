import {Poppins} from "next/font/google";
import Image from "next/image";
import {cn} from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
})

export const Logo = () => {
    return (
        <div className={"flex flex-col items-center gap-y-4"}>
            <div className={"bg-[#FFB7C5] rounded-full p-1"}>
                <Image src={"/spooky.svg"} alt={"Project V"} height={80} width={80} />
            </div>
            <div className={cn("flex flex-col items-center text-[#FFB7C5]", font.className)}>
                <p className={"text-xl font-semibold"}>
                    Project V
                </p>
                <p className={"text-sm text-muted-foreground"}>
                    Watch and Stream!
                </p>
            </div>
        </div>
    )
}