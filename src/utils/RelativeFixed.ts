export type Position="top"|"left"|"right"|"bottom";

export class RelativeFixed{
  /**
   *
   * @param space dropdown 离按钮的间距
   * @param dis 浏览器边的间距
   */
  constructor(space:number=0,dis:number=10){
    this.space=space;
    this.dis=dis;
  }
  space:number;
  dis:number;
  relativePosition(targetEl:HTMLElement,relativeEl:HTMLElement,position:"top"|"left"|"right"|"bottom"="bottom"):{"top":number;"left":number}{
    const rect=relativeEl.getBoundingClientRect();
    const obj={
      rect,
      centerX:rect.left+rect.width/2,
      centerY:rect.top+rect.height/2,
      winH:window.innerHeight,
      winW:document.body.offsetWidth,
      target:targetEl
    };

    return this.switchPosition(position,obj);
  }
  /**
   *
   * @param {"top"|"left"|"right"|"bottom"} position
   * @param obj
   * @param adjust
   */
  switchPosition(position:"top"|"left"|"right"|"bottom",obj:any,adjust:boolean=false):{"top":number;"left":number}{
    let top,left;
    const targetH=obj.target.offsetHeight;
    const targetW=obj.target.offsetWidth;
    // const minW=this.dis;
    const minH=this.dis;
    const maxW=obj.winW-this.dis;
    const maxH=obj.winH-this.dis;
    const getTop=(pos:Position):number=>{
      if(pos=="top")return obj.rect.top-this.space-targetH;
      if(pos=="left")return obj.centerY-targetH/2;
      if(pos=="right")return obj.centerY-targetH/2;
      return obj.rect.bottom+this.space;
    };
    const getLeft=(pos:Position):number=>{
      if(pos=="top")return obj.centerX-targetW/2;
      if(pos=="left")return obj.rect.left-this.space-targetW;
      if(pos=="right")return obj.rect.right+this.space;
      return obj.centerX-targetW/2;
    };
    top=getTop(position);
    left=getLeft(position);
    if (top!==undefined&&top<minH){
      if(position=="top"){
        top=getTop(position="bottom");
      }else{
        top=minH;
      }
    }

    if (left!==undefined&&left<minH){
      if(position=="left"){
        left=getLeft(position="right");
      }else{
        left=minH;
      }
    }
    if (left!==undefined&&left+this.space+targetW>maxW){
      if(position=="right"){
        left=getLeft(position="left");
      }else{
        left=maxW-targetW-this.space;
      }
    }
    if (top!==undefined&&top+this.space+targetH>maxH){
      if(position=="bottom"){
        top=getLeft(position="top");
      }else{
        top=maxH-targetH-this.space;
      }
    }
    return {
      top,left
    }
  }

}