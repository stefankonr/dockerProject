import React, { useState, useEffect } from 'react';

const App = () => {
    const [user, setUser] = useState('');  //stan do handlera UserSubmit
    const [userData, setUserData] = useState(null); //dane aktualnego użytkownika
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); //stan do śledzenia aktualnej strony
    const [userPosts, setUserPosts] = useState([]); //stan przechowywania postów użytkownika
    const [newPost, setNewPost] = useState({ title: '', content: '', user_id: '' }); //stan przechowania nowego posta do dodania

    const handleUserSubmit //obsługa wprowadzania danych użytkownika przu logowaniu lub dodawaniu nowego
        = (event) => {
        setUser(event.target.value); 
    };

    const handleAddUser = async () => {
        try {
            console.log('Przed zapytaniem fetch - debug adduser nie działa w firefox');
            const response = await fetch('http://localhost:8555/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user }),
            });
            console.log('Po zapytaniu fetch - debug adduser nie działa w firefox');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            } else {
                const data = await response.json();
                console.log('User added successfully:', data);
            }
        } catch (error) {
            setError(error.message);
            console.error('Error creating user:', error);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:8555/users/by_username/${user}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setUserData(data);
            console.log('Fetched user data:', data);
            
        } catch (error) {
            setError(error.message);
            console.error('Error fetching user data:', error.message);
        }
    }

    const handleUserLogin = async (event) => {
        event.preventDefault();
        await fetchUserData();
        if (userData && userData.username) {
            setPage(4);
        } else {
            alert(`Błąd logowania: ${user}`); 
        }
        
    };

    const updateUserPosts = async () => {
        try {
            if (userData) {
                const postsResponse = await fetch(`http://localhost:8555/users/posts/${userData.username}`);
                if (postsResponse.ok) {
                const postsData = await postsResponse.json();
                setUserPosts(postsData);
                } else {
                console.warn('No posts available for the user.');
                setUserPosts([]);
                }
            }
            } catch (error) {
            console.error('Error fetching user posts:', error);
            }
        };


    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                if (userData) {
                const postsResponse = await fetch(`http://localhost:8555/users/posts/${userData.username}`);
                if (postsResponse.ok) {
                    const postsData = await postsResponse.json();
                    setUserPosts(postsData);
                } else {
                    console.warn('No posts available for the user.');
                    setUserPosts([]);
                }
                }
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };
    
        fetchUserPosts();
    
        }, [userData]);


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
            await updateUserPosts();
            setNewPost({ title: '', content: '', user_id: '' });
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
        {page === 1 && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>Witaj w notatniku w chmurze</p>
                <button onClick={() => setPage(2)}>Załóż konto</button>
                <button onClick={() => setPage(3)}>Zaloguj</button>
            </div>

        )}
        {page === 2 && (
            <div style={{ width: '300px', textAlign: 'center', margin: 'auto' }}>
            <form onSubmit={async (event) => {
                event.preventDefault();
                await handleAddUser();
                handleUserLogin();
                }}>
                <label>
                    Username:
                    <input type="text" name="username" value={user} onChange={handleUserSubmit} />
                </label>
                <button type="submit">Dodaj użytkownika</button>
            </form>
            </div>
        )}
        {page === 3 && (
            <div>
            <form onSubmit={handleUserLogin}>
                <label>
                Wprowadź nazwę:
                <input type="text" value={user} onChange={handleUserSubmit} />
                </label>
                <button type="submit">Zaloguj</button>
            </form>
            {error && <p>Error: {error}</p>}
            </div>
        )}
        {page === 4 && (
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
        </div>
        )}
        </div>
    );
};

export default App;
