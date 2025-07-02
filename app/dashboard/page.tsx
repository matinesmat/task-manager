'use client';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SortableItem from '@/components/ui/SortableItem';
import { Task } from '@/types/type';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [fetching, setFetching] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', status: 'todo' });

  // Drag & drop setup
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!user || loading) return;

    (async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

      if (!error) setTasks(data as Task[]);
      setFetching(false);
    })();
  }, [user, loading]);

  // Add new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: newTask.title,
        status: newTask.status,
        user_id: user!.id
      })
      .select()
      .single();

    if (!error) {
      setTasks((prev) => [...prev, data as Task]);
      setNewTask({ title: '', status: 'todo' });
    }
  };

  // Delete task
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle drag and drop between columns
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active) return;
    const activeId = active.id;
    const newStatus = over.id as Task['status'];

    const taskToUpdate = tasks.find((t) => t.id === activeId);
    if (!taskToUpdate || taskToUpdate.status === newStatus) return;

    const { data, error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', activeId)
      .select()
      .single();

    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === activeId ? (data as Task) : t))
      );
    }
  };

  const grouped = {
    todo: tasks.filter((t) => t.status === 'todo'),
    pending: tasks.filter((t) => t.status === 'pending'),
    done: tasks.filter((t) => t.status === 'done')
  };

  if (!user) return <p className="p-8 text-center">Please log in</p>;

  return (
    <div className="p-8 bg-neutral-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Add task form */}
      <form onSubmit={handleAddTask} className="flex gap-4 mb-8">
        <Input
          placeholder="New task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <select
          value={newTask.status}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              status: e.target.value as Task['status']
            })
          }
          className="rounded-md border border-gray-300 px-2 py-2"
        >
          <option value="todo">Todo</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
        <Button type="submit">Add</Button>
      </form>

      {/* Task board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['todo', 'pending', 'done'] as const).map((status) => (
            <div key={status} className="bg-white p-4 rounded shadow" id={status}>
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
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
