import { ref } from "@xipjs/xip";

export default function Counter() {
  // define the count state
  let count = ref (0);
  return (
    <span>
      {/* tell the h1 to react to the count state */}
      <h1 react={count.Reg}>{() => count.value}</h1>
      {/* add buttons to update the count causing the h1 to update */}
      <button onClick={() => count.Set(count.value + 1)}>+</button>
      <button onClick={() => count.Set(count.value - 1)}>-</button>
      <hr />
    </span>
  );
}
