import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PostItem from "./PostItem";
import Navbar from "./NavBar";

export interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
}

export default function Posts() {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const { data: posts, isError, isPending, error } = useQuery<Post[]>({
        queryFn: async () => fetch('http://localhost:3000/posts').then(res => res.json()),
        queryKey: ['posts']
    })

    function getHeighestPossibleID(): number {
        if (posts !== undefined) {
            if (posts.length === 0) return 1;
            const newId = Math.max(...posts.map((post) => post.id)) + 1;
            console.log(newId);
            return newId;
        }
        return 0;
    }

    const createPostMutation = useMutation({
        mutationFn: async (newPost: Post) => {
            return fetch('http://localhost:3000/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost)
            }).then(res => res.json());
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['posts']
            })
        }
    })

    const handleCreatePost = () => {
        createPostMutation.mutate({
            id: getHeighestPossibleID(),
            title: title,
            content: content,
            author: "Universal User"
        })
        console.log(posts);
    }

    if (isPending) return <h1>Loading...</h1>

    if (isError) {
        return <h2>{error.message}</h2>
    }

    return (
        <>
            <Navbar />
            <div className="input-container">
                <h3>Add a new post</h3>
                <input type="text" placeholder="Title" name="title" onChange={(e) => setTitle(e.target.value)} /> <br></br>
                <textarea placeholder="Post content" name="content" onChange={(e) => setContent(e.target.value)} /> <br></br>
                <button onClick={handleCreatePost}>Create post</button>
            </div>
            <ul className="post-list">
                {posts?.map(post => (
                    <PostItem key={post.id} post={post} />
                ))}
            </ul>
        </>
    )
}