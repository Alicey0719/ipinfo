# 開発・デプロイ方法

このプロジェクトはDockerコンテナ内で全操作を行う。ホストへのNode.js/npm直接インストールは不要。

## 初回セットアップ（node_modules インストール）

```bash
docker compose run --rm install
```

## ローカル開発サーバー起動

```bash
docker compose run --rm --service-ports dev
```

`http://localhost:8787` でアクセス可能。
ローカルでは `request.cf` が空になるため ip のみ返る（正常動作）。

## 型チェック

```bash
docker compose run --rm type-check
```

## デプロイ（ip.alicey.dev）

Cloudflare API トークンを環境変数に設定してから実行:

```bash
export CLOUDFLARE_API_TOKEN=your_token_here
docker compose run --rm deploy
```

トークンの取得: Cloudflare ダッシュボード → My Profile → API Tokens → Create Token
必要な権限: `Workers Scripts:Edit`, `Workers Routes:Edit`, `Zone:Edit`（カスタムドメイン用）

## 注意事項

- `node_modules` は Docker 名前付きボリューム (`ipinfo_node_modules`) に格納されている
- ボリュームを削除する場合: `docker volume rm ipinfo_node_modules`
- wrangler.toml の `custom_domain = true` は `alicey.dev` が Cloudflare DNS 管理下であることが前提
- 仕様が変わる場合は、 README.md も変更すること
