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



import { ClosureDomNode } from "./ClosureDomNode";
import { CDN, NewRenCTX } from "./DomNode";
import { FragmentDomNode } from "./FragmentDomNode";
import { TextDomNode } from "./TextDomNode";
import { XipElementAttributes } from "../types";
import { ElementDomNode } from "./ElementNode";
export function BuildCDN(child: any): CDN {
  if (child instanceof CDN) {
    return child;
  }
  switch (typeof child) {
    case "function":
      let tfd = new ClosureDomNode(child);
      return tfd;
    case "string":
      return new TextDomNode(child);
    case "number":
      return new TextDomNode(child.toString());
    case "object":
      if (Object.prototype.toString.call(child) === "[object Array]") {
        return new FragmentDomNode(child);
      }
      return new TextDomNode(child.toString());
    default:
      if (!child) {
        return new TextDomNode("");
      }
      try {
        return new TextDomNode(child.toString());
      } catch {
        return new TextDomNode("");
      }
  }
}
export async function Render(ren: (ctx) => any) {
  let ctx = NewRenCTX();
  let r = await ren(ctx);
  ctx.End();
  return r;
}

export function Engage(Ui: () => CDN, cb: (e: Element | any) => void): CDN {
  let n;
  Render((ctx) => {
    n = Ui();
    cb(n.ToDomNode(ctx));
  });
  return n;
}

export function BuildFunctionalDomNode(
  func: (props: any) => CDN,
  props: any
): CDN {
  return func(props);
}
export function CreateElement(
  type: string,
  Attributes: XipElementAttributes,
  ...Children: any[]
): ElementDomNode {
  return new ElementDomNode(type, Attributes, Children);
}
export function CreateFunctionalElement(
  type: (props: any) => CDN,
  Attributes: XipElementAttributes
): CDN {
  let child = BuildFunctionalDomNode(type, Attributes);
  return child;
}
export function CreateFragmentElement(Children: any[]): CDN {
  return new FragmentDomNode(Children);
}
