/*!
MIT License

Copyright (c) 2023 Xip 0.2.0

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/



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
