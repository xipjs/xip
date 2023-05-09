const template = {
  Dirs: ["src", "src/components"],
  Files: {
    "package.json": `{
  "name": "xip_template",
  "private": true,
  "version": "0.2.0",
  "type": "module",
  "main": "index.ts",
  "scripts": {
    "dev": "vite",
    "public": "vite --host",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "typescript": "^4.9.3",
    "vite": "^4.0.0"
  },
  "dependencies": {
    "@xipjs/xip": "^0.2.2"
  }
}`,
    "tsconfig.json": `{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@xipjs/xip/jsx-runtime",
    "target": "ES5",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ESNext", "DOM"],
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "noEmit": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitThis": true
  },
  "include": ["src"]
}`,
    "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>
  <script type="module" src="./src/index.ts"></script>
</html>`,
    "src/app.tsx": `import Counter from "./components/counter";

export default function App() {
  return <Counter />;
}`,
    "src/index.ts": `import { Engage } from "@xipjs/xip";
import App from "./App";

Engage(App, (e) => document.body.replaceChildren(e)); `,
    "src/components/counter.tsx": `import { ref } from "@xipjs/xip";

export default function Counter() {
  // define the count state
  let count = ref(0);
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
}`,
  },
};
module.exports.template = template;
