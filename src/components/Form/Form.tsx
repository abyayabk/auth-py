import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Form.css';

export const Form = ({ method }: { method: string }) => {
    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const title = method === 'register' ? 'Register' : 'Login';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (method === 'register') {
                await register(userName, password);
            } else {
                await login(userName, password);
            }
            navigate('/dashboard/stories');
        } catch (error: any) {
            setErrors(error.response?.data || {});
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="login-container">
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>{title} to learn a language</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                        {errors.username && <span className="error">{errors.username}</span>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Loading...' : title}
                    </button>
                </form>
            </div>
        </div>
    );
};