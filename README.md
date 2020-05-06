# message-board

## このリポジトリについて
このリポジトリ `message-board` は、リアルタイムの掲示板のシステムである。
主に Vue.js, Firebase を使用している。

<br>

## 構成
主な構成は `admin`, `client`, `projection` の 3 つであり、それぞれが別の Vue.js のプロジェクトである。
```
message-board
|- admin  // 管理画面
|- client  // クライアント画面
|- projection  // 投影画面
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

## admin の IP アドレス制限
アクセス許可する IP アドレスは Firebase CLI で設定する [^1]。

[^1]: Firebase 環境の構成  
    https://firebase.google.com/docs/functions/config-env

<br>
