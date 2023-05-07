import { ElementAttributes } from "./lib/Elements";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: XipElementAttributes;
    }
  }
}

export interface XipElementAttributes {
  // Selectors
  id?: string; // html id
  class?: string; // html class
  className?: string | (() => string); // Reactiv class

  // Inline Style
  style?: string; //html style
  Style?: CSSStyleDeclaration;
  reStyle?: (style: CSSStyleDeclaration) => void;

  // Render Stages
  withRender?: (e?: Element) => void; // While the component is being built
  onDom?: (e?: Element) => void; // As soon as the component is added to the dom
  onRemove?: (e?: Element) => Promise<any>; // Before the component leaves the dom

  // Dom Events
  on?:
    | [EventName: string, CallBack: (event?: Event) => void] // calls element.addEventListener(EventName, CallBack);
    | [[EventName: string, CallBack: (event?: Event) => void]]; // use a 2d arry to add multiple event listener's
  onClick?: (event?: Event) => void;
  onInput?: (event?: Event) => void;
  onSubmit?: (event?: Event) => void;
  onContextMenu?: (event?: Event) => void;

  // Other
  x?: (api: EAPI) => void | [(api: EAPI) => void]; // pass 1, or an array of extensions
  focus?: boolean; //
  getRemover?: (remove: () => void) => void; // recieve a callback to saftly remove the element
  HotProps?: () => ElementAttributes; // Runs when the element is told to ReRender and directly apply's the new attributes without rerendering
  react?:
    | ((func: () => void) => () => void) // Recieve a rerender function and return a cleanup function
    | [(func: () => void) => () => void]; // Register multiple with an array

  [key: string]: any; // add attributes to the dom element
}

export interface EAPI {
  el: Element;
  Update: () => Promise<any>;
  onUpdate: (f: () => void) => void;
  Remove: () => Promise<any>;
  onRemove: (f: () => any) => void;
  Clean: () => void;
  onClean: (f: () => void) => void;
}
