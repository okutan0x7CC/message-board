# message-board

## このリポジトリについて
このリポジトリ `message-board` は、リアルタイムの掲示板のシステムである。
主に Vue.js, Firebase を使用している。

<br>

## 構成
`admin`, `client`, `projection` の 3 つは、それぞれ別の Vue.js のプロジェクトであり、 `functions` は Cloud Functions for Firebase のプロジェクト、 `database` は Realtime Database のプロジェクトである。

```
message-board  // Firebase プロジェクト
|- admin  // 管理画面 (Vue.js プロジェクト)
|- client  // クライアント画面 (Vue.js プロジェクト)
|- projection  // 投影画面 (Vue.js プロジェクト)
|- functions  // Cloud Functions
|- database // Realtime Database
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
|概要|管理画面|クライアント画面|投影画面|Cloud Functions|Realtime Database のセキュリティールールとそのテスト|
|ファイルパス|`./admin`|`./client`|`./projection`|`./functions`|`./database`|
|サイトURL production|https://admin-message-board-d24c1.web.app|https://message-board-d24c1.web.app|https://projection-message-board-d24c1.web.app|-|-|
|サイトURL staging|https://stg-admin-message-board.web.app|https://stg-message-board.web.app|https://stg-projection-message-board.web.app|-|-|
|デプロイ|`./deploy.sh` を実行し、 `admin_and_function` を選択|`./deploy.sh` を実行し、 `client` を選択|`./deploy.sh` を実行し、 `projection` を選択|現状は admin に依存|`./deploy.sh` を実行し、 `database` を選択<br>または、コンソールで直接書き込み|
|テスト|-|-|-|-|`cd ./database && npm run test` を実行する|
|環境変数 (自動生成については後述)|`./admin/.env` (自動生成)|`./client/.env` (自動生成)|`./projection/.env` (自動生成)|Cloud Functions の環境変数|`./database/.env` (自動生成)|

<br>

## 環境構築

### 1. Firebase CLI の用意
利用環境に [Firebase CLI](https://firebase.google.com/docs/cli) 最新版をインストールし、ログインする。

### 2. Vue CLI の用意
利用環境に [Vue CLI](https://cli.vuejs.org/guide/installation.html) 最新版をインストールする。

### 3. （Firebase プロジェクトを新規に作る場合）Firebase プロジェクトの用意
[Firebase のコンソール](https://console.firebase.google.com/u/0/) でプロジェクトを追加する。必要であれば staging, production 環境の両方を用意する。  
また、 `admin`, `client`, `projection` 用の Hosting を用意する。

### 4. （Firebase プロジェクトを新規に作る場合）Firebase の設定ファイルを更新
`./.firebaserc` のプロジェクト名とプロジェクトエイリアス、 [Hosting のデプロイターゲット](https://firebase.google.com/docs/cli/targets)を適宜更新する。  
また、プロジェクトエイリアスと Hosting のデプロイターゲット名は `./deploy.sh` と連携しているため、変更した場合には `./deploy.sh` 内の該当箇所も変更する。

### 5. （Firebase プロジェクトを新規に作る場合）admin にアクセス許可する IP アドレスの設定
次の Firebase CLI コマンドで admin にアクセス許可する IP アドレスを設定する。

```
firebase use staging
firebase functions:config:set functions.admin_allowed_ips="XXX.XXX.XXX.XXX,YYY.YYY.YYY.YYY"
firebase use production
firebase functions:config:set functions.admin_allowed_ips="XXX.XXX.XXX.XXX,YYY.YYY.YYY.YYY"
```

### 6. （Firebase プロジェクトを新規に作る場合）admin として扱うメールアドレス/ドメインの設定
次の Firebase CLI コマンドで admin として扱うメールアドレス/ドメインを設定する。

```
firebase use staging
firebase functions:config:set env.admin_email_domains="admin.com,admin.jp"
firebase functions:config:set env.admin_emails="alice@xxx.com,bob@yyy.com"
firebase use production
firebase functions:config:set env.admin_email_domains="admin.com,admin.jp"
firebase functions:config:set env.admin_emails="alice@xxx.com,bob@yyy.com"
```

### 7. 環境変数の自動生成
次のコマンドで各プロジェクトにおける `.env` を、 Firebase CLI で設定した Cloud Functions の環境変数から自動生成する。  
なお、デプロイコマンドには組み込まれているため、デプロイのたびに本コマンドを実行する必要はない。

```
python generate_env.py
```

### 8. ライブラリのインストール
各プロジェクトで `npm install` を実行する。
```
cd admin && npm install && cd ..
cd client && npm install && cd ..
cd projection && npm install && cd ..
cd functions && npm install && cd ..
cd database && npm install && cd ..
```

以上で環境構築が完了する。

<br>

## admin にアクセス許可する IP アドレスの変更
アクセス許可する IP アドレスは [Firebase CLI の環境変数](https://firebase.google.com/docs/functions/config-env) で設定する。

<br>

## 環境変数の設定
各プロジェクトの `.env` は自動生成であるため、環境変数を設定する場合には [Firebase CLI の環境変数](https://firebase.google.com/docs/functions/config-env) で設定する必要がある。  
Firebase CLI の環境変数でキーが `env.***` と設定されたもののみ、 `.env` に出力される。
また、`functions` を除いた各プロジェクトに生成され、内容は全て同じである。  
詳しくは `./generate_env.py` を参照すること。

<br>
