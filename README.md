# ipinfo

アクセス元のIPアドレス情報をJSONで返すCloudflare Worker。

**エンドポイント:** https://ip.alicey.dev

## レスポンス

```bash
curl https://ip.alicey.dev
```

```json
{
  "connectingIp": "192.0.2.1",
  "forwardedFor": ["192.0.2.1"],
  "asn": 64496,
  "asOrganization": "Example ISP",
  "city": "Example City",
  "region": "Example Region",
  "regionCode": "EX",
  "country": "XX",
  "latitude": "0.0000",
  "longitude": "0.0000",
  "postalCode": "000-0000",
  "timezone": "UTC"
}
```

VPN・プロキシ経由の場合は `forwardedFor` に複数のIPが含まれる。geo情報は常に `connectingIp`（Cloudflareが直接受け取ったIP）のもの。

```json
{
  "connectingIp": "192.0.2.1",
  "forwardedFor": ["198.51.100.1", "192.0.2.1"],
  ...
}
```

フィールドはCloudflare側でデータがある場合のみ含まれる。ローカル開発時は `connectingIp` と `forwardedFor` のみ返る。

### フィールド一覧

| フィールド | 型 | 説明 |
|---|---|---|
| `connectingIp` | string | Cloudflareが受け取った接続元IP（偽装不可） |
| `forwardedFor` | string[] | X-Forwarded-For のIP配列。プロキシがない場合は `connectingIp` のみ |
| `asn` | number | AS番号 |
| `asOrganization` | string | AS組織名 |
| `city` | string | 市区町村 |
| `region` | string | 都道府県・州 |
| `regionCode` | string | 地域コード |
| `country` | string | 国コード (ISO 3166-1 alpha-2) |
| `latitude` | string | 緯度 |
| `longitude` | string | 経度 |
| `postalCode` | string | 郵便番号 |
| `timezone` | string | タイムゾーン (IANA) |

### エラーレスポンス

| ステータス | 内容 |
|---|---|
| `405 Method Not Allowed` | GET・HEAD以外のメソッドでアクセスした場合 |

```json
{ "error": "Method Not Allowed" }
```

### レスポンスヘッダー

```
Content-Type: application/json; charset=utf-8
Access-Control-Allow-Origin: *
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
```

## 開発

Docker上で動作させるため、ホストへのNode.js/wranglerインストールは不要。

### セットアップ（初回のみ）

```bash
docker compose run --rm install
```

### ローカル開発

```bash
docker compose run --rm --service-ports dev
```

`http://localhost:8787` でアクセス可能。

### 型チェック

```bash
docker compose run --rm type-check
```

## デプロイ

[Cloudflare ダッシュボード](https://dash.cloudflare.com/profile/api-tokens) でAPIトークンを発行する。  
必要な権限: `Workers Scripts:Edit` / `Workers Routes:Edit` / `Zone:Edit`

```bash
export CLOUDFLARE_API_TOKEN=your_token
docker compose run --rm deploy
```

`alicey.dev` がCloudflare DNS管理下であれば、`ip.alicey.dev` のDNSレコードは自動作成される。
