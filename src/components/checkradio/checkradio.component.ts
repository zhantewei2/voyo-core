import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import "./checkradio.webscss";
import { VoyoOutput } from "@voyo/core/components";
import { BtnTypeVarious } from "@voyo/core/types/base-types";

@VoyoDor({
  name: "voyo-checkradio",
  template: `
    <div class='vo-checkradio'>
           <div class='back-img box' > 
<svg t="1608797559888" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1540" width="200" height="200"><path d="M512 85.333333C276.48 85.333333 85.333333 276.48 85.333333 512S276.48 938.666667 512 938.666667 938.666667 747.52 938.666667 512 747.52 85.333333 512 85.333333z m0 796.444445c-203.662222 0-369.777778-166.115556-369.777778-369.777778S308.337778 142.222222 512 142.222222 881.777778 308.337778 881.777778 512 715.662222 881.777778 512 881.777778z" p-id="1541" fill="var(--color-primary)"></path><path d="M512 512m-250.311111 0a250.311111 250.311111 0 1 0 500.622222 0 250.311111 250.311111 0 1 0-500.622222 0Z" p-id="1542" fill="var(--color-primary)"></path></svg>
           </div>
           <div class='back-img boxOutline'>
               <svg t="1608797493494" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1395" width="200" height="200"><path d="M512 85.333333C276.48 85.333333 85.333333 276.48 85.333333 512S276.48 938.666667 512 938.666667 938.666667 747.52 938.666667 512 747.52 85.333333 512 85.333333z m0 796.444445c-203.662222 0-369.777778-166.115556-369.777778-369.777778S308.337778 142.222222 512 142.222222 881.777778 308.337778 881.777778 512 715.662222 881.777778 512 881.777778z" p-id="1396" fill="var(--color-primary)"></path></svg>
            </div>
        <input class='vo-checkradio-box' type="checkbox"   id="checkboxId">
    </div>
  `,
  styles: require("./checkradio.webscss"),
})
export class CheckradioComponent extends VoyoComponent {
  @VoyoOutput({ event: "voyoTap" }) voyoTap: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();
  @VoyoInput({ defaultValue: 0 }) set value(v: BtnTypeVarious) {
    if (v) {
      if (this.box) this.box.style.display = "inline-flex";
      if (this.boxOutline) this.boxOutline.style.display = "none";
      if (this.checkboxIdEl) this.checkboxIdEl.checked = true;
      //if(this.checkPic) this.checkPic.classList.remove('img-checkOutline') , this.checkPic.classList.add('img-checkbox');
    } else {
      if (this.box) this.box.style.display = "none";
      if (this.boxOutline) this.boxOutline.style.display = "inline-flex";
      if (this.checkboxIdEl) this.checkboxIdEl.checked = false;
      //if(this.checkPic) this.checkPic.classList.remove('img-checkbox') , this.checkPic.classList.add('img-checkOutline');
    }
  }
  checkboxIdEl: HTMLInputElement;
  headerWrapper: HTMLElement;
  box: HTMLElement;
  checkPic: HTMLElement;
  boxOutline: HTMLElement;
  created() {
    console.log(2222);
    this.headerWrapper = this.shadowRoot.querySelector(".vo-checkradio");
    this.box = this.headerWrapper.querySelector(".box") as HTMLElement;
    this.boxOutline = this.headerWrapper.querySelector(
      ".boxOutline",
    ) as HTMLElement;
    this.checkboxIdEl = this.headerWrapper.querySelector(
      "#checkboxId",
    ) as HTMLInputElement;
    this.checkboxIdEl.addEventListener("change", (e: any) => {
      this.subtm(e);
    });
  }
  subtm(e: any) {
    if (e.target.checked == true) {
      this.box.style.display = "inline-flex";
      this.boxOutline.style.display = "none";
    } else {
      this.box.style.display = "none";
      this.boxOutline.style.display = "inline-flex";
    }
    this.voyoTap.next(e.target.checked);
  }
}
