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



import { BuildCDN } from "./Build";
import { CDN } from "./DomNode";
export class ClosureDomNode extends CDN {
  CDN: CDN;
  fun: () => any;
  PrevRens: any[];
  busy: boolean;
  constructor(fun: () => any) {
    super();
    this.fun = fun;
    this.PrevRens = [];
    this.busy = false;
  }
  PlsRen(r: () => Promise<any>): Promise<any> {
    return new Promise((resolve) => {
      this.PrevRens.push([r, resolve]);
      this.CheckRens();
    });
  }
  async CheckRens() {
    let c = this.PrevRens.shift();
    c
      ? c[0]().then(() => {
          c[1]();
          this.CheckRens();
        })
      : (this.busy = false);
  }
  ToDomNode(RenCTX: any): Element | Text | DocumentFragment {
    if (!this.CDN) {
      this.CDN = BuildCDN(this.fun());
    }
    return this.CDN.ToDomNode(RenCTX);
  }
  async Remove(): Promise<any> {
    await this.CDN.Remove();
  }
  async ReplaceWith(newel: Element | DocumentFragment | Text): Promise<any> {
    await this.CDN.ReplaceWith(newel);
  }
  async ReRender(RenCTX: any): Promise<any> {
    return new Promise((resolve) => {
      this.PrevRens.push([
        async () => {
          let old = this.CDN;
          this.CDN = BuildCDN(this.fun());
          await old.ReplaceWith(this.CDN.ToDomNode(RenCTX));
        },
        () => resolve(null),
      ]);
      if (!this.busy) {
        this.busy = true;
        this.CheckRens();
      }
    });
  }
}
