import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import InputModal from "./InputModal";

interface User {
    id: number;
    name: string;
    email: string;
}

export default function Users() {
    const queryClient = useQueryClient();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [inputNeeded,setInputNeeded] = useState(false);
    const [isInputUsedToUpdate,setIsInputUsedToUpdate] = useState(false);


    const { data: users, isError, isPending, error, isSuccess, status } = useQuery<User[]>({
        queryFn: async () => fetch('http://localhost:3000/users').then(res => res.json()),
        queryKey: ['users']
    })

    function getHeighestPossibleID() : number{
        if(users !== undefined){
            return Math.max(...users.map(user=>user.id))
        }
        return 0;
    }

    const updateUserMutation = useMutation({
        mutationFn: async (user:User)=>{
            fetch(`http://localhost:3000/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users']
            });

        }
        
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (id: number) => {
            fetch(`http://localhost:3000/users/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users']
            })
        }
    })

    const createUserMutation = useMutation({
        mutationFn: async (newUser: Omit<User,'id'>) => {
            fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({name:newUser.name,email:newUser.email})
            }).then(res => res.json());
        },
        onMutate: () => {

        },
        onError: () => {

        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users']
            })
        }
    })

    const handleCreateUser = () => {
        createUserMutation.mutate({
            name: name,
            email: email,
        })
    }
    const handleOpenUpdateUserModal = (id:number)=>{
        setInputNeeded(true);
        setIsInputUsedToUpdate(true);
    }
    const handleUpdateUser =(id:number)=>{
        updateUserMutation.mutate({
            id: id,
            name: name,
            email: email
        })
    }

    const handleDeleteUser = (id: number) => {
        deleteUserMutation.mutate(id);
    }

    if (isPending) return <h1>Loading...</h1>

    if (isError) {
        return <h2>{error.message}</h2>
    }

    return (
        <>  
            {inputNeeded?<InputModal title={"Próba"} inputFields={[{type:"text",value:'',label:"próba"}]} submitHandler={()=>{console.log('handled')} } id={1}/> :null}
            <ul>
                {users?.map(user => (
                    <li key={user.id}>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                        <p>User id: {user.id}</p>
                        <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        <button onClick={()=>handleOpenUpdateUserModal(user.id)}>Update</button>
                    </li>
                ))}
            </ul>
        </>
    )
}