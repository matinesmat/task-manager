'use client';

import { useEffect, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  closestCenter
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthProvider';
import SortableItem from '@/components/ui/SortableItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/* ---------- Task type ---------- */
export type Task = {
  id: string;
  title: string;
  status: 'todo' | 'pending' | 'done';
};

/* ---------- Droppable column wrapper ---------- */
function DroppableColumn({
  status,
  children
}: {
  status: Task['status'];
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className="bg-white p-4 rounded shadow">
      {children}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  /* ---- local task list ---- */
  const [tasks, setTasks] = useState<Task[]>([]);

  /* ---- add‑task form state (typed) ---- */
  const [newTask, setNewTask] = useState<{
    title: string;
    status: Task['status'];
  }>({ title: '', status: 'todo' });

  /* ---- fetch tasks once on mount ---- */
  useEffect(() => {
    if (!user) return;
    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => setTasks((data ?? []) as Task[]));
  }, [user]);

  /* ---- add new task ---- */
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTask.title.trim()) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: newTask.title,
        status: newTask.status,
        user_id: user.id
      })
      .select()
      .single();

    if (!error && data) {
      setTasks((prev) => [...prev, data as Task]);
      setNewTask({ title: '', status: 'todo' });
    }
  };

  /* ---- delete helper ---- */
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  /* ---- drag & drop sensors ---- */
  const sensors = useSensors(useSensor(PointerSensor));

  /* ---- on card drop ---- */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedId = active.id as string;

    /* 1‑ Determine target status */
    let newStatus: Task['status'] | undefined;
    if (['todo', 'pending', 'done'].includes(String(over.id))) {
      newStatus = over.id as Task['status']; // dropped on empty column
    } else {
      newStatus = tasks.find((t) => t.id === over.id)?.status; // dropped on another card
    }

    const task = tasks.find((t) => t.id === draggedId);
    if (!task || !newStatus || task.status === newStatus) return;

    /* 2‑ Update DB then local state */
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', draggedId)
      .select()
      .single();

    if (!error && data) {
      setTasks((prev) =>
        prev.map((t) => (t.id === draggedId ? (data as Task) : t))
      );
    }
  };

  /* ---- group tasks for each column ---- */
  const grouped = {
    todo: tasks.filter((t) => t.status === 'todo'),
    pending: tasks.filter((t) => t.status === 'pending'),
    done: tasks.filter((t) => t.status === 'done')
  };

  if (!user) return <p className="p-6">Please log in</p>;

  return (
    <div className="p-8 bg-neutral-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* ----- add‑task form ----- */}
      <form onSubmit={handleAddTask} className="flex gap-4 mb-8">
        <Input
          placeholder="New task"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <select
          value={newTask.status}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              status: e.target.value as Task['status']
            })
          }
          className="border rounded px-2"
        >
          <option value="todo">Todo</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
        <Button type="submit">Add</Button>
      </form>

      {/* ----- Kanban board ----- */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['todo', 'pending', 'done'] as const).map((status) => (
            <DroppableColumn key={status} status={status}>
              <h2 className="text-xl font-semibold capitalize mb-4">{status}</h2>

              <SortableContext
                items={grouped[status].map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {grouped[status].map((task) => (
                  <SortableItem
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>
            </DroppableColumn>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
