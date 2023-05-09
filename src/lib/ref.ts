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



export class refHook<Type> {
  value: Type;
  private listeners: Map<string, () => void>;
  private id: number;
  constructor(value: Type) {
    // The value
    this.value = value;
    // Map of listeners by id
    this.listeners = new Map<string, () => void>();
    // Current listener id
    this.id = 1;
  }
  Value = () => {
    // Create a closere nicer syntax in reactive elements
    return this.value;
  };

  Clean() {
    // Remove all listeners
    this.listeners = new Map<string, () => void>();
  }
  Set(nv: Type) {
    // Set a new value and trigger listeners
    this.value = nv;
    this.Trigger();
  }
  Update(nv: (v: Type) => Type) {
    // set the value with the result of the update function and trigger listeners
    this.value = nv(this.value);
    this.Trigger();
  }
  Trigger() {
    // extract functions from listeners map
    const cbs = Array.from(this.listeners.values());
    // Call each listener function
    for (let i = 0; i < cbs.length; i++) {
      cbs[i]();
    }
  }
  private ID() {
    // Return an incremented (localy unique) listener id
    this.id = this.id + 1;
    return this.id;
  }
  Reg = (func: () => void) => {
    // Get a new id
    let id = this.ID().toString();
    // Add listener under it's id
    this.listeners.set(id, func);
    return () => {
      // return a function that deletes this listener
      this.listeners.delete(id);
    };
  };
}
export function ref<Type>(ival: Type): refHook<Type> {
  let st = new refHook<Type>(ival);
  return st;
}
