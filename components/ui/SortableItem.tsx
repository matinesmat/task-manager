import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/app/dashboard/page';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2 } from 'lucide-react'; // Icons for drag & delete

export default function SortableItem({
  task,
  onDelete
}: {
  task: Task;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center"
    >
      {/* Drag handle only */}
      <span {...attributes} {...listeners} className="cursor-grab mr-2">
        <GripVertical size={18} />
      </span>

      {/* Task title */}
      <span className="flex-1">{task.title}</span>

      {/* Delete button (not draggable) */}
      <Button
  variant="ghost"
  className="text-red-600 hover:bg-red-50"
  size="icon"
  onClick={() => onDelete(task.id)}
>
  <Trash2 className="h-4 w-4" />
</Button>

    </div>
  );
}
