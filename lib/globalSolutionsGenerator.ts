export async function generateAllGlobalSolutions() {
    // Fetch all GlobalProblems
    const globalProblems = await prisma.globalProblem.findMany();

    // Generate solutions for each problem
    for (const globalProblem of globalProblems) {
        await generateSolutionsForProblem(globalProblem);
    }
}

async function decomposeSolutionToTasks(globalSolution: GlobalSolution) {
    // Use textCompletion to ask the LLM to provide a list of tasks to implement the solution
    const tasks = await jsonArrayCompletion(
        `List the tasks required to implement the solution "${globalSolution.name}" for the problem "${globalSolution.globalProblem.name}"`
    );

    // Create GlobalTask records for each task
    for (const taskName of tasks) {
        await prisma.globalTask.create({
            data: {
                name: taskName,
                globalSolutionId: globalSolution.id
            }
        });
    }
}

export async function decomposeAllSolutionsToTasks() {
    // Fetch all GlobalSolutions
    const globalSolutions = await prisma.globalSolution.findMany({
        include: {
            globalProblem: true
        }
    });

    // Decompose each solution into tasks
    for (const globalSolution of globalSolutions) {
        await decomposeSolutionToTasks(globalSolution);
    }
}