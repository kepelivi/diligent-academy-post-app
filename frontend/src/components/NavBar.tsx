import React from "react";
import { Link } from "react-router-dom";

const Navbar : React.FC = ()=>{
    return(<ul className="navbar">
        <li><Link to={'/'}>Home</Link></li>
        <li><Link to={'/posts'}>Posts</Link></li>
        <li><Link to={'/users'}>Users</Link></li>
    </ul>)
}
export default Navbar;
