"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Circle, Square, Triangle } from "lucide-react"

export default function Component() {
    const [step, setStep] = useState(0)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)
    const [testStarted, setTestStarted] = useState(false)

    // Memory Task
    const [sequence, setSequence] = useState("")
    const [userSequence, setUserSequence] = useState("")
    const [showSequence, setShowSequence] = useState(false)

    // Attention Task
    const [shapes, setShapes] = useState<string[]>([])
    const [targetShape, setTargetShape] = useState("")
    const [shapeCount, setShapeCount] = useState(0)

    // Problem-solving Task
    const [equation, setEquation] = useState({ num1: 0, num2: 0, operator: "" })
    const [answer, setAnswer] = useState("")

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (testStarted && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
        } else if (timeLeft === 0 && testStarted) {
            handleNextStep()
        }
        return () => clearTimeout(timer)
    }, [timeLeft, testStarted])

    const startTest = () => {
        console.log("Starting test")
        setTestStarted(true)
        setStep(1)
        startMemoryTask()
    }

    const handleNextStep = () => {
        console.log("Moving to next step", step)
        switch (step) {
            case 1:
                checkMemoryTask()
                break
            case 2:
                checkAttentionTask()
                break
            case 3:
                checkProblemSolvingTask()
                break
            default:
                endTest()
        }
    }

    const startMemoryTask = () => {
        console.log("Starting memory task")
        const newSequence = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join("")
        setSequence(newSequence)
        setShowSequence(true)
        setTimeLeft(5)
        setTimeout(() => {
            setShowSequence(false)
            setTimeLeft(10)
        }, 5000)
    }

    const checkMemoryTask = () => {
        console.log("Checking memory task")
        if (userSequence === sequence) {
            setScore(prev => prev + 1)
        }
        setStep(2)
        startAttentionTask()
    }

    const startAttentionTask = () => {
        console.log("Starting attention task")
        const shapeOptions = ["circle", "square", "triangle"]
        const newShapes = Array.from({ length: 20 }, () => shapeOptions[Math.floor(Math.random() * 3)])
        setShapes(newShapes)
        setTargetShape(shapeOptions[Math.floor(Math.random() * 3)])
        setTimeLeft(15)
    }

    const checkAttentionTask = () => {
        console.log("Checking attention task")
        const correctCount = shapes.filter(shape => shape === targetShape).length
        if (parseInt(shapeCount.toString()) === correctCount) {
            setScore(prev => prev + 1)
        }
        setStep(3)
        startProblemSolvingTask()
    }

    const startProblemSolvingTask = () => {
        console.log("Starting problem-solving task")
        const operators = ["+", "-", "*"]
        const newEquation = {
            num1: Math.floor(Math.random() * 10) + 1,
            num2: Math.floor(Math.random() * 10) + 1,
            operator: operators[Math.floor(Math.random() * 3)]
        }
        setEquation(newEquation)
        setTimeLeft(20)
    }

    const checkProblemSolvingTask = () => {
        console.log("Checking problem-solving task")
        let correctAnswer
        switch (equation.operator) {
            case "+":
                correctAnswer = equation.num1 + equation.num2
                break
            case "-":
                correctAnswer = equation.num1 - equation.num2
                break
            case "*":
                correctAnswer = equation.num1 * equation.num2
                break
        }
        if (parseInt(answer) === correctAnswer) {
            setScore(prev => prev + 1)
        }
        setStep(4)
    }

    const endTest = () => {
        console.log("Ending test")
        setTestStarted(false)
    }

    const renderShape = (shape: string) => {
        switch (shape) {
            case "circle":
                return <Circle className="w-6 h-6" />
            case "square":
                return <Square className="w-6 h-6" />
            case "triangle":
                return <Triangle className="w-6 h-6" />
        }
    }

    const resetTest = () => {
        console.log("Resetting test")
        setStep(0)
        setScore(0)
        setTestStarted(false)
        setUserSequence("")
        setShapeCount(0)
        setAnswer("")
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Cognitive Performance Test</CardTitle>
                <CardDescription>Test your memory, attention, and problem-solving skills</CardDescription>
            </CardHeader>
            <CardContent>
                {!testStarted && step === 0 && (
                    <Button onClick={startTest}>Start Test</Button>
                )}
                {testStarted && (
                    <div className="space-y-4">
                        <div className="text-2xl font-bold">Time left: {timeLeft}s</div>
                        {step === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Memory Task</h2>
                                {showSequence && <div className="text-3xl font-bold">{sequence}</div>}
                                {!showSequence && (
                                    <>
                                        <Label htmlFor="userSequence">Enter the number sequence you saw:</Label>
                                        <Input
                                            id="userSequence"
                                            value={userSequence}
                                            onChange={(e) => setUserSequence(e.target.value)}
                                            maxLength={5}
                                        />
                                    </>
                                )}
                            </div>
                        )}
                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Attention Task</h2>
                                <p>Count how many {targetShape}s you see:</p>
                                <div className="grid grid-cols-10 gap-2">
                                    {shapes.map((shape, index) => (
                                        <div key={index}>{renderShape(shape)}</div>
                                    ))}
                                </div>
                                <Label htmlFor="shapeCount">Enter the count:</Label>
                                <Input
                                    id="shapeCount"
                                    type="number"
                                    value={shapeCount}
                                    onChange={(e) => setShapeCount(parseInt(e.target.value))}
                                />
                            </div>
                        )}
                        {step === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Problem-solving Task</h2>
                                <p className="text-2xl">
                                    {equation.num1} {equation.operator} {equation.num2} = ?
                                </p>
                                <Label htmlFor="answer">Enter your answer:</Label>
                                <Input
                                    id="answer"
                                    type="number"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                            </div>
                        )}
                        {step < 4 && timeLeft > 0 && (
                            <Button onClick={handleNextStep}>Next</Button>
                        )}
                    </div>
                )}
                {step === 4 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Test Complete!</h2>
                        <p className="text-xl">Your score: {score} out of 3</p>
                        <Button onClick={resetTest}>Restart Test</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}