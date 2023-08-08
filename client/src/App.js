import { Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './scenes/Home';
import Login from './scenes/Login';
import Register from './scenes/Register';
import AddPost from './scenes/AddPost';
import PostPage from './scenes/PostPage';
import { UserContextProvider } from './UserContext';

function App() {
  return (
    <>
    <UserContextProvider>
   <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/addpost" element={<AddPost/>}/>
      <Route path="/post/:id" element={<PostPage/>}/>
    </Routes>
    </UserContextProvider>
   </>
  );
}

export default App;
