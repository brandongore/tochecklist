import { Todo } from "./Todo";

export interface CheckListType {
    id: number,
    name: string,
    items: Todo[],
    complete?: boolean,
    dateCompleted?: Date
}