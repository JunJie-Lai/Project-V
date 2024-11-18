import { DatePicker } from "@nextui-org/react";
import { TimeInput } from "@nextui-org/react";
import { now, today, ZonedDateTime, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { getScheduleByUsername } from "@/lib/schedule-service";
import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db"

const SchedulePage = async () => {
    const self = await getSelf()
    const user = await getScheduleByUsername(self.username)
    let startDays = user.startDay.split(',')
    let endDays = user.endDay.split(',')
    let startTimes = user.startTime.split(',')
    let endTimes = user.endTime.split(',')
    let schedule = []
    for (let i = 0; i < startDays.length; i++){
        schedule.push({startDay: startDays[i], endDay: endDays[i], startTime: startTimes[i], endTime: endTimes[i]})
    }
    
    console.log(schedule[1])

    const currentWeekStart = new Date(); // Initialize current week start
    const times = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 || 12;
        const suffix = i < 12 ? "am" : "pm";
        return `${hour}:00${suffix}`;
    });

    // Generate date and day arrays
    const generateDates = () => {
        return Array.from({ length: 7 }, (_, i) => {
            const futureDate = new Date(currentWeekStart);
            futureDate.setDate(currentWeekStart.getDate() + i);
            return `${futureDate.getMonth() + 1}/${futureDate.getDate()}`;
        });
    };

    const generateDays = () => {
        return Array.from({ length: 7 }, (_, i) => {
            const dayIndex = (currentWeekStart.getDay() + i) % 7;
            return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
        });
    };

    const dates = generateDates();
    const days = generateDays();

    // Render columns with schedule data
    const renderColumns = () => {
        const dayIndices = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        // Helper to parse time strings into minutes of the day
        const parseTime = (timeString) => {
            const [hour, minute] = timeString.split(/[: ]/);
            const suffix = timeString.includes("pm") && hour !== "12" ? 12 : 0;
            return (+hour % 12 + suffix) * 60 + (+minute || 0);
        };
    
        // Check if a given time falls within a schedule's start and end time
        const isScheduledTime = (currentDay, currentTime) => {
            if (!schedule) return false; // No schedule
    
            return schedule.some(({ startDay, endDay, startTime, endTime }) => {
                const startIndex = dayIndices.indexOf(startDay);
                const endIndex = dayIndices.indexOf(endDay);
                const currentIndex = dayIndices.indexOf(currentDay);
                const currentMinutes = parseTime(currentTime);
                const startMinutes = parseTime(startTime);
                const endMinutes = parseTime(endTime);
    
                // Handle time range, including multi-day schedules
                if (
                    (startIndex <= currentIndex && currentIndex <= endIndex) || // Non-wrapping schedule (same week)
                    (startIndex > endIndex && (currentIndex >= startIndex || currentIndex <= endIndex)) // Wrapping schedule (e.g., Fri to Mon)
                ) {
                    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
                }
                return false;
            });
        };
    
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
                            className={`text-[#171717] w-full h-8 flex justify-center items-center border-[#FFB7C5] border-2 border-b-0 border-l-0 ${
                                isScheduled ? "bg-[#FFB7C5]" : ""
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
        </main>
    );
};

export default SchedulePage;



/*

const [isModalOpen, setIsModalOpen] = useState(false);
const [scheduledSlots, setScheduledSlots] = useState([]); // Store scheduled slots

// Initialize currentWeekStart to today
const [currentWeekStart, setCurrentWeekStart] = useState(() => new Date());

useEffect(() => {
    const savedSlots = localStorage.getItem('scheduledSlots');
    if (savedSlots) {
        setScheduledSlots(JSON.parse(savedSlots));
    }
}, []);

useEffect(() => {
    localStorage.setItem('scheduledSlots', JSON.stringify(scheduledSlots));
}, [scheduledSlots]);


// Function to generate date array starting from today
const generateDates = () => {
    return Array.from({ length: 7 }, (_, i) => {
        const futureDate = new Date(currentWeekStart);
        futureDate.setDate(currentWeekStart.getDate() + i);
        return `${futureDate.getMonth() + 1}/${futureDate.getDate()}`;
    });
};

// Function to generate day names starting from today
const generateDays = () => {
    return Array.from({ length: 7 }, (_, i) => {
        const dayIndex = (currentWeekStart.getDay() + i) % 7;
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
    });
};

const dates = generateDates();
const days = generateDays();

// Create time slots
const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const suffix = i < 12 ? 'am' : 'pm';
    return `${hour}:00${suffix}`;
});


const renderColumns = () =>
    days.map((day, i) => (
        <div key={i} className="flex flex-col justify-center items-center w-1/7">
            <div className="w-full h-[9vh] flex flex-col justify-center items-center border-[#FFB7C5] border-2 border-b-0 border-l-0 border-r-2 border-t-0 relative">
                <span className="mb-11 absolute mr-10">{day}</span>
                <span className="text-5xl ml-20 -mb-4 mr-4">{dates[i]}</span>
            </div>
            {times.map((time, j) => {
                const isScheduled = scheduledSlots[dates[i]] && scheduledSlots[dates[i]].includes(time);
                return (
                    <div
                        key={j}
                        className={`text-[#171717] w-full h-8 flex justify-center items-center border-[#FFB7C5] border-2 border-b-0 border-l-0 ${isScheduled ? 'bg-[#FFB7C5]' : ''}`}
                    >
                        {time}
                    </div>
                );
            })}
        </div>
    ));

// Handler to move to the previous week
const handlePreviousWeek = () => {
    const previousWeek = new Date(currentWeekStart);
    previousWeek.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(previousWeek);
};

// Handler to move to the next week
const handleNextWeek = () => {
    const nextWeek = new Date(currentWeekStart);
    nextWeek.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(nextWeek);
};

const handleSchedule = (selectedDate, timeSlots) => {
    // Update `scheduledSlots` and save to local storage
    setScheduledSlots((prev) => {
        const updatedSlots = {
            ...prev,
            [selectedDate]: [...(prev[selectedDate] || []), ...timeSlots],
        };
        localStorage.setItem('scheduledSlots', JSON.stringify(updatedSlots));
        return updatedSlots;
    });
};

// Modal Component
const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [value, setValue] = useState(today(getLocalTimeZone()));
    const [startTimeValue, setStartTimeValue] = useState(now(getLocalTimeZone()));
    const [endTimeValue, setEndTimeValue] = useState(now(getLocalTimeZone()));

    const handleSchedule = () => {
        const selectedDate = `${value.month}/${value.day}`;
        const startTime = `${startTimeValue.hour % 12 || 12}:00${startTimeValue.hour < 12 ? 'am' : 'pm'}`;
        const endTime = `${endTimeValue.hour % 12 || 12}:00${endTimeValue.hour < 12 ? 'am' : 'pm'}`;

        const timeSlots = [];
        const startIndex = times.indexOf(startTime);
        const endIndex = times.indexOf(endTime);

        for (let i = startIndex; i <= endIndex; i++) {
            timeSlots.push(times[i]);
        }

        setScheduledSlots((prev) => ({
            ...prev,
            [selectedDate]: [...(prev[selectedDate] || []), ...timeSlots]
        }));

        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#171717] bg-opacity-50">
            <div className="bg-black p-4 rounded-lg w-96 border-white border-[0.2em]">
                <h2 className="text-xl font-bold mb-4">Schedule a Stream</h2>
                <p className="mb-4">Select a day and time to schedule a stream!</p>
                <DatePicker
                    label="Date and Time"
                    variant="bordered"
                    value={value}
                    minValue={today(getLocalTimeZone())}
                    onChange={setValue}
                    hideTimeZone
                    showMonthAndYearPickers
                    labelPlacement="outside"
                />
                <TimeInput
                    className="mt-2 mb-2"
                    label="Start Time"
                    value={startTimeValue}
                    onChange={setStartTimeValue}
                    hideTimeZone />
                <TimeInput
                    label="End Time"
                    value={endTimeValue}
                    onChange={setEndTimeValue}
                    hideTimeZone />

                <div className="flex space-x-[12.7em] mt-4">
                    <button
                        className="bg-[#FFB7C5] hover:bg-[#fdc0cc] transition-all duration-200 text-black rounded-lg p-2"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="bg-[#FFB7C5] hover:bg-[#fdc0cc] transition-all duration-200 text-black rounded-lg p-2 justify-end"
                        onClick={handleSchedule}
                    >
                        Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

return (
    <main className="text-white mb-4 ml-4 bg-[#171717] min-h-screen">
        <title>Schedule</title>
        <section className="flex mt-4 mb-4 items-center">
            <button
                className="bg-[#FFB7C5] hover:bg-[#fdc0cc] transition-all duration-200 text-black rounded-lg p-2 ml-[30em]"
                onClick={handlePreviousWeek}
            >
                &lt; Previous Week
            </button>
            <div className="text-lg font-semibold flex-grow text-center">Schedule</div>
            <button
                className="bg-[#FFB7C5] hover:bg-[#fdc0cc] transition-all duration-200 text-black rounded-lg p-2 pr-5 pl-5 mr-[30em] "
                onClick={handleNextWeek}
            >
                Next Week &gt;
            </button>
            <button
                className="bg-[#FFB7C5] hover:bg-[#fdc0cc] transition-all duration-200 text-black rounded-lg p-2.5 text-xl ml-4 mr-8"
                onClick={() => setIsModalOpen(true)} // Open the modal on button click
            >
                Click to Schedule
            </button>
        </section>
        <section className="flex">
            <div className="flex flex-col justify-center items-center w-24">
                <div className="schedule-cell-top text-lg border-[#FFB7C5] border-2 border-b-0 border-l-0 border-r-2 border-t-0 h-[4.5em] px-[0.7em] py-[1.3em]">GMT-08</div>
                {times.map((time, i) => (
                    <div key={i} className="w-full h-8 flex justify-center items-center border-[#FFB7C5] border-2 border-b-0 border-l-0">{time}</div>
                ))}
            </div>
            <section className="left-0 grid grid-cols-7 flex-grow">
                {renderColumns()}
            </section>
        </section>

=
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>

    
);
*/