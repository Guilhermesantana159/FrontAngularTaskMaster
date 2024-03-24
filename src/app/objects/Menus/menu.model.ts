import { RetornoPadrao } from "../RetornoPadrao";

export interface EstruturaMenu extends RetornoPadrao
{
  data: {
    menu: MenuItem[]
  } 
}

export interface MenuItem {
  id?: number;
  label?: any;
  icon?: string;
  link?: string;
  subItems?: any;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
  isLayout?: boolean;
  collapseid?: string;
}