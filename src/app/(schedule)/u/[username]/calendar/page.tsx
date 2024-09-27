"use client"

import { DatePicker } from "@nextui-org/react";
import { TimeInput } from "@nextui-org/react";
import { now, today, ZonedDateTime, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import React, { useState } from 'react';

const SchedulePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scheduledSlots, setScheduledSlots] = useState({}); // Store scheduled slots

    const current = new Date();

    // Generate date array for the next 7 days
    const date = Array.from({ length: 7 }, (_, i) => {
        const futureDate = new Date(current);
        futureDate.setDate(current.getDate() + i);
        return `${futureDate.getMonth() + 1}/${futureDate.getDate()}`;
    });

    // Generate day names for the next 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
        const dayIndex = (current.getDay() + i) % 7;
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
    });

    // Create time slots
    const times = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 || 12;
        const suffix = i < 12 ? 'am' : 'pm';
        return `${hour}:00${suffix}`;
    });

    // Function to generate schedule columns
    const renderColumns = () =>
        days.map((day, i) => (
            <div key={i} className="flex flex-col justify-center items-center w-[11vw]">
                <div className="w-full h-[9vh] flex justify-center items-center border-[#FFB7C5] border-2 border-b-0 border-l-0 border-r-2 border-t-0">
                    <span className="mb-11 absolute mr-10">{day}</span>
                    <span className="text-5xl ml-20 -mb-4 mr-4">{date[i]}</span>
                </div>
                {times.map((time, j) => {
                    const isScheduled = scheduledSlots[date[i]] && scheduledSlots[date[i]].includes(time);
                    return (
                        <div
                            key={j}
                            className={`text-black w-full h-8 flex justify-center items-center border-[#FFB7C5] border-2 border-b-0 border-l-0 ${isScheduled ? 'bg-[#FFB7C5]' : ''}`}
                        >
                            {time}
                        </div>
                    );
                })}
            </div>
        ));

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
                [selectedDate]: timeSlots
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
        <main className="text-white mb-4 ml-4 bg-[#171717]">
            <title>Schedule</title>
            <section className="flex mt-4 mb-4">
                <div className="ml-2 text-lg font-semibold">Schedule</div>
                <button
                    className="bg-[#FFB7C5] hover:bg-[#fdc0cc] transition-all duration-200 text-black rounded-lg p-2.5 text-xl ml-auto mr-20"
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
                <section className="left-0 grid grid-cols-7">
                    {renderColumns()}
                </section>
            </section>

            {/* Render the modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
};

export default SchedulePage;
