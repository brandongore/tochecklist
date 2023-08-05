import { CheckListConfigType } from "./CheckListConfigType";

export interface Config {
    checklists: CheckListConfigType[],
    showCompleted: boolean
}

export class Config implements Config {
    checklists: CheckListConfigType[] = [];
    showCompleted: boolean = false;
}