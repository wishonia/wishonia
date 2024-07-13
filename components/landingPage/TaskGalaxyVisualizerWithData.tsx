"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Check, Clock, AlertTriangle, Plus, Users } from 'lucide-react';

interface Task {
    id: string;
    name: string;
    description?: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
    subtasks?: Task[];
    dependencies?: string[];
    skills?: string[];
    decompositionNotes?: string;
}

interface TaskNodeProps {
    task: Task;
    level: number;
    onStatusChange: (id: string, newStatus: Task['status']) => void;
    onAddSubtask: (parentId: string) => void;
    onUpdateTask: (updatedTask: Task) => void;
}

const TaskNode: React.FC<TaskNodeProps> = ({ task, level, onStatusChange, onAddSubtask, onUpdateTask }) => {
    const [isExpanded, setIsExpanded] = useState(level < 2);
    const [isEditing, setIsEditing] = useState(false);

    const getStatusIcon = (status: Task['status']) => {
        switch (status) {
            case 'completed':
                return <Check className="text-green-500 dark:text-green-400" />;
            case 'in-progress':
                return <Clock className="text-blue-500 dark:text-blue-400" />;
            case 'blocked':
                return <AlertTriangle className="text-red-500 dark:text-red-400" />;
            default:
                return <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"></div>;
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onStatusChange(task.id, e.target.value as Task['status']);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedTask: Task = {
            ...task,
            name: formData.get('task') as string,
            description: formData.get('description') as string,
            skills: (formData.get('skills') as string).split(',').map(skill => skill.trim()),
            dependencies: (formData.get('dependencies') as string).split(',').map(dep => dep.trim()),
            decompositionNotes: formData.get('decompositionNotes') as string,
        };
        onUpdateTask(updatedTask);
        setIsEditing(false);
    };

    return (
        <div className="mb-4 p-2 border border-gray-200 dark:border-gray-700 rounded">
            <div className="flex items-center">
                <div style={{ width: `${level * 20}px` }} />
                {task.subtasks && task.subtasks.length > 0 && (
                    <button onClick={() => setIsExpanded(!isExpanded)} className="mr-2 focus:outline-none">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                )}
                <div className="mr-2">{getStatusIcon(task.status)}</div>
                <div className="flex-grow font-medium">{task.name}</div>
                <select
                    value={task.status}
                    onChange={handleStatusChange}
                    className="ml-2 p-1 text-sm border rounded bg-transparent dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                >
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="blocked">Blocked</option>
                </select>
                <button onClick={handleEdit} className="ml-2 p-1 text-sm border rounded">Edit</button>
                <button onClick={() => onAddSubtask(task.id)} className="ml-2 p-1 text-sm border rounded"><Plus size={16} /></button>
            </div>
            {isEditing ? (
                <form onSubmit={handleSave} className="mt-2">
                    <input name="task" defaultValue={task.name} className="w-full p-1 mb-2 border rounded" />
                    <textarea name="description" defaultValue={task.description} className="w-full p-1 mb-2 border rounded" placeholder="Description" />
                    <input name="skills" defaultValue={task.skills?.join(', ')} className="w-full p-1 mb-2 border rounded" placeholder="Required skills (comma-separated)" />
                    <input name="dependencies" defaultValue={task.dependencies?.join(', ')} className="w-full p-1 mb-2 border rounded" placeholder="Dependencies (comma-separated)" />
                    <textarea name="decompositionNotes" defaultValue={task.decompositionNotes} className="w-full p-1 mb-2 border rounded" placeholder="Decomposition notes" />
                    <button type="submit" className="p-1 text-sm border rounded">Save</button>
                </form>
            ) : (
                <>
                    {task.description && <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{task.description}</div>}
                    {task.skills && task.skills.length > 0 && (
                        <div className="mt-1 text-sm">
                            <strong>Skills:</strong> {task.skills.join(', ')}
                        </div>
                    )}
                    {task.dependencies && task.dependencies.length > 0 && (
                        <div className="mt-1 text-sm">
                            <strong>Dependencies:</strong> {task.dependencies.join(', ')}
                        </div>
                    )}
                    {task.decompositionNotes && (
                        <div className="mt-1 text-sm">
                            <strong>Decomposition Notes:</strong> {task.decompositionNotes}
                        </div>
                    )}
                </>
            )}
            {isExpanded && task.subtasks && (
                <div className="ml-6 mt-2">
                    {task.subtasks.map((subtask) => (
                        <TaskNode
                            key={subtask.id}
                            task={subtask}
                            level={level + 1}
                            onStatusChange={onStatusChange}
                            onAddSubtask={onAddSubtask}
                            onUpdateTask={onUpdateTask}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const ActionableTaskStrategyVisualizer: React.FC = () => {
    let taskHierarchy = {
        id: '1',
        name: "Create AI Drug Discovery Platform",
        status: 'in-progress',
        description: "Develop a comprehensive platform for AI-driven drug discovery",
        decompositionNotes: "Broken down by goal decomposition agents into main platform components",
        subtasks: [
            {
                id: '1.1',
                name: "Develop Platform Infrastructure",
                status: 'in-progress',
                skills: ["Cloud Architecture", "Database Design", "Security"],
                decompositionNotes: "Further decomposed based on technical requirements and best practices",
                subtasks: [
                    {
                        id: '1.1.1',
                        name: "Design Data Storage",
                        status: 'completed',
                        description: "Create a scalable and secure data storage system",
                        skills: ["Database Design", "Data Modeling"],
                        dependencies: ["Technology Stack Decision"],
                        decompositionNotes: "Broken down into specific database tasks by data architecture specialist",
                        subtasks: [
                            { id: '1.1.1.1', name: "Choose Technology", status: 'completed', skills: ["Database Comparison"] },
                            { id: '1.1.1.2', name: "Design Schema", status: 'completed', skills: ["Data Modeling"] },
                            { id: '1.1.1.3', name: "Set Up Security", status: 'completed', skills: ["Database Security"] },
                            { id: '1.1.1.4', name: "Implement Backup", status: 'in-progress', skills: ["Disaster Recovery"] }
                        ]
                    },
                    {
                        id: '1.1.2',
                        name: "Build Computation Infrastructure",
                        status: 'in-progress',
                        description: "Set up high-performance computing resources for AI model training",
                        skills: ["Cloud Computing", "HPC"],
                        dependencies: ["Data Storage Design"]
                    }
                ]
            },
            {
                id: '1.2',
                name: "Develop AI Models",
                status: 'not-started',
                description: "Create and train AI models for drug discovery",
                skills: ["Machine Learning", "Bioinformatics"],
                dependencies: ["Platform Infrastructure"],
                decompositionNotes: "Tasks identified by AI research team and goal decomposition agents",
                subtasks: [
                    { id: '1.2.1', name: "Data Preprocessing", status: 'not-started', skills: ["Data Cleaning", "Feature Engineering"] },
                    { id: '1.2.2', name: "Model Selection", status: 'not-started', skills: ["ML Algorithms"] },
                    { id: '1.2.3', name: "Training Pipeline", status: 'not-started', skills: ["ML Ops"] },
                    { id: '1.2.4', name: "Evaluation Metrics", status: 'not-started', skills: ["ML Evaluation"] }
                ]
            },
            {
                id: '1.3',
                name: "Create User Interface",
                status: 'blocked',
                description: "Develop an intuitive user interface for the platform",
                skills: ["UI/UX Design", "Frontend Development"],
                dependencies: ["AI Models", "Platform Infrastructure"],
                decompositionNotes: "Broken down into design and implementation tasks by UX team and goal decomposition agents",
                subtasks: [
                    { id: '1.3.1', name: "Design UX/UI", status: 'in-progress', skills: ["UI/UX Design"] },
                    { id: '1.3.2', name: "Implement Frontend", status: 'blocked', skills: ["Frontend Development"], dependencies: ["Design UX/UI"] },
                    { id: '1.3.3', name: "Integrate Backend", status: 'not-started', skills: ["Full-stack Development"], dependencies: ["Implement Frontend", "Platform Infrastructure"] }
                ]
            }
        ]
    } as Task;
    const [tasks, setTasks] = useState<Task>(taskHierarchy);

    const handleStatusChange = (id: string, newStatus: Task['status']) => {
        const updateTaskStatus = (task: Task): Task => {
            if (task.id === id) {
                return { ...task, status: newStatus };
            }
            if (task.subtasks) {
                return {
                    ...task,
                    subtasks: task.subtasks.map(updateTaskStatus)
                };
            }
            return task;
        };

        setTasks(updateTaskStatus(tasks));
    };

    const handleAddSubtask = (parentId: string) => {
        const addSubtask = (task: Task): Task => {
            if (task.id === parentId) {
                const newSubtask: Task = {
                    id: `${task.id}.${(task.subtasks?.length ?? 0) + 1}`,
                    name: "New Subtask",
                    status: 'not-started',
                };
                return {
                    ...task,
                    subtasks: [...(task.subtasks ?? []), newSubtask]
                };
            }
            if (task.subtasks) {
                return {
                    ...task,
                    subtasks: task.subtasks.map(addSubtask)
                };
            }
            return task;
        };

        setTasks(addSubtask(tasks));
    };

    const handleUpdateTask = (updatedTask: Task) => {
        const updateTask = (task: Task): Task => {
            if (task.id === updatedTask.id) {
                return updatedTask;
            }
            if (task.subtasks) {
                return {
                    ...task,
                    subtasks: task.subtasks.map(updateTask)
                };
            }
            return task;
        };

        setTasks(updateTask(tasks));
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-4xl mx-auto my-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">AI Drug Discovery Platform Strategy</h2>
            <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 rounded">
                <h3 className="font-bold flex items-center"><Users size={16} className="mr-2" /> Goal Decomposition Agents</h3>
                <p className="text-sm">These agents help break down chosen solutions into smaller, actionable tasks by identifying necessary steps, potential dependencies, and required skills for each task.</p>
            </div>
            <TaskNode
                task={tasks}
                level={0}
                onStatusChange={handleStatusChange}
                onAddSubtask={handleAddSubtask}
                onUpdateTask={handleUpdateTask}
            />
        </div>
    );
};

export default ActionableTaskStrategyVisualizer;