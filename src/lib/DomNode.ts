export abstract class CDN {
  constructor() {}
  // return dom node and build if not already
  abstract ToDomNode(RenCTX: any): Element | Text | DocumentFragment;
  // remove entire node
  abstract Remove(): Promise<any>;
  // traverses nodes for rerenderable's
  abstract ReRender(RenCTX: any): Promise<any>;
  // replace node
  abstract ReplaceWith(newel: Element | DocumentFragment | Text): Promise<any>;
}

export function NewRenCTX() {
  let onEnds = [];
  return {
    End: () => {
      onEnds.forEach((fu) => fu());
    },
    OnEnd: (fu) => {
      onEnds.push(fu);
    },
  };
}
