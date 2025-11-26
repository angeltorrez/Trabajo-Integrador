import axios from "axios";
import Create from "../Create";
import { useEffect, useState } from "react";
import { BsCheckCircleFill, BsCircleFill, BsTrashFill } from "react-icons/bs";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

type Todo = { _id: string; task: string; completed: boolean; role?: string };

const Dashboard = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [legajo, setLegajo] = useState("");
  const [rol, setRol] = useState("");

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const authResp = await axios.get("http://localhost:3001/dashboard");
        if (authResp.data?.valid) {
          setMessage(authResp.data.message || "");
          setLegajo(authResp.data.legajo || "");
          setRol(authResp.data.rol || "");
        } else {
          navigate("/");
          return;
        }

        const todosResp = await axios.get("http://localhost:3001/get");
        setTodos(
          Array.isArray(todosResp.data)
            ? todosResp.data.map((t: any) => ({ _id: String(t._id), task: t.task, completed: !!t.completed, role: t.role || '' }))
            : []
        );
      } catch (err: any) {
        console.error("Dashboard load error:", err);
        setError("No se pudieron cargar los datos. Intente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleToggle = async (id: string) => {
    try {
      await axios.put(`http://localhost:3001/update/${id}`);
      setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, completed: true } : t)));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/delete/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar legajo={legajo} rol={rol} />

      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Panel de Tareas</h1>
          <p className="text-sm text-gray-500">{message}</p>
        </div>

        <section className="mb-6">
          <Create onAdd={(todo) => setTodos((prev) => [todo, ...prev])} />
        </section>

        <section>
          {loading ? (
            <div className="text-gray-600">Cargando tareas...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : todos.length === 0 ? (
            <div className="text-gray-600">No hay tareas para mostrar</div>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li key={todo._id} className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleToggle(todo._id)}
                      aria-label={todo.completed ? "Marcar como pendiente" : "Marcar como completado"}
                      className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      {todo.completed ? <BsCheckCircleFill className="h-6 w-6" /> : <BsCircleFill className="h-6 w-6" />}
                    </button>
                    <p className={todo.completed ? "text-gray-500 line-through" : "text-gray-800"}>{todo.task}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">{todo.role || rol || '—'}</span>
                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                      aria-label="Eliminar tarea"
                    >
                      <BsTrashFill className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;