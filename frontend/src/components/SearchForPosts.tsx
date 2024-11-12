import React, { FormEvent,  useState } from "react";
import { Post } from "./Posts";

export type PostSearchOptions = "author" | "content" | "title";

interface Params {
  posts: Post[];
  setFindBy: (findBy: PostSearchOptions) => void;
  textToFind: string;
  setTextToFind: (ttf: string) => void,
  refetch: () => void
}

const SearchForPost: React.FC<Params> = ({ posts, setFindBy, textToFind, setTextToFind, refetch}: Params) => {
  const [isFirstSearch, setIsFirstSearch] = useState(true);

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
  {!isFirstSearch && posts && posts.length === 0 ? <p>Cannot find matching post. Please modify your query.</p>:null}
  {!isFirstSearch && textToFind.length === 0? <p>Please fill the search field.</p>: null}
    </div>
  );
};

export default SearchForPost;
