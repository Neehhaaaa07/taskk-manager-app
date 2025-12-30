import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const TaskForm = ({ onSubmit, initialData, onCancel }) => {
    const [form, setForm] = useState({ 
        title: '', description: '', dueDate: new Date(), priority: 'medium' 
    });

    useEffect(() => {
        if (initialData) {
            setForm({ ...initialData, dueDate: initialData.dueDate ? new Date(initialData.dueDate) : new Date() });
        } else {
            setForm({ title: '', description: '', dueDate: new Date(), priority: 'medium' });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
        if(!initialData) setForm({ title: '', description: '', dueDate: new Date(), priority: 'medium' });
    };

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm max-w-2xl mx-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#F9FBFA]">
                <h3 className="font-serif-app text-lg font-bold text-[#1C2D38]">
                    {initialData ? 'Edit Task' : 'Add New Task'}
                </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                    <label className="block text-xs font-bold text-[#1C2D38] mb-1.5 uppercase">Task Title</label>
                    <input className="w-full border border-gray-400 rounded p-2 text-sm text-[#1C2D38] focus:border-[#00684A] focus:ring-1 focus:ring-[#00684A] outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-[#1C2D38] mb-1.5 uppercase">Priority</label>
                        <select className="w-full border border-gray-400 rounded p-2 text-sm text-[#1C2D38] bg-white outline-none" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#1C2D38] mb-1.5 uppercase">Due Date</label>
                        <DatePicker selected={form.dueDate} onChange={d => setForm({...form, dueDate: d})} className="w-full border border-gray-400 rounded p-2 text-sm text-[#1C2D38] outline-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-[#1C2D38] mb-1.5 uppercase">Description</label>
                    <input className="w-full border border-gray-400 rounded p-2 text-sm text-[#1C2D38] outline-none" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-[#00684A] hover:bg-[#00503a] text-white rounded text-sm font-bold shadow-sm">{initialData ? 'Update' : 'Confirm'}</button>
                </div>
            </form>
        </div>
    );
};
export default TaskForm;