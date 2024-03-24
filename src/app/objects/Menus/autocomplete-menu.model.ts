import { RetornoPadrao } from "../RetornoPadrao";

export interface EstruturaAutoCompleteMenu extends RetornoPadrao
{
  data: {
    pages: PageItem[]
  } 
}

export interface PageItem {
  nome: string,
  url: string
}