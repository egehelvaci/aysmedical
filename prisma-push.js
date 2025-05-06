// prisma-push.js
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function runPrismaCommand() {
  try {
    console.log('Prisma komutunu çalıştırıyorum...');
    const { stdout, stderr } = await execPromise('npx prisma db push');
    console.log('Komut başarıyla çalıştı:');
    console.log(stdout);
  } catch (error) {
    console.error('Hata oluştu:', error.message);
    if (error.stdout) console.log('stdout:', error.stdout);
    if (error.stderr) console.log('stderr:', error.stderr);
  }
}

runPrismaCommand();
