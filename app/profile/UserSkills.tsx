'use client'

import { User, Skill } from '@prisma/client'
import { X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


import { addUserSkill, removeUserSkill, searchSkills } from './skillActions'


type UserSkillWithSkill = {
    id: string;
    skillId: string;
    skill: Skill;
}

type UserSkillsProps = {
    user: User & { userSkills: UserSkillWithSkill[] };
}

export default function UserSkills({ user }: UserSkillsProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
    const [filteredSkills, setFilteredSkills] = useState<Skill[]>([])

    useEffect(() => {
        const fetchSkills = async () => {
            if (debouncedSearchTerm) {
                const skills = await searchSkills(debouncedSearchTerm)
                setFilteredSkills(skills.filter(skill => 
                    !user.userSkills.some(userSkill => userSkill.skillId === skill.id)
                ))
            } else {
                setFilteredSkills([])
            }
        }
        fetchSkills()
    }, [debouncedSearchTerm, user.userSkills])

    const handleAddSkill = async (skillName: string) => {
        if (skillName.trim()) {
            await addUserSkill(user.id, skillName.trim())
            setSearchTerm('')
        }
    }

    const handleRemoveSkill = async (skillId: string) => {
        await removeUserSkill(user.id, skillId)
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault() // Prevent form submission
            handleAddSkill(searchTerm)
        }
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search for a skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                {searchTerm && filteredSkills.length > 0 && (
                    <div className="absolute z-10 w-full border mt-1 rounded-md shadow-lg bg-background">
                        {filteredSkills.map((skill) => (
                            <div
                                key={skill.id}
                                className="p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                onClick={() => handleAddSkill(skill.name)}
                            >
                                {skill.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {user.userSkills.map((userSkill) => (
                    <div key={userSkill.id} className="flex items-center bg-opacity-10 rounded-full px-3 py-1">
                        <span>{userSkill.skill.name}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 p-0"
                            onClick={() => handleRemoveSkill(userSkill.skillId)}
                        >
                            <X size={16} />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}