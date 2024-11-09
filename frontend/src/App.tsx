import Posts from "./components/Posts";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Users from "./components/Users";
import './styles/style.css';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
