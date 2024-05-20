"use client";
import React, {useEffect, useState} from 'react';
import { warImages } from '@/lib/warImagePaths';


interface ChartContainerProps {
    warPercentageDesired: number;
    labelsPosition?: 'top' | 'bottom';
}

// New BarChart component
const WarVsCuresBarChart: React.FC<ChartContainerProps> = ({ warPercentageDesired, labelsPosition = 'top' }) => {
  const researchPercentageDesired = 100 - warPercentageDesired;
  //let [warImages, setWarImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Extract backgroundImage to a variable, initially set to an empty string
    const img =  warImages.length > 0 ? warImages[currentImageIndex] : '/img/war/vietnam.jpg';
  const backgroundImage = warImages.length > 0 ? `url(${img})` : '';

  useEffect(() => {
    // fetch('/api/warImages')
    //     .then(response => response.json())
    //     .then(filePaths => setWarImages(filePaths))
    //     .catch(error => console.error('Error fetching war images:', error));

    const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % warImages.length);
    }, 2000);

    return () => clearInterval(interval);
}, [warImages.length]);

    return (
        <div id="chart-container"
             style={{display: 'flex', justifyContent: 'center', marginBottom: '5px'}}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '600px',
                height: '200px',
                justifyContent: 'flex-end'
            }}>
                <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', height: '100%'}}>
                    <div style={{
                        width: '48%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        maxWidth: '200px'
                    }}>
                        {labelsPosition === 'top' && (
                            <span id="warPercentageDesiredLabel" className="text-sm text-center">
                              {warPercentageDesired}% War / Military
                            </span>
                        )}
                        <div id="warBar"
                             style={{
                                 height: `${warPercentageDesired}%`,
                                 backgroundColor: 'black',
                                 width: '100%',
                                 backgroundImage: backgroundImage,
                                 backgroundSize: 'cover',
                                 backgroundPosition: 'center' // Adjusts the background image to be centered
                             }}>
                        </div>
                    </div>
                    <div style={{
                        width: '48%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        maxWidth: '200px'
                    }}>
                        {labelsPosition === 'top' && (
                            <span id="researchPercentageDesiredLabel" className="text-sm text-center px-2">
                  {researchPercentageDesired}% Medical Research
                </span>
                        )}
                        <div id="researchBar"
                             style={{
                                 height: `${researchPercentageDesired}%`,
                                 backgroundColor: '#0075ff',
                                 width: '100%',
                                 backgroundImage: 'url(/img/people/grandma.jpg)',
                                 backgroundSize: 'cover'
                             }}>
                        </div>
                    </div>
                </div>
                {labelsPosition === 'bottom' && (
                    <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', marginTop: '8px'}}>
                      <span id="warPercentageDesiredLabel" className="text-xs text-center"
                            style={{width: '48%'}}>
                        {warPercentageDesired}% War & Military
                      </span>
                        <span id="researchPercentageDesiredLabel" className="text-xs text-center px-2"
                              style={{width: '48%'}}>
                            {researchPercentageDesired}% Medical Research
                      </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WarVsCuresBarChart;
