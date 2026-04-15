import fs from 'node:fs';
const file = '/Users/seanmott/.gemini/antigravity/brain/ff551d7a-95b8-4242-9fbc-5589911523b1/playbill-wedding/src/App.css';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
`.nav-arrows {
  position: fixed;
  top: 50%;
  left: 0;
  width: 100vw;
  transform: translateY(-50%);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  pointer-events: none;
  z-index: 1000;
  padding: 0 20px;
}`,
`.nav-arrows {
  position: fixed;
  top: 50%;
  left: 0;
  width: 100vw;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  pointer-events: none;
  z-index: 1000;
  padding: 0 20px;
}`);
fs.writeFileSync(file, content);
console.log('Patch applied successfully');
