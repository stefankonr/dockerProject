import { useState, } from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
    const [user, setUser] = useState('');  //stan do handlera UserSubmit
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleUserSubmit //obsługa wprowadzania danych użytkownika przu logowaniu lub dodawaniu nowego
        = (event) => {
        setUser(event.target.value); 
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
            setError(error.message);
            console.error('Error fetching user data:', error.message);
            return false
        }
    }

    const handleUserLogin = async (event) => {
        event.preventDefault();
        const login = await fetchUserData();
        if (login ) {
            navigate('/notepad')
        } else {
            alert(`Błąd logowania: ${user}`);
            navigate('/')
        }
        
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}> 
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
        </div>
    );
};

export default App;
