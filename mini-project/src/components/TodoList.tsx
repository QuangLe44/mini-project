import React from "react";
import "./styles.css";
import { Todo } from "../model";
import SingleTodo from "./SIngleTodo";

interface Props{
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const TodoList: React.FC<Props> = ({todos, setTodos}) => {
    return (
        <div className="todos">
            {todos.map((todo) => (
                <SingleTodo todo={todo} 
                key={todo.id} 
                todos={todos} 
                setTodos={setTodos}></SingleTodo>
            ))}
        </div>
    )
}

export default TodoList