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
