import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { FaArrowLeft } from 'react-icons/fa';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await api.get(`/tasks/${id}`);
                setTask(res.data);
            } catch (err) { navigate('/dashboard'); }
        };
        fetchTask();
    }, [id, navigate]);

    if (!task) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#F9FBFA] p-8 flex justify-center">
            <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow-sm p-8 h-fit">
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-[#00684A] mb-6 text-sm font-bold uppercase"><FaArrowLeft /> Back</Link>
                <h1 className="font-serif-app text-3xl font-bold text-[#1C2D38] mb-4">{task.title}</h1>
                <div className="bg-[#E3FBE3] border border-[#C3E6CB] p-4 rounded mb-6">
                    <p className="text-[#00684A] font-bold text-sm uppercase">Status: {task.status}</p>
                </div>
                <div className="space-y-4 text-gray-700">
                    <p><strong>Description:</strong> {task.description || "No description provided."}</p>
                    <p><strong>Priority:</strong> {task.priority}</p>
                    <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};
export default TaskDetails;