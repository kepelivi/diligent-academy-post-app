import { Link } from "react-router-dom";
import InputModal from "./InputModal";
export default function Home() {
    return (
        <>
            <h1>Home page</h1>
            <p>Welcome to our page! Check out our posts and users:</p>
            <ul>
                <li><Link to={'/posts'}>Posts</Link></li>
                <li><Link to={'/users'}>Users</Link></li>
            </ul>
            <InputModal title={"Add user"} inputFields={[{type:"text",value:'',label:"name"},{type:"text",value:'',label:"email"}]} submitHandler={(id,values)=>{console.log(`id: ${id}, values: ${JSON.stringify(values)}`)} } id={1}/>
        </>
    )
}