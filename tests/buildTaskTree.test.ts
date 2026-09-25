/**
 * @jest-environment node
 */
import { buildTaskTree, TaskTreeNode } from "@/lib/tasks/buildTaskTree"

type Task = { id: string; name: string }

const task = (id: string): Task => ({ id, name: `Task ${id}` })

// Reduces a tree to nested ids, so the assertions stay short.
type Shape = { id: string; children: Shape[] }
const shape = (nodes: TaskTreeNode<Task>[]): Shape[] =>
  nodes.map((node) => ({
    id: node.id,
    children: shape(node.childTasks.map(({ child }) => child)),
  }))

describe("buildTaskTree", () => {
  it("nests subtasks under their parents and keeps link order", () => {
    const tasks = ["goal", "a", "b", "a1"].map(task)
    const tree = buildTaskTree(tasks, [
      { parentId: "goal", childId: "a" },
      { parentId: "goal", childId: "b" },
      { parentId: "a", childId: "a1" },
    ])
    expect(shape(tree)).toEqual([
      {
        id: "goal",
        children: [
          { id: "a", children: [{ id: "a1", children: [] }] },
          { id: "b", children: [] },
        ],
      },
    ])
  })

  it("keeps the task fields on each node", () => {
    const [root] = buildTaskTree([task("goal")], [])
    expect(root.name).toBe("Task goal")
    expect(root.childTasks).toEqual([])
  })

  it("returns every task without a parent as a root", () => {
    const tree = buildTaskTree([task("x"), task("y")], [])
    expect(shape(tree).map(({ id }) => id)).toEqual(["x", "y"])
  })

  it("ignores links to tasks that are not in the list", () => {
    const tree = buildTaskTree([task("goal")], [
      { parentId: "goal", childId: "missing" },
    ])
    expect(shape(tree)).toEqual([{ id: "goal", children: [] }])
  })

  it("stops at a link back to an ancestor instead of recursing forever", () => {
    const tasks = ["goal", "a", "b"].map(task)
    const tree = buildTaskTree(tasks, [
      { parentId: "goal", childId: "a" },
      { parentId: "a", childId: "b" },
      { parentId: "b", childId: "a" },
    ])
    expect(shape(tree)).toEqual([
      {
        id: "goal",
        children: [{ id: "a", children: [{ id: "b", children: [] }] }],
      },
    ])
  })
})
