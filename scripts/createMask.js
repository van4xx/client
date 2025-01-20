const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Создаем директорию для масок, если она не существует
const masksDir = path.join(__dirname, '../public/masks');
if (!fs.existsSync(masksDir)) {
  fs.mkdirSync(masksDir, { recursive: true });
}

// Создаем канвас
const canvas = createCanvas(300, 200);
const ctx = canvas.getContext('2d');

// Рисуем простые очки
ctx.fillStyle = '#000000';
ctx.strokeStyle = '#000000';
ctx.lineWidth = 3;

// Левая линза
ctx.beginPath();
ctx.ellipse(100, 100, 40, 30, 0, 0, Math.PI * 2);
ctx.stroke();

// Правая линза
ctx.beginPath();
ctx.ellipse(200, 100, 40, 30, 0, 0, Math.PI * 2);
ctx.stroke();

// Перемычка между линзами
ctx.beginPath();
ctx.moveTo(140, 100);
ctx.lineTo(160, 100);
ctx.stroke();

// Дужки очков
ctx.beginPath();
ctx.moveTo(60, 100);
ctx.lineTo(20, 80);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(240, 100);
ctx.lineTo(280, 80);
ctx.stroke();

// Сохраняем изображение
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(masksDir, 'mask1.png'), buffer);

console.log('Маска успешно создана!'); 