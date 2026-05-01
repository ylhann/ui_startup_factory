const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Increase all tiny fonts by 2px for better readability
code = code.replace(/fontSize: 8/g, 'fontSize: 10');
code = code.replace(/fontSize: 9/g, 'fontSize: 11');
code = code.replace(/fontSize: 10/g, 'fontSize: 12');
code = code.replace(/fontSize: 11/g, 'fontSize: 13');
code = code.replace(/fontSize: 12/g, 'fontSize: 13'); // bump 12 to 13
code = code.replace(/fontSize: 13/g, 'fontSize: 14');
code = code.replace(/fontSize: 14/g, 'fontSize: 15');

// For string-based inline styles
code = code.replace(/fontSize:"8"/g, 'fontSize:"10"');
code = code.replace(/fontSize:"9"/g, 'fontSize:"11"');
code = code.replace(/fontSize:"10"/g, 'fontSize:"12"');
code = code.replace(/fontSize:"11"/g, 'fontSize:"13"');
code = code.replace(/fontSize:"12"/g, 'fontSize:"13"');
code = code.replace(/fontSize:"13"/g, 'fontSize:"14"');
code = code.replace(/fontSize:"14"/g, 'fontSize:"15"');
code = code.replace(/fontSize:8/g, 'fontSize:10');
code = code.replace(/fontSize:9/g, 'fontSize:11');
code = code.replace(/fontSize:10/g, 'fontSize:12');
code = code.replace(/fontSize:11/g, 'fontSize:13');
code = code.replace(/fontSize:12/g, 'fontSize:13');
code = code.replace(/fontSize:13/g, 'fontSize:14');
code = code.replace(/fontSize:14/g, 'fontSize:15');

// Update line heights
code = code.replace(/lineHeight: 1\.4/g, 'lineHeight: 1.5');
code = code.replace(/lineHeight: 1\.5/g, 'lineHeight: 1.6');
code = code.replace(/lineHeight:1\.4/g, 'lineHeight:1.5');
code = code.replace(/lineHeight:1\.5/g, 'lineHeight:1.6');

// Replace letter-spacing that makes things hard to read
code = code.replace(/letterSpacing: "0\.1em",/g, 'letterSpacing: "0.02em",');
code = code.replace(/letterSpacing: "0\.15em",/g, 'letterSpacing: "0.02em",');
code = code.replace(/letterSpacing:"0\.1em"/g, 'letterSpacing:"0.02em"');
code = code.replace(/letterSpacing:"0\.15em"/g, 'letterSpacing:"0.02em"');

// Fix text transform uppercase when it's small font (uppercase small font is hard to read if letter spacing is removed, so we'll just leave uppercase but let's make it standard font)
// Already did monospace removal in previous step.

fs.writeFileSync('src/App.tsx', code);
console.log("Readability adjustments applied!");
