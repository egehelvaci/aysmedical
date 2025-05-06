// prisma-generate.js
const { exec } = require('child_process');

// Doğrudan npx prisma generate komutunu çalıştırın - Windows'ta çalışacak
exec('npx prisma generate', (error, stdout, stderr) => {
  if (error) {
    console.error(`Hata oluştu: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
}); 