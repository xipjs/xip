import { CDN } from "./DomNode";

export class TextDomNode extends CDN {
  DomNode: Text;
  constructor(text: string) {
    super();
    // Predefine the element since nothing can change
    this.DomNode = document.createTextNode(text);
  }
  ToDomNode(): Text {
    // Does not requre building
    return this.DomNode;
  }
  async ReplaceWith(newel: Element | DocumentFragment | Text): Promise<any> {
    // Replace the text node in the dom
    this.DomNode.replaceWith(newel);
  }

  async Remove(): Promise<any> {
    // Remove the text node from the dom
    this.DomNode.remove();
  }
  async ReRender(): Promise<any> {
    // End of chain
  }
}
