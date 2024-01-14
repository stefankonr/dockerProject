import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
    const [user, setUser] = useState('');  //stan do handlera UserSubmit
    const navigate = useNavigate();

    const handleUserSubmit //obsługa wprowadzania danych użytkownika przu logowaniu lub dodawaniu nowego
        = (event) => {
        setUser(event.target.value); 
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
            } else {
                const data = await response.json();
                console.log('User added successfully:', data);
                const login = await fetchUserData();
                    if (login ) {
                        navigate('/notepad')
                    } else {
                        alert(`Błąd logowania: ${user}`); 
                    }
            }
        } catch (error) {
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
            sessionStorage.setItem('username', JSON.stringify(data))
            console.log('Fetched user data:', data);
            return true
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            return false
        }
    }



    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}> 
            <div style={{ width: '300px', textAlign: 'center', margin: 'auto' }}>
            <form onSubmit={async (event) => {
                event.preventDefault();
                handleAddUser();
                }}>
                <label>
                    Username:
                    <input type="text" name="username" value={user} onChange={handleUserSubmit} />
                </label>
                <button type="submit">Dodaj użytkownika</button>
            </form>
            </div>
        </div>
    );
};

export default App;
