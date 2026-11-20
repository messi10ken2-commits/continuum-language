# 認証修正版をiPhoneへ反映する

対象：iOSのログイン送信が `Fetch is aborted` になる問題の修正版。修正はmainの8671c58に統合済み。Webの更新だけでは、インストール済みネイティブアプリの同梱JavaScriptは更新されない。

## こちらで準備するものと実機で必要な操作

ソース修正、シミュレーターでのログイン・プロセス再起動後のKeychain復元・ログアウトの検証、iPhone向けarm64 Releaseのコンパイル確認は別々の証拠として記録する。

CIの `continuum-iphone-release-unsigned` は署名なしの検証用archiveで、インストール可能なIPAではない。App Store/TestFlight配布や実機での認証成功を意味しない。実機への反映には、KenのMacのXcodeでApple Accountを選び、接続したiPhoneへRunする操作が残る。パスワードや署名鍵をチャットへ送る必要はない。

## Macで最新ソースを開く

Xcode 26以降と対応macOS、Node 24.22.1が必要。未保存の作業がある既存フォルダーには上書きせず、新しいフォルダーを使用する。

```sh
git clone --depth 1 https://github.com/messi10ken2-commits/continuum-language.git continuum-iphone-auth
cd continuum-iphone-auth
npm ci
npm run ios:sync
npm run ios:check
npm run ios:open
```

通常の **App** schemeを選ぶ。`App-Local-StoreKit` や一時テスト用プロジェクトは選ばない。APIは本番のHTTPS originで、StoreKitローカル用flagはfalse、実課金は無効のまま。

## 署名してiPhoneへ転送

1. Xcode → Settings → Apple Accountsで自分のApple Accountへサインインする。
2. iPhoneをMacへ接続し、ロックを解除して「このコンピュータを信頼」を承認する。必要な場合はiPhoneのDeveloper Modeを有効にする。
3. App target → Signing & CapabilitiesでAutomatically manage signingを選び、自分のTeamを指定する。未入会のアカウントではPersonal Teamを使用できるが、機能と署名期限には制限がある。
4. 実機のiPhoneをRun destinationに選び、Runを押す。以前のアプリと同じbundle ID・Teamで更新できる場合はそのまま更新する。既存アプリの削除は前提にしない。
5. bundle IDの登録競合が出た場合は、そのエラーを確認してから開発用IDを変更する。配信用IDやApple側の登録情報を推測して変更しない。

## 認証の確認

- 通常の本人アカウントでログインし、Account画面に自分の名前が表示される。
- アプリを終了して起動し直し、ログインが保持されている。
- ログアウト後に再起動し、未ログイン画面へ戻る。
- 不正なパスワードではログインできず、読み込み中表示が解除される。
- 課金・退会完了・実メール送信の試験は、この本番アカウントでは行わない。

記録する項目：iPhone機種、iOS、Xcode版、`git rev-parse HEAD`、実機への転送成功、上記4認証項目の結果。シミュレーターの成功をこの実機結果へ転記しない。

## Apple公式資料

- https://developer.apple.com/documentation/xcode/building-and-running-an-app
- https://developer.apple.com/help/account/basics/about-your-developer-account/

Apple Developer Programの本人確認・入会完了と、Xcodeによる個人端末への開発用実行は別の工程。入会問題が解決したとは扱わない。
