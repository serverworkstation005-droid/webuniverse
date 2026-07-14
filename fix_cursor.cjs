const fs = require('fs');
let code = fs.readFileSync('src/components/AuraCursor.tsx', 'utf8');

// For smoother cursor, increase stiffness so it follows faster, decrease damping so it doesn't drag too much
const targetSpring = `const springConfig = { damping: 22, stiffness: 151, mass: 0.5 };`;
const newSpring = `const springConfig = { damping: 25, stiffness: 250, mass: 0.2 };`;
code = code.replace(targetSpring, newSpring);

const targetDot = `const dotX = useSpring(mouseX, { damping: 40, stiffness: 600, mass: 0.08 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 600, mass: 0.08 });`;
const newDot = `const dotX = useSpring(mouseX, { damping: 30, stiffness: 800, mass: 0.05 });
  const dotY = useSpring(mouseY, { damping: 30, stiffness: 800, mass: 0.05 });`;
code = code.replace(targetDot, newDot);

fs.writeFileSync('src/components/AuraCursor.tsx', code);
