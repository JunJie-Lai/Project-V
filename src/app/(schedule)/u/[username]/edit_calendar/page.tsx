'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from 'next/navigation'

const editSchedulePage = () => {
    const searchParams = useSearchParams()
    let username = searchParams.get('search')
    const [clickedStates, setClickedStates] = useState({});

    const handleRectangleClick = (dayIndex, timeIndex) => {
        const key = `${dayIndex}-${timeIndex}`;
        setClickedStates((prev) => ({
            ...prev,
            [key]: !prev[key], // Toggle the state
        }));
    };

    const saveSchedule = async () => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const times = Array.from({ length: 24 }, (_, i) => {
          const hour = i % 12 || 12;
          const suffix = i < 12 ? "am" : "pm";
          return `${hour}:00${suffix}`;
        });
    
        const schedule = Object.keys(clickedStates)
          .filter((key) => clickedStates[key]) // Only include clicked cells
          .map((key) => {
            const [dayIndex, timeIndex] = key.split("-").map(Number);
            return {
              day: days[dayIndex],
              time: times[timeIndex],
            };
          });
    
        try {
          const response = await fetch("/schedule", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, schedule }),
          });
    
          if (response.ok) {
            alert("Schedule saved successfully!");
          } else {
            alert("Failed to save schedule.");
          }
        } catch (error) {
          console.error("Error saving schedule:", error);
          alert("An error occurred while saving the schedule.");
        }
      };

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
    const renderColumns = () =>
        days.map((day, i) => (
            <div key={i} className="flex flex-col justify-center items-center w-1/7">
                <div className="w-full h-[9vh] flex flex-col justify-center items-center border-[#FFB7C5] border-2 border-b-0 border-l-0 border-r-2 border-t-0 relative">
                    <span className="mb-11 absolute mr-10">{day}</span>
                    <span className="text-5xl ml-20 -mb-4 mr-4">{dates[i]}</span>
                </div>
                {times.map((time, j) => {
                    const key = `${i}-${j}`;
                    const isClicked = clickedStates[key];
                    const backgroundColor = isClicked ? "#FFB7C5" : "#171717";

                    return (
                        <div
                            key={j}
                            onClick={() => handleRectangleClick(i, j)}
                            style={{ backgroundColor }}
                            className={`text-[#171717] w-full h-8 flex justify-center items-center border-[#FFB7C5] border-2 border-b-0 border-l-0 
                            hover:bg-[#FFE0E5] transition-colors duration-300 cursor-pointer`}
                        >
                            {time}
                        </div>
                    );
                })}
            </div>
        ));

    return (
        <main className="text-white mb-4 ml-4 bg-[#171717] min-h-screen">
            <title>Schedule</title>
            <section className="flex mt-4 mb-4 items-center">
                <div className="text-lg font-semibold flex-grow text-center">Editing schedule for {username}</div>
                <Button className="bg-[#FFB7C5] text-black p-2.5 rounded-[0.5em] text-lg mr-4 flex" onClick={saveSchedule}>
                    <Link href={`/u/${username}/calendar`} className={"text-black hover:text-primary flex"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-7 mr-1 text-black">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        Done Editing
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
        </main>
    );
};

export default editSchedulePage;
