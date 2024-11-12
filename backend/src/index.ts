import express, { Express, Request, Response } from 'express';
import cors from "cors"

const app: Express = express();
const port = 3000;

app.use(cors());
app.use(express.json());

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'janesmith@example.com' },
];

const posts: Post[] = [
  { id: 1, title: "Post 1", content: "Lorem ipsum...", author: "Anna" },
  { id: 2, title: "Post 2", content: "Dolor sit amet...", author: "Béla" },
  { id: 3, title: "Post 3", content: "Dolor sit amet...", author: "Cecil" },
];

function getHeighestPossibleID(database:Post[]|User[]): number {
  if (database !== undefined) {
     const newId = Math.max(...database.map((data) => data.id))+1;
      return newId;
  }
  return 1;
}

app.get('/users', (req: Request, res: Response) => {
  res.json(users);
});

app.get('/posts', (req: Request, res: Response) => {
  console.log("req.query: ",Object.keys(req.query),"boolean:",Boolean(req.query.title||req.query.author||req.query.content),)
  if(req.query.title){
    const searchedPosts = posts.filter(post=>{return new RegExp(req.query.title  as string, "i").test(post['title'])});
    res.json(searchedPosts);
  } else if(req.query.author){
    const searchedPosts = posts.filter(post=>{return new RegExp(req.query.author  as string, "i").test(post['author'])});
    res.json(searchedPosts);
  } else if(req.query.content){
    const searchedPosts = posts.filter(post=>{return new RegExp(req.query.content  as string, "i").test(post['content'])});
    res.json(searchedPosts);
  }
  res.json(posts);
});

app.get('/posts/:id', (req: Request, res: Response) => {
  const post = posts.find(post => post.id === parseInt(req.params.id));
  res.json(post || {});
});

app.get('/users/:id', (req: Request, res: Response) => {
  const user = users.find(user => user.id === parseInt(req.params.id));
  res.json(user || {});
});

app.post('/users', (req: Request, res: Response) => {
  const newUser: User = {
    id: getHeighestPossibleID(users),
    ...req.body,
  };
  users.push(newUser);
  res.json(newUser);
  console.log(users);
});

app.post('/posts', (req: Request, res: Response) => {
  const newPost: Post = {
    id: getHeighestPossibleID(posts),
    ...req.body,
  };
  posts.push(newPost);
  res.json(newPost);
});

app.put('/users/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const updatedUser: Partial<User> = req.body;

  const userIndex = users.findIndex(user => user.id === userId);

  users[userIndex] = {
    ...users[userIndex],
    ...updatedUser

  };

  res.json(users[userIndex]);
});

app.put('/posts/:id', (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  const updatedPost: Partial<Post> = req.body;

  const postIndex = posts.findIndex(post => post.id === postId);

  posts[postIndex] = {
    ...posts[postIndex],
    ...updatedPost

  };

  res.json(posts[postIndex]);
});

app.delete('/users/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === userId);

  users.splice(userIndex, 1);

  res.sendStatus(204);   

});

app.delete('/posts/:id', (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(post => post.id === postId);

  posts.splice(postIndex, 1);

  res.sendStatus(204);   

});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
