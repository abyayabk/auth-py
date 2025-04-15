import './UserList.css';
import { useEffect, useState } from 'react';
import api from '../../api';

interface UserRole {
    role: string;
}

interface User {
    id: number;
    username: string;
    role: UserRole;
}

export const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);

    const getUsers = async () => {
        try {
            const response = await api.get('api/list-users');

            if (response.status === 200) {
                setUsers(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const deleteUser = async (id: number) => {
        try {
            const response = await api.delete(`api/user/delete/${id}/`);
            
            if (response.status === 204) {
                getUsers();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="user-listcontainer">
            <h1></h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.username}</td>
                                <td><span className={`role role-${item.role.role}`}>{item.role.role.charAt(0).toUpperCase() + item.role.role.slice(1)}</span></td>
                                {item.username !== 'admin' && (
                                    <td><button className="btn btn-delete" onClick={() => deleteUser(item.id)}>Delete</button></td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}