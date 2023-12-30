import React, { useState, useEffect } from 'react';

const UserSelection = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [newUsername, setNewUsername] = useState('');

    useEffect(() => {
        // Fetch all users
        fetch('http://localhost:8555/users')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched users:', data);
            setUsers(data);
        })
        .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleUserSelect = () => {
        onSelectUser(selectedUserId);
    };

    const handleAddUser = () => {
        // Add a new user
        fetch('http://localhost:8555/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername }),
        })
        .then(response => response.json())
        .then(data => {
            setUsers([...users, data]);
            setSelectedUserId(data.id); // Wybierz nowo dodanego użytkownika
            setNewUsername(''); // Wyczyść pole do wprowadzania nowego użytkownika
        })
        .catch(error => console.error('Error creating user:', error));
    };

    return (
        <div>
        <h2>User Selection</h2>
        <label>
            Choose or Add User:
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
            <option value="">-- Choose User --</option>
            {users.map(user => (
                <option key={user.id} value={user.id}>
                {user.username}
                </option>
            ))}
            </select>
        </label>
        <input
            type="text"
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
        />
        <button onClick={handleUserSelect}>Select User</button>
        <button onClick={handleAddUser}>Add User</button>
        </div>
    );
};

export default UserSelection;
