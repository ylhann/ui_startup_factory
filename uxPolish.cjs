const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace backgrounds
code = code.replace(/background: "#000000",/g, ''); // Let the global #0a0a0a apply
code = code.replace(/background: "#0a0a0a",/g, 'background: "rgba(10, 10, 10, 0.4)", backdropFilter: "blur(40px)",');

// Global font fix
code = code.replace(/fontFamily: "sans-serif",/g, '');
code = code.replace(/fontFamily: "inherit",/g, '');

// A bit more padding on cards for a polished layout
code = code.replace(/padding: 16,/g, 'padding: 20,');
code = code.replace(/padding: 12,/g, 'padding: 16,');

// Smoother shadows
code = code.replace(/boxShadow: "0 0 15px rgba\(255,255,255,0\.15\)"/g, 'boxShadow: "0 8px 30px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.2)"');
code = code.replace(/boxShadow: "0 0 20px rgba\(255,255,255,0\.3\)"/g, 'boxShadow: "0 4px 20px rgba(0,0,0,0.3)"'); // For the logo
code = code.replace(/boxShadow: "0 0 10px rgba\(237,237,237,0\.4\)"/g, 'boxShadow: "0 8px 20px rgba(0,0,0,0.4)"'); 
code = code.replace(/boxShadow: "0 4px 12px rgba\(0,0,0,0\.2\)"/g, 'boxShadow: "0 10px 40px rgba(0,0,0,0.5)"');

fs.writeFileSync('src/App.tsx', code);
console.log("UX Polish applied!");
