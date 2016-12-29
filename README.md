# yamanu-chang
endchan: catalog sorter, preview upload files, recursive popup

「Mozilla Firefox + Greasemonkey」と「Google Chrome + Tampermonkey」で動くユーザースクリプトです。

# 機能一覧
- レスアンカーの再帰的ポップアップ
- カタログソートとRefresh
- 投稿ファイルのプレビュー
- 投稿時間の表記をユーザーローカルに(日本なら日本時間に)
- スレ内通し番号を表示(各スレページのみ)
- Auto RefreshチェックON/OFFの記憶
- 通報フォームを隠す
- カタログのスレ立てフォームを隠す
- Google Chrome で mp3 が貼れるようにする補助機能(スレ立て時は不可)
- 動画 Embed 補助機能( ニコニコ動画に関しては、ブラウザのセキュリティを下げている場合のみ )
- Refresh読み込み分のレスにも、[X] と del を設置する補助機能

***

Google Chrome の拡張機能に直接 —— Tampermonkey を介さずに —— 入れることも出来るけれど、
Tampermonkey を入れる方が自動更新が効く分オススメです。

# インストール方法
Greasemonkey か Tampermonkey を入れてから、下記 URL をクリック。
https://github.com/toshakiii/yamanu-chang/raw/master/yamanu-chang.user.js

あとは成り行きにまかせて下さい。
インストール後、ページを更新してから有効になります。

# Google Chrome 向け注意事項
もし「Google Chrome → 設定 → 拡張機能」に yamanu-chang を入れていて、
Tampermonkey に移行する人は、「設定 → 拡張機能」に入っている yamanu-chang の削除を忘れずに。

# Mozilla Firefox での導入済みバージョン確認方法
ツール → アドオン → (猿マークの)ユーザースクリプト → 詳細

# Google Chrome での導入済みバージョン確認方法
・右上の Tampermonkey のアイコン → ダッシュボード
あるいは
・右上の縦… → 設定 → 拡張機能