import React, { FormEvent, useEffect, useState } from "react";
import { Post } from "./Posts";
import { useQuery } from "@tanstack/react-query";

type PostSearchOptions = "author" | "content" | "title";

const SearcForPost: React.FC = () => {
  const [findBy, setFindBy] = useState<PostSearchOptions>(
    "author"
  );
  const [textToFind,setTextToFind] = useState<string>('');
  const [posts,setPosts] = useState<Post[]>([]);
  const [isFirstSearch, setIsFirstSearch] = useState(true);
  const {data,isError,error,isSuccess,isLoading, refetch} = useQuery({
    queryKey : ['searchPost'],
    queryFn : async ()=>{
        if(textToFind === ''){return []};
        const searchQuery = new URLSearchParams();
        searchQuery.append(findBy,textToFind);
        const URL = `http://localhost:3000/posts?${searchQuery.toString()}`;
        return  fetch(URL).then(res=>res.json());
    }
  })

  useEffect(()=>{
    if(isSuccess && isPostArray(data)){
      setPosts(data);
    }
  },[data])
  
  function isPostArray (array : any[]) : array is Post[] {
    return array.every(item=>item.author && item.content && item.id && item.title)
  }

  function handleSubmit(e:FormEvent){
    e.preventDefault();
    setIsFirstSearch(false);
    refetch();
  }

  return (
    <div>
      <form>
        <label htmlFor="findBy">Find post by:</label>
        <select
          name="findBy"
          onChange={
            (event)=>setFindBy(event.target.value as PostSearchOptions)
          }
        >
          <option value="author">Author</option>
          <option value="content">Content</option>
          <option value="title">Title</option>
        </select>
        <label>
          Text to find in post:
          <input type="text" onChange={(e)=>setTextToFind(e.target.value)} />
        </label>
        <button onClick={handleSubmit}>Search</button>
      </form>
  {isLoading && <p>Loading...</p>}
  {isError && <p>An error occured: {error.message} </p>}
  {!isFirstSearch && posts && posts.length === 0 ? <p>Cannot find matching post. Please modify your query.</p>:null}
  {!isFirstSearch && textToFind.length === 0? <p>Please fill the search field.</p>: null}
{/* Listing posts - ONLY FOR TESTING*/}
      <ul className="user-list">
        {posts.map((post,index)=>(
            <li key={`${post.title}-${index}`}>
                <h2>{post.title}</h2>
                <h4>{post.author}</h4>
                <p>{post.content}</p>
            </li>
        ))}
      </ul>
  {/* Listing posts - ONLY FOR TESTING*/}
    </div>
  );
};

export default SearcForPost;
