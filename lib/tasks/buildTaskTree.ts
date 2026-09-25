// A task with its subtasks nested under childTasks, in the shape the task
// tree UI reads.
export type TaskTreeNode<T> = T & { childTasks: { child: TaskTreeNode<T> }[] }

// Builds the task tree from flat tasks and parent-child links. Tasks without
// a parent become roots. Links to unknown tasks are ignored, and a link back
// to an ancestor is skipped, so a cycle cannot recurse forever.
export function buildTaskTree<T extends { id: string }>(
  tasks: T[],
  relationships: { parentId: string; childId: string }[]
): TaskTreeNode<T>[] {
  const tasksById = new Map(tasks.map((task) => [task.id, task]))
  const childIdsByParent = new Map<string, string[]>()
  for (const { parentId, childId } of relationships) {
    const childIds = childIdsByParent.get(parentId) ?? []
    childIds.push(childId)
    childIdsByParent.set(parentId, childIds)
  }

  const build = (task: T, ancestors: Set<string>): TaskTreeNode<T> => {
    const path = new Set(ancestors).add(task.id)
    return {
      ...task,
      childTasks: (childIdsByParent.get(task.id) ?? [])
        .filter((childId) => !path.has(childId))
        .map((childId) => tasksById.get(childId))
        .filter((child): child is T => child !== undefined)
        .map((child) => ({ child: build(child, path) })),
    }
  }

  const childIds = new Set(relationships.map(({ childId }) => childId))
  return tasks
    .filter((task) => !childIds.has(task.id))
    .map((task) => build(task, new Set()))
}
