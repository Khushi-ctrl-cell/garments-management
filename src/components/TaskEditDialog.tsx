import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Task } from "@/hooks/useDatabase";

interface TaskEditDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
}

export const TaskEditDialog = ({ task, open, onOpenChange, onUpdateTask }: TaskEditDialogProps) => {
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task['priority'],
    assignee_id: "",
    due_date: "",
    status: "todo" as Task['status'],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        assignee_id: task.assignee_id || "",
        due_date: task.due_date || "",
        status: task.status,
      });
    }
  }, [task]);

  const handleSave = async () => {
    if (!task) return;
    
    setIsLoading(true);
    try {
      await onUpdateTask(task.id, editedTask);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (task) {
      setEditedTask({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        assignee_id: task.assignee_id || "",
        due_date: task.due_date || "",
        status: task.status,
      });
    }
    onOpenChange(false);
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Task Title</Label>
            <Input
              id="edit-title"
              placeholder="Enter task title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Enter task description"
              value={editedTask.description}
              onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={editedTask.priority} onValueChange={(value: Task['priority']) => setEditedTask({...editedTask, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editedTask.status} onValueChange={(value: Task['status']) => setEditedTask({...editedTask, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-assignee">Assignee</Label>
            <Input
              id="edit-assignee"
              placeholder="Assign to..."
              value={editedTask.assignee_id}
              onChange={(e) => setEditedTask({...editedTask, assignee_id: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-dueDate">Due Date</Label>
            <Input
              id="edit-dueDate"
              type="date"
              value={editedTask.due_date}
              onChange={(e) => setEditedTask({...editedTask, due_date: e.target.value})}
            />
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={handleSave} 
              className="flex-1 gradient-primary text-white"
              disabled={isLoading || !editedTask.title.trim()}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};