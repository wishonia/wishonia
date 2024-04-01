import React, {useEffect, useState} from 'react';

interface ChartContainerProps {
  warPercentageDesired: number;
}

// New ChartContainer component
const ChartContainer: React.FC<ChartContainerProps> = ({ warPercentageDesired }) => {
  const researchPercentageDesired = 100 - warPercentageDesired;
  const [warImages, setWarImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Extract backgroundImage to a variable, initially set to an empty string
  const backgroundImage = warImages.length > 0 ? `url(${warImages[currentImageIndex]})` : '';

  useEffect(() => {
    fetch('/api/warImages')
        .then(response => response.json())
        .then(filePaths => setWarImages(filePaths))
        .catch(error => console.error('Error fetching war images:', error));

    const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % warImages.length);
    }, 1000);

    return () => clearInterval(interval);
}, [warImages.length]);

  return (
        <div id="chart-container"
            style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
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
                          <span id="warPercentageDesired"
                          className="text-sm">
                            {warPercentageDesired}% Military/War
                            </span>
                            <div id="warBar"
                            style={{
                                height: `${warPercentageDesired}%`, 
                                backgroundColor: 'black', 
                                width: '100%',
                                backgroundImage: backgroundImage,
                                backgroundSize: 'cover'
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
                        <span
                          className="text-sm">
                            {researchPercentageDesired}% Medial Research
                        </span>
                            <div style={{
                                height: `${researchPercentageDesired}%`,
                                backgroundColor: '#0075ff',
                                width: '100%',
                                backgroundImage: 'url(img/people/grandma.jpg)',
                                backgroundSize: 'cover'
                            }}></div>
                        </div>
                    </div>
                </div>
            </div>
  );
};

export default ChartContainer;
