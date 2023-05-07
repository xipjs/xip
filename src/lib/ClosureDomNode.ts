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
