const fs = require('fs');

const target_file = 'src/pages/MyPage.tsx';
let data = fs.readFileSync(target_file, 'utf8');

data = data.replace(/sky-500/g, 'gray-800');
data = data.replace(/sky-600/g, 'gray-900');
data = data.replace(/sky-700/g, 'gray-900');
data = data.replace(/sky-400/g, 'gray-300');
data = data.replace(/sky-200/g, 'gray-200');
data = data.replace(/sky-100/g, 'gray-200');
data = data.replace(/sky-150/g, 'gray-200');
data = data.replace(/sky-50\/50/g, 'gray-50');
data = data.replace(/sky-50\/40/g, 'gray-50');
data = data.replace(/sky-50/g, 'gray-100');

data = data.replace(/indigo-700/g, 'gray-700');
data = data.replace(/indigo-900/g, 'gray-900');
data = data.replace(/indigo-150/g, 'gray-200');
data = data.replace(/indigo-50/g, 'gray-100');

data = data.replace(/bg-rose-500/g, 'bg-red-500');
data = data.replace(/text-rose-500/g, 'text-red-500');

fs.writeFileSync(target_file, data);
console.log('done');
