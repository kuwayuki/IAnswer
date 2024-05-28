npm run start

React Native パッケージャー(▷ 　 ⇒ 　 □)
19000

Attach to pacakagr（F5）
19000

Remote JS
※省略可能(起動しっぱなしならそれでもいい)

ブラウザのデバッグモードは切らないとだめ
スマホからリロードすると、ブラウザのデバッグモードが起動するので、切ってから F5 デバッグする

Admob
https://docs.expo.dev/versions/v44.0.0/sdk/admob/

Google Admob
https://apps.admob.com/v2/home?_ga=2.71246102.782286764.1642601502-166732312.1642306416

AuthSession
https://docs.expo.dev/versions/v44.0.0/sdk/auth-session/

StoreReview
https://docs.expo.dev/versions/v44.0.0/sdk/storereview/

Expo で作成したアプリを App Store に申請するまで
https://qiita.com/mildsummer/items/e98b1b8e4ea7f72b9899

_アプリのビルド Credential の作成_
※expo build:ios で自動的に作成される
Certificates, Identifiers & Profiles
https://developer.apple.com/account/resources/identifiers/list

_アプリの公開_
App Store Connect
https://appstoreconnect.apple.com/apps

SKU に命名規則はありません。ただし、App001 のように適当な名前をつけると紛らわしいので、おすすめしません。私の場合、Bundle ID が com.example.MyApp なら SKU は ComExampleMyApp のように設定しています。

月額課金：
https://docs-expo-dev.translate.goog/versions/latest/sdk/in-app-purchases/?_x_tr_sl=en&_x_tr_tl=ja&_x_tr_hl=ja&_x_tr_pto=sc
参考:https://tech-blog.re-arc-lab.jp/posts/211015_expo-in-app-purchases/
OTA update のやりかた

$ expo publish

eas build --profile development-simulator --platform ios

% ビルドした状態でのみテストしたいとき(Purchase や Google-Admob)
npm install --dev-client
% pacakge を追加した場合には必ず再インストールすること！
eas build --profile development --platform ios
% QR コードを読み取る or Expo GO で読み取る
npx expo start --dev-client
% Expo で起動すると、上でインストールしたペリオチャートが起動する。

% npx expo start --dev-client 以外は起動できなくなるので、アンインストール時は下記を行う
npm uninstall --dev-client
npm run start

% app.json-"version": "2"はずれるようにする必要がある。
% app.json-"ios"."buildNumber": "2"はずれるようにする必要がある。
% eas build -p ios
% eas submit --latest -p ios
% eas update --branch production --message "Bug Fixed"

npm install --dev-client

ee68028@yahoo.ne.jp

eas build --platform ios --auto-submit

% ★OTA (初回だけ production で公開。次回以降は eas update で OTA)
eas build --platform ios --profile production
eas submit --latest -p ios
% OTA(以降はこれだけで OK)
eas update --branch production --message "Bug Fixed"

LOG ["3840x2160", "1920x1080", "1280x720", "640x480", "352x288", "Photo", "High", "Medium", "Low"]
