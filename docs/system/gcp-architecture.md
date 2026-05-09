# システムアーキテクチャ（Google Cloud × Turso）

**推奨形**: 外向き HTTPS は **Global External Application Load Balancer**、アプリは **Cloud Run**、機密は **Secret Manager**。Google ログインは **GCP Console で作成した OAuth 2.0 クライアント** と Better Auth を接続。静的フロントは **Firebase Hosting** または **Cloud Storage + LB** でも同一論理構成に収まる（保管先は未決・[`open-questions-and-spikes.md`](open-questions-and-spikes.md)）。

## システム構成図（論理）

```mermaid
flowchart TB
  subgraph clients [Clients]
    browser[Browser]
    kiosk[OptionalVenueKiosk]
  end

  subgraph gcp [GoogleCloud]
    lb[ExternalHTTPSLoadBalancer]
    run[CloudRun_ThreadhallAPI]
    sm[SecretManager]
    sa[IAM_ServiceAccount]
    wif[WorkloadIdentity_binding]
    run --> sm
    sa --> wif
    wif --> run
  end

  subgraph googleIdp [GoogleIdentity]
    oauthClient[OAuth2Client_GCPConsole]
  end

  subgraph turso [Turso]
    dbPrimary[TursoDB_Primary]
    dbSatA[TursoDB_EventSatellite]
    dbSatB[TursoDB_EventSatellite_N]
  end

  browser --> lb
  kiosk --> lb
  lb --> run
  run --> oauthClient
  run --> dbPrimary
  run --> dbSatA
  run --> dbSatB
```

## 認証シーケンス（概念）

```mermaid
sequenceDiagram
  participant U as User
  participant LB as LoadBalancer
  participant API as CloudRun_BetterAuth
  participant G as GoogleOAuth
  participant P as TursoPrimary

  U->>LB: SignInClick
  LB->>API: GET_or_POST_auth
  API->>G: OIDC_Authorize
  G-->>API: IdToken_And_AccessToken
  API->>P: UpsertUser_OrgMember_Session
  API-->>U: SessionCookie_or_JWT
```

## 運用・CI/CD（概念）

```mermaid
flowchart TB
  subgraph devloop [Delivery]
    repo[VCS_GitHub]
    cb[CloudBuild]
    ar[ArtifactRegistry]
    cb --> ar
    ar --> deploy[CloudRun_Deploy]
  end
  repo --> cb
  deploy --> runSvc[CloudRun_ThreadhallAPI]
```

## インフラメモ

- **Cloud Run**: 最小インスタンス 0 可。書込集中時は同時実行・CPU を調整。長時間 SSE は別検討
- **サテライト増殖**: プロビジョニング API は **IAM で実行主体を限定**（例: Cloud Run サービスアカウントのみ Turso 管理操作可）
