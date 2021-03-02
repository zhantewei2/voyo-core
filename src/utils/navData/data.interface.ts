export interface NavListItem{
  label:string;
  icon?:string;
  path?:string;
  //是否展开
  open?:boolean;
  children?:NavListItem[];
  //父级对象
  parent?:NavListItem;
  //选中状态
  active?:boolean;
  //是否被选种，include children
  selected?:boolean;
}