import { Subject } from "rxjs";

export interface VoyoComponentParams {
  template: string;
  styles?: Function | string;
  name?: string;
  styleUrl?: string;
}
export interface VoyoComponentLifeHooks {
  //component created after constructor completed.
  // before input
  created?: any;
  // after input
  afterCreate?: any;
  //component attributes changed.g
  updated?: any;
  // connectedCallback trigger once. after connectedCallback
  mounted?: any;
}

export interface VoyoTemplateParams {
  tag: string;
  className?: string;
  render: (() => string) | string;
  renderCache?: boolean;
  renderCallback?: (el: HTMLElement) => void;
  insertedCallback?: (el: HTMLElement) => void;
}
export interface VoyoTemplateRemoveAnParams {
  className: string;
  duration: number;
}
export interface VoyoTemplateRef {
  el?: HTMLElement;
  container?: HTMLElement;
  insert: (container: HTMLElement, animateClassName?: string) => boolean;
  remove: (animateClassName?: string) => boolean;

  renderCached?: boolean;
  inserted?: boolean;
  inserting?: boolean;
  leaving?: boolean;
  insertClassName?: string;
  leaveClassName?: string;
  inTree?: boolean;
}

export interface VoyoComponentInterface extends VoyoComponentLifeHooks {
  shadowRoot?: HTMLElement;
  _voyoData?: VoyoComponentParams;
  _componentName?: string;
  handlers?: Array<(target: any) => void>;
  connectedCallback?: () => void;
}

export class VoyoComponent extends HTMLElement
  implements VoyoComponentInterface {
  _voyoData: VoyoComponentParams;
  shadowRoot: HTMLElement | any;
  handlers: Array<(target: any) => void>;
  voyoConnected: Subject<any> = new Subject<any>();
  voyoConnectCompleted: boolean;
}

export class VoyoEventEmitter<T> extends Subject<T> {}
