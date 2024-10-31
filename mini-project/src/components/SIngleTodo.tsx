import React, { useEffect, useRef, useState } from "react";
import { Todo } from "../model";
import {AiFillEdit, AiFillDelete} from "react-icons/ai";
import "./styles.css";


interface Props{
    todo: Todo;
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const SingleTodo: React.FC<Props> = ({todo, todos, setTodos}) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [editTodo, setEditTodo] = useState<string>(todo.todo);

    const handleDelete = (id:number) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const handleEdit = (e:React.FormEvent, id:number) =>{
        e.preventDefault();
        setTodos(todos.map((todo) => (
            todo.id === id ? {...todo, todo:editTodo} : todo
        )))
        setEdit(false);
    };

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [edit]);

    return (
        <form className="todos_single" onSubmit={(e)=>handleEdit(e, todo.id)}>
            {edit?(
                    <input type="text" 
                    value={editTodo} 
                    onChange={(e) => setEditTodo(e.target.value)} 
                    className="todos_single--text"/>
                ):(
                    <span className="todos_single--text">{todo.todo}</span> 
                )}
             
            <div>
                <span className="icon" onClick={ () =>{
                    if (!edit){
                        setEdit(!edit);
                    }
                }}
                >
                    <AiFillEdit></AiFillEdit>
                </span>
                <span className="icon" onClick={()=> handleDelete(todo.id)}>
                    <AiFillDelete></AiFillDelete>
                </span>
            </div>
        </form>
    )
}

export default SingleTodo