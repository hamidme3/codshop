const fs = require('fs');
let code = fs.readFileSync('src/lib/puck-config.tsx', 'utf8');
let open = 0, close = 0;
for (let c of code) {
  if (c === '{') open++;
  if (c === '}') close++;
}
while (close < open) {
  code = code.replace(/export const puckConfig/, '};\nexport const puckConfig');
  close++;
}
fs.writeFileSync('src/lib/puck-config.tsx', code);
