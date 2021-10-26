import { useMemo } from "react";
import { ITask } from "../types";

import "./style.css";

interface TaskRendererProps {
  taskId: number;
  tasks: ITask[];
  taskTree: Record<number, number[]>;
  onToggle: (taskId: number) => void;
  onDragStart: (taskId: number) => void;
  onDragEnd: (taskId: number) => void;
}

const TaskRenderer = ({
  taskTree,
  taskId,
  tasks,
  onToggle,
  onDragStart,
  onDragEnd,
}: TaskRendererProps) => {
  const task = useMemo(() => {
    return tasks.find((t) => t.id === taskId)!;
  }, [taskId, tasks]);

  return (
    <div
      className="task-item"
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart(task.id);
      }}
      onDrop={(e) => {
        e.stopPropagation();
        onDragEnd(task.id);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
      >
        {task.title} [{task.completed ? "X" : "-"}]
      </span>
      <div className="task-item sub-item">
        {taskTree[task.id].map((subTaskId) => (
          <TaskRenderer
            key={subTaskId.toString()}
            taskTree={taskTree}
            taskId={subTaskId}
            tasks={tasks}
            onToggle={onToggle}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskRenderer;
