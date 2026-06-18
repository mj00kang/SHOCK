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

const files = [...walk('src/components'), ...walk('src/pages'), ...walk('src/utils')];

files.forEach(target_file => {
    let data = fs.readFileSync(target_file, 'utf8');

    // Radiuses
    data = data.replace(/rounded-3xl/g, 'rounded-2xl');
    
    // Shadows
    data = data.replace(/shadow-3xs/g, 'shadow-sm');
    data = data.replace(/shadow-xs/g, 'shadow-sm');
    data = data.replace(/shadow-2xs/g, 'shadow-sm');

    // Gray
    data = data.replace(/slate-50/g, 'gray-50');
    data = data.replace(/slate-100/g, 'gray-100');
    data = data.replace(/slate-150/g, 'gray-200');
    data = data.replace(/slate-200/g, 'gray-200');
    data = data.replace(/slate-300/g, 'gray-300');
    data = data.replace(/slate-400/g, 'gray-400');
    data = data.replace(/slate-500/g, 'gray-500');
    data = data.replace(/slate-600/g, 'gray-600');
    data = data.replace(/slate-700/g, 'gray-700');
    data = data.replace(/slate-800/g, 'gray-900');
    data = data.replace(/slate-900/g, 'gray-900');

    // Primary Buttons (previously sky/slate/etc gradients)
    data = data.replace(/bg-gradient-to-br from-\[\#38BDF8\] to-\[\#0EA5E9\] hover:from-\[\#0EA5E9\] hover:to-\[\#0284C7\]/g, 'bg-gray-900 hover:bg-black');
    data = data.replace(/bg-gradient-to-br from-white to-gray-100\/20 hover:to-gray-100\/50/g, 'bg-white hover:bg-gray-50');
    
    // Badges standard
    data = data.replace(/bg-gray-800 text-white/g, 'bg-gray-900 text-white');

    // Convert standard gradients
    data = data.replace(/bg-gradient-[^ ]+ from-[^ ]+ to-[^ ]+/g, 'bg-gray-50');
    
    // Replace remaining gradients
    data = data.replace(/bg-gradient-[A-Za-z0-9\-\[\]\/]+/g, '');

    fs.writeFileSync(target_file, data);
});
console.log('done across all components and pages');
