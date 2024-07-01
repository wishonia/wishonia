"use client"

import React, { useState } from "react"

import { PollRandomGlobalProblems } from "./poll-random-global-problems"

const tasks = [
  {
    id: 2,
    title: "Compare two problems",
    //description:  "We'll show you two problems. Decide which one you think is more important.",
    component: <PollRandomGlobalProblems />,
  },
  {
    id: 3,
    title: "Propose a solution",
    description:
      "Think of a way to solve one of the problems you've seen and submit your solution.",
  },
  {
    id: 4,
    title: "Compare two solutions",
    description:
      "We'll show you two solutions to a problem. Choose which one you think is better.",
  },
  {
    id: 5,
    title: "Break down a solution",
    description:
      "Take a solution and break it down into three smaller, actionable tasks.",
  },
  {
    id: 6,
    title: "Complete a small task",
    description: "Choose a small task from our list and complete it.",
  },
  {
    id: 7,
    title: "Report on progress",
    description:
      "Tell us if you think the task you completed is helping to solve the bigger problem.",
  },
  {
    id: 8,
    title: "Suggest a new idea",
    description:
      "Come up with a new idea for solving a problem and add it to our list.",
  },
  {
    id: 9,
    title: "Review the process",
    description:
      "Look back at all the steps you've completed. Do you understand how Wishocracy works now?",
  },
]

const TodoItem: React.FC<{
  task: (typeof tasks)[0]
  onComplete: () => void
}> = ({ task, onComplete }) => (
  <div className="mb-4 border-4 border-black p-4">
    <h3 className="mb-2 text-2xl font-bold">{task.title}</h3>
    <p className="mb-4">{task.description}</p>
    <button
      onClick={onComplete}
      className="border-2 border-black bg-black px-4 py-2 text-white transition-colors hover:bg-white hover:text-black"
    >
      Complete Task
    </button>
  </div>
)

const MetaTodoList: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<number[]>([])

  const handleComplete = (taskId: number) => {
    setCompletedTasks([...completedTasks, taskId])
  }

  return (
    <div className="mb-16 border-8 border-black p-8">
      <h2 className="mb-8 bg-black p-4 text-center text-4xl font-bold uppercase text-white">
        HOW IT WORKS
      </h2>
      <div>
        {tasks
          .filter((task) => !completedTasks.includes(task.id))
          .map(
            (
              task // Filter out completed tasks
            ) => (
              <TodoItem
                key={task.id}
                task={task}
                onComplete={() => handleComplete(task.id)}
              />
            )
          )}
      </div>
      <div className="mt-8 text-center">
        <p className="text-2xl font-bold">
          Tasks Completed: {completedTasks.length} / {tasks.length}
        </p>
        {completedTasks.length === tasks.length && (
          <p className="mt-4 bg-black p-4 text-2xl text-white">
            Congratulations! You've experienced the entire Wishocracy process!
          </p>
        )}
      </div>
    </div>
  )
}

export default MetaTodoList
