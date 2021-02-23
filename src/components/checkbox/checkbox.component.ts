import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../../components";
import { BtnTypeVarious } from "../../types/base-types";

@VoyoDor({
  name: "voyo-checkbox",
  template: `
    <div class='vo-checkbox'>
           <div class='back-img box' > 
           <svg t="1607912583899" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1930" xmlns:xlink="http://www.w3.org/1999/xlink" ><path d="M810.666667 128H213.333333a85.333333 85.333333 0 0 0-85.333333 85.333333v597.333334a85.333333 85.333333 0 0 0 85.333333 85.333333h597.333334a85.333333 85.333333 0 0 0 85.333333-85.333333V213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333z m-384 597.333333l-213.333334-213.333333 60.16-60.16L426.666667 604.586667l323.84-323.84L810.666667 341.333333l-384 384z" p-id="1931" fill="var(--color-primary)" ></path></svg>
           </div>
           <div class='back-img boxOutline'>
            <svg t="1607912555815" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1161" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M810.666667 213.333333v597.333334H213.333333V213.333333h597.333334m0-85.333333H213.333333c-46.933333 0-85.333333 38.4-85.333333 85.333333v597.333334c0 46.933333 38.4 85.333333 85.333333 85.333333h597.333334c46.933333 0 85.333333-38.4 85.333333-85.333333V213.333333c0-46.933333-38.4-85.333333-85.333333-85.333333z" p-id="1162" fill="var(--color-primary)"></path></svg>
            </div>
        <input class='vo-checkbox-box' type="checkbox"   id="checkboxId">
    </div>
  `,
  styles: require("./checkbox.webscss"),
})
export class CheckboxComponent extends VoyoComponent {
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
    this.headerWrapper = this.shadowRoot.querySelector(".vo-checkbox");
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
