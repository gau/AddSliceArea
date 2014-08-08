# Add Slice Area ReadMe #

指定した範囲の四隅に、目に見えないくらいの透明度でシェイプを追加します。Photoshopの画像アセット生成やSlicy.appなどで、余白のあるスライスをしたいときに便利です。

[図入りの説明](http://graphicartsunit.tumblr.com/post/94075304659/slicy-photoshop-add-slice)

-----

### 更新履歴 ###

* 0.5.1：コードの整理／処理中にダイアログを表示するようにした
* 0.5.0：新規作成

-----

### 対応バージョン ###

Photoshop CS5／CS6／CC／CC2014

-----

### インストール方法 ###

1. ダウンロードしたzipファイルを解凍します。
2. zipファイルを解凍すると「Add Slice Area.jsx」「README.md」「LICENSE.txt」という4つのファイルができますが、実際に使うのは「Add Slice Area.jsx」1点だけです。
以下の場所に「Add Slice Area.jsx」をコピーします。Windows版では、お使いのPhotoshopのモードによって、保存する場所が異なりますのでご注意ください。
	* 【Mac】/Applications/Adobe Photoshop [CS6/CC]/Presets/Scripts/
	* 【Windows 64bit版】C:\Program Files\Adobe\Adobe Photoshop {CS6/CC/CC2014} (64 Bit)\Presets\Scripts\
	* 【Windows 32bit版】C:\Program Files (x86)\Adobe\Adobe Photoshop {CS6/CC}\Presets\Scripts\
3. Photoshopを再起動します。
4. “ファイル”メニュー→“スクリプト”に“Add Slice Area”と表示されていれば、インストール成功です。

-----

### 使い方 ###

1. スライスしたい範囲を［長方形選択ツール］で選択します。
2. “ファイル”メニュー→“スクリプト”→“Add Slice Area”を選択します。
3. 範囲を定義するシェイプレイヤーが追加されれば完了です。
4. 書き出したいレイヤーと、追加されたレイヤーをまとめてレイヤーグループにし、レイヤーグループに対してファイル名やパラメーターを設定します。
5. あとは、Photoshopの画像アセット生成や、Slicy.appを使って画像をスライスします。

-----

### 仕組み ###

指定された範囲の四隅に、1ピクセル四方のシェイプを作成します。このシェイプレイヤーは［不透明度：1%］、［塗り：20％］という、極めて透明に近い濃度（単純計算で不透明度0.2％相当）なので、書き出し後の画像ではほぼ目視できないレベルです。

-----

### 補足、注意事項など ###

* 選択範囲にぼかしがあったり、長方形以外の形で選択されているときは処理ができません。警告を表示して中断します。
* 範囲定義のシェイプレイヤーは、スクリプト実行時に選択されているレイヤーのひとつ上に追加されます。レイヤーがひとつも選択されていないときは、最上層に追加されます。
* 範囲定義のシェイプレイヤーには、範囲の幅と高さがレイヤー名として追加されます。
* Retina用の@2x書き出しにも対応しています。
* 当然ですが、書き出したレイヤーの四隅には、不透明度1％以下のピクセルが残ります。肉眼で確認できない程度ですが、どうしてもこのピクセルが問題になるときは、書き出し後に手動で削除してください。
* スクリプトの実行が完了するまでは、他の操作をしないでください。

-----

### 免責事項 ###

* このスクリプトを使って起こったいかなる現象についても制作者は責任を負えません。すべて自己責任にてお使いください。
* 一応CS5〜CC2014で動作の確認はしましたが、OSのバージョンやその他の状況によって実行できないことがあるかもしれません。もし動かなかったらごめんなさい。

-----

### ライセンス ###

* Add Slice Area.jsx
* Copyright (c) 2014 Toshiyuki Takahashi
* Released under the MIT license
* [http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)
* [Graphic Arts Unit](http://www.graphicartsunit.com/)
* [Twitter](https://twitter.com/gautt)