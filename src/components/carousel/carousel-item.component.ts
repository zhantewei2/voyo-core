import { VoyoEventEmitter, VoyoComponent } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import { ClassManage } from "../../utils";
import { Subject } from "rxjs";
import anime from "animejs/lib/anime.es.js";
import { MoveChangeParams, MoveChangeType } from "./carousel.interface";

export type PositionState = "left" | "mid" | "right";

@VoyoDor({
  template: `
<slot></slot>
  `,
})
export class CarouselItemComponent extends VoyoComponent {
  index: number;
  @VoyoInput({ name: "order" }) order: string;
  public orderIndex: number;
  width: number;
  classM: ClassManage;
  isVisible = false;
  animateRun = false;
  containerWidth: number;
  transformMove(disX: any) {
    this.visible();
    if (this.positionState === "right") {
      disX = this.containerWidth + disX;
    } else if (this.positionState === "left") {
      disX = 0 - this.containerWidth + disX;
    }
    this.moveDis = disX;
    this.style.transform = `translateX(${disX}px)`;
  }
  animateMoveChange: Subject<MoveChangeParams> = new Subject<
      MoveChangeParams
      >();
  listenAnimate(
      startPos: number,
      targetPos: number,
      indexPos: number,
      moveType: MoveChangeType,
      progress: number,
  ) {
    let relativeV = 0;
    progress = progress / 100;
    if (moveType === "to" || moveType === "toIndex") {
      relativeV =
          (startPos + (targetPos - startPos) * progress) / this.containerWidth;
    } else if (moveType === "reset") {
      const dis = targetPos - startPos;
      relativeV = (dis - dis * progress) / this.containerWidth;
      relativeV = startPos > 0 ? Math.abs(relativeV) : 0 - Math.abs(relativeV);
    }
    this.animateMoveChange.next({
      v: (targetPos - startPos > 0 ? progress : 0 - progress) / 100,
      relativeV: relativeV,
      type: moveType,
    });
  }

  created() {
    this.classM = new ClassManage(this as any);
  }
  connectedCallback() {
    this.containerWidth = (this.parentNode as any).offsetWidth;
    if (!this.containerWidth) {
      setTimeout(
          () => (this.containerWidth = (this.parentNode as any).offsetWidth),
      );
    }
    this.classList.add("carousel-page");
    if (!this.isVisible) this.classList.add("no-display");
  }
  visible() {
    if (this.isVisible) return;
    this.isVisible = true;
    this.classList.remove("no-display");
  }
  hid() {
    if (!this.isVisible) return;
    this.isVisible = false;
    this.classList.add("no-display");
  }
  set positionState(v: PositionState) {
    this.positionStatePre = this.positionStateCurrent;
    this.positionStateCurrent = v;
  }
  get positionState() {
    return this.positionStateCurrent;
  }

  positionStateCurrent: PositionState = "mid";
  positionStatePre: PositionState = "mid";
  moveDis = 0;
  atLeft() {
    if (this.positionState === "left") return;
    this.style.transform = "translateX(-100%)";
    this.positionState = "left";
    this.moveDis = 0 - this.containerWidth;
  }
  atRight() {
    if (this.positionState === "right") return;
    this.style.transform = "translateX(100%)";
    this.positionState = "right";
    this.moveDis = this.containerWidth;
  }
  atMid() {
    // if(this.positionState==="mid")return;
    this.style.transform = "translateX(0)";
    this.positionState = "mid";
    this.moveDis = 0;
  }
  atPosition(pos: PositionState) {
    if (pos === "mid") {
      this.atMid();
    } else if (pos === "left") {
      this.atLeft();
    } else if (pos === "right") {
      this.atRight();
    }
  }
  switchTransform(pos: PositionState): number {
    if (pos === "mid") {
      return 0;
    } else if (pos === "left") {
      return 0 - this.containerWidth;
    } else if (pos === "right") {
      return this.containerWidth;
    }
    return 0;
  }

  animateTo(
      transitionDuration: number,
      pos: "mid" | "left" | "right",
      animateEnd?: () => void,
      specifyIndex?: boolean,
  ) {
    if (pos === this.positionState) return;
    this.animateRun = true;
    const startPos = this.moveDis;
    const targetPos = this.switchTransform(pos);
    anime({
      targets: this,
      translateX: [startPos + "px", targetPos + "px"],
      duration: transitionDuration,
      easing: "easeOutQuart",
      update: (an: any) =>
          this.listenAnimate(
              startPos,
              targetPos,
              this.switchTransform(this.positionState),
              specifyIndex ? "toIndex" : "to",
              an.progress,
          ),
      complete: (an: any) => {
        this.animateRun = false;
        this.atPosition(pos);
        animateEnd && animateEnd();
      },
    });
  }

  clearTransformStyleAn(duration: number, animateEnd: () => void) {
    this.animateRun = true;
    const startPos = this.moveDis;
    const targetPos = this.switchTransform(this.positionState);
    anime({
      targets: this,
      translateX: [this.moveDis, this.switchTransform(this.positionState)],
      duration,
      easing: "linear",
      update: (an: any) =>
          this.listenAnimate(
              startPos,
              targetPos,
              targetPos,
              "reset",
              an.progress,
          ),
      complete: (an: any) => {
        this.animateRun = false;
        animateEnd && animateEnd();
      },
    });
  }
}

