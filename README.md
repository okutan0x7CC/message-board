# message-board

## このリポジトリについて
このリポジトリ `message-board` は、リアルタイムの掲示板のシステムである。
主に Vue.js, Firebase を使用している。


## 構成
主な構成は `admin`, `client`, `projection` の 3 つであり、それぞれが別の Vue.js のプロジェクトである。
```
message-board
|- admin  // 管理画面
|- client  // クライアント画面
|- projection  // 投影画面
```


## ホスティング
ホスティングには Firebase Hosting を使用しており、 `admin`, `client`, `projection` はそれぞれ異なるサイトである。
ただし、全て同一 Firebase プロジェクトである。


## `admin`, `client`, `projection` の機能
それぞれのプロジェクトの機能比較を示す。


|機能|admin|client|projection|
|-|:-:|:-:|:-:|
|Realtime Database セキュリティルール|client に依存|database.rules.json で管理|client に依存|
|サイトURL|https://admin-message-board-d24c1.web.app|https://message-board-d24c1.web.app|https://projection-message-board-d24c1.web.app|
|Cloud Function|`./admin/functions` で管理|admin に依存|admin に依存|


## admin の IP アドレス制限
アクセス許可する IP アドレスは Firebase CLI で設定する[^1]。

[^1]: Firebase 環境の構成  
    https://firebase.google.com/docs/functions/config-env
