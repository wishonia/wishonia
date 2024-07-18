"use client"
import React, { useState, useEffect } from 'react';
import { Search, Link, Users, AlertCircle, CheckCircle } from 'lucide-react';

interface ResearchEffort {
    id: string;
    title: string;
    organization: string;
    relevance: number;
    status: 'ongoing' | 'completed';
    collaborationPotential: 'high' | 'medium' | 'low';
}

const ResearchEffortCataloger: React.FC = () => {
    const [researchEfforts, setResearchEfforts] = useState<ResearchEffort[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        // Simulated initial data
        const initialEfforts: ResearchEffort[] = [
            { id: 'e1', title: 'AI-driven drug candidate screening', organization: 'Pharma Co', relevance: 0.9, status: 'ongoing', collaborationPotential: 'high' },
            { id: 'e2', title: 'Machine learning for protein folding', organization: 'BioTech Inc', relevance: 0.8, status: 'completed', collaborationPotential: 'medium' },
            { id: 'e3', title: 'Natural language processing for medical literature analysis', organization: 'MedAI Labs', relevance: 0.7, status: 'ongoing', collaborationPotential: 'high' },
        ];
        setResearchEfforts(initialEfforts);
    }, []);

    const handleSearch = () => {
        setScanning(true);
        // Simulate AI agent scanning process
        setTimeout(() => {
            const newEffort: ResearchEffort = {
                id: `e${researchEfforts.length + 1}`,
                title: `New entity working on ${searchTerm}`,
                organization: 'Recently Discovered Org',
                relevance: Math.random() * 0.5 + 0.5, // Random relevance between 0.5 and 1
                status: Math.random() > 0.5 ? 'ongoing' : 'completed',
                collaborationPotential: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
            };
            setResearchEfforts(prev => [...prev, newEffort]);
            setScanning(false);
        }, 2000);
    };

    return (
        <div className="p-4 rounded-lg shadow-md max-w-4xl mx-auto my-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Effort Cataloger</h2>
            <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 rounded">
                <h3 className="font-bold flex items-center"><Search size={16} className="mr-2" /> Continuous Effort Scanning</h3>
                <p className="text-sm">AI agents continuously scan and catalog existing efforts to avoid duplication and identify collaboration opportunities.</p>
            </div>
            <div className="mb-4 flex">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter task..."
                    className="flex-grow p-2 border rounded-l dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                    onClick={handleSearch}
                    disabled={scanning}
                    className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {scanning ? 'Scanning...' : 'Scan for Ongoing Work'}
                </button>
            </div>
            <div>
                <h3 className="font-bold mb-2">Cataloged Ongoing Efforts</h3>
                {researchEfforts.map(effort => (
                    <div key={effort.id} className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                        <div className="font-medium">{effort.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{effort.organization}</div>
                        <div className="mt-2 flex items-center">
                            <Link size={16} className="mr-1" />
                            <span className="text-sm mr-4">Relevance: {effort.relevance.toFixed(2)}</span>
                            {effort.status === 'ongoing' ? (
                                <AlertCircle size={16} className="mr-1 text-yellow-500" />
                            ) : (
                                <CheckCircle size={16} className="mr-1 text-green-500" />
                            )}
                            <span className="text-sm mr-4">Status: {effort.status}</span>
                            <Users size={16} className="mr-1" />
                            <span className="text-sm">Collaboration Potential: {effort.collaborationPotential}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResearchEffortCataloger;