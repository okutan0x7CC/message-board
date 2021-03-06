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
|デプロイ|`./deploy.sh` を実行し、 `admin_and_function` を選択|`./deploy.sh` を実行し、 `client` を選択|`./deploy.sh` を実行し、 `projection` を選択|現状は admin に依存|`./deploy.sh` を実行し、 `database` を選択（注意 : git管理対象外であるため、最新版であるか Firebase コンソールで確認すること）|
|テスト|-|-|-|-|`cd ./database && npm run test` を実行する|
|環境変数 (自動生成については後述)|`./admin/.env` (自動生成)|`./client/.env` (自動生成)|`./projection/.env` (自動生成)|Cloud Functions の環境変数|`./database/.env` (自動生成)|

<br>

## 環境構築

### 1. Firebase CLI の用意
利用環境に [Firebase CLI](https://firebase.google.com/docs/cli) 最新版をインストールし、ログインする。

<br>

### 2. Vue CLI の用意
利用環境に [Vue CLI](https://cli.vuejs.org/guide/installation.html) 最新版をインストールする。

<br>

### 3. （Firebase プロジェクトを新規に作る場合）Firebase プロジェクトの用意
[Firebase のコンソール](https://console.firebase.google.com/u/0/) でプロジェクトを追加する。必要であれば staging, production 環境の両方を用意する。  
また、 `admin`, `client`, `projection` 用の Hosting を用意する。

<br>

### 4. （Firebase プロジェクトを新規に作る場合）Firebase の設定ファイルを更新
`./.firebaserc` のプロジェクト名とプロジェクトエイリアス、 [Hosting のデプロイターゲット](https://firebase.google.com/docs/cli/targets)を適宜更新する。  
また、プロジェクトエイリアスと Hosting のデプロイターゲット名は `./deploy.sh` と連携しているため、変更した場合には `./deploy.sh` 内の該当箇所も変更する。

<br>

### 5. （Firebase プロジェクトを新規に作る場合）admin にアクセス許可する IP アドレスの設定
次の Firebase CLI コマンドで admin にアクセス許可する IP アドレスを設定する。

```
firebase use staging
firebase functions:config:set functions.admin_allowed_ips="XXX.XXX.XXX.XXX,YYY.YYY.YYY.YYY"
firebase use production
firebase functions:config:set functions.admin_allowed_ips="XXX.XXX.XXX.XXX,YYY.YYY.YYY.YYY"
```

<br>

### 6. （Firebase プロジェクトを新規に作る場合）admin として扱うメールアドレス/ドメインの設定
次の Firebase CLI コマンドで admin として扱うメールアドレス/ドメインを正規表現で設定する。  
また、セキュリティルールのテストで使用するメールアドレス/ドメイン（カンマ区切りで複数可）を設定する。  

```
firebase use staging
firebase functions:config:set env.admin_email_regex="/.*@(xxx\.com|yyy\.jp)$/"
firebase functions:config:set env.admin_emails_for_testing="zzz@xxx.com,zzz@yyy.jp"
firebase use production
firebase functions:config:set env.admin_email_regex="/.*@(xxx\.com|yyy\.jp)$/"
firebase functions:config:set env.admin_emails_for_testing="zzz@xxx.com,zzz@yyy.jp"
```

### 7. セキュリティルールのファイル作成
Firebase コンソールのセキュリティルールから内容をコピーし、ファイル `./database/database.rules.json` を作成してペーストする。  
なお、本ファイルは git 管理対象外であるため、使用時には最新版を手動で取得する必要がある。（← 改善したい）

<br>

### 8. 環境変数の自動生成
次のコマンドで各プロジェクトにおける `.env` を、 Firebase CLI で設定した Cloud Functions の環境変数から自動生成する。  
なお、デプロイコマンドには組み込まれているため、デプロイのたびに本コマンドを実行する必要はない。

```
python generate_env.py
```

<br>

### 9. ライブラリのインストール
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

### admin として扱うメールアドレスの設定
本リポジトリにおいて、 `admin` とは、 Firebase AdminSDK のことではなく、Firebase Authentication アカウントにおける管理者のことを指す。  
また、Realtime Database セキュリティルールにおける管理者の識別はメールアドレスに対して正規表現を用いて行う。  
なお、セキュリティルールのテストには `admin` となるメールアドレスを使用する必要があるため、正規表現に一致するメールアドレスをサンプルとして設定しておく必要がある。  
環境変数から `./database/database.rules.json` への書き込みは、 `./generate_env.py` で行われる。

```
firebase use staging
firebase functions:config:set env.admin_email_regex="/.*@(xxx\.com|yyy\.jp)$/"
firebase functions:config:set env.admin_emails_for_testing="zzz@xxx.com,zzz@yyy.jp"
firebase use production
firebase functions:config:set env.admin_email_regex="/.*@(xxx\.com|yyy\.jp)$/"
firebase functions:config:set env.admin_emails_for_testing="zzz@xxx.com,zzz@yyy.jp"
```

## セキュリティルールのテスト
`./database` では、Realtime Database のセキュリティルール `./database/database.rules.json` をテストしている。  
実行するには次のコマンドを入力する。

```
cd ./database && npm run test
```

なお、 `./database/.env` の値を参照しているため、もし環境変数が更新されているのであれば、テスト前に `python generate_env.py` を実行することが望ましい。

<br>
