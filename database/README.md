## 本ディレクトリ `database` の役割
本ディレクトリは [Firebase Realtime Database セキュリティルール](https://firebase.google.com/docs/database/security) の実装をテストする役割を担っている。  


## 機能

### セキュリティルールのテスト
コマンド `npm run test` を実行することで、セキュリティルール `database.rules.json` のテストを行うことができる。  
テスト内容は `./test/*.js` ファイルである。

### デプロイ
セキュリティルールは `database.rules.json` に実装されており、
コマンド `cd .. && ./deploy.sh` を実行するか、Firebase コンソールによって Firebase プロジェクトにデプロイすることができる。  
なお、 `database.rules.json` には管理者判定に必要な定数が含まれているため `.gitignore` に追加されている。

**したがって、セキュリティルール (`database.rules.json`) は .gitignore　に追加されているため、実装/デプロイ を行う前に必ず Firebase コンソールから最新版を取得すること。**


## 管理者判定

### セキュリティルールが Git 管理対象外の理由
本プロジェクト `message-board` において、管理者の判定をセキュリティルールで行っている。AdminSDK や Cloud Function for Firebase では行っていない。  
したがって、管理者判定に必要な定数を隠蔽するために、セキュリティルール `database.rules.json` を `.gitignore` で Git 管理対象外としている。  

### テストにおける管理者判定に必要な定数を環境変数からの読み込む
テストコードにおいて管理者の権限に関するテストを行うために、[Firebase CLI の環境変数](https://firebase.google.com/docs/functions/config-env) から[管理者判定の定数（メールアドレスの正規表現）を呼び出している](https://github.com/okutan0x7CC/message-board/blob/master/database/test/database.rules.test.js#L17-L23)。   
この定数（メールアドレスの正規表現）は環境構築時に設定されているはずである。  
また、この定数は `cd .. && python generate_env.py` が実行されると `database.rules.json` 内に Firebase CLI の環境変数から埋め込まれる。すなわち、デプロイ時には自動で埋め込まれる。


## 参考

- セキュリティルールに関するドキュメント : [Firebase Database Security Rules API](https://firebase.google.com/docs/reference/security/database)
