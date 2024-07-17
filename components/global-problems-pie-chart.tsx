import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { GlobalProblem } from "@prisma/client";

interface CoolGlobalProblemsPieChartProps {
    entries: GlobalProblem[];
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#B19CD9'];

const CoolGlobalProblemsPieChart: React.FC<CoolGlobalProblemsPieChartProps> = ({ entries }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const data = entries.map(entry => ({
        name: entry.name,
        value: entry.averageAllocation,
        featuredImage: entry.featuredImage
    }));

    return (
        <div className="w-full h-[400px] sm:h-[500px] rounded-lg shadow-lg p-2 sm:p-4 flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 sm:mb-4 text-gray-200">
                Collective Budget for Each Problem
            </h2>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            {data.map((entry, index) => (
                                <pattern key={`pattern-${index}`} id={`image-${index}`} patternUnits="objectBoundingBox" width="100%" height="100%">
                                    <image href={entry.featuredImage || ''} x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                                </pattern>
                            ))}
                        </defs>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius="80%"
                            fill="#8884d8"
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`url(#image-${index})`} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                            ))}
                        </Pie>
                        {data[activeIndex] && (
                            <text x="50%" y="40%" textAnchor="middle" dominantBaseline="middle" fill="#e0e0e0">
                                <tspan x="50%" dy="-1em" fontSize="16" fontWeight="bold" textAnchor="middle" wordSpacing="0.25em">
                                    {data[activeIndex].name.split(' ').map((word, index) => (
                                        <tspan key={index} x="50%" dy={index === 0 ? 0 : "1.2em"}>
                                            {word}
                                        </tspan>
                                    ))}
                                </tspan>
                                <tspan x="50%" dy="1.5em" fontSize="14">
                                    {`${data[activeIndex]?.value?.toFixed(2) ?? 0}%`}
                                </tspan>
                            </text>
                        )}
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CoolGlobalProblemsPieChart;