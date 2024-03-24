import { RetornoPadrao } from "../RetornoPadrao"

export interface SelectPadrao extends RetornoPadrao{ 
    data: Array<BaseOptions>
}

export interface BaseOptions{ 
    description: string,
    value: number
}
