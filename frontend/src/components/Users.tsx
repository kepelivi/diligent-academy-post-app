import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import InputModal from "./InputModal";
import { inputState } from "./InputModal";
import Navbar from "./NavBar";


interface User {
  id: number;
  name: string;
  email: string;
}

export default function Users() {
  const queryClient = useQueryClient();
  const [isAddModalopen, setIsAddModalopen] = useState(false);
  const [openUpdateModalNr,setOpenUpdateModalNr] = useState<number|null>(null);

  const {
    data: users,
    isError,
    isPending,
    error,
  } = useQuery<User[]>({
    queryFn: async () =>
      fetch("http://localhost:3000/users").then((res) => res.json()),
    queryKey: ["users"],    
  });

    function getHeighestPossibleID(): number {
    if (users !== undefined) {
      const newId = Math.max(...users.map((user) => user.id))+1;
        console.log(newId);
        return newId;
    }
    return 0;
  }

  const updateUserMutation = useMutation({
    mutationFn: async (user: User) => {
      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });    
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (newUser: Omit<User, "id">) => {
      fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newUser.name, email: newUser.email }),
      }).then((res) => res.json());
    },
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      })
    },
  });


 
  const handleUpdateUser = (id: number,values:inputState) => {
    const {name,email} = values;
    if(typeof name === "string" && typeof email === 'string')
    updateUserMutation.mutate({
      id: id,
      name: name,
      email: email,
    });
    setOpenUpdateModalNr(null);
  };

  const handleDeleteUser = (id: number) => {
    deleteUserMutation.mutate(id);
  };
  const cancelModalHandler = ()=>{
    setIsAddModalopen(false);
  }

  const handleAddUser = (id:number, values:inputState) => {
    const {name,email} = values;
    if(typeof name === "string" && typeof email === 'string')
    {createUserMutation.mutate({
        name: name,
        email: email,
      });}
    setIsAddModalopen(false);
  };

  if (isPending) return (
  <>
  <Navbar/>
  <h1>Loading...</h1>
  </>);

  if (isError) return <><Navbar/><h2>{error.message}</h2></>;
  
  const userListItem = users?.map((user) => {
    return (

    <li key={user.id}>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>User id: {user.id}</p>
      <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
      <button onClick={() => setOpenUpdateModalNr(user.id)}>
        Update
      </button>
      {openUpdateModalNr===user.id?
        <InputModal
        title={"Update user"}
        inputFields={[
          { type: "text", value: user.name, label: "name" },
          { type: "email", value: user.email, label: "email" },
        ]}
        submitHandler={handleUpdateUser}
        cancelHandler={() => setOpenUpdateModalNr(null)}
        id={user.id}
      />
        :null}
    </li>
  )})

  return (
    <>
    <Navbar/>
      {isAddModalopen ? (
        <InputModal
          title={"Add user"}
          inputFields={[
            { type: "text", value: "", label: "name" },
            { type: "email", value: "", label: "email" },
          ]}
          submitHandler={handleAddUser}
          cancelHandler={cancelModalHandler}
          id={getHeighestPossibleID()}
        />
      ) : null}
      <button onClick={()=>setIsAddModalopen(true)}>Add new user</button>
      <ul className="user-list">
        {userListItem}
      </ul>
    </>
  );
}