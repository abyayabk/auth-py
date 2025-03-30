import './UserList.css';
import { useState } from 'react';
import api from '../../api';

export const UserList = () => {
    const [users, setUsers] = useState([]);
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
                <tr>
                    <td>1</td>
                    <td>john_doe</td>
                    <td><span className="role role-admin">Admin</span></td>
                    <td><button className="btn btn-delete">Delete</button></td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>jane_smith</td>
                    <td><span className="role role-user">User</span></td>
                    <td><button className="btn btn-delete">Delete</button></td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>mike_johnson</td>
                    <td><span className="role role-user">User</span></td>
                    <td><button className="btn btn-delete">Delete</button></td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>sarah_williams</td>
                    <td><span className="role role-admin">Admin</span></td>
                    <td><button className="btn btn-delete">Delete</button></td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>david_brown</td>
                    <td><span className="role role-user">User</span></td>
                    <td><button className="btn btn-delete">Delete</button></td>
                </tr>
            </tbody>
        </table>
    </div>
    )
}