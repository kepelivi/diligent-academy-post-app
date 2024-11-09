import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
            <h1>Home page</h1>
            <p>Welcome to our page! Check out our posts and users:</p>
            <ul className="navbar">
                <li><Link to={'/posts'}>Posts</Link></li>
                <li><Link to={'/users'}>Users</Link></li>
            </ul>
           
        </>
    )
}