import React, { useState, useEffect } from 'react';

const App = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '' }); //stan dodawania nowego użytkownika
  const [newPost, setNewPost] = useState({ title: '', content: '', user_id: '' }); //stan do tworzenia nowego posta
  const [selectedUser, setSelectedUser] = useState([]); //stan do przechowywania wybranego użytkownika

  useEffect(() => {
    // Fetch all users on component mount
    fetchUsers();
  }, []);

  const fetchUsers = () => {
  // Fetch all users
  fetch('http://localhost:8555/users')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched users:', data);
      setUsers(data);
    })
    .catch(error => {
      console.error(error.message);
      // Handle the error as needed, for example, set an empty array for users
      setUsers([]);
    });
};

  const handleUserChange = (event) => {
    setNewUser({ ...newUser, [event.target.name]: event.target.value });
  };

  const handleAddUser = (event) => {
    event.preventDefault();

    // Add a new user
    fetch('http://localhost:8555/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then(response => response.json())
      .then(data => {
        setUsers([...users, data]);
        // Clear the input field after adding a user
        setNewUser({ username: '' });
      })
      .catch(error => console.error('Error creating user:', error));
  };

  const handleDisplayUsers = () => {
    // Fetch all users again (refresh the list)
    fetchUsers();
  };

  const handleAddPost = (event) => {
    event.preventDefault();

    const postUserId = selectedUser ? selectedUser.id : '';
    // Add a new post
    fetch('http://localhost:8555/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newPost, user_id: postUserId }),
    })
      .then(response => response.json())
      .then(data => {
        // Dodajemy nowy post do listy postów
        // Możesz dostosować tę część w zależności od tego, jak chcesz zaktualizować listę postów
        console.log('Post added successfully:', data);
      })
      .catch(error => console.error('Error creating post:', error));
  };

  return (
    <div>
      <button onClick={handleDisplayUsers}>Display Users</button>
      <ul>
        {users && users.map(user => (
          <li key={user && user.id}>{user && user.username}</li>
        ))}
      </ul>

      {/* Formularz do dodawania nowego użytkownika */}
      <form onSubmit={handleAddUser}>
        <label>
          Username:
          <input type="text" name="username" value={newUser.username} onChange={handleUserChange} />
        </label>
        <button type="submit">Add User</button>
      </form>

      {/* Formularz do dodawania nowego posta */}
      <form onSubmit={handleAddPost}>
        <label>
          Title:
          <input type="text" name="title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
        </label>
        <br />
        <label>
          Content:
          <textarea name="content" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} />
        </label>
        <br />
        {/* Dodaj przycisk do wyboru istniejącego użytkownika */}
        <label>
          Choose Existing User:
          <select value={selectedUser ? selectedUser.username : ''} onChange={(e) => setSelectedUser(users.find(user => user.username === e.target.value))}>
            <option value="">-- Choose User --</option>
            {users && users.map(user => (
              <option key={user.id} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Add Post</button>
      </form>
    </div>
  );
};

export default App;
