# 運用仕上げと引き継ぎ — 2026-11-24

## 稼働構成

- Web: `continuum-language`。本番DBに既存機能を提供。
- Backup: `continuum-db-backup`。日次18:00 UTC（日本03:00、マレーシア02:00）、暗号化して非公開バケットに保存。通常6日保持。
- Monitor/journal: `continuum-operations`。15分ごとにHTTPSヘルス、DB、メール認可、未処理メール、バックアップの成功日時/実行結果を検査。HTTPの削除記録受付はRailway内部ネットワークのみ。
- 外部監視: ChatGPT「Continuum障害監視」。1時間ごと、異常/確認不能時だけ通知。RailwayとGmailが同時に停止した場合の別経路。実行環境・接続が使えなければ確認不能として扱う。

メールの宛先は `continuum.language@gmail.com` に固定。初回テスト、異常の変化、同一異常6時間経過、復旧時に送信。Gmail自身の認可が壊れるとメール通知も送れないため、外部監視を併用する。`OPS_NOTICE_PROVIDER_ACCEPTED` はGoogle受付であり受信箱到着の証明ではない。

日次ジョブの `BACKUP_VERIFIED` は保存済みファイルの再取得・認証付き復号・PostgreSQL 18への隔離復元・全テーブル件数一致の記録。26時間を過ぎると通知する。`last-attempt.json` の failed と30分超のrunningも異常。監視サービスはバックアップ失敗中も6日を超えた管理対象アーカイブを削除する。両サービスの停止中は自動削除も停止するため、復旧時に保持超過を処理する。

## 退会と復旧

Webの `ERASURE_JOURNAL_ENABLED=true`、`ERASURE_JOURNAL_TOKEN` は監視サービスへの参照。
削除直前に暗号化prepared記録をS3へ保存。記録不能ならDBトランザクションを戻し、未記録の削除をしない。
コミット後はcommittedを保存。コミット後の通信失敗は削除の失敗と偽らずpendingとして扱う。監視サービスが本番の完了受領証とユーザーの不在を照合して記録を修復する。
DBがロールバックされたprepared記録は自動削除を再実行せず、15分後に照合要求を通知する。

記録には内部ユーザーID、申請/受領証ID、日時、ポリシー版だけを保存し、名前・メール・学習内容を含めない。完了記録は8日後に削除。未確定intentは解決まで保管する。
初回の暗号化書込・再読取・復号テストはランダムな架空IDで行い、テストオブジェクトを削除する。

復元テストは通常の件数照合後に、現時点のDB外削除記録を読む。対象アカウントが残れば `promotionBlocked=true` と件数を記録する。
復元DBの全セッション・パスワード再設定リンクを消し、古い送信待ちメールを失効させる。本番へ自動接続する機能はない。
未知/破損/復号不能の削除記録は検査失敗とする。実際の災害復旧では、本番公開前に削除処理を再適用して対象アカウント/非公開内容の不在を確認する。
退会要求がバックアップより新しい場合は、外部記録から要求を再構成して既存のowner確認付き削除手順を使う。公開・ワーカー起動はその後。

## Google Driveへの別保存（接続待ち）

実装済みのDrive転送は、暗号化済みアーカイブと暗号化削除記録だけを作成する。フォルダ名は `Continuum encrypted backups`。
転送後にDriveから再ダウンロードしてSHA-256を照合する。自分で作った専用フォルダのappProperties付きファイルだけを対象に、DBアーカイブは6日、確定削除記録は8日で永久削除する。既存の無関係なDriveファイルは削除しない。

接続には運営者によるGoogle認可が必要。ChatGPTへのDrive接続とRailway定期ジョブの認可は別。

1. 現在のOAuthクライアントが所属するGoogle Cloudプロジェクトで **Google Drive API** を有効化。
2. OAuth Playgroundで **Use your own OAuth credentials** をON。確認済みClient ID/Secretを設定。
3. Step 1のscopeに **`https://www.googleapis.com/auth/drive.file`** だけを入力し、`continuum.language@gmail.com` で認可。
4. Step 2でコードを交換し、新しいrefresh tokenの更新成功を確認。
5. Railwayの **バックアップサービス** に下記を設定。Gmail送信用の `AUTH_GMAIL_REFRESH_TOKEN` は変更しない。

| Variable | Value |
|---|---|
| DRIVE_CLIENT_ID | `${{continuum-language.AUTH_GMAIL_CLIENT_ID}}` |
| DRIVE_CLIENT_SECRET | `${{continuum-language.AUTH_GMAIL_CLIENT_SECRET}}` |
| DRIVE_REFRESH_TOKEN | Drive用の新しいトークンの値だけ。引用符不要 |
| DRIVE_BACKUP_ENABLED | `true` |

Testingのクライアントで発行する場合は期限条件をGoogle応答で確認。継続用クライアントで認可する。秘密値をチャットに貼らない。
設定後に1回実行して **`offsite: google-drive-verified`** を確認して初めて外部保存完了とする。未接続の現在は外部保存成功とは報告しない。
S3互換保存先を使う場合のOFFSITE_*実装も残しているが、Driveだけなら不要。

## 秘密情報と審査用アカウント

バックアップ暗号鍵は既存の値を維持。監視サービスはバックアップサービスの `BACKUP_ENCRYPTION_KEY` を参照する。
DBダンプにRailway設定やOAuth資格情報は含まれない。鍵と必要な復旧設定は独立したパスワード管理アプリへ保管する。
審査用学習者を本番HTTPSバックエンドに作成済み。認証情報はWebサービスの `APP_REVIEW_EMAIL` / `APP_REVIEW_PASSWORD` に保存し、Gitには保存しない。
一般学習者で、管理画面は403。Premium付与・講師公開・実ユーザーデータの投入は行っていない。
Apple登録後、App Store Connectの審査用欄へ転記し、実機でログインを確認する。審査終了後にパスワードを変更する。

## 緊急時

`BACKUP_FAILED`, `OPS_CHECK_FAILED`, `OPS_NOTICE_FAILED`, `ERASURE_JOURNAL_COMMIT_PENDING` の生のプロバイダ応答/秘密値を共有しない。
Web停止時はアプリのデプロイ/DBヘルスを先に確認。DBやボリュームを削除せず、データ復元を本番で試さない。
通知のテストは架空の状態を使い、本番DB停止や実アカウント削除で障害を作らない。
