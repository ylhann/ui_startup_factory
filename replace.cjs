const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace hex codes globally
code = code.replace(/#1e293b/gi, '#262626'); // neutral-800
code = code.replace(/#0f172a/gi, '#171717'); // neutral-900 
code = code.replace(/#0b1120/gi, '#0a0a0a'); // neutral-950
code = code.replace(/#020408/gi, '#0a0a0a'); // neutral-950
code = code.replace(/#060d14/gi, '#0a0a0a'); // neutral-950
code = code.replace(/#334155/gi, '#404040'); // neutral-700
code = code.replace(/rgba\(30,58,95,0\.4\)/g, 'rgba(255,255,255,0.05)');
code = code.replace(/rgba\(30,58,95,0\.8\)/g, 'rgba(255,255,255,0.1)');
code = code.replace(/rgba\(15,23,42,/gi, 'rgba(20,20,20,'); // dark backdrop
code = code.replace(/rgba\(9,17,26,/gi, 'rgba(10,10,10,'); // header
code = code.replace(/#1e3a5f/gi, '#262626');

// Replace text colors
code = code.replace(/#f8fafc/gi, '#fafafa'); // neutral-50
code = code.replace(/#f1f5f9/gi, '#f5f5f5'); // neutral-100
code = code.replace(/#e2e8f0/gi, '#e5e5e5'); // neutral-200
code = code.replace(/#cbd5e1/gi, '#a3a3a3'); // neutral-400
code = code.replace(/#94a3b8/gi, '#737373'); // neutral-500
code = code.replace(/#64748b/gi, '#525252'); // neutral-600

// Make it look cleaner, like Vercel/Linear
code = code.replace(/#22d3ee/gi, '#ededed');
code = code.replace(/rgba\(6,182,212,/gi, 'rgba(255,255,255,');
code = code.replace(/#06b6d4/gi, '#e5e5e5');
code = code.replace(/#3b82f6/gi, '#3b82f6'); // keep blue for some buttons, it's nice

// Remove monospace font-family everywhere except maybe logs
code = code.replace(/fontFamily: "monospace"/g, 'fontFamily: "inherit"');
code = code.replace(/fontFamily:"monospace"/g, 'fontFamily:"inherit"');
code = code.replace(/fontStyle: "italic"/g, 'fontStyle: "normal"');
code = code.replace(/fontStyle:"italic"/g, 'fontStyle:"normal"');

// Tighter borders
code = code.replace(/borderRadius: 28/g, 'borderRadius: 16');
code = code.replace(/borderRadius: 24/g, 'borderRadius: 16');
code = code.replace(/borderRadius: 20/g, 'borderRadius: 12');
code = code.replace(/borderRadius:28/g, 'borderRadius:16');
code = code.replace(/borderRadius:24/g, 'borderRadius:16');
code = code.replace(/borderRadius:20/g, 'borderRadius:12');

// Fix the map background grid lines if any
code = code.replace(/rgba\(30, 41, 59, 0\.8\)/g, 'rgba(255,255,255,0.05)');

fs.writeFileSync('src/App.tsx', code);
console.log("Colors explicitly replaced!");
