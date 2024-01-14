import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const fetchUserPosts = async (userData) => {
    try {
        if (userData) {
            const postsResponse = await fetch(`http://localhost:8555/users/posts/${userData.username}`);
            if (postsResponse.ok) {
            const postsData = await postsResponse.json();
            return postsData
            } else {
            console.warn('No posts available for the user.');
            }
        }
        } catch (error) {
        console.error('Error fetching user posts:', error);

        } return []
    };

const App = () => {
    const [userData, setUserData] = useState(null); //dane aktualnego użytkownika
    const [userPosts, setUserPosts] = useState([]); //stan przechowywania postów użytkownika
    const [newPost, setNewPost] = useState({ title: '', content: '', user_id: '' }); //stan przechowania nowego posta do dodania
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear
        navigate('/')
    };

    const updatePosts = async () => {
        const posts= await fetchUserPosts(userData)
        setUserPosts(posts)
    }
    


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
            await updatePosts()
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

    useEffect(() => {
        const username=JSON.parse(sessionStorage.getItem('username'))
        if (username) {
            setUserData(username)
        } 
        else  {navigate('/')
        }      
    }, [navigate])

    useEffect(() => {
        updatePosts()
    }, [userData, updatePosts]
    )

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}> 
            <div style={{ width: '600px', textAlign: 'center', margin: 'auto' }}>
            {userData && (
                <div style={{ position: 'absolute', top: '10px', right: '100px' }}>
                    <p>Witaj <span style={{ fontWeight: 'bold' }}>{userData.username}</span></p>
                    <button onClick={handleLogout}>Wyloguj</button>
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
        </div>
    );
};

export default App;
