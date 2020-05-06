# message-board

## このリポジトリについて
このリポジトリ `message-board` は、リアルタイムの掲示板のシステムである。
主に Vue.js, Firebase を使用している。

<br>

## 構成
`admin`, `client`, `projection` の 3 つは、それぞれ別の Vue.js のプロジェクトであり、 `functions` は Cloud Functions for Firebase のプロジェクトである。
```
message-board  // Firebase プロジェクト
|- admin  // 管理画面 (Vue.js プロジェクト)
|- client  // クライアント画面 (Vue.js プロジェクト)
|- projection  // 投影画面 (Vue.js プロジェクト)
|- functions  // Cloud Functions
```

<br>

## ホスティング
ホスティングには Firebase Hosting を使用しており、 `admin`, `client`, `projection` はそれぞれ異なるサイトである。
ただし、全て同一 Firebase プロジェクトである。

<br>

## 各デプロイ対象の機能比較
各デプロイ対象の機能比較を次の表に示す。

|デプロイ対象|admin|client|projection|functions|database|
|-|:-:|:-:|:-:|:-:|:-:|
|概要|管理画面|クライアント画面|投影画面|Cloud Functions|Realtime Database のセキュリティールール|
|ファイルパス|`./admin`|`./client`|`./projection`|`./functions`|`./database.rules.json` (.gitignore)|
|サイトURL production|https://admin-message-board-d24c1.web.app|https://message-board-d24c1.web.app|https://projection-message-board-d24c1.web.app|-|-|
|サイトURL staging|https://stg-admin-message-board.web.app|https://stg-message-board.web.app|https://stg-projection-message-board.web.app|-|-|
|デプロイ|`./deploy.sh` を実行し、 `admin_and_function` を選択|`./deploy.sh` を実行し、 `client` を選択|`./deploy.sh` を実行し、 `projection` を選択|現状は admin に依存|`./deploy.sh` を実行し、 `database` を選択<br>または、コンソールで直接書き込み|

<br>

## 環境構築

### 1. Firebase CLI の用意
利用環境に [Firebase CLI](https://firebase.google.com/docs/cli) 最新版をインストールし、ログインする。

### 2. Vue CLI の用意
利用環境に [Vue CLI](https://cli.vuejs.org/guide/installation.html) 最新版をインストールする。

### 3. Firebase プロジェクトの用意（Firebase プロジェクトを新規に作る場合）
[Firebase のコンソール](https://console.firebase.google.com/u/0/) でプロジェクトを追加する。必要であれば staging, production 環境の両方を用意する。  
また、 `admin`, `client`, `projection` 用の Hosting を用意する。

### 4. Firebase の設定ファイルを更新（Firebase プロジェクトを新規に作る場合）
`./.firebaserc` のプロジェクト名と [Hosting のデプロイターゲット](https://firebase.google.com/docs/cli/targets)を適宜更新する。  
また、プロジェクトエイリアスと Hosting のデプロイターゲット名は `./deploy.sh` と連携しているため、変更した場合には `./deploy.sh` 内の該当箇所も変更する。

### 5. admin にアクセス許可する IP アドレスを設定する（Firebase プロジェクトを新規に作る場合）
次の Firebase CLI コマンドで admin にアクセス許可する IP アドレスを設定する。複数設定したい場合などは `./functions/index.js` を含めて適宜変更する。
```
firebase functions:config:set admin.allowed_ip="XXX.XXX.XXX.XXX"
```

### 6. ライブラリのインストール
各プロジェクトで `npm install` を実行する。
```
cd admin && npm install && cd ..
cd client && npm install && cd ..
cd projection && npm install && cd ..
cd functions && npm install && cd ..
```

以上で環境構築が完了する。

<br>

## admin にアクセス許可する IP アドレスの変更
アクセス許可する IP アドレスは [Firebase CLI で設定](https://firebase.google.com/docs/functions/config-env)し、 `./functions/index.js` に反映する。

<br>
