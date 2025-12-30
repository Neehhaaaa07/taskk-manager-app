import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import TaskForm from '../components/TaskForm';
import { toast } from 'react-toastify';
import { 
    FaTasks, FaSignOutAlt, FaDatabase, FaPlus, FaEye, FaKey
} from 'react-icons/fa';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});
    const [editingTask, setEditingTask] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const fetchTasks = async () => {
        try {
            const res = await api.get(`/tasks?page=${page}&limit=10`);
            setTasks(res.data.docs);
            setPageInfo(res.data);
        } catch (err) { 
            if(err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/'); 
            }
        }
    };

    useEffect(() => { fetchTasks(); }, [page]);

    // Req #1 & #4: Create and Edit Task
    const handleSaveTask = async (formData) => {
        try {
            if (editingTask) {
                const { _id, user, createdAt, updatedAt, __v, ...cleanData } = formData;
                await api.put(`/tasks/${editingTask._id}`, cleanData);
                toast.success("Task updated");
                setEditingTask(null);
            } else {
                await api.post('/tasks', formData);
                toast.success("Task created");
            }
            setShowForm(false);
            fetchTasks(); 
        } catch (err) { toast.error("Operation failed"); }
    };

    // Req #5: Task Deletion
    const handleDelete = async (id) => {
        if(window.confirm("Delete this task permanently?")) {
            try {
                await api.delete(`/tasks/${id}`);
                fetchTasks();
                toast.success("Task deleted");
            } catch (err) { toast.error("Failed to delete"); }
        }
    };

    // Req #6: Task Status Update
    const handleStatus = async (task) => {
        try {
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
            await api.put(`/tasks/${task._id}`, { ...task, status: newStatus });
            toast.info(`Task marked as ${newStatus}`);
        } catch (err) { 
            fetchTasks(); 
            toast.error("Status update failed"); 
        }
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Req #9: Visual Representation (Color Coding)
    const getPriorityColor = (p) => {
        if(p === 'high') return 'bg-red-100 text-red-700 border-red-200';
        if(p === 'medium') return 'bg-orange-100 text-orange-700 border-orange-200';
        return 'bg-green-100 text-green-700 border-green-200';
    };

    return (
        <div className="min-h-screen flex bg-[#F9FBFA]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <FaTasks className="text-[#00684A] text-xl mr-2" />
                    <span className="font-bold text-[#00684A] text-lg tracking-tight">Task Manager</span>
                </div>
                <div className="p-4 space-y-1 overflow-y-auto flex-grow text-sm font-medium text-gray-600">
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-4">Workspace</div>
                    <div className="flex items-center gap-3 px-3 py-2 bg-[#E3FBE3] text-[#00684A] rounded-lg cursor-pointer border-l-4 border-[#00684A]">
                        <FaDatabase /> My Tasks
                    </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                    <button onClick={() => {localStorage.clear(); navigate('/');}} className="flex items-center gap-3 w-full px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
                <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-serif-app text-[#1C2D38] mb-2">My Tasks</h1>
                        <p className="text-sm text-gray-500">Manage your project deliverables and timelines.</p>
                    </div>
                    <button onClick={() => { setEditingTask(null); setShowForm(!showForm); }} className="bg-[#00684A] hover:bg-[#00503a] text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition-all flex items-center gap-2">
                        <FaPlus size={12} /> {showForm ? 'Close Form' : 'Add New Task'}
                    </button>
                </div>

                {showForm && (
                    <div className="mb-8">
                        <TaskForm onSubmit={handleSaveTask} initialData={editingTask} onCancel={() => setShowForm(false)} />
                    </div>
                )}

                {/* Req #2: Task List with Ajax */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-[#FFEFD8] border-l-4 border-[#FFB25B] p-3 flex items-start gap-3">
                        <div className="text-[#975F0E] mt-0.5"><FaKey size={14} /></div>
                        <p className="text-xs text-[#664D03]"><strong>Tip:</strong> Click the status badge to toggle between Pending and Active.</p>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F9FBFA] border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Task Title</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tasks.map(task => (
                                <tr key={task._id} className="hover:bg-[#F5F6F7] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[#1C2D38] text-sm">{task.title}</div>
                                        <div className="text-xs text-gray-400 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                                    </td>
                                    
                                    {/* Req #8 & #9: Priority Visuals */}
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    
                                    {/* Req #6: Status Toggle */}
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleStatus(task)} className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border cursor-pointer ${task.status === 'completed' ? 'bg-[#E3FBE3] text-[#00684A] border-[#C3E6CB]' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'completed' ? 'bg-[#00684A]' : 'bg-gray-400'}`}></div>
                                            {task.status === 'completed' ? 'Active' : 'Pending'}
                                        </button>
                                    </td>
                                    
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Req #3: View Details */}
                                            <button onClick={() => navigate(`/task/${task._id}`)} className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200 uppercase"><FaEye /></button>
                                            
                                            {/* Req #4: Edit */}
                                            <button onClick={() => handleEditClick(task)} className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-600 hover:text-gray-900 hover:border-gray-400 uppercase">Edit</button>
                                            
                                            {/* Req #5: Delete */}
                                            <button onClick={() => handleDelete(task._id)} className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-600 hover:text-red-600 hover:border-red-200 uppercase">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Req #2: Pagination */}
                <div className="flex justify-end mt-4 gap-2">
                    <button disabled={!pageInfo.hasPrevPage} onClick={() => setPage(page - 1)} className="px-3 py-1 border border-gray-300 rounded text-xs font-bold text-gray-600 disabled:opacity-50 hover:bg-white">Prev</button>
                    <button disabled={!pageInfo.hasNextPage} onClick={() => setPage(page + 1)} className="px-3 py-1 border border-gray-300 rounded text-xs font-bold text-gray-600 disabled:opacity-50 hover:bg-white">Next</button>
                </div>
            </main>
        </div>
    );
};
export default Dashboard;