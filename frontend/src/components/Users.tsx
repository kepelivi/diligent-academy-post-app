import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
}

export default function Users() {
    const queryClient = useQueryClient();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const { data: users, isError, isPending, error, isSuccess, status } = useQuery<User[]>({
        queryFn: async () => fetch('http://localhost:3000/users').then(res => res.json()),
        queryKey: ['users']
    })

    const createUserMutation = useMutation({
        mutationFn: async (newUser: User) => {
            fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
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
            id: 30,
            name: name,
            email: email
        })
    }

    if (isPending) return <h1>Loading...</h1>

    if (isError) {
        return <h2>{error.message}</h2>
    }

    return (
        <>
            <input type="text" placeholder="Name" name="name" onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="E-mail" name="email" onChange={(e) => setEmail(e.target.value)} />
            <button onClick={handleCreateUser}>Create user</button>
            <ul>
                {users?.map(user => (
                    <li key={user.id}>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                    </li>
                ))}
            </ul>
        </>
    )
}