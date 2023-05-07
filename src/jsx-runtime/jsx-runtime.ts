import { CDN } from "../lib/DomNode";
import {
  CreateElement as el,
  CreateFragmentElement,
  BuildFunctionalDomNode,
} from "../lib/Build";
import { XipElementAttributes } from "../types";
function jsx(type: any, opts: XipElementAttributes): CDN {
  if (typeof type === "function") {
    let res = BuildFunctionalDomNode(type, opts);
    return res;
  } else {
    let children = opts.children;
    delete opts.children;
    let nch = nCh(children);
    return el(type, opts, ...nch);
  }
}
function nCh(children: any): any[] {
  if (children !== undefined && children !== null) {
    if (Array.isArray(children)) {
      return children;
    } else {
      return [children];
    }
  }
  return [];
}

const jsxs = (...args: any) => {
  return jsx(args[0], args[1]);
};
const Fragment = (opts: any) => {
  return CreateFragmentElement(opts.children);
};
export { jsx, jsxs, Fragment };
