rm -rf ./dist && rm -rf ./functions/admin/*
npm run build
mv ./dist/index.html ./functions/admin/index.html
firebase deploy
