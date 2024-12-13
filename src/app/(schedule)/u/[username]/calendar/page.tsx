import { getScheduleByUsername } from "@/lib/schedule-service";
import { getSelf } from "@/lib/auth-service";
import Link from "next/link"
import { Button } from "@/components/ui/button";

const SchedulePage = async () => {
    const self = await getSelf()
    const user = await getScheduleByUsername(self.username);
    const schedule = user!.schedule || [];
    const currentWeekStart = new Date();
    currentWeekStart.setHours(0, 0, 0, 0);

    const times = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 || 12;
        const suffix = i < 12 ? "am" : "pm";
        return `${hour}:00${suffix}`;
    });

    const generateDates = () => {
        return Array.from({ length: 7 }, (_, i) => {
            const futureDate = new Date(currentWeekStart);
            futureDate.setDate(currentWeekStart.getDate() + i);
            return `${futureDate.getMonth() + 1}/${futureDate.getDate()}`;
        });
    };

    const generateDays = (startDay: any) => {
        return Array.from({ length: 7 }, (_, i) => {
            const dayIndex = (startDay + i) % 7;
            return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
        });
    };
    
    const days = generateDays(currentWeekStart.getDay());
    const dates = generateDates();


    const isScheduledTime = (currentDay: any, currentTime: any) => {
        if(Array.isArray(schedule))
        //if (!schedule || schedule.length === 0) 
            //return false;
            return schedule.some(({ day, time }:any) => day === currentDay && time === currentTime);
    };

    const renderColumns = () => {
        return days.map((day, i) => (
            <div key={i} className="flex flex-col justify-center items-center w-1/7">
                <div className="w-full h-[9vh] flex flex-col justify-center items-center border-[#FFB7C5] border-2 border-b-0 border-l-0 border-r-2 border-t-0 relative">
                    <span className="mb-11 absolute mr-10">{day}</span>
                    <span className="text-5xl ml-20 -mb-4 mr-4">{dates[i]}</span>
                </div>
                {times.map((time, j) => {
                    const isScheduled = isScheduledTime(day, time);

                    return (
                        <div
                            key={j}
                            className={`text-[#171717] w-full h-8 flex justify-center items-center border-[#FFB7C5] border-2 border-b-0 border-l-0 ${isScheduled ? "bg-[#FFB7C5]" : ""
                                }`}
                        >
                            {time}
                        </div>
                    );
                })}
            </div>
        ));
    };

    return (
        <main className="text-white mb-4 ml-4 bg-[#171717] min-h-screen">
            <title>Schedule</title>
            <section className="flex mt-4 mb-4 items-center">
                <div className="text-lg font-semibold flex-grow text-center">Schedule for {self.username}</div>
                <Button className="bg-[#FFB7C5] text-black p-2.5 rounded-[0.5em] text-lg mr-4 flex">
                    <Link
                        href={{
                            pathname: `/u/${self.username}/edit_calendar`,
                            query: {
                                search: self.username
                            },
                        }}
                        className={"hover:text-primary flex text-black"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-7 mr-1 text-black">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                        Edit Schedule
                    </Link>
                </Button>
            </section>

            <section className="flex">
                <div className="flex flex-col justify-center items-center w-24">
                    <div className="schedule-cell-top text-lg border-[#FFB7C5] border-2 border-b-0 border-l-0 border-r-2 border-t-0 h-[4.5em] px-[0.7em] py-[1.3em]">GMT-08</div>
                    {times.map((time, i) => (
                        <div
                            key={i}
                            className="w-full h-8 flex justify-center items-center border-[#FFB7C5] border-2 border-b-0 border-l-0"
                        >
                            {time}
                        </div>
                    ))}
                </div>
                <section className="left-0 grid grid-cols-7 flex-grow">
                    {renderColumns()}
                </section>
            </section>
        </main >
    );
};

export default SchedulePage;