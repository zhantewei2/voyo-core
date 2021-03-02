import {
  VoyoComponent,
  VoyoEventEmitter,
} from "../commonComponent";
import { VoyoDor, VoyoInput,VoyoTemplate } from "../BaseComponent";
import {RelativeFixed} from "../../utils/RelativeFixed";

export class ForElement extends HTMLElement{
  voyocMenuForElListenerName:any;
}

@VoyoDor({
  template:`
<span>
  <div class="voyo-menu-wrapper">
    <div class="_layout-bg"></div>
    <article>
      <slot name="menu"></slot>
    </article>
  </div>
</span>
  `
})
export class MenuComponent extends VoyoComponent{
  relativeFixed:RelativeFixed=new RelativeFixed();
  wrapperEl:HTMLElement;
  @VoyoInput({name:"clickTrigger",defaultValue:true})clickTrigger:boolean;
  @VoyoInput({name:"forEl"})set forEl(el:ForElement){
    if(el instanceof HTMLElement){
      if(el.voyocMenuForElListenerName)return;
      if(this.clickTrigger){
        el.voyocMenuForElListenerName=(e:Event)=>{this.open(e)};
        el.addEventListener("click",el.voyocMenuForElListenerName);
      }
    }
  };
  created(){
    this.wrapperEl=this.shadowRoot.querySelector("voyo-menu-wrapper");
  }

  open(e:Event){
    document.body.appendChild(this.wrapperEl);
  }
}