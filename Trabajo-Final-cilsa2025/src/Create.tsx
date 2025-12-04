import { useState } from "react";
import axios from "axios";

type Props = {
  onAdd?: (todo: { _id: string; task: string; completed: boolean; role?: string }) => void;
};

const Create = ({ onAdd }: Props) => {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = task.trim();
    if (!trimmed) {
      setError("La tarea no puede estar vacía");
      return;
    }

    try {
      setLoading(true);
      const resp = await axios.post("http://localhost:3001/add", { task: trimmed });
      const created = resp.data;
      if (onAdd) {
        onAdd({ _id: String(created._id), task: created.task, completed: !!created.completed, role: created.role });
      } else {
        // Fallback: reload if no callback provided
        location.reload();
      }
      setTask("");
    } catch (err) {
      console.error("Create task error:", err);
      setError("No se pudo crear la tarea. Intente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex items-center space-x-2">
      <div className="flex-1">
        <label htmlFor="new-task" className="sr-only">Nueva tarea</label>
        <input
          id="new-task"
          type="text"
          placeholder="Describa la tarea (ej: Revisar reporte mensual)"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 card-plain"
        />
        {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 btn-primary rounded-md disabled:opacity-60"
        >
          {loading ? "Agregando..." : "Agregar"}
        </button>
      </div>
    </form>
  );
};

export default Create;