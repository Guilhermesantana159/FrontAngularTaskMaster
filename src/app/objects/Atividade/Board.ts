import { Column } from "./Column";

export class Board {
  constructor(public idColumn: number, public columns: Column[]) {}
}
