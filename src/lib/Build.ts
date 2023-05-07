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
