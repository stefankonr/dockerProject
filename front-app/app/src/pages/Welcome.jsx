import { Link } from 'react-router-dom';

const App = () => {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}> 
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>Witaj w notatniku w chmurze</p>
                <Link to='/create-account'>Załóż konto </Link>
                <Link to='/login'>Zaloguj</Link>
            </div>
        </div>
    )
};

export default App;
