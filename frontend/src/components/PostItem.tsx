import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from './Posts';
import { useState } from 'react';

interface PostProps {
    post: Post
}

const PostItem: React.FC<PostProps> = ({ post }: PostProps) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState<string>(post.title);
    const [content, setContent] = useState<string>(post.content);
    const [isUpdating, setIsUpdating] = useState(false);

    const deletePostMutation = useMutation({
        mutationFn: async (id: number) => {
            return fetch(`http://localhost:3000/posts/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['posts'],
            });
        },
    });

    const updatePostMutation = useMutation({
        mutationFn: async (postToUpdate: Post) => {
            return fetch(`http://localhost:3000/posts/${postToUpdate.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postToUpdate),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['posts'],
            });
            setIsUpdating(false);
        },
    });

    const handleDeleteUser = (id: number) => {
        deletePostMutation.mutate(id);
    }

    const handleUpdatePost = (id: number) => {
        setIsUpdating(true);
        updatePostMutation.mutate({
            id: id,
            title: title,
            content: content
        })
    }

    return (
        <>
            {isUpdating ? (
                <div>
                    <input type='text' placeholder='Title' name='title' value={title} onChange={(e) => setTitle(e.target.value)} /> <br></br>
                    <input type='text' placeholder='Post content' name='content' value={content} onChange={(e) => setContent(e.target.value)} />
                    <button onClick={() => handleUpdatePost(post.id)}>Save</button>
                </div>
            ) : (
                <li>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <button onClick={() => handleDeleteUser(post.id)}>Delete</button>
                    <button onClick={() => setIsUpdating(true)}>
                        Update
                    </button>
                </li>
            )}
        </>
    )
}

export default PostItem;