import { UserCircle, Bell } from 'lucide-react'
import React from 'react'

export default function Header() {
    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold">FDA</div>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="#" className="text-primary">Home</a></li>
                        <li><a href="#" className="text-muted-foreground">About</a></li>
                        <li><a href="#" className="text-muted-foreground">Contact</a></li>
                    </ul>
                </nav>
                <div className="flex items-center space-x-4">
                    <UserCircle className="text-muted-foreground" />
                    <Bell className="text-muted-foreground" />
                </div>
            </div>
        </header>
    )
}