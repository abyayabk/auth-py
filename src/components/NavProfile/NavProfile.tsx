import './NavProfile.css';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const NavProfile = () => {
    const [isActive, setIsActive] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    return (
        <nav>
            <div className="profile-dropdown" id="profileDropdown">
                <button
                    className="profile-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsActive(!isActive);
                    }}
                    onBlur={() => setIsActive(false)}
                >
                    <div className="profile-icon">JD</div>
                    <span className="username">John Doe</span>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L6 6L11 1" stroke="#666666" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {isActive && (
                        <div className="dropdown-content">
                            <div className="dropdown-item" onClick={() => {
                                logout();
                                setIsActive(false);
                                navigate('/login');
                            }}>
                                Logout
                            </div>
                        </div>
                    )}
                </button>
            </div>
        </nav>
    );
};