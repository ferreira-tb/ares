import * as path from 'path';

window.addEventListener('DOMContentLoaded', () => {
    const gameScript = document.createElement('script');
    const scriptPath = path.resolve(__dirname, 'game.js');
    gameScript.setAttribute('src', scriptPath);
    document.head.appendChild(gameScript);

}, { once: true });

console.log('Olá');
setInterval(() => window.postMessage('Mensagem enviada'), 5000);

export { }