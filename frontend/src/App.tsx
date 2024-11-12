import Posts from "./components/Posts";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Users from "./components/Users";
import './styles/style.css';
import SearcForPost from "./components/SearchForPosts";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/users" element={<Users />} />
      </Routes>
      <SearcForPost/>
    </BrowserRouter>
  )
}

export default App
