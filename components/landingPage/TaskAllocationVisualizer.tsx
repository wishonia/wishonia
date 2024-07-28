"use client"
import React, { useState, useEffect } from 'react';
import { User, Bot, BrainCircuit } from 'lucide-react';

interface Task {
    id: string;
    name: string;
    skills: string[];
}

interface Agent {
    id: string;
    name: string;
    type: 'human' | 'ai';
    skills: string[];
    experience: number;
    interests: string[];
}

const TaskAllocationVisualizer: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [allocations, setAllocations] = useState<Record<string, string>>({});
    const [highlightedTask, setHighlightedTask] = useState<string | null>(null);

    useEffect(() => {
        // Simulated data
        const sampleTasks: Task[] = [
            { id: 't1', name: 'Design Database Schema', skills: ['Database Design', 'SQL'] },
            { id: 't2', name: 'Develop ML Model', skills: ['Machine Learning', 'Python'] },
            { id: 't3', name: 'Create UI Mockups', skills: ['UI/UX Design', 'Figma'] },
            { id: 't4', name: 'Implement API', skills: ['Backend Development', 'REST API'] },
        ];

        const sampleAgents: Agent[] = [
            { id: 'a1', name: 'Alice', type: 'human', skills: ['Database Design', 'SQL'], experience: 5, interests: ['Data Modeling'] },
            { id: 'a2', name: 'Bob', type: 'human', skills: ['Machine Learning', 'Python'], experience: 3, interests: ['AI Research'] },
            { id: 'a3', name: 'AI Assistant', type: 'ai', skills: ['UI/UX Design', 'Figma'], experience: 2, interests: ['Design Patterns'] },
            { id: 'a4', name: 'Charlie', type: 'human', skills: ['Backend Development', 'REST API'], experience: 4, interests: ['System Architecture'] },
        ];

        setTasks(sampleTasks);
        setAgents(sampleAgents);

        // Simulate AI matching process
        const matchedAllocations: Record<string, string> = {};
        sampleTasks.forEach(task => {
            const matchedAgent = sampleAgents.find(agent =>
                agent.skills.some(skill => task.skills.includes(skill))
            );
            if (matchedAgent) {
                matchedAllocations[task.id] = matchedAgent.id;
            }
        });
        setAllocations(matchedAllocations);
    }, []);

    const handleTaskHover = (taskId: string | null) => {
        setHighlightedTask(taskId);
    };

    return (
        <div className="p-4 rounded-lg shadow-md max-w-4xl mx-auto my-8">
            <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 rounded">
                <h3 className="font-bold flex items-center"><BrainCircuit size={16} className="mr-2" /> AI-Powered Task Allocation</h3>
                <p className="text-sm">Our AI system matches tasks with the most suitable people or AI agents based on their skills, experience, and interests.</p>
            </div>
            <div className="flex">
                <div className="w-1/2 pr-2">
                    <h3 className="font-bold mb-2">Tasks</h3>
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            className={`p-2 mb-2 rounded ${highlightedTask === task.id ? 'bg-yellow-200 dark:bg-yellow-800' : 'bg-gray-100 dark:bg-gray-700'}`}
                            onMouseEnter={() => handleTaskHover(task.id)}
                            onMouseLeave={() => handleTaskHover(null)}
                        >
                            <div className="font-medium">{task.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Skills: {task.skills.join(', ')}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-1/2 pl-2">
                    <h3 className="font-bold mb-2">Agents</h3>
                    {agents.map(agent => (
                        <div
                            key={agent.id}
                            className={`p-2 mb-2 rounded ${highlightedTask && allocations[highlightedTask] === agent.id ? 'bg-green-200 dark:bg-green-800' : 'bg-gray-100 dark:bg-gray-700'}`}
                        >
                            <div className="font-medium flex items-center">
                                {agent.type === 'human' ? <User size={16} className="mr-1" /> : <Bot size={16} className="mr-1" />}
                                {agent.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Skills: {agent.skills.join(', ')}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Experience: {agent.experience} years
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Interests: {agent.interests.join(', ')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskAllocationVisualizer;