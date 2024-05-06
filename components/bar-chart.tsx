import React, { useEffect, useState } from 'react';

interface Priority {
    name: string;
    percentage?: number;
    backgroundImages: string[];
    backgroundColor: string;
}

interface BarChartProps {
    thisPriority: Priority;
    thatPriority: Priority;
    labelsPosition?: 'top' | 'bottom';
}

const BarChart: React.FC<BarChartProps> = ({ thisPriority, thatPriority, labelsPosition = 'top' }) => {
    const [currentImageIndexes, setCurrentImageIndexes] = useState([0, 0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndexes(prevIndexes => [
                (prevIndexes[0] + 1) % thisPriority.backgroundImages.length,
                (prevIndexes[1] + 1) % thatPriority.backgroundImages.length,
            ]);
        }, 1000);

        return () => clearInterval(interval);
    }, [thisPriority.backgroundImages.length, thatPriority.backgroundImages.length]);

    const thatPriorityPercentage = 100 - (thisPriority.percentage || 0);

    return (
        <div id="chart-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '600px',
                height: '200px',
                justifyContent: 'flex-end'
            }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', height: '100%' }}>
                    {[thisPriority, { ...thatPriority, percentage: thatPriorityPercentage }].map((priority, index) => (
                        <div key={priority.name} style={{
                            width: '48%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            maxWidth: '200px'
                        }}>
                            {labelsPosition === 'top' && (
                                <span id={`${priority.name}PercentageLabel`} className="text-sm text-center">
                  {priority.percentage}% {priority.name}
                </span>
                            )}
                            <div
                                id={`${priority.name}Bar`}
                                style={{
                                    height: `${priority.percentage}%`,
                                    backgroundColor: priority.backgroundColor,
                                    width: '100%',
                                    backgroundImage: `url(${priority.backgroundImages[currentImageIndexes[index]]})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            ></div>
                        </div>
                    ))}
                </div>
                {labelsPosition === 'bottom' && (
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginTop: '8px' }}>
                        {[thisPriority, { ...thatPriority, percentage: thatPriorityPercentage }].map((priority, index) => (
                            <span key={priority.name} id={`${priority.name}PercentageLabel`} className="text-xs text-center" style={{ width: '48%' }}>
                {priority.percentage}% {priority.name}
              </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BarChart;