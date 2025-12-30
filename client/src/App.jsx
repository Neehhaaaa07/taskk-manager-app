import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails'; // Import the new page
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
    return (
        <BrowserRouter>
            <ToastContainer position="top-right" autoClose={2000} />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Add this new route */}
                <Route path="/task/:id" element={<TaskDetails />} />
            </Routes>
        </BrowserRouter>
    );
}