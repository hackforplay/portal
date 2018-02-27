pwd
ls -a
npm install --only=dev
npm run build
npm run test
npm --prefix functions install
npm --prefix functions install --only=dev
pwd
ls -a
./node_modules/.bin/firebase deploy --project hackforplay-production --token "$FIREBASE_TOKEN"
