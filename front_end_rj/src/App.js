import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Register from './pages/Register/register';

export const url = process.env.REACT_APP_API_URL;

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:id" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="*" element={<Error />} /> */}
        </Routes>
    );
}

export default App;
