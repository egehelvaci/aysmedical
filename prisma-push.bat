@echo off
node --max-old-space-size=4096 --stack-size=4096 .\node_modules\prisma\build\index.js db push
