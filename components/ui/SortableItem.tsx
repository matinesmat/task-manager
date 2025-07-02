'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities'; 
import { Task } from '@/types/type';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';


type Props = {
  task: Task;
  onDelete: (id: string) => void;
};

export default function SortableItem({ task, onDelete }: Props) {
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
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-4 flex items-start gap-2"
    >
      <p className="flex-1 font-medium">{task.title}</p>
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 size={16} />
      </button>
    </Card>
  );
}
