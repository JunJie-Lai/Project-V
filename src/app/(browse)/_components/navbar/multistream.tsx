"use client";

import {Button} from "@/components/ui/button";
import {Grid2X2} from "lucide-react";
import {useState} from "react";

interface MultiStreamProps {
    userList: string[]
}

export const MultiStream = ({userList}: MultiStreamProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchValues, setSearchValues] = useState(["", "", "", ""]);
    const [suggestions] = useState(userList);
    const [isDropdownVisible, setIsDropdownVisible] = useState(Array(4).fill(false));
    
    const handleInputChange = (index: number, value: string, visibility: boolean) => {
        const newValues = [...searchValues];
        newValues[index] = value;
        setSearchValues(newValues);

        const dropdownVisibility = [...isDropdownVisible];
        dropdownVisibility[index] = visibility;
        setIsDropdownVisible(dropdownVisibility);
    };

    const getFilteredSuggestions = (query: string, index: number) => {
        if (!query || !isDropdownVisible[index]) return [];
        return suggestions.filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()));
    };
    
    return (
        <div>
            <Button variant={"secondary"} className={"rounded bg-background border search-border p-3"} onClick={() => setIsModalOpen(true)}>
                    <Grid2X2 className="h-5 w-5 text-[#FFB7C5]"/>
            </Button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-background p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Multistream</h2>
                        {[1, 2, 3, 4].map((user, index) => (
                            <div key={index} className="mb-4">
                                <p className="mb-2">User {user} {user === 1 && "(Required)"}</p>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded"
                                    placeholder="Search..."
                                    value={searchValues[index]}
                                    onChange={(e) => handleInputChange(index, e.target.value, true)}
                                />
                                <ul className="bg-background rounded mt-2 max-h-20 overflow-auto">
                                    {getFilteredSuggestions(searchValues[index], index).map((suggestion, suggestionIndex) => (
                                        <li key={suggestionIndex} className="p-2 hover:bg-black hover:bg-opacity-30 cursor-pointer" onClick={() => handleInputChange(index, suggestion, false)}>
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        
                        <div className="flex justify-between">
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>
                                Close
                            </button>
                            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => {
                                const baseUser = searchValues[0];
                                if (!baseUser || !suggestions.includes(baseUser)) {
                                    alert("The first user must be filled in and match a valid suggestion.");
                                    return;
                                }
                                const multiUsers = searchValues.slice(1).filter((value) => suggestions.includes(value)).join(",");
                                const url = `/${baseUser}${multiUsers? `?multi=${multiUsers}` : ""}`;
                                window.location.href = url;
                            }}>
                                Multistream
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}