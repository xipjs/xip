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
