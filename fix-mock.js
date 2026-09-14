const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/data/mock-orders.ts');
let content = fs.readFileSync(file, 'utf8');

// Replace top-level statuses
content = content.replace(/status: "expediee"/g, 'status: "en_attente"');
content = content.replace(/status: "confirmee"/g, 'status: "en_attente"');
content = content.replace(/status: "annulee"/g, 'status: "livree"');

// Replace array items
content = content.replace(/\{ status: "confirmee",.*\},\n/g, '');
content = content.replace(/\{ status: "expediee",.*\},\n/g, '');
content = content.replace(/\{ status: "annulee",(.*)\}/g, '{ status: "livree",$1}');

fs.writeFileSync(file, content);
console.log("Mock data updated.");
