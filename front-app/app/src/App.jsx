import Welcome from "./pages/Welcome";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import Notepad from "./pages/Notepad"
import {Route, Routes} from "react-router-dom"


const App = () => {
    return (
        <Routes>
            <Route path='/create-account' element={<CreateAccount/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/notepad' element={<Notepad/>} />
            <Route index element={<Welcome/>} />
        </Routes>
    )
};

export default App;
