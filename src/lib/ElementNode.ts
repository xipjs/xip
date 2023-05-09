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



import { CDN } from "./DomNode";
import { BuildCDN, Render } from "./Build";
export class ElementDomNode extends CDN {
  type: string;
  Children: any[];
  childCDNS: CDN[];
  DomNode: HTMLElement;
  Cleaners: (() => void)[];
  Renders: (() => void)[];
  OnRemove: ((Element: Element) => Promise<any>)[];
  Ats: any;
  // defer: boolean;
  Creator: () => ElementDomNode;
  constructor(type: string, Attributes: any, Children: CDN[]) {
    super();
    this.Children = Children;
    this.OnRemove = [];
    this.Ats = Attributes;
    this.type = type;
    this.Renders = [];
    this.childCDNS = [];
    this.Cleaners = [];
    // this.defer = false;
  }

  ToDomNode(RenCTX: any): Element | Text | DocumentFragment {
    if (!this.DomNode) {
      this.Build(RenCTX);
    }
    return this.DomNode;
  }
  Build(RenCTX: any) {
    this.childCDNS = [];
    let newel = document.createElement(this.type);
    if (this.Ats.HotProps) {
      this.Renders.push(() => this.AdAts(newel, this.Ats.HotProps, RenCTX));
      delete this.Ats.HotProps;
    }
    this.AdAts(newel, this.Ats, RenCTX);
    // if (this.defer) {
    //   RenCTX.OnEnd(() => Render((ctx) => this.RenderAllChildren(newel, ctx)));
    // } else {
    for (let i = 0; i < this.Children.length; i++) {
      let c = BuildCDN(this.Children[i]);
      this.childCDNS.push(c);
      newel.appendChild(c.ToDomNode(RenCTX));
    }
    // }
    this.DomNode = newel;
  }
  Clean() {
    for (let i = 0; i < this.Cleaners.length; i++) {
      this.Cleaners[i]();
    }
    this.Cleaners = [];
  }
  async ReplaceWith(newel: Element | DocumentFragment | Text): Promise<any> {
    for (let i = 0; i < this.OnRemove.length; i++) {
      await this.OnRemove[i](this.DomNode);
    }
    for (let i = 0; i < this.childCDNS.length; i++) {
      await this.childCDNS[i].Remove();
    }
    this.Clean();
    this.DomNode.replaceWith(newel);
  }
  async ReRender(RenCTX: any): Promise<any> {
    for (let i = 0; i < this.Renders.length; i++) {
      this.Renders[i]();
    }
    for (let i = 0; i < this.childCDNS.length; i++) {
      await this.childCDNS[i].ReRender(RenCTX);
    }
  }
  Remove = async () => {
    this.Clean();
    for (let i = 0; i < this.OnRemove.length; i++) {
      await this.OnRemove[i](this.DomNode);
    }
    for (let i = 0; i < this.childCDNS.length; i++) {
      await this.childCDNS[i].Remove();
    }
    this.DomNode.remove();
  };
  AdAts(newel, Attributes, RenCTX: any) {
    Object.keys(Attributes).forEach((Name) => {
      let value = Attributes[Name];
      switch (Name) {
        case "x":
          // Create a closure for context
          let t = () => {
            return this.DomNode;
          };
          let api = {
            get el() {
              return t();
            },
            Update: () => Render((ctx) => this.ReRender(ctx)),
            onUpdate: (f) => this.Renders.push(f),
            Remove: this.Remove,
            onRemove: this.OnRemove.push,
            Clean: () => this.Clean(),
            onClean: (e) => this.Cleaners.push(e),
          };
          if (!value) {
            break;
          }
          if (Array.isArray(value)) {
            value.forEach((item) => {
              this.Renders.push(item(api));
            });
          } else {
            // Pass the api to the extension
            value(api);
          }

          break;
        case "className":
          if (typeof value === "function") {
            this.Renders.push(() => (this.DomNode.className = value()));
            newel.className = value();
          } else {
            newel.className = value;
          }
          break;
        case "reStyle":
          if (!value) {
            break;
          }
          if (Array.isArray(value)) {
            let nren = () => {
              value.shift()(newel.style);
            };
            value.forEach((item) => {
              this.Renders.push(item(nren));
            });
          } else {
            value(newel.style);
          }
          break;
        case "Style":
          Object.assign(newel.style, value);
          break;

        // case "CleanUp":
        //   if (value === undefined) {
        //     break;
        //   }
        //   if (Array.isArray(value.react)) {
        //     value.forEach((item) => {
        //       this.Cleaners.push(item);
        //     });
        //   } else {
        //     this.Cleaners.push(value);
        //   }
        //   break;
        case "onRemove":
          if (value === undefined) {
            break;
          } else {
            const promise3 = async (node) => await value(node);
            this.OnRemove.push(promise3);
          }
          break;
        case "on":
          if (Array.isArray(value[0])) {
            value.forEach((item) => {
              newel.addEventListener(item[0], item[1]);
            });
          } else {
            newel.addEventListener(value[0], value[1]);
          }
          break;
        case "onDom":
          RenCTX.OnEnd(() => value(newel));
          break;
        case "focus":
          newel.autofocus = value;
          newel.focus();
          break;
        case "class":
          newel.className = value;
          break;

        case `onClick`:
          newel.addEventListener("click", value);
          break;
        case `withRender`:
          value(newel);
          break;
        // case "getRemover":
        //   value(() => this.Remove());
        //   break;
        // case "defer":
        //   this.defer = true;
        //   break;
        case "react":
          if (!value) {
            break;
          }
          let ren = () => Render((ctx) => this.ReRender(ctx));
          if (Array.isArray(value)) {
            value.forEach((item) => {
              this.Cleaners.push(item(ren));
            });
          } else {
            this.Cleaners.push(value(ren));
          }
          break;
        default:
          newel.setAttributeNS(null, Name, value);
      }
    });
  }
}
