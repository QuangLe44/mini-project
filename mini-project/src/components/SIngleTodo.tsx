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
    const [confirmId, setConfirmId] = useState<boolean>(false);

    const handleDeleteClick = () => {
        setConfirmId(true);
    };

    const handleDelete = (id:number) => {
        setTodos(todos.filter((todo) => todo.id !== id));
        setConfirmId(false);
    };

    const handleCancel = () => {
        setConfirmId(false);
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
                <span className="icon_delete" onClick={()=> handleDeleteClick()}>
                    <AiFillDelete></AiFillDelete>
                </span>
                {confirmId === true && (
                    <div className="todos_single--confirm">
                        <span className="todos_single--text">Are you sure?</span>
                        <span>
                            <span className="todos_single--option" onClick={() => handleDelete(todo.id)}>Yes</span>
                            <span className="todos_single--option" onClick={handleCancel}>No</span>      
                        </span>
                    </div>
                    )}
            </div>
        </form>
    )
}

export default SingleTodo