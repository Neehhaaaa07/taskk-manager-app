import { FaTrash, FaCheck, FaRegCircle, FaEdit, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TaskItem = ({ task, onDelete, onStatusChange, onEdit }) => {
    
    // Soft pastel badges
    const getPriorityBadge = (p) => {
        const styles = {
            high: "bg-rose-50 text-rose-500",
            medium: "bg-amber-50 text-amber-500",
            low: "bg-emerald-50 text-emerald-500"
        };
        return `px-3 py-1 rounded-full text-xs font-medium ${styles[p] || styles.low}`;
    };

    const isCompleted = task.status === 'completed';

    return (
        <div className={`group bg-white p-5 rounded-2xl border border-transparent hover:border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between ${isCompleted ? 'opacity-50' : ''}`}>
            
            <div className="flex items-center gap-5">
                <button 
                    onClick={() => onStatusChange(task)} 
                    className={`p-2 rounded-full transition-all ${isCompleted ? 'bg-emerald-100 text-emerald-500' : 'bg-slate-50 text-slate-300 hover:bg-sky-50 hover:text-sky-500'}`}
                >
                    {isCompleted ? <FaCheck size={12} /> : <FaRegCircle size={14} />}
                </button>

                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Link to={`/task/${task._id}`} className={`font-medium text-slate-700 hover:text-sky-600 transition-colors ${isCompleted ? 'line-through' : ''}`}>
                            {task.title}
                        </Link>
                        <span className={getPriorityBadge(task.priority)}>
                            {task.priority}
                        </span>
                    </div>
                    <div className="text-sm text-slate-400 font-light">
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                </div>
            </div>
            
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <Link to={`/task/${task._id}`} className="p-2 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors">
                    <FaEye />
                </Link>
                <button onClick={() => onEdit(task)} className="p-2 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                    <FaEdit />
                </button>
                <button onClick={() => onDelete(task._id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};
export default TaskItem;