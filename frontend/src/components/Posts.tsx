import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Post {
    id: number;
    title: string;
    content: string;
}

export default function Posts() {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const { data: posts, isError, isPending, error, isSuccess, status } = useQuery<Post[]>({
        queryFn: async () => fetch('http://localhost:3000/posts').then(res => res.json()),
        queryKey: ['posts']
    })

    const createPostMutation = useMutation({
        mutationFn: async (newPost: Post) => {
            fetch('http://localhost:3000/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost)
            }).then(res => res.json());
        },
        onMutate: () => {

        },
        onError: () => {

        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['posts']
            })
        }
    })

    const handleCreatePost = () => {
        createPostMutation.mutate({
            id: 30,
            title: title,
            content: content
        })
    }

    if (isPending) return <h1>Loading...</h1>

    if (isError) {
        return <h2>{error.message}</h2>
    }

    return (
        <>
            <input type="text" placeholder="Title" name="title" onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Post content" name="content" onChange={(e) => setContent(e.target.value)} />
            <button onClick={handleCreatePost}>Create post</button>
            <ul>
                {posts?.map(post => (
                    <li key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                    </li>
                ))}
            </ul>
        </>
    )
}