const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = [...walk('src/components'), ...walk('src/pages')];

files.forEach(target_file => {
    let data = fs.readFileSync(target_file, 'utf8');

    data = data.replace(/bg-sky-50\/[0-9]+/g, 'bg-gray-50');
    data = data.replace(/border-sky-[0-9]+\/[0-9]+/g, 'border-gray-200');

    data = data.replace(/sky-500/g, 'gray-800');
    data = data.replace(/sky-550/g, 'gray-800');
    data = data.replace(/sky-600/g, 'gray-900');
    data = data.replace(/sky-650/g, 'gray-900');
    data = data.replace(/sky-655/g, 'gray-900');
    data = data.replace(/sky-700/g, 'gray-900');
    data = data.replace(/sky-800/g, 'gray-900');
    data = data.replace(/sky-400/g, 'gray-300');
    data = data.replace(/sky-450/g, 'gray-300');
    data = data.replace(/sky-300/g, 'gray-300');
    data = data.replace(/sky-200/g, 'gray-200');
    data = data.replace(/sky-100/g, 'gray-200');
    data = data.replace(/sky-150/g, 'gray-200');
    data = data.replace(/sky-50/g, 'gray-100');

    // Also remove neon colors that the user might complain about
    data = data.replace(/rose-500/g, 'red-500');
    data = data.replace(/amber-/g, 'yellow-');
    data = data.replace(/indigo-/g, 'gray-');

    fs.writeFileSync(target_file, data);
});
console.log('done across all components and pages');
