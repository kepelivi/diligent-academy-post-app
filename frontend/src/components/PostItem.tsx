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
    const [author, setAuthor] = useState<string>(post.author);
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
            content: content,
            author: author
        })
    }

    return (
        <>
            {isUpdating ? (
                <div className='postitem-input-container'>
                    <input type='text' placeholder='Title' name='title' value={title} onChange={(e) => setTitle(e.target.value)} /> <br></br>
                    <textarea placeholder='Post content' name='content' value={content} onChange={(e) => setContent(e.target.value)} /> <br></br>
                    <input type='text' placeholder='Author' name='author' value={author} onChange={(e) => setAuthor(e.target.value)} /> <br></br>
                    <button onClick={() => handleUpdatePost(post.id)}>Save</button>
                </div>
            ) : (
                <li className='postitem'>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <h4>{post.author}</h4>
                    <button onClick={() => setIsUpdating(true)}>
                        Update
                    </button>
                    <button onClick={() => handleDeleteUser(post.id)}>Delete</button>
                </li>
            )}
        </>
    )
}

export default PostItem;