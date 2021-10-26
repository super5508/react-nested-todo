import { useState, useCallback } from "react";
import TaskRenderer from "../components/TaskRenderer";
import { ITask } from "../types";

const TasksPage = () => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [taskTree, setTaskTree] = useState<Record<number, number[]>>({ 0: [] });
  const [dragId, setDragId] = useState(-1);
  const [uniqueId, setUniqueId] = useState(1);

  const onNewTask = useCallback(() => {
    setTasks((prevTasks) => {
      return [
        ...prevTasks,
        {
          id: uniqueId,
          children: [],
          completed: false,
          title: newTaskTitle,
        },
      ];
    });
    setTaskTree((prevTaskTree) => {
      return {
        ...prevTaskTree,
        [uniqueId]: [],
        // eslint-disable-next-line
        [0]: [...prevTaskTree[0], uniqueId],
      };
    });
    setNewTaskTitle("");
    setUniqueId((uId) => uId + 1);
  }, [setTasks, newTaskTitle, setNewTaskTitle, uniqueId, setUniqueId]);

  const onToggle = useCallback(
    (taskId: number) => {
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              completed: !task.completed,
            };
          }
          return task;
        });
      });
    },
    [setTasks]
  );

  const onDragEnd = useCallback(
    (dropId: number) => {
      if (dragId !== dropId) {
        setTaskTree((prevTree) => {
          const newTree = { ...prevTree };
          Object.keys(newTree).forEach((key: string) => {
            if (+key === dropId && !newTree[+key].includes(dragId)) {
              newTree[+key] = [...newTree[+key], dragId];
            }
            if (+key !== dropId && newTree[+key].includes(dragId)) {
              newTree[+key] = newTree[+key].filter((tId) => tId !== dragId);
            }
          });
          return newTree;
        });
      }
      setDragId(-1);
    },
    [dragId, setTaskTree]
  );

  return (
    <div>
      <section>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button onClick={onNewTask} disabled={!newTaskTitle}>
          Add
        </button>
      </section>

      <section>
        {taskTree[0].map((taskId) => (
          <TaskRenderer
            taskId={taskId}
            tasks={tasks}
            taskTree={taskTree}
            onToggle={onToggle}
            onDragStart={setDragId}
            onDragEnd={onDragEnd}
            key={taskId.toString()}
          />
        ))}
      </section>
    </div>
  );
};

export default TasksPage;
