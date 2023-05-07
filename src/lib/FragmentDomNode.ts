import { BuildCDN } from "./Build";
import { CDN } from "./DomNode";
import { TextDomNode } from "./TextDomNode";

export class FragmentDomNode extends CDN {
  ChildrenCDN: CDN[];
  DomNode: DocumentFragment;
  constructor(Children: any[]) {
    super();
    this.ChildrenCDN = [];
    for (let i = 0; i < Children.length; i++) {
      let t = BuildCDN(Children[i]);
      this.ChildrenCDN.push(t);
    }
    if (this.ChildrenCDN.length === 0) {
      this.ChildrenCDN.push(new TextDomNode(""));
    }
  }
  ToDomNode(RenCTX: any): Element | Text | DocumentFragment {
    // Build if not already
    if (!this.DomNode) {
      this.Build(RenCTX);
    }
    // Return current dom element
    return this.DomNode;
  }
  async Remove(): Promise<any> {
    // Fragments arn't on the dom so just remove it's children
    for (let i = 0; i < this.ChildrenCDN.length; i++) {
      await this.ChildrenCDN[i].Remove();
    }
  }
  async ReRender(RenCTX: any): Promise<any> {
    // Rerender each child of the fragment
    for (let i = 0; i < this.ChildrenCDN.length; i++) {
      await this.ChildrenCDN[i].ReRender(RenCTX);
    }
  }
  Build(RenCTX: any) {
    // Create a document fragment to store children before being added to the dom
    let newel = document.createDocumentFragment();
    // Add each child to the document fragment
    for (let i = 0; i < this.ChildrenCDN.length; i++) {
      newel.appendChild(this.ChildrenCDN[i].ToDomNode(RenCTX));
    }
    this.DomNode = newel;
  }
  async ReplaceWith(newel: Element | Text | DocumentFragment): Promise<any> {
    let placeholder = document.createTextNode("");
    this.ChildrenCDN[0].ToDomNode(null).parentElement.appendChild(placeholder);
    let pr = [];
    for (let i = 0; i < this.ChildrenCDN.length; i++) {
      pr.push(this.ChildrenCDN[i].Remove());
    }
    await Promise.all(pr);
    placeholder.replaceWith(newel);
  }
}
