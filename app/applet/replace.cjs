const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/SYAK/g, 'SHOCK')
    .replace(/syak/g, 'shock')
    .replace(/Syak/g, 'Shock')
    .replace(/SHAK/g, 'SHOCK')
    .replace(/shak/g, 'shock')
    .replace(/Shak/g, 'Shock')
    .replace(/샥/g, '쇼크');
    
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated:', filePath);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
      replaceInFile(fullPath);
    }
  }
}

traverseDir(path.join(__dirname, 'src'));
