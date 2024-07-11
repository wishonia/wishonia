"use client"
import React, { useState } from 'react';
import { Lightbulb, AlertCircle, Cog, List, Send } from 'lucide-react';

type IdeaType = 'problem' | 'solution' | 'task' | 'other';

interface Idea {
    type: IdeaType;
    title: string;
    description: string;
}

const IdeaSubmissionHub: React.FC = () => {
    const [ideaType, setIdeaType] = useState<IdeaType>('problem');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [recentIdeas, setRecentIdeas] = useState<Idea[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newIdea: Idea = { type: ideaType, title, description };
        setRecentIdeas(prev => [newIdea, ...prev.slice(0, 2)]);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setTitle('');
            setDescription('');
        }, 3000);
    };

    const getIcon = (type: IdeaType) => {
        switch (type) {
            case 'problem': return <AlertCircle size={20} />;
            case 'solution': return <Lightbulb size={20} />;
            case 'task': return <Cog size={20} />;
            default: return <List size={20} />;
        }
    };

    return (
        <div className="p-4 rounded-lg shadow-md max-w-4xl mx-auto my-8">
            <h2 className="text-2xl font-bold mb-4">Idea Submission Hub</h2>
            <div className="mb-4 p-2 border rounded">
                <h3 className="font-bold flex items-center"><Lightbulb size={16} className="mr-2" /> New Ideas Welcome!</h3>
                <p className="text-sm">We encourage everyone to submit new problems, solutions, or tasks. Your ideas can make a difference!</p>
            </div>
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold">Idea Type</label>
                    <div className="flex space-x-2">
                        {(['problem', 'solution', 'task', 'other'] as IdeaType[]).map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setIdeaType(type)}
                                className={`px-3 py-2 rounded border ${ideaType === type ? 'border-2' : 'border'}`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="title" className="block mb-2 text-sm font-bold">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-2 text-sm font-bold">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                        rows={4}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 font-bold rounded-full border hover:border-2 focus:outline-none focus:ring-2"
                >
                    Submit Idea
                </button>
            </form>
            {submitted && (
                <div className="mb-4 p-2 border rounded">
                    <p className="text-sm font-bold">Thank you for your submission! Our team will review your idea shortly.</p>
                </div>
            )}
            <div>
                <h3 className="font-bold mb-2">Recent Submissions</h3>
                {recentIdeas.map((idea, index) => (
                    <div key={index} className="mb-2 p-2 border rounded">
                        <div className="flex items-center">
                            {getIcon(idea.type)}
                            <span className="ml-2 font-bold">{idea.title}</span>
                        </div>
                        <p className="text-sm mt-1">{idea.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IdeaSubmissionHub;