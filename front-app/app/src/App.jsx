import React, { useState } from 'react';

const App = () => {
    const [user, setUser] = useState('');  //stan użyty do dodawania nowego użytkownika
    const [userData, setUserData] = useState(null); //dane aktualnego użytkownika
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); //stan do śledzenia aktualnej strony
    const [userPosts, setUserPosts] = useState([]); //stan przechowywania postów użytkownika
    const [newPost, setNewPost] = useState({ title: '', content: '', user_id: '' }); //stan przechowania nowego posta do dodania

    const handleUserChange
        = (event) => {
        setUser(event.target.value);
        setNewPost({ ...newPost, user_id: user.user_id });
        
    };

    const handleAddUser = async () => {
        try {
            const response = await fetch('http://localhost:8555/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('User added successfully:', data);

            setUserData(data);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    async function fetchUserData() {
        try {
            const response = await fetch(`http://localhost:8555/users/by_username/${user}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched user data:', data);
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchUserData();
    };

    const handleDisplayCurrentUser = () => {
        if (userData) {
        alert(`Current User: ${userData.username}`);
        } else {
        alert('No user data available.');
        }
    };

    async function fetchUserPosts() {
        try {
            const postsResponse = await fetch(`http://localhost:8555/users/posts/${userData.username}`);
            if (postsResponse.ok) {
                const postsData = await postsResponse.json();
                console.log('Fetched user posts:', postsData);
                setUserPosts(postsData);
            } else {
                console.warn('No posts available for the user.');
                setUserPosts([]);
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    }

    const handlePageChange = () => {
        setPage(2);
        fetchUserPosts();
    };

    const handleAddPost = async (event) => {
        event.preventDefault();
        const postUserId = userData ? userData.user_id : '';

        try {
            const response = await fetch('http://localhost:8555/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newPost, user_id: postUserId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Added new post:', data);

            // Po dodaniu nowego posta, pobieram aktualne posty
            fetchUserPosts();
        } catch (error) {
            console.error('Error adding new post:', error.message);
        }
    };



    const handleTitleChange = (event) => {
        setNewPost({ ...newPost, title: event.target.value });
    };

    const handleContentChange = (event) => {
        setNewPost({ ...newPost, content: event.target.value });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}> 
        {page === 1 ? (
            <div style={{ width: '300px', textAlign: 'center', margin: 'auto' }}>
            <form onSubmit={handleAddUser}>
                <label>
                    Username:
                    <input type="text" name="username" value={user} onChange={handleUserChange} />
                </label>
                <button type="submit">Dodaj użytkownika</button>
            </form>
            <h1>Dane zalogowanego użytkownika</h1>
            <form onSubmit={handleSubmit}>
                <label>
                Wprowadź nazwę:
                <input type="text" value={user} onChange={handleUserChange} />
                </label>
                <button type="submit">Zaloguj</button>
            </form>
            {error && <p>Error: {error}</p>}
            {userData && (
                <div>
                <p>User ID: {userData.user_id}</p>
                <p>Username: {userData.username}</p>
                </div>
            )}
            <button onClick={handlePageChange}>Przejdź na drugą stronę</button>
            </div>
        ) : (
            <div style={{ width: '600px', textAlign: 'center', margin: 'auto' }}>
            {userData && (
                <div style={{ position: 'absolute', top: '10px', right: '100px' }}>
                    <p>Witaj <span style={{ fontWeight: 'bold' }}>{userData.username}</span></p>
                </div>
            )}
            <form onSubmit={handleAddPost}>
                <label>
                    Tytuł :
                    <input type="text" name="title" value={newPost.title} onChange={handleTitleChange} maxLength={50} style={{ width: '100%' }} />
                </label>
                <label>
                    Treść:
                    <textarea name="content" value={newPost.content} onChange={handleContentChange} maxLength={500} style={{ width: '100%', height: '100px' }} />
                </label>
                <button type="submit">Dodaj notatkę</button>
            </form>
            <h2>Moje notatki</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {userPosts.map((post) => (
                    <li key={post.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>{post.title}</h3>
                        <p>{post.content}</p>
                    </li>
                ))}
            </ul>
            <button onClick={handleDisplayCurrentUser}>Pokaż użytkownika</button>
        </div>
        )}
        </div>
    );
};

export default App;
