const fs = require('fs');
let data = fs.readFileSync('src/data/mockData.ts', 'utf8');
data = data.replace(/condition: "새상품",/g, 'condition: "새상품급",');
data = data.replace(/condition: "거의 새것",/g, 'condition: "새상품급",');
data = data.replace(/condition: "사용감 약간",/g, 'condition: "사용감 있음",');
data = data.replace(/condition: "빈티지"/g, 'condition: "빈티지"');
data = data.replace(/condition\?: '새상품급' \| '상태 좋음' \| '사용감 있음' \| '하자 있음' \| string;/g, "condition?: '새상품급' | '상태우수' | '사용감 있음' | '빈티지' | string;");
fs.writeFileSync('src/data/mockData.ts', data);
