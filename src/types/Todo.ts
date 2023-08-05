import { generateUniqueId } from "../helpers/helpers";

export interface Todo {
    id: number;
    name: string;
    done?: boolean;
}

export class Todo implements Todo {
    id: number = generateUniqueId();
    name: string = "NEW TODO";
    done?: boolean = false;
}