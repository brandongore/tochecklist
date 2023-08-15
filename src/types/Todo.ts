import { generateUniqueId } from "../helpers/helpers";

export interface Todo {
    id: number;
    name: string;
    done?: boolean;
}

export class Todo implements Todo {
    id: number = generateUniqueId();
    name: string = "";
    done?: boolean = false;
}

export interface UITodo {
    id: number;
    name: string;
    done?: boolean;
    editing: boolean;
}

export class UITodo implements UITodo {
    id: number;
    name: string;
    done?: boolean;
    editing: boolean;

    constructor(todo: Todo){
        this.id = todo.id;
        this.name = todo.name;
        this.done = todo.done;
        this.editing = false;
    }
}