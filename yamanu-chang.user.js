// ==UserScript==
// @name        yamanu-chang
// @author      to_sha_ki_ii
// @namespace   to_sha_ki_ii
//
// @include    http://endchan.xyz*
// @include    https://endchan.xyz*
// @include    http://endchan.net*
// @include    https://endchan.net*
// @include    http://infinow.net*
// @include    https://infinow.net*
//
// @include    /https?://endchan5doxvprs5\.onion/.*$/
// @include    /https?://s6424n4x4bsmqs27\.onion/.*$/
// @include    /https?://endchan5doxvprs5\.onion.to/.*$/
// @include    /https?://s6424n4x4bsmqs27\.onion.to/.*$/
//
// @include    /https?://32ch\.org/.*$/
// @include    /https?://32ch\.org/.*$/
// @include    /https?://bunkerchan\.xyz/.*$/
//
// @include    /https?://freech\.net/.*$/
// @include    /https?://keksec\.com/.*$/
// @include    /https?://lynxhub\.com/.*$/
// @include    /https?://spacechan\.xyz/.*$/
// @include    /https?://spqrchan\.org/.*$/
// @include    /https?://spqrchan\.org/.*$/
// @include    /https?://waifuchan\.moe/.*$/
// @include    /https?://waifuchan\.moe/.*$/
//
// @version      2.35
// @description v2.35: endchan: catalog sorter, preview upload files, recursive quote popup
// @grant       none
// ==/UserScript==


/**************************************************
 *  yamanu-chang
 *  Copyright (c) 2017 "to_sha_ki_ii"
 *  This software is released under the MIT License.
 *  http://opensource.org/licenses/mit-license.php
 **************************************************
 *  CSSを利用しました : http://endchan.xyz/librejp/res/5273.html#8133
 */

/*
 yamanu-chang(山ぬちゃん)です
・(v2.35 2017.09.27) 修正: 再帰的ポップアップの表示CSSを改善
・(v2.34 2017.09.20) コード整理。プレビューの'POINTER'機構を削除して、'Element Unique Id'を使うように変更
・(v2.33 2017.09.20) 機能追加: 右クリックマークダウン支援を追加
・(v2.32 2017.09.06) 修正: 再帰的ポップアップの表示CSSを改善
・(v2.31 2017.08.31) 機能追加: qr.js 失敗時に再読み込みする機能を追加。
・(v2.30 2017.08.27) 対応: マークダウン支援で Red 周りの表示が崩れるのを修正。原因は global.css で .redText に position: absolute が指定されていたから。
・(v2.29 2017.08.27) 機能追加: 読み込み失敗した画像を再読み込みさせる補助機能を追加
・(v2.28 2017.08.22) getElementUniqueIdのタイプミスを修正
・(v2.27 2017.08.22) 変更: 通報/削除フォームム非表示機能を再有効化
・(v2.26 2017.08.22)
  ・HTML Element Unique ID のインフラを変更
  ・Board CSS で通報フォームを透明化したので、通報/削除フォームム非表示機能を停止
・(v2.25 2017.07.25) 微調整: マークダウン支援UI
・(v2.24 2017.07.25) 機能追加: マークダウン支援(タグ追加)
・(v2.23 2017.07.17) 機能追加: クリップボードのデータを添付ファイルにする機能
・(v2.22 2017.07.17) 微調整
・(v2.21 2017.07.17) 機能追加: UserJS(仮)
・(v2.20 2017.07.10)
  ・調整: ポップアップが縦幅100%でクリップされるのを撤廃
  ・調整: 縦に大きなポップアップの場合の出現位置を調整
・(v2.19 2017.07.09) 機能追加: 右下ダンスを非表示にする機能
・(v2.18 2017.07.02) ファイル名を自由に変更できる機能を追加
・(v2.17 2017.06.28) 微調整
・(v2.16) ファイル名をランダムな名前に変更するオプションを追加。
・(v2.15) 引用ポップアップの大きさ調整
・(v2.14) 動画ループ補助機能
・(v2.13) 通し番号CSSを調整。(v2.12は余計な対処だった)
・(v2.12) 通し番号CSSを調整。
・(v2.11) 補助機能:「400 Bad Request」ページにクッキー削除ボタンを設置
・(v2.10)
  ・v2.10の修正
    スクリプトを実行させる方法の選択を、「Firefox と Edge または、それ以外」という風に変更
・(v2.09)
  ・スクリプトを実行させる方法の選択を、「Firefox または、それ以外」という風に変更(MS Edge対応用)
・(v2.08) hideの仕様を公式にあわせる
・(v2.07) ミス修正
・(v2.06 2017.04.02 14:43 JST)
  ・endchan公式でカタログリフレッシュが導入され、公式のカタhideが動いていない。
    カタログhideを有効にする補助機能を追加
・(v2.05 2017.03.08 07:44 JST)
  ・endchan公式に入ったため、delと[X]を設置する補助機能を削除
・(v2.04 2017.02.26 JST)
  ・Youtube埋め込みをautoplyに
  ・soundcloudの埋め込み対応
  ・endchanがEmbedを表示しないURIの埋め込みにも対応
・(v2.03 2017.02.21 JST) デバッグコードが消えていなかったのを修正
・(v2.02 2017.02.21.01.09 JST)
  ・endchan公式に入ったため、複数行引用機能削除
  ・名前変更: CompulsoryProcesses → CompulsoryProcessing
  ・変数名調整多数
  ・endchan公式の変化に追従し、日付ローカライズ方法を縮小。公式の「Use Local Time」に寄生する形式に。
・(v2.01 2017.01.22 03:15 JST) 複数行引用の引用方法の微修正
・(v2.00 2017.01.22 03:03 JST) クイックリプライの複数行引用の補助機能を追加。
・(v1.99 2017.01.02.19.05 JST)
  ・オブザーバーパターンを歪めて統一した扱いができるようなコードに変更。(CompulsoryProcesses周り)
  ・Audioファイルのインライン再生時にサムネを残す補助機能を追加。
・(v1.98 2016.12.30.05.25 JST) 引用ポップアップで画像が表示できなかったのを修正
・(v1.97 2016.12.30.02.53 JST) Tor用アドレスに対応してみる(動作未確認)
・(v1.96 2016.12.30.02.34 JST)
  ・endchan が http を廃止して https に全面移行したみたいだから
    https に対応していないニコニコの埋め込みメッセージを変更
・(v1.95)
  ・Refresh時にタイトルの順番が戻ってしまうのを修正。
  ・対象サイトを追記
・(v1.94)
  ・ページタイトルを "<何々> - /<板名>/" にする補助機能を追加。
  ・Google Chrome で mp3 を貼れるようにする機能の実装を変更。
・(v1.93) Refresh読み込み分のレスにも、[X] と del を設置する補助機能を追加。
・(v1.92) autoRefresh の状態を記憶する補助機能を追加。
・(v1.91)
  ・カタログのスレ立てフォームを表示/非表示できるように。初期値は非表示。
  ・通報/削除フォームを表示/非表示できるように。初期値は非表示。
・(v1.90)
  ・div.markedPost にも通し番号が出るように
  ・endchan のカタログ hide の新仕様に対応。hide したスレが下に溜まるように。
  ・再帰的ポップアップのクイック引用に対応。レス番部分を押すと Quick Reply が開きます。
・(v1.89 2016.11.30 15:08 JST) バグ修正
・(v1.88 2016.11.30 14:44 JST) Google Chrome でも mp3 が貼れるようにハックを追加。
・(v1.87 2016.11.28 21:43 JST)
  ・freech.net で再帰的ポップアップが動かないのを修正
  ・ポップアップ待機中の「now loading」表示を追加
・(v1.86 2016.11.28 21:43 JST)
  ・再帰的ポップアップで、OP引用時にレス全部が出てくる不具合を修正。
  ・スレ内通し番号が出て来る場所を修正。引用ブロック内で出ないように。
・(v1.85 2016.11.25 14:22 JST)
  ・再帰的ポップアップをとりあえず実装。
    ポップアップ内の色々をクリックした時の動作が甘い。
・(v1.84 2016.11.23 03:37 JST)
  ・[Refresh]読み込み分の[Embed]ボタンが効くようにする補助機能を追加
  ・既存の Embed 機能を上書きして、closeできるように
    (endchan既存機能を抑えつけているから、上書き漏れが発生するかも)
  ・v1.84現在、ニコニコ動画とYoutubeに対応してます。
    山ぬちゃん書き換え分は[embeD]と[closE]と表示します。
・(v1.82 2016.11.19 04:25 JST)
  ・スレ[Refresh]分で読み込んだ文のレス日時が、ローカライズされないのを修正。
・(v1.81)
  ・通し番号に対応
  ・v1.80 が Chrome で動かなかったのを修正
  ・こっそりとLynxChan系の他掲示板に対応。
・(vその前)
  ・レス時間をローカルタイム表記にします。
  ・カタログソートと、ファイルプレビューをひとつにまとめました。
  ・mp3 とか mp4 とか webm のプレビューに対応しました。
     ( Chrome でたまにページごと落ちるけれど、回避方法は分からない )
  ・カタログに[Refresh]ボタンを追加しました。
  ・カタログソート。カタログに Sort By: セレクトボックスを設置します。
      ・選ぶと、カタログがその順でソートされます。
      ・localStorage上にどのソート方法を選んでいるか記録し、開き直した際もそのソートを適用します。
      ・「Sort by:」の部分を押してもソートが切り替わります。
      ・「r」の部分を押すとランダムにソートします。
      ・歯車ボタンを押すと設定が出ます
          ・Hideしたスレは下げる(ソート変更後に適用)
              (endchan の機能である)カタログ hide したあとに出る [Show hidden thread 0000]
              を常に一番下に置きます。
      ・厳密なレス新着順は、カタログにある情報だけでは構築できないため実装していません。
        (全スレの取得すればできるけど負荷がかかっちゃう)
      ・同順位についての扱いがブラウザによってマチマチかも
  ----------------------------------------
 */


/*
  ・1行100文字
  ・セミコロンは全ての場所につける。
  ・"message"
  ・'system_constant_value'
  ・trigger, enable, disable
  ・文字列定数は直接書く。変数を媒介しない。
*/

/*
 TODO:
 ・圧縮しても動くコードにしたい
 ・sendReplyData の hack をオフにできるオプションを追加すること。
 ・2回もダウンロードしないように
 ・ボードトップでページ内引用をするように。サウロンの目にも対応したい。
 ・selectedDivOnChange を lynxChanWrapper に移動すること。今時点、ファイルプレビューに依存している。
 ・Youtubeのリンクを有効にする補助機能を盛ること
 ・埋め込みを一本化すること
 ・再生開始機能を盛ること
*/

(function(){
  // pthis: modFilePreview
  // sthis: modCatalogSorter
  // mthis: modMultiPopup
  // etcthis: modEtCetera
  // ethis: DOM Elementを指すthis
  // lthis: modFeWrapper
  // cthis: 一時使用用

  window.toshakiii = window.toshakiii || {};
  window.toshakiii2 = window.toshakiii || {};
  var toshakiii = window.toshakiii;
  var toshakiii2 = window.toshakiii || {};

  /*********
   * utils *
   *********/
  function modUtils()
  {
    window.toshakiii = window.toshakiii || {};
    window.toshakiii.settings = window.toshakiii.settings || {};
    var toshakiii = window.toshakiii;
    var settings = window.toshakiii.settings;

    var uthis = window.toshakiii.utils = window.toshakiii.utils || {};
    var utils = uthis;

    uthis.CompulsoryProcessing = function( initFunc ) {
      this.initFunc = initFunc;
      /* mutationRecords を preProc したものを渡される関数のリスト */
      this.processes = [];

      /* 名前要再考 */
      /* mutationRecords 1つにつき、1回だけ呼びだされる関数のリスト */
      this.processesAfter = [];

      this.mutationObserver = undefined;
      this.observingElement = undefined;
      this.observingOptions = undefined;
      this.preProc = undefined;

      this.funcEnumExistingTargets = undefined;
    };

    uthis.CompulsoryProcessing.prototype.setObservingElement =
        function setObservingElement( element )
    {
      this.observingElement = element;
    };
    uthis.CompulsoryProcessing.prototype.setObservingOptions =
        function setObservingElement( options )
    {
      this.observingOptions = options;
    };
    uthis.CompulsoryProcessing.prototype.setFuncEnumExistingTargets =
        function setFuncEnumExistingTargets( value )
    {
      this.funcEnumExistingTargets = value;
    };
    uthis.CompulsoryProcessing.prototype.setPreProc =
        function setPreProc( value )
    {
      this.preProc = value;
    };
    uthis.CompulsoryProcessing.prototype.processExistingTargets =
        function processExistingTargets( proc, procAfter)
    {
      if( undefined === proc )
      {
        procAfter();
        return;
      };
      if( undefined === this.funcEnumExistingTargets )
      {
        return;
      };
      var break_ = false;
      var continue_ = true;
      var iloops = utils.IntermittentLoops();
      var obj = this;
      var tlist, idx;
      iloops.push( function(){
        tlist = obj.funcEnumExistingTargets();
        idx = tlist.length;
      } ).push( function(){
        --idx;
        if( -1 >= idx )
        {
          return break_;
        };

        proc( tlist[ idx ] );
        return continue_;
      } ).push( function(){
        if( undefined !== procAfter )
        {
          procAfter();
        };
      } ).beginAsync();
    };
    uthis.CompulsoryProcessing.prototype.startApply =
        function startApply()
    {
      if( undefined !== this.initFunc )
      {
        this.initFunc( this );
        this.initFunc = undefined;
      };
      if( undefined === this.mutationObserver &&
            this.observingElement !== undefined &&
            this.observingOptions !== undefined   )
      {
        this.mutationObserver = new MutationObserver( this.defaultCallback.bind( this ) );
        this.mutationObserver.observe( this.observingElement, this.observingOptions );
      };
    };
    uthis.CompulsoryProcessing.prototype.stopApply =
        function stopApply()
    {
      if( undefined !== this.mutationObserver )
      {
        this.mutationObserver.disconnect();
        this.mutationObserver = undefined;
      };
    };
    uthis.CompulsoryProcessing.prototype.defaultCallback =
        function defaultCallback( mutationRecords, mutationObserver)
    {
      if( undefined === this.preProc )
      {
        this.process( mutationRecords );
        this.processAfter( mutationRecords );
        return;
      };
      var tlist, tidx;
      var break_ = false;
      var continue_ = true;
      var iloops = utils.IntermittentLoops();
      var obj = this;
      iloops.push( function(){
        tlist = obj.preProc( mutationRecords, mutationObserver );
        tidx = tlist.length;
      } ).push( function(){
        --tidx;
        if( -1 >= tidx )
        {
          return break_;
        };
        obj.process( tlist[ tidx ] );
        return continue_;
      } ).push( function(){
        obj.processAfter( mutationRecords );
      } ).beginAsync();
    };
    uthis.CompulsoryProcessing.prototype.process =
        function process( target )
    {
      for( var pidx = 0, plen = this.processes.length; pidx < plen ; ++pidx )
      {
        this.processes[ pidx ]( target );
      };
    };
    uthis.CompulsoryProcessing.prototype.processAfter =
        function processAfter()/* to_sha_ki: 名前と設計を再考すること */
    {
      for( var pidx = 0, plen = this.processesAfter.length; pidx < plen ; ++pidx )
      {
        this.processesAfter[ pidx ]();
      };

    };

    uthis.CompulsoryProcessing.prototype.appendCP =
        function appendCP( func, noStartApply, noApplyToExistingTargets )
    {
      this.processes.push( func );
      if( ! noStartApply )
      {
        this.startApply();
      };
      if( ! noApplyToExistingTargets )
      {
        this.processExistingTargets( func, undefined);
      };
      return func;
    };
    uthis.CompulsoryProcessing.prototype.removeCP =
        function removeCP( func, noStopApply )
    {
      for( var idx = this.processes.length - 1; -1 < idx ; --idx )
      {
        if( this.processes[ idx ] === func )
        {
          this.processes.splice( idx, 1 );
          if( ! noStopApply &&
                0 === this.processes.length &&
                0 === this.processesAfter.length )
          {
            this.stopApply();
          };
          return func;
        };
      };
      return null;
    };
    uthis.CompulsoryProcessing.prototype.appendAfterCP =
        function appendAfterCP( func, noStartApply, noApplyToExistingTargets )
    {
      this.processesAfter.push( func );
      if( ! noStartApply )
      {
        this.startApply();
      };
      if( ! noApplyToExistingTargets )
      {
        this.processExistingTargets( undefined, func );
      };
      return func;
    };
    uthis.CompulsoryProcessing.prototype.removeAfterCP =
        function removeCP( func, noStopApply )
    {
      for( var idx = this.processesAfter.length - 1; -1 < idx ; --idx )
      {
        if( this.processesAfter[ idx ] === func )
        {
          this.processesAfter.splice( idx, 1 );
          if( ! noStopApply &&
                0 === this.processes.length &&
                0 === this.processesAfter.length )
          {
            this.stopApply();
          };
          return func;
        };
      };
      return null;
    };

    uthis.CompulsoryProcessing.prototype.preProc_enumAddedNodes =
        function preProc_enumAddedNodes( mutationRecords )
    {
      var tlist = [];
      for( var mrIdx = 0, mrLen = mutationRecords.length; mrIdx < mrLen ; ++mrIdx )
      {
        var mr = mutationRecords[ mrIdx ];
        for( var anIdx = 0, anLen = mr.addedNodes.length; anIdx < anLen ; ++anIdx )
        {
          tlist.push( mr.addedNodes[ anIdx ] );
        }
      };
      return tlist;
    };


    uthis.endsWith =
        function endsWith( str, suffix )
    {
      return -1 !== str.indexOf(suffix, str.length - suffix.length);
    };

    uthis.foreEachElementDescendants =
        function foreEachElementDescendants( element, func )
    {
      var children, idx, len;
      for( children = element.children, idx = 0, len = element.children.length; idx < len ; ++idx )
      {
        if( ! func( children[ idx ] ) )
        {
          return false;
        };
      };
      for( children = element.children, idx = 0, len = element.children.length; idx < len ; ++idx )
      {
        if( ! foreEachElementDescendants( children[ idx ], func ) )
        {
          return false;
        };
      };
      return true;
    };

    uthis.contains =
        function( array, item )
    {
      for( var arIdx in array )
      {
        if( item != array[ arIdx ] )
        {
          return true;
        };
      };
      return false;
    };

    uthis.getFirstLanguage =
        function()
    {
      return (window.navigator.languages && window.navigator.languages[0]) ||
          window.navigator.language ||
          window.navigator.userLanguage ||
          window.navigator.browserLanguage;
    };

    uthis.getBodyBackgroundColor =
        function()
    {
      var cssProperties = window.getComputedStyle(document.body);
      var backgroundColor = cssProperties["background-color"];
      if( backgroundColor == null )
      {
        return "rgb(255,255,255)";
      };
      return backgroundColor;
    };
    uthis.getBodyForegroundColor =
        function()
    {
      var cssProperties = window.getComputedStyle(document.body);
      var foregroundColor = cssProperties["color"];
      if( foregroundColor == null )
      {
        return "rgb(0,0,0)";
      };
      return foregroundColor;
    };

    uthis.getScrollTop = function()
    {
      var v = document.documentElement.scrollTop;
      if( 0 == v )
      {
        return document.body.scrollTop;
      };
      return v;
    };
    uthis.getScrollLeft = function()
    {
      var v = document.documentElement.scrollLeft;
      if( 0 == v )
      {
        return document.body.scrollLeft;
      };
      return v;
    };

    uthis.replaceItem = function( array, fromItem, toItem )
    {
      for( var idx = 0, len = array.length ; idx < len ; ++idx )
      {
        if( array[ idx ] === fromItem )
        {
          array[ idx ] = toItem;
        };
      };
      return array;
    };
    uthis.leftpad =
        function( str, n, char )
    {
      str = str.toString();
      if( n <= str.length )
      {
        return str;
      };
      if( undefined == char )
      {
        char = " ";
      };
      return char.repeat( n - str.length ) + str;
    };

    uthis.removeIdAll =
        function removeIdAll( element )
    {
      element.id = "";
      for( var i in element.children )
      {
        if( undefined != element.children )
        {
          removeIdAll( element.children[ i ] );
        };
      };
      return element;
    };


    uthis.log01 =
        function()
    {
      var elt = document.getElementById("toshakiii_log01");
      if( null == elt )
      {
        elt = document.createElement('SPAN');
        elt.id = "toshakiii_log01";
        document.body.appendChild(elt);
      };
      var str = "";
      for( var idx = 0, len = arguments.length; idx < len ; ++idx )
      {
        str = str + arguments[idx]+" ";
      };

      elt.appendChild( document.createTextNode(str) );
      elt.appendChild( document.createElement('BR') );
    };

    uthis.removePostCells =
        function()
    {
      var postCellList = document.getElementsByClassName('postCell');
      for( var idx = postCellList.length - 1; -1 < idx ; --idx )
      {
        postCellList[idx].parentElement.removeChild( postCellList[idx] );
      };
      window.lastReplyId = 0;
    };

    uthis.differenceSet =
        function( lhs, rhs )
    {
      var r = {};
      for( var key in lhs )
      {
        if( ! key in rhs )
        {
          r[ key ] = lhs[ key ];
        };
      };
      return r;
    };

    uthis.getYearMonthDateDayHoursMinutesSeconds =
        function( dateObj , useUTC )
    {
      /* return type: int array */
      /* return value: [ year, month, date, day, hours, minutes, seconds] */
      /*   month: 0 origin */
      if( useUTC )
      {
        return [ dateObj.getUTCFullYear(),
          dateObj.getUTCMonth(),
          dateObj.getUTCDate(),
          dateObj.getUTCDay(),
          dateObj.getUTCHours(),
          dateObj.getUTCMinutes(),
          dateObj.getUTCSeconds() ];
      };
      return [ dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        dateObj.getDay(),
        dateObj.getHours(),
        dateObj.getMinutes(),
        dateObj.getSeconds() ];
    };

    /* IntermittentLoops { */
    uthis.IntermittentLoops = function() {
      return new uthis.IntermittentLoops__();
      /* ・`IntermittentLoops' enables asynchronous loop execution. *
       * ・makes setTimeout-recursion easier to write.              */
    };
    uthis.IntermittentLoops__ = function() {
      this.loopFuncList = [];
    };

    uthis.IntermittentLoops__.prototype.push = function(f) {
      this.loopFuncList.push(f);
      return this;
    };

    /* note: the following setTimeout( [function], 0 )   */
    /*       I don't expect 0ms.                         */
    /*       with many browsers 0 stands for about 40ms. */
    uthis.IntermittentLoops__.prototype.beginAsync = function() {
      var ilThis = this;
      var loopFuncList = ilThis.loopFuncList;
      var wrappedLoopFuncList = new Array(loopFuncList.length);
      var index = loopFuncList.length - 1;

      /* loop for prepare wrappedLoopFuncList */
      for(; -1 < index ; --index ) {
        function createWrappedLoopFunc() {

          var currentLoopFunc = loopFuncList[index];

          var nextLoopFunc = ilThis.doNothing;;
          if( index + 1 < wrappedLoopFuncList.length ) {
            nextLoopFunc = wrappedLoopFuncList[ index + 1 ];
          };

          function wrappedLoopFunc() {
            if(currentLoopFunc()) {
              setTimeout( wrappedLoopFunc, 0 );
            } else {
              setTimeout( nextLoopFunc, 0 );
            };
          };
          return wrappedLoopFunc;
        };
        wrappedLoopFuncList[ index ] = createWrappedLoopFunc();
      };

      setTimeout( wrappedLoopFuncList[0], 0 );
    };

    uthis.IntermittentLoops__.prototype.doNothing = function(){};
    /* } IntermittentLoops */

    uthis.__Test_IntermittentLoops = function()
    {
      /*
        outputs: [1][2][3](A)(B)(C){_}{~}{=}
      */
      var ile = uthis.IntermittentLoops();

      var sss1 = ["[1]","[2]","[3]"];
      var idx1 = 0;
      var len1 = sss1.length;
      ile.push( function(){
        if( idx1 >= len1 ) return false;
        console.log( sss1[ idx1 ] );
        ++idx1;
        return true;
      } );

      var sss2 = ["(A)","(B)","(C)"];
      var idx2 = 0;
      var len2 = sss2.length;

      var sss3 = ["{_}","{-}","{=}"];
      var idx3 = 0;
      var len3 = sss3.length;

      ile
          .push( function(){
            if( idx2 >= len2 ) return false;
            console.log( sss2[ idx2 ] );
            ++idx2;
            return true;
          } )
          .push( function(){
            if( idx3 >= len3 ) return false;
            console.log( sss3[ idx3 ] );
            ++idx3;
            return true;
          } )
          .beginAsync();
    };

    uthis.elementUidCounter = 0;
    uthis.getElementUniqueId = function(element) {
      if ( element === element.thisself ) {
        /* thisself フィールドが element 自身を示すなら "data-tsk-uid" も有効に設定されているはず */
        return element.getAttribute("data-tsk-uid");
      };

      ++uthis.elementUidCounter;

      var uid = "tskuid" + uthis.elementUidCounter + "__";
      element.setAttribute( "data-tsk-uid", uid );
      element.thisself = element;

      return uid;
    };

    uthis.getElementsByUniqueId = function(euid) {
      var query = '[data-tsk-uid="' + euid + '"]';
      return document.querySelectorAll(query);
    };

    uthis.toMarkElementDiscarded = function(element) {
      element.setAttribute("data-tsk-discarded", "1");
    };

    uthis.trigger =
        function()
    {
      return;
    };

    return uthis;
  };

  /**********************************
   * settings                       *
   **********************************/
  function modSettings()
  {
    window.toshakiii = window.toshakiii || {};
    window.toshakiii.settings = window.toshakiii.settings || {};
    var toshakiii = window.toshakiii;
    var settings = window.toshakiii.settings;

    /*                         [<keynames>...] */
    settings.miniDataKeyList = [ 'ThreadAutoRefresh' ];

    settings.getMiniDataIndex =
        function( keyname )
    {
      for( var index = 0, length = settings.miniDataKeyList.length;
          index < length; ++index )
      {
        if( keyname === settings.miniDataKeyList[ index ] )
        {
          return index;
        };
      };
      return -1;
    };

    settings.setMiniDataContainer =
        function( value )
    {
      localStorage.setItem('toshakiii.settings.miniData', JSON.stringify( value ) );
    };
    settings.getMiniDataContainer =
        function()
    {
      var miniDataStr = localStorage.getItem('toshakiii.settings.miniData');
      var miniData, mdIdx, mdLen;
      if( null == miniDataStr )
      {
        miniData = Array( settings.miniDataKeyList.length );
        for( mdIdx = 0, mdLen = miniData.length; mdIdx < mdLen ; ++mdIdx )
        {
          miniData[ mdIdx ] = 0;
        };
      }
      else
      {
        miniData = JSON.parse( miniDataStr );
        for( mdIdx = miniData.length, mdLen = settings.miniDataKeyList.length;
            mdIdx < mdLen; ++mdIdx )
        {
          miniData[ mdIdx ] = 0;
        };
      };
      return miniData;
    };

    settings.getMiniData =
        function( keyname )
    {
      var index = settings.getMiniDataIndex( keyname );
      var miniDataContainer = settings.getMiniDataContainer();

      if( 0 > index )
      {
        return null;
      };

      if( index < (miniDataContainer.length) )
      {
        return miniDataContainer[ index ];
      };

      return null;
    };
    settings.setMiniData =
        function( keyname, value )
    {
      var index = settings.getMiniDataIndex( keyname );
      if( 0 > index )
      {
        return null;
      };
      var miniDataContainer = settings.getMiniDataContainer();
      miniDataContainer[ index ] = value;

      settings.setMiniDataContainer( miniDataContainer );
      return value;
    };

    settings.trigger = function(){};
    settings.enable = function(){};
    settings.disable = function(){};

    return settings;
  };

  /**********************************
   * filePreview                    *
   **********************************/
  function modFilePreview()
  {
    window.toshakiii = window.toshakiii || {};
    window.toshakiii.settings = window.toshakiii.settings || {};
    var toshakiii = window.toshakiii;
    var settings = window.toshakiii.settings;

    var pthis = {};
    var feWrapper = window.toshakiii.feWrapper;
    var utils = window.toshakiii.utils;

    window.toshakiii.filePreview = pthis;

    pthis.previewMaxWidth = "140px";
    pthis.previewMaxHeight = "140px";

    pthis.PREVIEW_CLASSNAME = "toshakiPreviewCell";
    pthis.PREVIEWS_AREA_CLASSNAME = "toshakiPreviewsArea";

    /* previewCell の className と data-rel-selected-cell に selectedCell の Element Unique Id
     * を設定する */

    pthis.insertPreviewElement = function( selectedCell, file) {
      if ( pthis.hasPreviewed( selectedCell ) )
        return true;

      var previewsArea = pthis.getPreviewsAreaElement(selectedCell);
      var div = document.createElement('DIV');
      var selectedCellUid = utils.getElementUniqueId(selectedCell);
      var previewCell;
      div.className = pthis.PREVIEW_CLASSNAME + " preview" + selectedCellUid;
      div.style.display = "inline-block";
      div.setAttribute("data-rel-selected-cell", selectedCellUid);
      previewsArea.appendChild(div);

      if ((350 * 1024 * 1024) <= file.size) {
        previewCell = this.insertDummyElement( div, file, "OVER 350MiB");

      } else if ( 0 <= file.type.indexOf( 'image/' ) ) {
        previewCell = pthis.insertImagePreviewElement( div, file);

      } else if ( 0 <= file.type.indexOf( 'audio/' ) || 0 <= file.type.indexOf( 'video/' ) ) {
        previewCell = pthis.insertAudioVideoPreviewElement( div, file);

      } else {
        previewCell = pthis.insertDummyElement( div, file);
      };

      return previewCell;
    };



    pthis.insertImagePreviewElement = function( destElt, file) {
      var fileReader = new FileReader();
      fileReader.onload = function() {
        var dataUri = this.result;
        var elt = document.createElement('IMG');
        elt.src = dataUri.toString();
        elt.style.maxWidth = pthis.previewMaxWidth;
        elt.style.maxHeight = pthis.previewMaxHeight;
        elt.style.border = "1px dashed black";
        destElt.appendChild( elt );
      };
      fileReader.readAsDataURL( file );
    };

    pthis.insertAudioVideoPreviewElement = function( destElt, file) {
      var fileReader = new FileReader();
      fileReader.onload = function() {
        var dataUri = this.result;
        var elt = document.createElement('VIDEO');
        elt.controls = true;
        elt.src = dataUri.toString();
        elt.style.maxWidth = pthis.previewMaxWidth;
        elt.style.maxHeight = pthis.previewMaxHeight;
        elt.style.border = "1px dashed black";
        destElt.appendChild( elt );
      };
      fileReader.readAsDataURL( file );
    };

    pthis.insertDummyElement = function( destElt, file, msg ) {
      var elt = document.createElement('DIV');
      var text = document.createTextNode( file.type );
      elt.appendChild( text );
      if( undefined != msg ) {
        elt.appendChild( document.createElement('BR') );
        elt.appendChild( document.createTextNode( msg ) );
      };

      elt.style.maxWidth = pthis.previewMaxWidth;
      elt.style.maxHeight = pthis.previewMaxHeight;
      elt.style.border = "1px dashed black";
      destElt.appendChild( elt );
    };

    pthis.getPreviewsAreaElement = function( refSelectedCell ) {
      return refSelectedCell.parentElement.parentElement
        .getElementsByClassName(pthis.PREVIEWS_AREA_CLASSNAME)[0];
    };

    pthis.getPreviewCellByChild = function(element) {
      for(; element.parentElement; element = element.parentElement) {
        if (0 <= element.className.indexOf(pthis.PREVIEW_CLASSNAME)) {
          return element;
        };
      };
      return null;
    };

    pthis.hasPreviewed = function(selectedCell) {
      var className = "preview" + utils.getElementUniqueId(selectedCell);
      return 0 != document.getElementsByClassName(className).length;
    };

    pthis.removeOldPreviews = function() {
      var previewList = document.getElementsByClassName(pthis.PREVIEW_CLASSNAME);
      var elementsToRemove = [];

      for (var pIdx = 0, pLen = previewList.length; pIdx < pLen; ++pIdx ) {
        var selectedCellEuid = previewList[pIdx].getAttribute("data-rel-selected-cell");
        if ( 0 == utils.getElementsByUniqueId(selectedCellEuid).length) {
          elementsToRemove.push(previewList[pIdx]);
        };
      };

      for (var rIdx = elementsToRemove.length - 1; -1 < rIdx ; --rIdx ) {
        var elt = elementsToRemove[rIdx];
        elt.parentElement.removeChild(elt);
      };
    };

    pthis.selectedDivOnChange = function(mutationRecords, mutationObserver) {
      /* 本フォームへの ".selectedCell" 追加の前に、クイックリプライへの追加が行なわれることを前提と
       * する */
      var selectedCells = document.getElementsByClassName("selectedCell");
      var scIdx = 0;
      var scLen = selectedCells.length;
      var mLen = Math.min(selectedCells.length, window.selectedFiles.length);
      pthis.removeOldPreviews();

      for (; scIdx < mLen ; ++scIdx) {
        if (! pthis.hasPreviewed(selectedCells[scIdx])) {
          pthis.insertPreviewElement( selectedCells[scIdx], window.selectedFiles[scIdx]);
        };
      };

      for (; scIdx < scLen; ++scIdx) {
        if (! pthis.hasPreviewed(selectedCells[scIdx])) {
          pthis.insertPreviewElement( selectedCells[scIdx], window.selectedFiles[scIdx - mLen]);
        };
      };

      for(var shIdx in feWrapper.selectedDivOnChangeHandlers) {
        feWrapper.selectedDivOnChangeHandlers[shIdx]();
      };
    };

    pthis.quickReplyOnLoad = function(mutationRecords, mutationObserver ) {
      for( var mrIdx = 0, mrLen = mutationRecords.length; mrIdx < mrLen ; ++mrIdx ) {
        if( 0 >= mutationRecords[ mrIdx ].addedNodes.Length )
          continue;
        for( var anIdx = 0, anLen = mutationRecords[ mrIdx ].addedNodes.length ;
             anIdx < anLen ; ++anIdx ) {

          if( "quick-reply" == mutationRecords[ mrIdx ].addedNodes[ anIdx ].id ) {
            var selectedCells = mutationRecords[ mrIdx ].addedNodes[ anIdx ]
                  .getElementsByClassName("selectedCell");

            pthis.insertPreviewsArea(document.getElementById("selectedDivQr"));

            for( var qrhIdx = 0, qrhLen = feWrapper.quickReplyOnLoadHandlers.length;
                 qrhIdx < qrhLen; ++qrhIdx) {

              feWrapper.quickReplyOnLoadHandlers[qrhIdx](
                mutationRecords[mrIdx].addedNodes[anIdx]);
            };

            pthis.selectedDivOnChange();
          };
        };
      };
    };

    pthis.insertPreviewsArea = function(refSelectedDiv) {
      var previewsArea = document.createElement("div");
      previewsArea.className = pthis.PREVIEWS_AREA_CLASSNAME;
      refSelectedDiv.parentElement.insertBefore( previewsArea, refSelectedDiv );
    };

    pthis.stopSelectedDivObserver = function() {
      if( undefined != pthis.sdMutationObserver ) {
        pthis.sdMutationObserver.disconnect();
        pthis.sdMutationObserver = undefined;
      };
    };
    pthis.startSelectedDivObserver = function() {
      var selectedDiv = document.getElementById("selectedDiv");
      if( null == selectedDiv ) {
        return;
      };
      var options = { childList: true};
      pthis.sdMutationObserver = new MutationObserver( pthis.selectedDivOnChange );
      pthis.insertPreviewsArea( selectedDiv );
      pthis.sdMutationObserver.observe( selectedDiv, options );
    };

    pthis.stopQuickReplyObserver = function() {
      if( undefined != pthis.qrMutationObserver ) {
        pthis.qrMutationObserver.disconnect();
        pthis.qrMutationObserver = undefined;
      };
    };
    pthis.startQuickReplyObserver = function() {
      if( pthis.qrMutationObserver !== undefined && ! window.show_quick_reply ) {
        return;
      };
      var qrOptions = { childList: true};
      pthis.qrMutationObserver = new MutationObserver( pthis.quickReplyOnLoad );
      pthis.qrMutationObserver.observe( document.body, qrOptions);
    };

    pthis.trigger = function() {
      pthis.enable();
    };

    pthis.enable = function() {
      /* 公式対応したら動かない */
      if( undefined != window.addSelectedFile &&
          0 <= window.addSelectedFile.toString().indexOf("dragAndDropThumb") ) {
        return;
      };
      pthis.startSelectedDivObserver();
      pthis.startQuickReplyObserver();
    };

    pthis.disable =
        function()
    {
      pthis.stopSelectedDivObserver();
      pthis.stopQuickReplyObserver();
      var elts = document.getElementsByClassName( pthis.PREVIEWS_AREA_CLASSNAME );
      for( var idx = elts.length - 1; idx > -1 ; --idx )
      {
        elts[ idx ].parentElement.removeChild( elts[ idx ] );
      }
    };

    return pthis;
  };
  /* end modFilePreview */

  /**********************************
   * CatalogSorter                  *
   **********************************/
  function modCatalogSorter()
  {
    window.toshakiii = window.toshakiii || {};
    window.toshakiii.settings = window.toshakiii.settings || {};
    var toshakiii = window.toshakiii;
    var settings = window.toshakiii.settings;

    var sthis = {};
    var utils = window.toshakiii.utils;

    window.toshakiii.catalogSorter = sthis;

    sthis.SPAN_ID = "toshakiiiCatalogSortSpan";
    /*sthis.LABEL_ID = "toshakiiiCatalogSortLabel";*/
    sthis.SELECT_ID = "toshakiiiCatalogSortSelect";
    sthis.SETTINGS_ID = "toshakiiiCatalogSortSettings";
    sthis.REFRESH_STATUS_ID = "toshakiiiCatalogSortRefreshStatus";

    sthis.boardUri = document.location.pathname.replace(/\/([^\/]*).*/,"$1");

    sthis.catalogLastModified = new Date( document.lastModified );
    sthis.nowRefreshing = false;

    sthis.cmpfBumpOrder =
      function(x,y)
    {
      var a = sthis.bumpOrderOfId[ sthis.getCatalogCellId( x ) ];
      var b = sthis.bumpOrderOfId[ sthis.getCatalogCellId( y ) ];
      return a - b;
    };

    sthis.cmpfCreationData =
      function(x,y)
    {
      var a = parseInt( sthis.getCatalogCellId( y ) );
      var b = parseInt( sthis.getCatalogCellId( x ) );
      return a - b;
    };

    sthis.cmpfReplyCount =
      function(x,y)
    {
      var f = function(elt)
      {
        return parseInt( elt.getElementsByClassName("labelReplies")[0].innerHTML );
      };
      var a = f(y);
      var b = f(x);
      return a - b;
    };

    sthis.cmpfImageCount =
      function(x,y)
    {
      var f = function(elt)
      {
        return parseInt( elt.getElementsByClassName("labelImages")[0].innerHTML );
      };
      var a = f(y);
      var b = f(x);
      return a - b;
    };

    sthis.cmpfRevBumpOrder    = function(x,y){ return -sthis.cmpfBumpOrder   (x,y);};
    sthis.cmpfRevCreationData = function(x,y){ return -sthis.cmpfCreationData(x,y);};
    sthis.cmpfRevReplyCount   = function(x,y){ return -sthis.cmpfReplyCount  (x,y);};
    sthis.cmpfRevImageCount   = function(x,y){ return -sthis.cmpfImageCount  (x,y);};

    sthis.shuffle =
      function( array )
    {
      var n = array.length;
      var t;
      var i;

      while (n) {
        i = Math.floor(Math.random() * n--);
        t = array[n];
        array[n] = array[i];
        array[i] = t;
      };

      return array;
    };

    sthis.tableOrderType = undefined;

    sthis.initTableOrderType =
      function()
    {
      /*
        funcType == undefined は funcType == 0 と同義とする。
      */
      sthis.tableOrderType =
          [
            { name: "Bump order"      , compareFunction: sthis.cmpfBumpOrder }
            , { name: "Creation date" , compareFunction: sthis.cmpfCreationData }
            , { name: "Reply count"   , compareFunction: sthis.cmpfReplyCount }
            , { name: "Image count"   , compareFunction: sthis.cmpfImageCount }
            , { name: "Random", funcType: 1, sortFunction: sthis.shuffle }
            , { name: "Bump order(reverse)",    compareFunction: sthis.cmpfRevBumpOrder }
            , { name: "Creation date(reverse)", compareFunction: sthis.cmpfRevCreationData }
            , { name: "Reply count(reverse)",   compareFunction: sthis.cmpfRevReplyCount }
            , { name: "Image count(reverse)",   compareFunction: sthis.cmpfRevImageCount }
          ];
    };

    sthis.bumpOrderOfId = {};

    sthis.loadSettingsSageHidedThreads =
      function()
    {
      if( undefined === settings.sageHidedThreads )
      {
        if( "1" == localStorage.getItem( 'toshakiii.settings.sageHidedThreads' ) )
        {
          settings.sageHidedThreads = true;
        }
        else
        {
          settings.sageHidedThreads = false;
        };
      };
      return settings.sageHidedThreads;
    };

    sthis.saveSettingsSageHidedThreads =
      function( value )
    {
      if( value )
      {
        settings.sageHidedThreads = true;
        localStorage.setItem( 'toshakiii.settings.sageHidedThreads', "1");
      }
      else
      {
        settings.sageHidedThreads = false;
        localStorage.setItem( 'toshakiii.settings.sageHidedThreads', "0");
      };
    };

    /*
      元 HTML の catalogCell に id は設定されていない
    */
    sthis.getCatalogCellId =
      function( catalogCell )
    {
      if( 0 != catalogCell.id.length )
        return catalogCell.id;
      var s = catalogCell.getElementsByClassName( "linkThumb" )[0].href;
      var i = s.lastIndexOf("/");
      s = s.substring(1+i);
      i = s.indexOf(".");
      if( 0 <= i )
        return catalogCell.id = s.substring(0,i);
      return undefined;
    };

    sthis.recordBumpOrder =
      function()
    {
      var divThreads = document.getElementById( "divThreads" );
      if( null == divThreads )
      {
        return false;
      };

      for( var idx = 0, len = divThreads.children.length; idx < len ; ++idx )
      {
        var id = sthis.getCatalogCellId( divThreads.children[idx] );
        if( id.length != 0 )
        {
          sthis.bumpOrderOfId[ id ] = idx;
        };
      };
      return true;
    };

    sthis.recordBumpOrderFromJson =
      function( catalogJson )
    {
      /* json : catalog.json をパースしたもの */
      var bumpOrderOfId = {};
      for( var idx = 0, len = catalogJson.length; idx < len ; ++idx )
      {
        var id = catalogJson[ idx ].threadId;
        bumpOrderOfId[ id ] = idx;
      };
      sthis.bumpOrderOfId = bumpOrderOfId;
    };

    sthis.circulateOrderType =
      function()
    {
      var selectElt = document.getElementById( sthis.SELECT_ID );
      var n = 1 + parseInt(selectElt.value);
      if( n >= selectElt.length )
      {
        n = 0;
      }
      selectElt.value = n;
      sthis.sortCatalogCells();
    };

    sthis.MeasuringPerformanceSortCatalogCells =
      function()
    {
      /*
        うーｎ。直接 appendChild した場合と、DocumentFragment を使った場合。
        そもそも全体 Firefox の方が遅いから、DocumentFragment は不採用。

        Google Chrome version 52.0.2743.116 (64-bit)
        direct[1025] fragment[ 995] diff[30] / count[816]
        direct[ 960] fragment[1038] diff[78] / count[699]
        direct[ 972] fragment[1028] diff[56] / count[651]

        Firefox 48.0
        direct[883] fragment[1121] diff[238] / count[106]
        direct[871] fragment[1132] diff[261] / count[111]
        direct[853] fragment[1157] diff[304] / count[119]
      */
      var end = (+new Date()) + 2000;
      var tottimed = 0;
      var tottimef = 0;
      var count = 0;
      while( end > (+new Date()))
      {
        var time = (+new Date());
        sthis.sortCatalogCells( false );
        tottimed += (+new Date()) - time;

        time = (+new Date());
        sthis.sortCatalogCells( true );
        tottimef += (+new Date()) - time;
        ++count;
      };
      document.body.insertBefore( document.createTextNode( "direct["+tottimed+"]  fragment["+tottimef+"] diff[" + Math.abs( tottimed - tottimef ) + "] / count["+count+"]" ),
          document.body.firstChild );
    };

    sthis.shuffleCatalogCells =
      function()
    {
      for( var idx = 0, len = sthis.tableOrderType.length; idx < len ; ++idx )
      {
        if( sthis.tableOrderType[ idx ].sortFunction == sthis.shuffle )
        {
          var selectElt = document.getElementById( sthis.SELECT_ID );
          selectElt.value = idx;
          sthis.sortCatalogCells();
          break;
        };
      };
    };

    sthis.CatalogCell =
      (function()
          {
            var ccthis = this;
            var ref = function( array, index, defval )
            {
              if( array.length > index )
              {
                return array[ index ];
              };
              return defval;
            };
            var refInnerHTML = function( element, defval )
            {
              if( undefined == element )
              {
                return defval;
              };
              if( element.innerHTML )
              {
                return element.innerHTML;
              };
              return defval;
            };
            ccthis.prepareId = function( catalogCell )
            {
              if( 0 != catalogCell.id.length )
                return catalogCell.id;
              var s = catalogCell.getElementsByClassName( "linkThumb" )[0].href;
              var i = s.lastIndexOf("/");
              s = s.substring(1+i);
              i = s.indexOf(".");
              if( 0 <= i )
                return catalogCell.id = s.substring(0,i);
              return undefined;
            };

            ccthis.getLinkThumbElement = function( catalogCell )
            {
              return ref( catalogCell.getElementsByClassName("linkThumb"), 0, null );
            };
            ccthis.getLabelSubjectElement = function( catalogCell )
            {
              return ref( catalogCell.getElementsByClassName("labelSubject"), 0, null );
            };
            ccthis.getDivMessageElement = function( catalogCell )
            {
              return ref( catalogCell.getElementsByClassName("divMessage"), 0, null );
            };
            ccthis.getLabelRepliesElement = function( catalogCell )
            {
              return ref( catalogCell.getElementsByClassName("labelReplies"), 0, null );
            };
            ccthis.getLabelImagesElement = function( catalogCell )
            {
              return ref( catalogCell.getElementsByClassName("labelImages"), 0, null );
            };
            ccthis.getLabelPageElement = function( catalogCell )
            {
              return ref( catalogCell.getElementsByClassName("labelPage"), 0, null );
            };
            ccthis.getLockIndicatorElement = function( catalogCell )
            {
              return ref( catalogCell.getElementsByClassName("lockIndicator"), 0, null );
            };
            ccthis.getPinIndicatorElement = function( catalogCell )
            {
              return ref( catalogCell.getElementsByClassName("pinIndicator"), 0, null );
            };
            ccthis.getCyclicIndicatorElement = function( catalogCell )
            {
              return ref( catalogCell.getElementsByClassName("cyclicIndicator"), 0, null );
            };
            ccthis.getBumpLockIndicatorElement = function( catalogCell )
            {
              return ref( catalogCell.getElementsByClassName("bumpLockIndicator"), 0, null );
            };
            ccthis.getThreadStatsElement = function( catalogCell )
            {
              return ref( catalogCell.getElementsByClassName("threadStats"), 0, null);
            };

            ccthis.getRepliesStr = function( catalogCell )
            {
              return refInnerHTML( ccthis.getLabelRepliesElement( catalogCell ), null );
            };
            ccthis.getImagesStr = function( catalogCell )
            {
              return refInnerHTML( ccthis.getLabelImagesElement( catalogCell ), null );
            };
            ccthis.getPageStr = function( catalogCell )
            {
              return refInnerHTML( ccthis.getLabelPageElement( catalogCell ), null );
            };
            ccthis.isLocked = function( catalogCell )
            {
              return ccthis.getLockIndicatorElement( catalogCell );
            };
            ccthis.isPined = function( catalogCell )
            {
              return ccthis.getPinIndicatorElement( catalogCell );
            };
            ccthis.isCyclic = function( catalogCell )
            {
              return ccthis.getCyclicIndicatorElement( catalogCell );
            };
            ccthis.isBumpLocked = function( catalogCell )
            {
              return ccthis.getBumpLockIndicatorElement( catalogCell );
            };

            ccthis.changeURL = function( catalogCell, value )
            {
              ccthis.getLinkThumbElement( catalogCell ).href = value;
            };
            ccthis.changeThumb = function( catalogCell, value )
            {
              var linkThumb = ccthis.getLinkThumbElement( catalogCell );
              var firstChild = linkThumb.firstChild;
              if( value )
              {
                if( 'IMG' == firstChild.tagName )
                {
                  firstChild.src = value;
                  return;
                }
                else
                {
                  var img = document.createElement('IMG');
                  img.src = value;
                  linkThumb.replaceChild( img, firstChild );
                  return;
                };
                return;
              };
              if( 'IMG' == firstChild.tagName )
              {
                var text = document.createTextNode("Open");
                linkThumb.replaceChild( text, firstChild );
              };
            };
            ccthis.changeSubject = function( catalogCell, value )
            {
              ccthis.getLabelSubjectElement( catalogCell ).innerHTML = value;
            };
            ccthis.changeMessage = function( catalogCell, value )
            {
              ccthis.getDivMessageElement( catalogCell ).innerHTML
                  = value.replace(/\r/g,"").replace(/\n/g,"<br>");
            };

            ccthis.changeRepliesNum = function( catalogCell, value )
            {
              if( undefined == value ) value = "0";
              ccthis.getLabelRepliesElement( catalogCell ).innerHTML = value;
            };
            ccthis.changeImagesNum = function( catalogCell, value )
            {
              if( undefined == value ) value = "0";
              ccthis.getLabelImagesElement( catalogCell ).innerHTML = value;
            };
            ccthis.changePageNum = function( catalogCell, value )
            {
              if( undefined == value ) value = "0";
              ccthis.getLabelPageElement( catalogCell ).innerHTML = value;
            };

            ccthis.changeIndicator = function( catalogCell, value,
                getIndicatorFunction, createElementFunction )
            {
              var elt = getIndicatorFunction( catalogCell );
              if( elt )
              {
                if( value )
                {
                  return;
                }
                else
                {
                  elt.parentElement.removeChild( elt );
                  return;
                };
              }
              else
              {
                if( value )
                {
                  ccthis.getThreadStatsElement( catalogCell )
                      .appendChild( createElementFunction() );
                  return;
                }
                else
                {
                  return;
                };
              };
            };
            ccthis.changeLock = function( catalogCell, value)
            {
              return ccthis.changeIndicator( catalogCell, value,
                  ccthis.getLockIndicatorElement,
                  ccthis.makeLockIndicatorElement );
            };
            ccthis.changePin = function( catalogCell, value)
            {
              return ccthis.changeIndicator( catalogCell, value,
                  ccthis.getPinIndicatorElement,
                  ccthis.makePinIndicatorElement );
            };
            ccthis.changeCyclic = function( catalogCell, value)
            {
              return ccthis.changeIndicator( catalogCell, value,
                  ccthis.getCyclicIndicatorElement,
                  ccthis.makeCyclicIndicatorElement );
            };
            ccthis.changeBumpLock = function( catalogCell, value)
            {
              return ccthis.changeIndicator( catalogCell, value,
                  ccthis.getBumpLockIndicatorElement,
                  ccthis.makeBumpLockIndicatorElement );
            };

            ccthis.makeIndicatorElement = function( classnames, title)
            {
              var elt = document.createElement("span");
              elt.class = classnames;
              elt.title = title;
              return elt;
            };
            ccthis.makeLockIndicatorElement = function()
            {
              return ccthis.makeIndicatorElement("lockIndicator","Locked");
            };
            ccthis.makePinIndicatorElement = function()
            {
              return ccthis.makeIndicatorElement("pinIndicator","Sticky");
            };

            ccthis.makeCyclicIndicatorElement = function()
            {
              return ccthis.makeIndicatorElement("cyclicIndicator","Cyclical Thread");
            };

            ccthis.makeBumpLockIndicatorElement = function()
            {
              return ccthis.makeIndicatorElement("bumpLockIndicator","Bumplocked");
            };

            return ccthis;
          })();
    /* end: sthis.CatalogCell = (function(){...}()) */

    sthis.sortCatalogCells =
      function()
    {
      var time = (+new Date());
      var parentElt = document.getElementById("divThreads");
      var children = parentElt.children;
      var catalogCells = [];
      var showButtonElts = {};
      var idx = 0;
      var len = 0;
      var n = "";
      for( idx = 0, len = children.length ; idx < len ; ++idx )
      {
        var child = children[idx];
        if( null != child.firstChild &&
              'A' === child.firstChild.tagName &&
              0 === child.firstChild.innerHTML.lastIndexOf("[Show hidden thread ",0) )
        {
          n = child.id.replace( /[^0-9]/g, "");
          showButtonElts[ n ] = child;
        }
        else
        {
          catalogCells.push( children[idx] );
        };
      };
      children = undefined;

      var selectElt = document.getElementById( sthis.SELECT_ID );
      var oIdx = parseInt(selectElt.value);
      localStorage.setItem( "toshakiii.settings.catalogOrderType", oIdx );

      var funcType = sthis.tableOrderType[oIdx].funcType;
      if( 0 ==  funcType || undefined == funcType )
      {
        catalogCells.sort( sthis.tableOrderType[oIdx].compareFunction );
      }
      else if( 1 == funcType )
      {
        catalogCells = sthis.tableOrderType[oIdx].sortFunction( catalogCells );
      };

      /* var cookie = '; ' + document.cookie + "; "; */
      var sageElts = [];
      for( var ccIdx = 0, ccLen = catalogCells.length; ccIdx < ccLen ; ++ccIdx )
      {
        var catalogCell = catalogCells[ ccIdx ];
        if( catalogCell.id in showButtonElts )
        {
          var spanElt = showButtonElts[ catalogCell.id ];
          if( settings.sageHidedThreads && spanElt.style.display != 'none' )
          {
            sageElts.push( spanElt );
            sageElts.push( catalogCell );
            continue;
          }
          parentElt.appendChild( showButtonElts[ catalogCell.id ] );
        }
        else if( settings.sageHidedThreads &&
              window.getSetting !== undefined &&
              window.getSetting( 'hide' + sthis.boardUri + 'Thread' + catalogCell.id ) )
        {
          sageElts.push( catalogCell );
          continue;
        };

        parentElt.appendChild( catalogCell );
      };
      for( var seIdx = 0, seLen = sageElts.length; seIdx < seLen ; ++seIdx )
      {
        parentElt.appendChild( sageElts[ seIdx ] );
      };
    };

    sthis.getCatalogJsonUri =
      function()
    {
      if( undefined == sthis.CatalogJsonUri )
      {
        sthis.CatalogJsonUri = document.URL.replace(/\.html.*/,"") + ".json";
      };
      return sthis.CatalogJsonUri;
    };

    sthis.showRefreshStatus =
      function( msg )
    {
      var refreshStatus = document.getElementById( sthis.REFRESH_STATUS_ID );
      var text = document.createTextNode( msg );
      if( refreshStatus.firstChild )
      {
        refreshStatus.replaceChild( text, refreshStatus.firstChild );
      }
      else
      {
        refreshStatus.appendChild( text );
      };
    };

    sthis.refreshCatalogCells =
      function( callback )
    {
      if( sthis.nowRefreshing )
      {
        return;
      };
      sthis.nowRefreshing = true;
      sthis.showRefreshStatus("loading");
      var uri = sthis.getCatalogJsonUri();

      var loadingBody = false;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange =
          function()
      {
        switch( this.readyState ){
        case 0:
        case 1:
          sthis.showRefreshStatus("requesting");
          break;
        case 2:
          sthis.showRefreshStatus("header");
          break;
        case 3:
          if( ! loadingBody )
          {
            sthis.showRefreshStatus("body");
            loadingBody = true;
          };
          break;
        case 4:
          switch( this.status ){
          case 304:
            sthis.showRefreshStatus("not modified");
            sthis.nowRefreshing = false;
            if (callback) callback( false );
            return;
          case 200:
            sthis.showRefreshStatus("applying");
            sthis.catalogLastModified = new Date( this.getResponseHeader("Last-Modified") );
            sthis.applyJsonToCatalog( this.responseText, sthis.showRefreshStatus,
                function(){ if (callback) callback( true ); } );
            return;
          default:
            sthis.showRefreshStatus("error(HTTP "+this.status+")");
            sthis.nowRefreshing = false;
            if (callback) callback( false );
          };
        default:
          sthis.nowRefreshing = false;
          sthis.showRefreshStatus("error(unknown)");
          if (callback) callback( false );
        };
      };

      xhr.open('GET', uri);
      /*
        catalog.html の lastModified は catalog.json のそれより 1秒過去の場合がしばしば。
      */
      var ifModifiedSince = sthis.catalogLastModified.toUTCString();
      xhr.setRequestHeader('If-Modified-Since', ifModifiedSince);

      var catalogCells = document.getElementsByClassName("catalogCell");
      if( 0 < catalogCells.length &&
            "" == catalogCells[0].id )
      {
        for( var idx = 0, len = catalogCells.length ; idx < len ; ++idx )
        {
          sthis.CatalogCell.prepareId( catalogCells[ idx ] );
        };
      };
      xhr.send(null);
    };

    sthis.applyJsonToCatalog =
        function( jsontext, msgfunc, callback )
    {
      var json = undefined;
      try
      {
        json = JSON.parse( jsontext );
        window.catalogThreads = json;
      }
      catch(o)
      {
        msgfunc("JSON error");
        sthis.nowRefreshing = false;
        return;
      };

      var break_ = false;
      var iloops = utils.IntermittentLoops();

      var threadCount = 0;
      var threadProcedCount = 0;
      iloops.push
      (function()
          {
            var threadsToDelete = utils.differenceSet( sthis.bumpOrderOfId, json );
            for( var threadId in threadsToDelete )
            {
              var catalogCell = document.getElementById( threadId );
              catalogCell.parentElement.removeChild( catalogCell );
            };
          } ).push
      (function()
          {
            sthis.recordBumpOrderFromJson( json );
          } );
      var catalogCellInfoOfId = {};
      iloops.push( function(){
        for( var cellInfo in json )
        {
          ++threadCount;
          catalogCellInfoOfId[ json[ cellInfo ].threadId ] = json[ cellInfo ];
        };
        if( 0 == threadCount )
        {
          threadCount = 1;
        };
      } );

      var newThreadIds = [];
      var beforeProgress = 0;

      iloops.push
      (function()
          {
            ++threadProcedCount;
            var p = Math.floor( ( 10 * threadProcedCount ) / threadCount ).toString();
            if( p != beforeProgress )
            {
              msgfunc( p + "0%" );
              beforeProgress = p;
            };
            return sthis.applyInfoToCatalogCellLoop( catalogCellInfoOfId, newThreadIds, msgfunc );
          } ).push
      ( function(){
        msgfunc("succeeded");
        sthis.sortCatalogCells();
        sthis.nowRefreshing = false;
      } );

      if( undefined != window.enableHideThreadLink )
      {
        iloops.push( function(){
          if( 0 >= newThreadIds.length )
          {
            return false;
          };
          var newThreadId = newThreadIds.pop();
          var catalogCell = document.getElementById( newThreadId );
          if( null == catalogCell )
          {
            return true;
          };
          window.enableHideThreadLink( catalogCell );
          return true;
        } );
      };

      if(callback) {
        iloops.push( callback );
      };

      iloops.beginAsync();
    };

    /*
      新しく catalogCell 全部を作るのではなく、
      わざわざ既存の DOM を変更するのは、
      他のスクリプトが catalogCell に何か仕込んでいるかも知れないから。
    */
    sthis.applyInfoToCatalogCellLoop =
        function( catalogCellInfoOfId, out_newThreadIds, msgfunc )
    {
      var break_ = false;
      var continue_ = true;

      for( var id in catalogCellInfoOfId ){break;};
      if( undefined == id )
      {
        return break_;
      };
      /*msgfunc( "applying["+id+"]" );*/
      var info = catalogCellInfoOfId[ id ];
      var catalogCell = document.getElementById( id );
      if( null == catalogCell )
      {
        out_newThreadIds.push( info.threadId );
        var newCatalogCell = sthis.makeCatalogCell( info );
        document.getElementById("divThreads").appendChild( newCatalogCell );
      }
      else
      {
        sthis.applyInfoToCatalogCell( info, catalogCell );
      };
      delete catalogCellInfoOfId[ id ];
      return continue_;
    };

    sthis.applyInfoToCatalogCell =
        function( catalogCellInfo, catalogCell )
    {
      var info = catalogCellInfo;
      sthis.CatalogCell.changeRepliesNum( catalogCell, info.postCount );
      sthis.CatalogCell.changeImagesNum ( catalogCell, info.fileCount );
      sthis.CatalogCell.changePageNum   ( catalogCell, info.page );
      sthis.CatalogCell.changeLock      ( catalogCell, info.locked );
      sthis.CatalogCell.changePin       ( catalogCell, info.pinned );
      sthis.CatalogCell.changeCyclic    ( catalogCell, info.cyclic );
      sthis.CatalogCell.changeBumpLock  ( catalogCell, info.autoSage );
    };


    sthis.catalogCellTemplateHTML = '<div id="00" class="catalogCell"><a class="linkThumb" href="/"><img src="/"></a><p class="threadStats">R:<span class="labelReplies">00</span>/ I:<span class="labelImages">00</span>/ P:<span class="labelPage">00</span></p><p><span class="labelSubject">00</span></p><div class="divMessage">00</div></div>';
    sthis.catalogCellTemplateElement = undefined;
    sthis.makeCatalogCell =
        function( catalogCellInfo )
    {
      if( sthis.catalogCellTemplateElement == undefined )
      {
        var span = document.createElement('SPAN');
        span.innerHTML = sthis.catalogCellTemplateHTML;
        sthis.catalogCellTemplateElement = span.removeChild ( span.firstChild );
        span = undefined;
      };
      var info = catalogCellInfo;
      var catalogCell = sthis.catalogCellTemplateElement.cloneNode(true);

      catalogCell.id = catalogCellInfo.threadId;

      sthis.CatalogCell.changeURL( catalogCell,
          "/" + sthis.boardUri + "/res/" + catalogCellInfo.threadId + ".html" );
      sthis.CatalogCell.changeThumb( catalogCell,
          catalogCellInfo.thumb );

      sthis.CatalogCell.changeRepliesNum( catalogCell, info.postCount );
      sthis.CatalogCell.changeImagesNum ( catalogCell, info.fileCount );
      sthis.CatalogCell.changePageNum   ( catalogCell, info.page );
      sthis.CatalogCell.changeLock      ( catalogCell, info.locked );
      sthis.CatalogCell.changePin       ( catalogCell, info.pinned );
      sthis.CatalogCell.changeCyclic    ( catalogCell, info.cyclic );
      sthis.CatalogCell.changeBumpLock  ( catalogCell, info.autoSage );

      sthis.CatalogCell.changeSubject   ( catalogCell, info.subject );
      sthis.CatalogCell.changeMessage   ( catalogCell, info.message );
      /*catalogCell.getElementsByClassName("hideButton")[0].id =
        'hide' + sthis.boardUri + 'Thread' + info.threadID;*/

      return catalogCell;
    };

    sthis.makeSortElement =
        function()
    {
      var eltSpan = document.createElement('SPAN');
      eltSpan.id = sthis.SPAN_ID;

      /* [So] [r] [t by:] */
      var eltASo = document.createElement('A');
      eltASo.appendChild( document.createTextNode("So") );
      var eltAr = document.createElement('A');
      eltAr.appendChild( document.createTextNode("r") );
      var eltAtby = document.createElement('A');
      eltAtby.appendChild( document.createTextNode("t by:") );

      eltASo.addEventListener( 'click', sthis.circulateOrderType );
      eltAr.addEventListener( 'click', sthis.shuffleCatalogCells );
      eltAtby.addEventListener( 'click', sthis.circulateOrderType );

      var eltSelect = document.createElement('SELECT');
      eltSelect.id = sthis.SELECT_ID;
      eltSelect.addEventListener( "change", sthis.sortCatalogCells );

      var option;
      var optionText;
      for( var idx = 0, len = sthis.tableOrderType.length; idx < len ; ++idx )
      {
        option = document.createElement('OPTION');
        option.setAttribute("value", idx );
        optionText = document.createTextNode( sthis.tableOrderType[idx].name );
        option.appendChild( optionText );
        eltSelect.appendChild( option );
      }

      /*
      var eltLSB = document.createTextNode("[");
      var eltARefresh = document.createElement('A');
      eltARefresh.appendChild( document.createTextNode('Refresh') );
      eltARefresh.addEventListener('click', sthis.refreshCatalogCells);
      var eltRSB = document.createTextNode("]");
      */

      var eltConfig = document.createElement('A');
      eltConfig.appendChild( document.createTextNode("⚙") );
      eltConfig.addEventListener('click', sthis.showCloseDivSettings );

      var eltStatus = document.createElement('SPAN');
      eltStatus.id = sthis.REFRESH_STATUS_ID;

      eltSpan.appendChild( eltASo );
      eltSpan.appendChild( eltAr );
      eltSpan.appendChild( eltAtby );
      eltSpan.appendChild( eltSelect );

      /* eltSpan.appendChild( eltLSB );
      eltSpan.appendChild( eltARefresh );
      eltSpan.appendChild( eltRSB ); */

      eltSpan.appendChild( eltConfig );

      eltSpan.appendChild( eltStatus );
      return eltSpan;
    };

    sthis.closeDivSettings =
        function()
    {
      var divSettings = document.getElementById( sthis.SETTINGS_ID );
      if( null == divSettings )
      {
        return;
      };
      divSettings.parentElement.removeChild( divSettings );
    };

    sthis.showCloseDivSettings =
        function()
    {
      if( null != document.getElementById( sthis.SETTINGS_ID ) )
      {
        sthis.closeDivSettings();
        return;
      };
      var divSettings = document.createElement('DIV');
      divSettings.id = sthis.SETTINGS_ID;
      divSettings.style.border = '1px solid black';
      divSettings.style.display = 'inline-block';
      var checkboxSageHidedThreads = document.createElement('INPUT');
      checkboxSageHidedThreads.addEventListener('change',
          function()
          {
            sthis.saveSettingsSageHidedThreads( this.checked );
          });
      checkboxSageHidedThreads.type = 'checkbox';
      checkboxSageHidedThreads.value = 'sageHidedThreads';
      checkboxSageHidedThreads.checked = settings.sageHidedThreads;

      var closeButton = document.createElement('INPUT');
      closeButton.type = 'button';
      closeButton.addEventListener('click', sthis.closeDivSettings );
      closeButton.value = "Close";

      divSettings.appendChild( checkboxSageHidedThreads );
      divSettings.appendChild( document.createTextNode("Hideしたスレは下げる(ソート変更後に適用)") );
      divSettings.appendChild( document.createElement('BR') );
      divSettings.appendChild( closeButton );

      document.getElementById( sthis.SPAN_ID ).appendChild( divSettings );
    };

    sthis.loadSettings =
        function()
    {
      sthis.loadSettingsSageHidedThreads();
      if( undefined == window.toshakiii.settings.catalogOrderType )
      {
        var n = "toshakiii.settings.catalogOrderType";
        var v = localStorage.getItem(n);
        if( v == null )
        {
          window.toshakiii.settings.catalogOrderType = 0;
        }
        else
        {
          v = parseInt(v);
          if( isNaN( v ) )
          {
            window.toshakiii.settings.catalogOrderType = 0;
          }
          else
          {
            window.toshakiii.settings.catalogOrderType = v;
          };
        };
      };
    };

    sthis.override = function override() {
      if ( undefined === window.refreshCatalog ) {
        if ( 'complete' === document.readyState ) {
          return;
        };
        setTimeout( override, 0 );
      };

      sthis.overrideRefreshCatalog();
      /* sthis.overrideSetCell(); */
    };

    sthis.overrideRefreshCatalog = function overrideRefreshCatalog() {
      if ( 'function' !== typeof( window.refreshCatalog ) ) {
        return;
      };
      window.refreshCatalog = function ymncRefreshCatalog(manual) {

        if ( window.autoRefresh ) {
          clearInterval( window.refreshTimer );
        };

        sthis.refreshCatalogCells( function done(changed) {
          if (window.autoRefresh) {
            window.startTimer(manual || changed ? 5 : window.lastRefresh * 2);
          };
          if (!changed) {
            return;
          };

          var assoc = {};
          var dest = [];
          for ( var idx = 0, len = window.catalogThreads.length;
              idx < len ; ++idx ) {
              assoc[ window.catalogThreads[idx].threadId ] = window.catalogThreads[idx];
            };
            var divThreads = document.getElementById( "divThreads" );
            for ( var dtIdx = 0, dtLen = divThreads.children.length ;
                dtIdx < dtLen ; ++dtIdx ) {
              if ( "" !== divThreads.children[ dtIdx ].id &&
                    undefined !== assoc[ divThreads.children[ dtIdx ].id ] )
              {
                dest.push( assoc[ divThreads.children[ dtIdx ].id ] );
                delete assoc[ divThreads.children[ dtIdx ].id ];
              };
            };
            window.catalogThreads = dest;
            window.search();
        } );

      };
    };

    sthis.overrideSetCell = function overrideSetCell() {
      if ( 'function' !== typeof( window.setCell ) ||
            'function' !== typeof( window.enableHideThreadLink ) ) {
        return;
      };

      var originalSetCell = window.setCell;
      window.setCell = function ymncSetCell(thread) {
        var element = originalSetCell(thread);
        element.id = thread.threadId;
        element.catalog = true;
        window.enableHideThreadLink(element);

        /* var cookie = '; ' + document.cookie + "; "; */
        if ( window.getSetting('hide' + sthis.boardUri + 'Thread' + element.id) ) {
          element.style.display = "none";
          var fragment = document.createDocumentFragment();
          fragment.appendChild( createShowThreadLink( element ) );
          fragment.appendChild( element );
          return fragment;
        };
        return element;
      };

    };

    function getShowThreadLink(threadElem) {
      return document.getElementById('Show'+sthis.boardUri+'Thread'+threadElem.id);
    };

    function createShowThreadLink(threadElem) {
      var threadID = threadElem.id;

      var opHeadElem = threadElem.querySelector('.opHead');
      /* add show thread link if we don't already have one */

      var div = document.createElement(threadElem.catalog?'span':'div');
      div.id = 'Show'+sthis.boardUri+'Thread'+threadID;
      var link = document.createElement('a');
      link.textContent = '[Show hidden thread '+threadID+'] ';
      link.href = '#';
      link.onclick = function() {
        console.log('showing thread', threadID);
        threadElem.style.display = threadElem.catalog ? 'inline-block' : 'block';
        if( window.deleteSetting ) {
          window.deleteSetting('hide'+sthis.boardUri+'Thread'+threadID);
        };
        div.style.display = 'none';
        window.enableHideThreadLink(threadElem);
        return false;
      };
      div.appendChild(link);
      return div;
    };

    sthis.disable =
        function()
    {
      var elt = document.getElementById( sthis.SPAN_ID );
      if( null != elt )
      {
        var selectElt = document.getElementById( sthis.SELECT_ID );
        selectElt.value = 0;
        sthis.sortCatalogCells();
        elt.parentElement.removeChild( elt );
      };
    };

    sthis.isHereCatalogPage =
        function()
    {
      var divThreads = document.getElementById( "divThreads" );
      return null != divThreads &&
          0 < document.getElementsByClassName("catalogCell").length;
    };

    sthis.trigger =
        function()
    {
      if( ! sthis.isHereCatalogPage() )
      {
        return;
      };

      if( ! sthis.recordBumpOrder() )
      {
        return;
      };
      sthis.initTableOrderType();
      sthis.loadSettings();
      sthis.enable();
    };

    sthis.enable =
        function()
    {
      if( ! sthis.isHereCatalogPage() )
      {
        return;
      };

      sthis.override();

      var divThreads = document.getElementById("divThreads");
      if( null == divThreads )
      {
        return;
      };
      var elt = sthis.makeSortElement();

      divThreads.parentElement.insertBefore( elt, divThreads );

      if( undefined !== window.toshakiii.settings.catalogOrderType )
      {
        var selectElt = document.getElementById( sthis.SELECT_ID );
        if( selectElt.length <= window.toshakiii.settings.catalogOrderType )
        {
          window.toshakiii.settings.catalogOrderType = 0;
        };
        selectElt.value = window.toshakiii.settings.catalogOrderType;

        sthis.sortCatalogCells();
      };
    };

    return sthis;
  };

  /**********************************
   * etCetera                       *
   **********************************/
  function modEtCetera()
  {
    window.toshakiii = window.toshakiii || {};
    window.toshakiii.settings = window.toshakiii.settings || {};
    var toshakiii = window.toshakiii;
    var settings = window.toshakiii.settings;

    var feWrapper = window.toshakiii.feWrapper;
    var utils = window.toshakiii.utils;
    var etcthis = {};

    window.toshakiii.etCetera = etcthis;

    etcthis.maskFilename = false;
    etcthis.hideLibrejpBottomLeftMascot = false;

    etcthis.insertMiscCSS = function() {
      var s = "";
      s += '.ymncMarkdownToolButton { cursor: pointer; border: 1px solid }';
      s += '.ymncMarkdownToolButton:hover { border: 1px solid white }';

      /* ポップアップ関係 */
      s += '.tskQuoteblock img { float: none; margin: auto; max-width: 127px; max-height: 127px }';
      s += '.tskQuoteblock .imgLink { display: block; text-align: center; vertical-align: middle }';

      s += '.tskQuoteblock .uploadCell { display: inline-block; max-width: 127px;' +
          'word-wrap: break-word }';
      s += '.tskQuoteblock .uploadDetails { max-width: 127px }';

      s += '.tskQuoteblock .multipleUploads .opUploadPanel, ' +
          '.tskQuoteblock .multipleUploads .panelUploads {' +
          '  float: none; display: block }';

      s += '.tskQuoteblock .panelUploads { display: inline-block;';
      s += '  vertical-align: top }';

      s += '.tskQuoteblock .divMessage {' +
        '  margin-left: 1em;' +
        '  margin-top: 1em;' +
        '  margin-right: 0.5em;' +
        '  margin-bottom: 0.5em }';

      s += '.tskQuoteblock .innerPost > div:not(.divMessage)' +
        ':not(.tskQuoteblock .multipleUploads .opUploadPanel)' +
        ':not(.tskQuoteblock .multipleUploads .panelUploads){ display: inline-block; }';



      var style = document.createElement('STYLE');
      style.type = "text/css";
      style.id = "ymanuchangStyles";
      style.innerHTML = s;
      document.head.appendChild( style );
    };

    etcthis.markdowns = [
      { name: "Spo",  title: "spoiler",   beg: "[spoiler]", end: "[/spoiler]",
        className: "spoiler", style: { fontWeight: "normal" } },
      { name: "Red",  title: "red",       beg: "==",        end: "==",
        className: "redText", style: { position: "static" } },
      { name: "Ita",  title: "italic",    beg: "''",        end: "''",
        style: { fontStyle: "italic",  fontWeight: "normal" } },
      { name: "Bol",  title: "bold",      beg: "'''",       end: "'''",
        style: { fontStyle: "bold",    fontWeight: "bold" } },
      { name: "Und",  title: "underline", beg: "__",        end: "__",
        style: { textDecoration: "underline", fontWeight: "normal" } },
      { name: "Str",  title: "strike",    beg: "~~",        end: "~~",
        style: { textDecoration: "line-through", fontWeight: "normal" } },
      { name: "mem",  title: "meme",      beg: "[meme]",    end: "[/meme]",
        className: "memeText", style: { fontWeight: "normal" } },
      { name: "Aut",  title: "autism",    beg: "[autism]",  end: "[/autism]",
        className: "autismText", style: { fontWeight: "normal" } },
      { name: "AA",   title: "Ascii Art", beg: "[aa]",      end: "[/aa]",
        style: { fontWeight: "normal" } },
      { name: "code", title: "code",      beg: "[code]",    end: "[/code]",
        style: { fontWeight: "normal" } }
    ];

    etcthis.markdownTool = function() {
      etcthis.setMarkdownToolForMainForm();
      etcthis.contextMenuOnMarkdownTool();
    };

    etcthis.contextMenuOnMarkdownTool = function() {
      var fieldMessage = document.getElementById('fieldMessage');
      etcthis.setMarkdownToolOnTextAreaContextMenu(fieldMessage, fieldMessage.id);

      feWrapper.quickReplyOnLoadHandlers.push( etcthis.setMarkdownToolOnQrBodyContextMenu );
    };

    etcthis.setMarkdownToolOnQrBodyContextMenu = function() {
      var qrBody = document.getElementById("qrbody");
      etcthis.setMarkdownToolOnTextAreaContextMenu(qrBody, qrBody.id);
    };

    etcthis.setMarkdownToolForMainForm = function() {
      var fieldMessage = document.getElementById('fieldMessage');
      if (!fieldMessage) {
        return false;
      };
      var commentTh = fieldMessage.parentElement ?
          fieldMessage.parentElement.previousElementSibling :
          null;

      if (!commentTh) {
        return false;
      };

      commentTh.style.width = "5em";
      etcthis.setMarkdownToolButton( commentTh, fieldMessage );

      return true;
    };

    etcthis.setMarkdownToolButton = function( container, textarea ) {

      for ( var markdownIndex = 0, markdownLen = etcthis.markdowns.length;
            markdownIndex < markdownLen ; ++markdownIndex ) {

        var Anchor = document.createElement("A");
        var markdown = etcthis.markdowns[ markdownIndex ];
        if (markdown.className)
          Anchor.className = markdown.className;
        Anchor.className = Anchor.className + " ymncMarkdownToolButton";

        for ( var name in markdown.style ) {
          Anchor.style[name] = markdown.style[name];
        };

        if (markdown.title)
          Anchor.title = markdown.title;

        Anchor.appendChild( document.createTextNode( markdown.name ) );

        Anchor.addEventListener("click", (function closure() {
          var index = markdownIndex;
          etcthis.applyMarkdown( textarea, etcthis.markdowns[index]);
        } ) );

        container.appendChild( document.createTextNode(" ") );
        container.appendChild( Anchor );
      };
    };

    etcthis.applyMarkdown = function(textarea, markdown){
      var originalSelectionEnd = +textarea.selectionEnd;
      var originalSelectionStart = +textarea.selectionStart;
      var begTag = markdown.beg;
      var endTag = markdown.end;

      textarea.value = textarea.value.substring(0, originalSelectionEnd ) + endTag +
        textarea.value.substring( originalSelectionEnd);

      textarea.value = textarea.value.substring(0, originalSelectionStart ) + begTag +
        textarea.value.substring( originalSelectionStart);

      textarea.select();
      textarea.selectionStart = begTag.length + originalSelectionStart;
      textarea.selectionEnd = begTag.length + originalSelectionEnd;

    };

    etcthis.setMarkdownToolOnTextAreaContextMenu = function(textarea, textareaId) {
      var menuId = "markdownToolMenu" + textareaId;
      textarea.setAttribute('contextmenu', menuId);

      if (document.getElementById(menuId)) {
        return;
      };

      var menu = document.createElement('MENU');
      var markdownMenu = document.createElement('MENU');

      menu.type = 'context';
      menu.id = menuId;
      menu.appendChild(markdownMenu);

      markdownMenu.setAttribute('label', "Markdown");

      for ( var markdownIndex = 0, markdownLength = etcthis.markdowns.length;
            markdownIndex < markdownLength; ++markdownIndex ) {

        var markdown = etcthis.markdowns[ markdownIndex ];
        var menuitem = document.createElement('MENUITEM');

        if (markdown.className)
          menuitem.className = markdown.className;

        if (markdown.title)
          menuitem.title = markdown.title;

        menuitem.textContent = markdown.title;

        for ( var name in markdown.style ) {
          menuitem.style[name] = menuitem.style[name];
        };

        (function() {
          var markdownN = markdown;
          menuitem.addEventListener('click', function() {
            etcthis.applyMarkdown( textarea, markdownN);
          } );
        })();

        markdownMenu.appendChild(menuitem);
      };
      document.body.appendChild(menu);
    };

    etcthis.makeCanvasFromImg = function(imgElement) {
      var canvas = document.createElement('CANVAS');
      canvas.width  = imgElement.width;
      canvas.height = imgElement.height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(imgElement, 0, 0);
      return canvas;
    };

    etcthis.uploadFileFromClipboard = function() {
      var fieldMessage = document.getElementById("fieldMessage");
      if ( fieldMessage ) {
        fieldMessage.contentEditable = true;
        fieldMessage.title = "Ctrl-V to upload";
        fieldMessage.addEventListener('paste', fieldMessageOnPaste );
      };

      if ( window.show_quick_reply ) {
        var original_show_quick_reply = window.show_quick_reply;
        function ymnc_show_quick_reply() {
          var r = original_show_quick_reply();
          var qrbody = document.getElementById("qrbody");
          if (qrbody && "1" !== qrbody.getAttribute("data-ymnc-initialized")) {
            qrbody.addEventListener('paste', fieldMessageOnPaste );
            qrbody.title = "Ctrl-V to upload";
            qrbody.setAttribute("data-ymnc-initialized","1");
          };
          return r;
        };
        window.show_quick_reply = ymnc_show_quick_reply;
      };
    };

    function fieldMessageOnPaste( event ) {
      var items = (event.clipboardData || event.originalEvent.clipboardData).items;

      for (var index in items) {
        var item = items[index];
        if (item.kind === 'file') {
          var blob = item.getAsFile();
          window.addSelectedFile( blob );
        };
      };
    };

    etcthis.UserJs = function() {
      etcthis.setButtonToEditUserJs();
      etcthis.excuteUserJs();
    };

    etcthis.setButtonToEditUserJs = function() {
      var anchor = document.createElement("A");
      anchor.style.cursor = "pointer";
      anchor.appendChild( document.createTextNode(" [(山仮)UserJS]") );
      anchor.onclick = etcthis.showHideEditBoxForUserJs;

      var navList = document.getElementsByTagName("NAV");
      if ( 0 < navList.length ) {
        navList[0].appendChild( anchor );
      } else {
        document.body.appendChild( anchor );
      };

    };

    etcthis.showHideEditBoxForUserJs = function() {
      var editboxUserJsContainer = document.getElementById("editboxUserJsContainer");
      if ( editboxUserJsContainer ) {
        if ( "none" !== editboxUserJsContainer.style.display ) {
          editboxUserJsContainer.style.display = "none";
        } else {
          editboxUserJsContainer.style.display = "block";
        };
      } else {
        var element = etcthis.createUserJsControls();
        document.body.appendChild( element );
      };
    };

    etcthis.createUserJsControls = function() {
      /* TODO: CSSに書き換える */
      var editboxUserJsContainer = document.createElement("DIV");
      editboxUserJsContainer.id = "editboxUserJsContainer";
      editboxUserJsContainer.style.position = "fixed";
      editboxUserJsContainer.style.top = "0px";
      editboxUserJsContainer.style.left = "0px";
      editboxUserJsContainer.style.bottom = "0px";
      editboxUserJsContainer.style.right = "0px";
      editboxUserJsContainer.style.width ="100%";
      editboxUserJsContainer.style.height = "100%";
      editboxUserJsContainer.style.textAlign = "center";
      editboxUserJsContainer.style.zIndex = 10;
      editboxUserJsContainer.style.maxWidth = "100%";

      var blackoutCurtain = document.createElement("DIV");
      blackoutCurtain.id = "blackoutCurtain";
      blackoutCurtain.style.background = "black";
      blackoutCurtain.style.opacity = 0.3;
      blackoutCurtain.style.position = "absolute";
      blackoutCurtain.style.top = "0px";
      blackoutCurtain.style.left = "0px";
      blackoutCurtain.style.right = "0px";
      blackoutCurtain.style.bottom = "0px";
      blackoutCurtain.style.width = "100%";
      blackoutCurtain.style.maxWidth = "100%";
      blackoutCurtain.style.height = "100%";
      blackoutCurtain.style.zIndex = "-1";
      blackoutCurtain.onclick = etcthis.showHideEditBoxForUserJs;

      var editboxUserJsDiv = document.createElement("DIV");
      editboxUserJsDiv.id = "editboxUserJsDiv";
      editboxUserJsDiv.style.background = "#f0e0d6";
      editboxUserJsDiv.style.borderColor = "#d9bfb7";
      etcthis.setInnerPostStyle( editboxUserJsDiv.style );
      editboxUserJsDiv.style.opacity = "1";
      editboxUserJsDiv.style.resize = "both";
      editboxUserJsDiv.style.overflow = "auto";
      editboxUserJsDiv.style.height = "90%";
      editboxUserJsDiv.style.width = "97%";
      editboxUserJsDiv.style.margin = "0.5em";
      editboxUserJsDiv.style.maxWidth = "97%";
      editboxUserJsDiv.style.maxHeight = "97%";

      var editboxUserJsTitle = document.createElement("DIV");
      editboxUserJsTitle.appendChild( document.createTextNode("UserJS") );
      editboxUserJsTitle.appendChild( document.createElement("BR") );
      editboxUserJsTitle.appendChild( document.createTextNode("warning: javascript can send spam and any attack") );

      var editboxUserJsCloseButton = document.createElement("DIV");
      editboxUserJsCloseButton.style.float = "right";
      editboxUserJsCloseButton.style.margin = "0.5em";
      editboxUserJsCloseButton.style.cursor = "pointer";
      editboxUserJsCloseButton.onclick = etcthis.showHideEditBoxForUserJs;
      editboxUserJsCloseButton.appendChild( document.createTextNode("×") );

      var editboxUserJs = document.createElement("TEXTAREA");
      editboxUserJs.id = "editboxUserJs";
      editboxUserJs.style.maxWidth = "98%";
      editboxUserJs.style.width = "100%";
      editboxUserJs.style.height = "calc( 100% - 7em )";
      editboxUserJs.style.fontFamily = "monospace";
      editboxUserJs.style.disable = "block";
      editboxUserJs.style.resize = "none";
      if (localStorage.user_js) {
        editboxUserJs.value = localStorage.user_js;
      };

      var editboxUserJsSaveButton = document.createElement("BUTTON");
      editboxUserJsSaveButton.appendChild( document.createTextNode("save custom Javascript" ) );
      editboxUserJsSaveButton.onclick = etcthis.saveAndRunUserJs;

      editboxUserJsContainer.appendChild( blackoutCurtain );
      editboxUserJsContainer.appendChild( editboxUserJsDiv );
      editboxUserJsDiv.appendChild( editboxUserJsCloseButton );
      editboxUserJsDiv.appendChild( editboxUserJsTitle );
      editboxUserJsDiv.appendChild( editboxUserJs );
      editboxUserJsDiv.appendChild( editboxUserJsSaveButton );

      return editboxUserJsContainer;
    };

    etcthis.saveAndRunUserJs = function() {
      var editboxUserJs = document.getElementById("editboxUserJs");
      if (!editboxUserJs) {
        return;
      };

      localStorage.user_js = editboxUserJs.value;

      etcthis.excuteUserJs();
    };

    etcthis.excuteUserJs = function() {
      if ( localStorage.user_js ) {
        try { eval( localStorage.user_js ); }
        catch(e){ alert( e ); };
      };
    };

    etcthis.setInnerPostStyle = function( destStyle ) {
      var innerPostList = document.getElementsByClassName("innerPost");
      var srcStyle;
      if ( 0 < innerPostList.length ) {
        srcStyle = window.getComputedStyle( innerPostList[0], null );
      };
      if ( srcStyle ) {
        destStyle.background = srcStyle.backgroundColor;
        destStyle.borderTopColor = srcStyle.borderTopColor;
        destStyle.borderLeftColor = srcStyle.borderLeftColor;
        destStyle.borderBottomColor = srcStyle.borderBottomColor;
        destStyle.borderRightColor = srcStyle.borderRightColor;
        destStyle.fontSize = srcStyle.fontSize;
        destStyle.color = srcStyle.color;
      };
    };

    etcthis.movePostBox = function() {
      if ( 0 <= document.location.href.indexOf("/res/") ) {
        var postBox = document.getElementById("postBox");
        if (postBox) {
          document.body.appendChild( postBox );
        };
      };
    };

    etcthis.setCheckboxOfDancingMascot = function() {

      etcthis.hideLibrejpBottomLeftMascot =
          'true' === window.getSetting('ymncLibrejpBottomLeftMascot');

      var input = document.createElement('INPUT');
      input.type = 'checkbox';
      input.id = 'myHideLibrejpBottomLeftMascot';
      input.onclick = etcthis.updateShowHideLibrejpBottomLeftMascot;
      input.checked = etcthis.hideLibrejpBottomLeftMascot;

      var label = document.createElement('LABEL');
      label.style.display = 'inline';
      label.appendChild( input );
      label.appendChild( document.createTextNode( "右下マスコット非表示" ) );

      var origin = document.querySelector('select[name=switchcolorcontrol]');

      if ( origin ) {
        origin.parentElement.appendChild( label );
      };

      etcthis.updateShowHideLibrejpBottomLeftMascot();
    };

    etcthis.updateShowHideLibrejpBottomLeftMascot = function(ev) {

      var style_id = "styleHideLibrejpBottomLeftMascot";

      if ( ev ) {
        etcthis.hideLibrejpBottomLeftMascot = ev.target.checked;
        window.setSetting('ymncLibrejpBottomLeftMascot', etcthis.hideLibrejpBottomLeftMascot );
      };

      var style = document.getElementById( style_id );

      if ( etcthis.hideLibrejpBottomLeftMascot ) {

        if ( null === style ) {
          style = document.createElement('STYLE');
          style.type = "text/css";
          style.id = style_id;
          style.innerHTML =
              "body:after, body:before { content: none !important; }"
              + "body:before { content: none !important; }";
          document.head.appendChild( style );
        };

      } else {

        if ( null !== style ) {
          style.parentElement.removeChild( style );
        };

      };
    };

    etcthis.setCheckboxOfMaskFilenameMode = function() {

      etcthis.maskFilename =
          'true' === window.getSetting('ymncMaskFilename');

      var input = document.createElement('INPUT');
      input.type = 'checkbox';
      input.id = 'myForceCookie';
      input.onclick = etcthis.updateMaskFilenameMode;
      input.checked = etcthis.maskFilename;

      var label = document.createElement('LABEL');
      label.style.display = 'block';
      label.appendChild( input );
      label.appendChild( document.createTextNode('常に投稿ファイル名をマスクする') );

      var origin;
      origin = document.getElementById('postBox');
      if ( origin ) {
        origin.insertBefore( label, origin.firstChild );
        return;
      };

      /*

      if ( origin ) {
        origin = origin.parentElement;
      } else {
        origin = document.body;
      }

      origin.appendChild( label );
      */

    };

    etcthis.updateMaskFilenameMode = function( ev ) {

      if ( ev ) {
        etcthis.maskFilename = ev.target.checked;
        window.setSetting('ymncMaskFilename', etcthis.maskFilename );
      };

      etcthis.maskAllFilename( etcthis.maskFilename );
    };

    /* filename から拡張子を得る。
     * 拡張子の長さが"."を含めずにmaxExtLen以上の長さの場合は、拡張子とみなさず空白を返す。
     * maxExtLen: 省略時は4
     */
    etcthis.getFilenameExtension = function( filename, maxExtLen ) {

      if ( ! maxExtLen ) {
        maxExtLen = 4;
      };

      var dotpos = filename.lastIndexOf(".");

      if ( 0 > dotpos ) {
        return "";
      };

      var lastPart = filename.substring( dotpos );

      if ( 1 + maxExtLen < lastPart.length ) {
        return "";
      };

      return lastPart;
    };

    etcthis.defineProperty = function( obj, propertyName, propertyValue ) {

          Object.defineProperty( obj, propertyName,
              { enumerable: false,
                configurable: false,
                writable: true,
                value: propertyValue } );
    };

    /* 設定によりFile名を自動的に設定する時の関数 */
    etcthis.maskAllFilename = function( doMaskIfTrue ) {

      if ( null == window.selectedFiles) {
        return;
      };

      var randomNum = (+new Date());

      for ( var idx = 0, len = window.selectedFiles.length; idx < len ; ++idx ) {

        var file = window.selectedFiles[idx];

        /* file.ymncFilenameMaskMode は
         *  undefined: 元のファイル名のまま
         *   "random": プログラムが指定したランダムな名前
         *     "user": ユーザーが指定した名前
         * この関数では doMaskIfTrue が false の場合でも、"user" のマスクは外さない
         */

        if ( doMaskIfTrue && file.ymncFilenameMaskMode === undefined ) {
          /* マスク要求、現在マスクしていないからマスクする */
          file.ymncOriginalName = file.name.toString(); /* cloneがわりのtoString */
          etcthis.defineProperty( file, 'name',
              randomNum.toString() + etcthis.getFilenameExtension( file.name ) );
          file.ymncFilenameMaskMode = "random";

        } else if ( doMaskIfTrue && file.ymncFilenameMaskMode !== undefined ) {
          /* マスク要求だが、現在マスク済だからなにもしない */
        } else if ( ! doMaskIfTrue && file.ymncFilenameMaskMode === undefined ) {
          /* マスク外し要求だが、現在マスクしていないのでなにもしない */
        } else if ( ! doMaskIfTrue && file.ymncFilenameMaskMode === "user" ) {
          /* マスク外し要求だが、現在ユーザー指定だから外さない */

        } else if ( ! doMaskIfTrue && file.ymncFilenameMaskMode === "random" ) {
          /* マスク外し要求、その通り外す */
          etcthis.defineProperty( file, 'name', file.ymncOriginalName );
          file.ymncFilenameMaskMode = undefined;
        } else {
          document.body.appendChild( document.createTextNode(
              "yamanu-changにバグ(etcthis.maskAllFilename)" ) );
        };

        ++randomNum;
      };

      etcthis.updateSelectedFilenameLabels();

    };

    etcthis.updateSelectedFilenameLabels = function updateSelectedFilenameLabels() {

      var nameLabelList = document.getElementsByClassName("nameLabel");

      var formCount = 1; /* メインフォームの分の1 */
      var quickReplyElt = document.getElementById("quick-reply");

      if ( quickReplyElt ) {
        ++formCount;
      };

      var nlIdx = 0;
      /* var nlLen = nameLabelList.length; */

      for ( ; 0 < formCount ; --formCount ) {

        for ( var sfIdx = 0, sfLen = window.selectedFiles.length; sfIdx < sfLen ;
            ++sfIdx, ++nlIdx ) {

          var nameLabel = nameLabelList[nlIdx];
          while ( nameLabel.firstChild ) {
            nameLabel.removeChild( nameLabel.firstChild );
          };

          var nameInput = document.createElement("INPUT");
          nameInput.value = window.selectedFiles[sfIdx].name;
          nameInput.style.width = "75%";

          var setFilenameFunc = (function() {
            var index = sfIdx;
            return function ( ev ) {
              if ( window.selectedFiles[ index ].name === ev.target.value ) {
                return true;
              };
              if ( undefined === window.selectedFiles[ index ].ymncFilenameMaskMode ) {
                /* cloneがわりのtoString */
                window.selectedFiles[ index ].ymncOriginalName =
                    window.selectedFiles[ index ].name.toString();
              };
              window.selectedFiles[ index ].ymncFilenameMaskMode = "user";
              etcthis.defineProperty( window.selectedFiles[ index ],
                  "name", ev.target.value );
              return true;
            };
          } )();
          nameInput.addEventListener("blur", setFilenameFunc );
          /* nameInput.addEventListener("keyup", setFilenameFunc ); */

          var modosuButton = document.createElement("SPAN");
          modosuButton.appendChild( document.createTextNode("元") );
          modosuButton.title = "元のファイル名に戻します(" + window.selectedFiles[ sfIdx ].ymncOriginalName + ")";
          var setOriginalFilenameFunc = (function(){
            var index = sfIdx;
            return function ( ev ) {
              if ( undefined !== window.selectedFiles[ index ].ymncOriginalName ) {
                etcthis.defineProperty( window.selectedFiles[ index ],
                    "name", window.selectedFiles[ index ].ymncOriginalName );
                window.selectedFiles[ index ].ymncFilenameMaskMode = undefined;
              };
              updateSelectedFilenameLabels();
              return true;
            };
          } )();
          modosuButton.addEventListener("click", setOriginalFilenameFunc );

          var randomizeButton = document.createElement("SPAN");
          randomizeButton.appendChild( document.createTextNode("乱") );
          randomizeButton.title = "ファイル名をランダムにします";
          var setRandomFilenameFunc = (function(){
            var index = sfIdx;
            return function ( ev ) {
              if ( undefined === window.selectedFiles[ index ].ymncOriginalName ) {
                window.selectedFiles[ index ].ymncOriginalName =
                    window.selectedFiles[ index ].name.toString();
              };
              etcthis.defineProperty( window.selectedFiles[ index ],
                  "name", (+new Date()).toString()
                    + etcthis.getFilenameExtension(
                        window.selectedFiles[ index ].ymncOriginalName ) );
              window.selectedFiles[ index ].ymncFilenameMaskMode = "random";

              updateSelectedFilenameLabels();
              return true;
            };
          } )();
          randomizeButton.addEventListener("click", setRandomFilenameFunc );

          modosuButton.style.cursor = 'pointer';
          randomizeButton.style.cursor = 'pointer';

          nameLabel.appendChild( nameInput );
          nameLabel.appendChild( modosuButton );
          nameLabel.appendChild( document.createTextNode(" ") );
          nameLabel.appendChild( randomizeButton );

        };
      };
    };

    etcthis.ymncSetPlayer = function setPlayer(link, mime) {

      var videoTypes = [ 'video/webm', 'video/mp4', 'video/ogg' ];
      var path = link.href;
      var parent = link.parentNode;

      var src = document.createElement('source');
      src.setAttribute('src', link.href);
      src.setAttribute('type', mime);

      var video = document.createElement(videoTypes.indexOf(mime) > -1 ? 'video'
            : 'audio');
      video.setAttribute('controls', true);
      video.setAttribute('loop', true);
      video.style.display = 'none';

      var videoContainer = document.createElement('span');

      var hideLink = document.createElement('a');
      hideLink.innerHTML = '[ - ]';
      hideLink.style.cursor = 'pointer';
      hideLink.style.display = 'none';
      hideLink.setAttribute('class', 'hideLink');
      hideLink.onclick = function() {
        newThumb.style.display = 'inline';
        video.style.display = 'none';
        hideLink.style.display = 'none';
        video.pause();
      };

      var newThumb = document.createElement('img');
      newThumb.src = link.childNodes[0].src;
      newThumb.width = link.childNodes[0].width;
      newThumb.height = link.childNodes[0].height;
      newThumb.onclick = function() {
        if (!video.childNodes.count) {
          video.appendChild(src);
        };

        newThumb.style.display = 'none';
        video.style.display = 'inline';
        hideLink.style.display = 'inline';
        video.play();
      };
      newThumb.style.cursor = 'pointer';

      videoContainer.appendChild(hideLink);
      videoContainer.appendChild(video);
      videoContainer.appendChild(newThumb);

      parent.replaceChild(videoContainer, link);

    };

    etcthis.overrideSetPlayer = function overrideSetPlayer() {

      if ( undefined === window.setPlayer ) {
        if ( 'complete' === document.readyState ) {
          return;
        };
        setTimeout( overrideSetPlayer, 0 );
        return;
      };

      if ( 'function' === typeof( window.setPlayer ) ) {
        window.setPlayer = etcthis.ymncSetPlayer;
      };

    };

    etcthis.setVideosLoopMode = function() {
      var videos = document.getElementsByTagName('VIDEO');

      for (var idx = 0, len = videos.length; idx < len ; ++idx ) {
        videos[idx].setAttribute('loop', true);
      };
    };

    etcthis.overrideEmbedYoutubeButton =
        function( youtube_wrapper )
    {
      if( "1" === youtube_wrapper.getAttribute("data-tsk-overrode") )
      {
        return 0;
      };
      var embedButtons = youtube_wrapper.getElementsByTagName('A');
      if( 0 >= embedButtons.length )
      {
        return -1;
      };
      var embedButton = embedButtons[0];
      embedButton.onclick = null;
      embedButton.addEventListener("click", etcthis.onYoutubeEmbedButtonClick );
      embedButton.replaceChild( document.createTextNode("embeD") , embedButton.firstChild );
      youtube_wrapper.setAttribute("data-tsk-overrode","1");
      return 1;
    };

    etcthis.overrideEmbedNiconicoButton =
        function( niconico_wrapper )
    {
      if( "1" === niconico_wrapper.getAttribute("data-tsk-overrode") )
      {
        return 0;
      };
      var embedButtons = niconico_wrapper.getElementsByTagName('A');
      if( 0 >= embedButtons.length )
      {
        return -1;
      };
      var embedButton = embedButtons[0];
      embedButton.onclick = null;
      embedButton.addEventListener("click", etcthis.onNiconicoEmbedButtonClick );
      embedButton.replaceChild( document.createTextNode("embeD") , embedButton.firstChild );
      niconico_wrapper.setAttribute("data-tsk-overrode","1");
      return 1;
    };

    etcthis.onYoutubeEmbedButtonClick =
        function( ev )
    {
      var iframes = this.parentElement.getElementsByTagName('IFRAME');
      if( 0 < iframes.length )
      {
        var brs = this.parentElement.getElementsByTagName('BR');
        for( var ifIdx = 0, ifLen = iframes.length; ifIdx < ifLen ; ++ifIdx )
        {
          iframes[ifIdx].parentElement.removeChild( iframes[ifIdx] );
        };
        for( var brIdx = 0, brLen = brs.length; brIdx < brLen ; ++brIdx )
        {
          brs[brIdx].parentElement.removeChild( brs[brIdx] );
        };
        this.replaceChild( document.createTextNode("embeD"), this.firstChild );
        ev.preventDefault();
        return false;
      };
      var youtubeUri = this.href.replace(/youtu.be\//,"www.youtube.com/watch?v=")
          .replace(/watch\?v=/, 'embed/') + "?autoplay=1";
      if( "https:" == location.protocol )
      {
        youtubeUri = youtubeUri.replace(/^http:/,"https:");
      };
      var iframe = document.createElement('IFRAME');
      iframe.width = 560;
      iframe.height = 315;
      iframe.frameborder = 0;
      iframe.allowfullscreen = true;
      iframe.src = youtubeUri;
      this.parentElement.appendChild( document.createElement('BR') );
      this.parentElement.appendChild(iframe);
      this.replaceChild( document.createTextNode("closE"), this.firstChild );
      ev.preventDefault();
      return false;
    };

    etcthis.getAncestorPostCellId =
        function( elt )
    {
      for(;; elt = elt.parentElement )
      {
        if( elt.parentElement.tagName == 'BODY' )
        {
          return null;
        };
        if( 0 <= elt.className.indexOf("postCell") )
        {
          return elt.id;
        };

      };
      return null;
    };

    etcthis.onNiconicoEmbedButtonClick =
        function( ev )
    {
      var iframes = this.parentElement.getElementsByTagName('IFRAME');
      var divs = this.parentElement.getElementsByTagName('DIV');
      if( 0 < iframes.length || 0 < divs.length )
      {
        for( var ifIdx = 0, ifLen = iframes.length; ifIdx < ifLen ; ++ifIdx )
        {
          iframes[ifIdx].parentElement.removeChild( iframes[ifIdx] );
        };
        for( var dvIdx = 0, dvLen = divs.length; dvIdx < dvLen ; ++dvIdx )
        {
          divs[dvIdx].parentElement.removeChild( divs[dvIdx] );
        };
        var brs = this.parentElement.getElementsByTagName('BR');
        for( var brIdx = 0, brLen = brs.length; brIdx < brLen ; ++brIdx )
        {
          brs[brIdx].parentElement.removeChild( brs[brIdx] );
        };

        this.replaceChild( document.createTextNode("embeD"), this.firstChild );
        ev.preventDefault();
        return false;
      };

      if( "https:" == location.protocol )
      {
        var div = document.createElement('DIV');
        div.style.border = "1px solid red";
        var br = document.createElement('BR');
        var anchor = document.createElement("A");
        anchor.href = this.href;
        anchor.appendChild( document.createTextNode(this.href) );

        div.appendChild( document.createTextNode("埋め込み不可: https —×→ http" ) );
        div.appendChild( br );
        div.appendChild( anchor );

        this.parentElement.appendChild( div );

        this.replaceChild( document.createTextNode("closE"), this.firstChild );
        /*ev.preventDefault();
          return false;*/
      };
      var videoUri = this.href.replace(/nico.ms/,"embed.nicovideo.jp/watch")
          .replace(/www\.nicovideo/,"embed.nicovideo");
      var iframe = document.createElement('IFRAME');

      iframe.width = 560;
      iframe.height = 315;
      iframe.frameborder = 0;
      iframe.allowfullscreen = true;
      iframe.src = videoUri;
      this.parentElement.appendChild( document.createElement('BR') );
      this.parentElement.appendChild( iframe );
      this.replaceChild( document.createTextNode("closE"), this.firstChild );
      ev.preventDefault();
      return false;
    };

    etcthis.overrideWrapperAll =
        function()
    {
      var IntermittentLoops = utils.IntermittentLoops;
      var iloops = IntermittentLoops();
      var idx = 0;
      var youtubeWrappers;
      var niconicoWrappers;
      var break_ = false;
      var continue_ = true;

      iloops.push( function(){
        youtubeWrappers = document.getElementsByClassName('youtube_wrapper');
        idx = youtubeWrappers.length - 1;
      } ).push( function(){
        if( -1 >= idx )
        {
          return break_;
        };
        etcthis.overrideEmbedYoutubeButton( youtubeWrappers[ idx ] );
        --idx;
        return continue_;
      } ).push( function(){
        niconicoWrappers = document.getElementsByClassName('niconico_wrapper');
        idx = niconicoWrappers.length - 1;
      } ).push( function(){
        if( -1 >= idx )
        {
          return break_;
        };
        etcthis.overrideEmbedNiconicoButton( niconicoWrappers[ idx ] );
        --idx;
        return continue_;
      } ).beginAsync();
    };

    etcthis.defaultEmbedOpen = function( embedButton, playerWrapper, options ) {
      var iframe = document.createElement('IFRAME');
      iframe.width = options.width || 560;
      iframe.height = options.height || 315;
      iframe.src = options.src;
      iframe.allowfullscreen = options.allowfullscreen || true;
      iframe.frameborder = options.frameBorder || "no";
      iframe.scrolling = options.scrolling || "no";
      iframe.style.maxWidth = "100%";
      playerWrapper.appendChild( iframe );
    };

    etcthis.appendEmbedControl = function(anchor, options ) {
      var wrapper = document.createElement('SPAN');
      var button = document.createElement('A');
      var playerWrapper = document.createElement('SPAN');
      button.href = anchor.href;
      playerWrapper.style.display = 'none';
      button.textContent = "embeD";
      wrapper.appendChild( document.createTextNode(" [") );
      wrapper.appendChild( button );
      wrapper.appendChild( document.createTextNode("]") );
      wrapper.appendChild( playerWrapper );

      button.setAttribute('data-embeded', "false");
      button.addEventListener("click", function(ev) {
        ev.preventDefault();
        var button = this;
        if ("false" === button.getAttribute('data-embeded')) {
          button.setAttribute('data-embeded', "true");
          button.textContent = "closE";
          etcthis.defaultEmbedOpen( button, playerWrapper, options );
          playerWrapper.style.display = 'inline';
          return;
        };
        button.textContent = "embeD";
        button.setAttribute('data-embeded', "false");
        if ( 'remove' === options.closeStyle ) {
          while(playerWrapper.firstChild) {
            playerWrapper.removeChild( playerWrapper.firstChild );
          };
        };
        playerWrapper.style.display = 'none';
        return;
      } );

      anchor.parentNode.insertBefore( wrapper, anchor.nextSibling );
    };

    etcthis.enableSoundcloudEmbed = function(anchor) {
      if (  ( 0 !== anchor.href.lastIndexOf( "https://soundcloud.com/", 0 ) &&
              0 !== anchor.href.lastIndexOf( "http://soundcloud.com/", 0 ) ) ||
              anchor.href == "https://soundcloud.com/" ||
            utils.endsWith( anchor.pathname, "/tracks" ) ||
            3 >= anchor.href.toString().split("/").length ) {
        return false;
      };

      var o = {}; /* ref. defaultEmbedOpen */
      o.width = "100%";
      o.height = "166";
      o.scrolling = "no";
      o.frameborder = "no";
      o.src = "https://w.soundcloud.com/player/?url=" + encodeURIComponent(anchor.href) +
          "&auto_play=true";
      o.closeStyle = 'remove';

      etcthis.appendEmbedControl(anchor, o );
      return true;
    };

    etcthis.enableYoutubeEmbed = function(anchor) {
      if (  0 !== anchor.href.lastIndexOf("https://youtu.be/", 0) &&
            0 !== anchor.href.lastIndexOf("https://www.youtube.com/watch?") &&
            0 !== anchor.href.lastIndexOf("http://youtu.be/", 0 ) &&
            0 !== anchor.href.lastIndexOf("http://www.youtube.com/watch?") ) {
        return false;
      };

      var uri = anchor.href.replace(/youtu.be\//,"www.youtube.com/watch?v=")
          .replace(/watch\?v=/, 'embed/').replace(/(^[^&]*)&/, '$1?');
          /* .replace(/([&?])t=/,'$1start='); */
      if (0 <= uri.indexOf('?') ) {
        uri = uri + '&autoplay=1';
      } else {
        uri = uri + '?autoplay=1';
      };

      if( "https:" == location.protocol ) {
        uri = uri.replace(/^http:/,"https:");
      };
      var o = {}; /* ref. defaultEmbedOpen */
      o.width = "560";
      o.height = "315";
      o.scrolling = "no";
      o.frameborder = "no";
      o.src = uri;
      o.closeStyle = 'remove';
      o.allowfullscreen = "true";

      etcthis.appendEmbedControl(anchor, o );
      return true;
    };

    etcthis.insertFakeRefreshButton =
        function()
    {
      var refreshButton = document.getElementById("refreshButton");
      if( null == refreshButton )
      {
        return;
      };
      var fakeRefresh = document.createElement('A');
      fakeRefresh.addEventListener("click",function()
          {
            window.lastReplyId = 0;
            window.refreshPosts(true);
          } );
    };

    etcthis.presetImageGeometry =
        function()
    {
      var iloops = utils.IntermittentLoops();
      var imgLinks;
      var idx = 0;
      var len = 0;
      iloops.push( function(){
        imgLinks = document.getElementsByClassName('imgLink');
      } ).push( function(){
        idx = 0;
        len = imgLinks.length;
      } ).push( function(){
        if( idx >= len )
        {
          return false;
        };
        var imgLink = imgLinks[idx];
        var img = imgLink.firstChild;
        if( null == img )
        {
          return true;
        };
        imgLink.style.minWidth = 255;
        imgLink.style.minHeight = 255;

        return true;
      } ).beginAsync();

    };

    etcthis.jaDateFormat = function jaDateFormat(d) {
      /* 2016/12/31(Sat)13:59:59 形式 */
      var leftpad = utils.leftpad;
      var year, month, date, hours, minutes, seconds, day;

      [ year, month, date, day, hours, minutes, seconds ] =
          utils.getYearMonthDateDayHoursMinutesSeconds( d );

      var text =
          year + "/"
          + leftpad( month + 1, 2, "0") + "/"
          + leftpad( date , 2, "0") +
          "(" + d.toLocaleString('ja', {weekday:'short'}) + ")"
          + leftpad( hours, 2, "0") + ":" +
          leftpad( minutes, 2, "0") + ":" +
          leftpad( seconds, 2, "0");
      return text;
    };

    etcthis.firstLanguage =
        (window.navigator.languages && window.navigator.languages[0]) ||
        window.navigator.language ||
        window.navigator.userLanguage ||
        window.navigator.browserLanguage;

    etcthis.dateFromStringForOverride = function dateFromStringForOverride(str) {
      var firstLanguage = etcthis.firstLanguage;

      var m = str.match(/(\d+)\/(\d+)\/(\d+)\s+\([A-Za-z]+\)\s+(\d+):(\d+):(\d+)/);
      if (m) {
        var d = new Date();
        d.setUTCFullYear(+m[3]);
        d.setUTCMonth(+m[1]-1);
        d.setUTCDate(+m[2]);
        d.setUTCHours(+m[4]);
        d.setUTCMinutes(+m[5]);
        d.setUTCSeconds(+m[6]);

        if ( 'ja' === firstLanguage ||
              'ja-JP' === firstLanguage ) {
          return etcthis.jaDateFormat(d);
        };
        return d.toLocaleString(firstLanguage) +
            ' ('+d.toLocaleString(firstLanguage, {weekday:"short"} )+')';
      };
      return undefined;
    };

    etcthis.overrideDateFromString = function overrideDateFromString() {

      if ( undefined === window.dateFromString ) {
        if ( 'complete' === document.readyState ) {
          return;
        };
        setTimeout( overrideDateFromString, 0 );
        return;
      };

      if ( 'function' !== typeof( window.dateFromString ) ) {
        return;
      };

      window.dateFromString = etcthis.dateFromStringForOverride;
      if ( 'function' === typeof( window.updateTimes ) ) {
        window.updateTimes();
      };
    };

    etcthis.fixGoogleChromeMp3Mime =
        function fixGoogleChromeMp3Mime()
    {
      if( undefined === window.sendReplyData )
      {
        if( 'complete' === document.readyState )
        {
          return;
        };
        setTimeout( fixGoogleChromeMp3Mime, 0 );
        return;
      };
      if( 'function' !== typeof( window.sendReplyData ) ||
            'function' !== typeof( window.checkExistance ) )
      {
        return;
      };

      var originalCheckExistance = window.checkExistance;
      window.checkExistance
          = function ymnccheckExistance()
      {
        if( 'audio/mp3' === arguments[0].type )
        {
          arguments[0].type = 'audio/mpeg';
          Object.defineProperty( arguments[0], "type",
              { enumerable: false,
                configurable: false,
                writable: true,
                value: 'audio/mpeg' } );
        };
        return originalCheckExistance.apply( window, Array.prototype.slice.call( arguments ) );
      };

      var fixMp3BlobMime = function( files )
      {
        try
        {
          var data_audio_mpeg = 'data:audio/mpeg;';
          var data_audio_mp3 = 'data:audio/mp3;';
          var IANA_mp3_mime = 'audio/mpeg';
          var Chrome_mp3_mime = 'audio/mp3';
          for( var i in files )
          {
            var file = files[ i ];
            if( 0 == file.content.indexOf( data_audio_mp3 ) )
            {
              file.mime = IANA_mp3_mime;
              file.content = data_audio_mpeg
                  + file.content.substring( data_audio_mp3.length );
            };
          };
          i = undefined;
          file = undefined;
          data_audio_mpeg = undefined;
          data_audio_mp3 = undefined;
          IANA_mp3_mime = undefined;
        }
        catch(e)
        {};
      };

      var originalSendReplyData = window.sendReplyData;
      window.sendReplyData = function ymncSendReplyData( files )
      {
        fixMp3BlobMime( files );
        return originalSendReplyData.apply( window, Array.prototype.slice.call( arguments ) );
      };

      var originalQRsendReplyData = window.QRsendReplyData;
      window.QRsendReplyData = function ymncQRsendReplyData( files )
      {
        fixMp3BlobMime( files );
        return originalQRsendReplyData.apply( window, Array.prototype.slice.call( arguments ) );
      };
    };

    etcthis.addConsecutiveNumberStyle =
        function()
    {

      var style = document.createElement('style');
      style.type = "text/css";
      style.id = "postsConsecutiveNumberStyle";
      /*
        このCSSルール部分のオリジナルは「大統領スレッド三枚」
        "http://endchan.xyz/librejp/res/5273.html#q8133"
        そのとちゃき。

        その後の改変の下二つは自分(to_sha_ki_ii)だった(はず)。
        http://endchan.xyz/librejp/res/5273.html#q8156
        http://endchan.xyz/librejp/res/5273.html#q8166
      */
      style.innerHTML =
          "#divThreads .opCell .divPosts .postCell{counter-increment:consecutiveNumber;}" +
          "#divThreads .opCell .divPosts .postCell .markedPost:before{content:counter(consecutiveNumber);}" +
          "#divThreads .opCell .divPosts .postCell .innerPost:before{content:counter(consecutiveNumber);}";
      document.head.appendChild( style );
    };

    etcthis.isHiddenCDAName = 'data-is-hidden';
    etcthis.insertButtonShowHidePostingForm =
        function()
    {
      var postingForm = document.getElementById('postingForm');
      var topAnchorElement = document.getElementById('top');
      if( null === postingForm ||
            null === topAnchorElement )
      {
        return;
      };
      var showHideAnchor = document.createElement('A');
      var showText = document.createTextNode('[Show hidden posting form]');
      showHideAnchor.appendChild( showText );

      showHideAnchor.setAttribute( etcthis.isHiddenCDAName, '1' );
      showHideAnchor.addEventListener('click', etcthis.showHidePostingForm);
      postingForm.style.display = 'none';

      topAnchorElement.parentElement.insertBefore( showHideAnchor, topAnchorElement.nextSibling );
    };

    etcthis.showHidePostingForm =
        function()
    {
      var showHideAnchor = this;
      var postingForm = document.getElementById('postingForm');
      if( '0' === showHideAnchor.getAttribute( etcthis.isHiddenCDAName ) )
      {
        showHideAnchor.setAttribute( etcthis.isHiddenCDAName, '1' );
        postingForm.style.display = 'none';
        showHideAnchor.replaceChild( document.createTextNode('[Show hidden posting form]'),
            showHideAnchor.firstChild );
      }
      else
      {
        showHideAnchor.setAttribute( etcthis.isHiddenCDAName, '0' );
        postingForm.style.display = '';
        showHideAnchor.replaceChild( document.createTextNode('[Hide a posting form]'),
            showHideAnchor.firstChild );
      };
    };

    etcthis.getContentActionElement =
        function()
    {
      var reportFieldReason = document.getElementById('reportFieldReason');
      if( null == reportFieldReason ||
            null == reportFieldReason.parentElement ||
            null == reportFieldReason.parentElement.parentElement ||
            0 > reportFieldReason.parentElement.parentElement.className.indexOf('contentAction') )
      {
        return null;
      };
      return reportFieldReason.parentElement.parentElement;
    };

    etcthis.insertButtonShowHideContentAction =
        function()
    {
      var contentAction = etcthis.getContentActionElement();
      if( null == contentAction )
      {
        return;
      };
      var showHideAnchor = document.createElement('A');
      showHideAnchor.appendChild( document.createTextNode('[+report/del form]') );
      showHideAnchor.setAttribute( etcthis.isHiddenCDAName, '1' );
      showHideAnchor.addEventListener('click', etcthis.showHideContentAction);

      contentAction.parentElement.insertBefore( showHideAnchor, contentAction );
      contentAction.style.visibility = 'hidden';
    };

    etcthis.showHideContentAction =
        function()
    {
      var showHideAnchor = this;
      var target = etcthis.getContentActionElement();
      var toShowText = '[+report/del form]';
      var toHideText = '[-report/del form]';

      if( null == target )
      {
        return;
      };
      if( '0' === showHideAnchor.getAttribute( etcthis.isHiddenCDAName ) )
      {
        showHideAnchor.setAttribute( etcthis.isHiddenCDAName, '1' );
        target.style.visibility = 'hidden';
        showHideAnchor.replaceChild( document.createTextNode( toShowText ),
            showHideAnchor.firstChild );
      }
      else
      {
        showHideAnchor.setAttribute( etcthis.isHiddenCDAName, '0' );
        target.style.visibility = 'visible';
        showHideAnchor.replaceChild( document.createTextNode( toHideText),
            showHideAnchor.firstChild );
      };
    };

    etcthis.getAutoRefreshCheckboxElement =
        function()
    {
      var labelRefresh = document.getElementById('labelRefresh');
      if( null === labelRefresh )
      {
        return null;
      };

      var break_ = false;
      var continue_ = true;
      var target = null;

      function f( descendant )
      {
        if( 'INPUT' === descendant.tagName &&
              'checkbox' === descendant.type )
        {
          target = descendant;
          return break_;
        };
        return continue_;
      };
      utils.foreEachElementDescendants( labelRefresh.parentElement              , f );
      if( null !== target )
      {
        return target;
      };
      utils.foreEachElementDescendants( labelRefresh.parentElement.parentElement, f );

      return target;
    };

    etcthis.autoRefreshCheckboxPersistent =
        function()
    {
      var autoRefreshCheckbox = etcthis.getAutoRefreshCheckboxElement();
      if( null === autoRefreshCheckbox ||
            undefined === window.changeRefresh ||
            undefined === window.autoRefresh
      )
      {
        return;
      };

      if( false === window.autoRefresh )
      {
        /* サイト指定の初期値が false の場合は、この機能は動かさない */
        return;
      };

      /* ブラウザがチェックボックスの状態を覚えていて、ページを開いた時に状態を反映する。
         autoRefresh の状態はチェックボックスに従わない。
         autoRefresh はチェックボックスが初期状態で、checked だと思っている。
         上記の理由で、autoRefreshCheckbox.dispatchEvent だけで対応することは不可能 */

      if( autoRefreshCheckbox.checked !== window.autoRefresh )
      {
        window.changeRefresh();
      };

      if( autoRefreshCheckbox.checked !==
            ( 0 !== settings.getMiniData('ThreadAutoRefresh') ) )
      {
        autoRefreshCheckbox.checked = !autoRefreshCheckbox.checked;

        /*
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", true, true);
          autoRefreshCheckbox.dispatchEvent(evt);
          alert( "2617:autoRefresh:" + window.autoRefresh );*/
        window.changeRefresh();
      };
      autoRefreshCheckbox.addEventListener('change', etcthis.autoRefreshCheckboxOnChange );
    };

    etcthis.autoRefreshCheckboxOnChange =
        function()
    {
      var autoRefreshCheckbox = this;
      if( autoRefreshCheckbox.checked )
      {
        settings.setMiniData('ThreadAutoRefresh', 1);
      }
      else
      {
        settings.setMiniData('ThreadAutoRefresh', 0);
      };
    };

    etcthis.titleNewReplysCountReg = /^([(]\d*[)] ).*$/;
    etcthis.procTitle = function procTitle()
    {
      var boardUri = feWrapper.getBoardUri();
      var title = document.title;
      var newReplys = title.match( etcthis.titleNewReplysCountReg );
      if( null === newReplys )
      {
        newReplys = "";
      }
      else
      {
        newReplys = newReplys[1];
      };
      title = title.substring( newReplys.length );
      var prefix = '/' + boardUri + '/ - ';
      if( 0 === title.lastIndexOf( prefix, 0 ) )
      {
        document.title = newReplys + title.substring( prefix.length ) + ' - /' + boardUri + '/';
      };
    };

    /* override と言いつつ、新規設置も行う。
       引数は、postCell でなくてもかまわない */
    etcthis.overrideInlinePlayers =
        function overrideInlinePlayers( postCell )
    {
      var uploadCellList = postCell.getElementsByClassName('uploadCell');
      var idx = uploadCellList.length;
      var iloops = utils.IntermittentLoops();
      var break_ = false, continue_ = true;
      iloops.push( function(){
        --idx;
        if( -1 >= idx )
        { return break_; };
        etcthis.addHookToAudioInlinePlayer( uploadCellList[ idx ] );
        /*etcthis.overrideInlinePlayer( uploadCellList[ idx ] );*/
        return continue_;
      } ).beginAsync();
    };

    etcthis.addHookToAudioInlinePlayer =
        function addHookToAudioInlinePlayer( uploadCell )
    {
      var audioList = uploadCell.getElementsByTagName('AUDIO');
      var imgList = uploadCell.getElementsByTagName('IMG');
      if( 0 >= audioList.length ||
            0 >= imgList.length )
      {
        return;
      };

      var img = imgList[0];
      img.addEventListener('click', function(){ this.style.display = 'inline'; } );
    };

    etcthis.addQuote = function addQuote()
    {
      var postIdToQuote = this.hash.substring(2);

      if (typeof window.add_quick_reply_quote != "undefined") {
        window.add_quick_reply_quote( postIdToQuote );
      }

      document.getElementById('fieldMessage').value += '>>' + postIdToQuote + '\n';
    };

    etcthis.insertDeleteCookiesButton = function insertDeleteCookiesButton()
    {
      if (document.title.toLowerCase() == "400 request header or cookie too large")
      {
        var ButtonDeleteCookies = document.createElement("button");
        ButtonDeleteCookies.type = "button";
        ButtonDeleteCookies.innerHTML = "delete all cookies on this site(" + document.domain+ ")"
            + "<br> cookie length: " + document.cookie.length +"bytes";

        function deleteCookie( name ) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        };
        ButtonDeleteCookies.onclick = function deleteAllCookies(){
          var cookies = document.cookie.split("; ");
          for ( var idx = 0, len = cookies.length; idx < len ; ++idx ) {
            var eqpos = cookies[ idx ].indexOf( "=" );
            if ( 0 > eqpos ) {
              continue;
            };
            document.cookie = cookies[idx].substring(0, eqpos) + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
          };
          ButtonDeleteCookies.innerHTML = ButtonDeleteCookies.innerHTML + "<br> cookie length: " + document.cookie.length + "bytes";
        };
        document.body.appendChild( ButtonDeleteCookies );
      };
    };

    etcthis.removeNonJsSendButton = function removeNonJsSendButton() {
      /* エンターキーで送信暴発しちゃうのを防ぐために */

      var formButton = document.getElementById('formButton');

      if ( formButton !== null && 'none' === formButton.style.display) {
        formButton.parentElement.removeChild( formButton );
      };

    };

    etcthis.disable = function disable()
    {
      var style = document.getElementById("postsConsecutiveNumberStyle");
      if( null != style )
      {
        style.parentElement.removeChild( style );
      };
    };

    etcthis.maxRetries = 5;
    etcthis.retryLoading = function (event) {
      /* event.target だけを使う */

      /* 連続アクセスが原因で503が起きているらしい。時間をあけてから処理する */
      setTimeout( function(){

        var target = event.target;
        var count = parseInt(target.getAttribute("data-yamanu-retries-count"));

        if (count < etcthis.maxRetries) {
          ++count;
          target.setAttribute("data-yamanu-retries-count", count.toString());
          event.target.src = event.target.src + "?t=" + (+new Date());

        } else {
          /* count が NaN の場合もここ */
          target.removeEventListener("error", etcthis.retryLoading);
        };
      }, 1500 );
    };

    etcthis.retryFailedImgTags = function() {
      var imgList = Array.apply(null, document.getElementsByTagName("IMG"));
      var imgIndex = 0, imgLength = imgList.length;

      for (; imgIndex < imgLength; ++imgIndex ) {

        var img = imgList[imgIndex];

        if (0 <= img.src.indexOf("/.youtube/vi/")) {
          continue;
        };

        if (! img.complete) {
          img.setAttribute("data-yamanu-retries-count", "0");
          img.addEventListener("error", etcthis.retryLoading );

        } else if (0 === img.naturalWidth && 0 === img.naturalHeight) {
          img.setAttribute("data-yamanu-retries-count", "0");
          img.addEventListener("error", etcthis.retryLoading );
          etcthis.retryLoading( { "target": img} );
        };
      };
    };

    etcthis.qrJsRetriesCount = 0;
    etcthis.reloadQrJs = function() {
      if ( 5 <= etcthis.qrJsRetriesCount ||
            undefined !== window.show_quick_reply ) {
        etcthis.uploadFileFromClipboard();
        window.toshakiii.filePreview.startQuickReplyObserver();
        return;
      };
      etcthis.qrJsRetriesCount = 1 + etcthis.qrJsRetriesCount;
      var script = document.createElement("SCRIPT");
      script.src = "/.static/qr.js?t=" + (+new Date());

      document.head.appendChild( script );

      setTimeout( etcthis.reloadQrJs, 1500 );
    };

    etcthis.retryFailedScriptSources = function() {
      /* 読み込みに失敗したjavascript sourcesを再読み込みする。
       * 2017年7月からある 503/502 エラー対策
       * DOMContentLoaded時点で読み込みエラーをキャッチすることはできない
       * だから泥臭い方法で再読み込みを行う
       * Firefox(55あたり)におけるキャッシュバグまではカバーできない */
      var scriptTags = document.getElementsByTagName("SCRIPT");
      var needToReloadQrJs = false;

      for ( var scriptIndex = 0, scriptLength = scriptTags.length;
            scriptIndex < scriptLength ; ++scriptIndex ) {

        if ( 0 <= scriptTags[ scriptIndex ].src.indexOf("/.static/qr.js") &&
              undefined === window.show_quick_reply ) {

          needToReloadQrJs = true;
        };
      };
      if (needToReloadQrJs) {
        setTimeout( etcthis.reloadQrJs, 1500 );
      };
    };

    etcthis.retryFailedTags = function() {
      etcthis.retryFailedImgTags();
      etcthis.retryFailedScriptSources();
    };

    etcthis.enable = function enable()
    {
      etcthis.retryFailedTags();

      feWrapper.postCellCP.appendAfterCP( etcthis.overrideWrapperAll );

      feWrapper.messageUriHandlers.push( etcthis.enableSoundcloudEmbed );
      feWrapper.messageUriHandlers.push( etcthis.enableYoutubeEmbed );

      feWrapper.postCellCP.appendCP( etcthis.overrideInlinePlayers );

      feWrapper.titleCP.appendAfterCP( etcthis.procTitle );

      /* setTimeout( etcthis.insertButtonShowHidePostingForm, 0 ); */
      setTimeout( etcthis.insertButtonShowHideContentAction, 0 );

      setTimeout( etcthis.fixGoogleChromeMp3Mime, 0 );

      setTimeout( etcthis.autoRefreshCheckboxPersistent, 0 );

      setTimeout( etcthis.overrideDateFromString, 0 );

      if( 0 <= document.location.href.indexOf("/res/") )
      {
        setTimeout( etcthis.addConsecutiveNumberStyle, 0 );
      };

      etcthis.insertDeleteCookiesButton();

      setTimeout( etcthis.overrideSetPlayer, 0 );
      setTimeout( etcthis.setVideosLoopMode, 0 );


      if ( 0 > document.location.href.indexOf("/catalog.html") ) {
        etcthis.setCheckboxOfMaskFilenameMode();

        feWrapper.selectedDivOnChangeHandlers.push(
            etcthis.updateMaskFilenameMode );
      };

      etcthis.removeNonJsSendButton();

      if ( 0 <= document.location.href.indexOf("/librejp/") ) {
        etcthis.setCheckboxOfDancingMascot();
      };

      /* etcthis.movePostBox(); */
      etcthis.UserJs();
      etcthis.uploadFileFromClipboard();
      etcthis.markdownTool();
      etcthis.insertMiscCSS();
    };

    etcthis.trigger = function()
    {
      etcthis.enable();
    };
    return etcthis;
  };

  /**********************************
   * MultiPopup                    *
   **********************************/
  function modMultiPopup()
  {
    window.toshakiii = window.toshakiii || {};
    window.toshakiii.settings = window.toshakiii.settings || {};
    window.toshakiii.multiPopup = window.toshakiii.multiPopup || {};
    var toshakiii = window.toshakiii;
    var settings = window.toshakiii.settings;
    var mthis = window.toshakiii.multiPopup;
    var feWrapper = window.toshakiii.feWrapper;
    var utils = window.toshakiii.utils;

    window.toshakiii.multiPopup = mthis;
    var etCetera = window.toshakiii.etCetera;

    mthis.Popup =
        function(){};
    mthis.popups = {};
    /* { <ElementUniqueId>:
       { uid: <ElementUniqueId>:
       quoteAnchor: <HTMLAnchorElement>,
       targetPosition: {x:<int>, y:<int>},
       element: <HTMLElement>,
       phase: <int>,
       showTimer: <timer ID>,
       closeTimer: <timer ID>,
       parent: <ElementUniqueId>,
       children: [ <ElementUniqueId>, ... ],
       brothers: (reseved)[ <ElementUniqueId>, ... ],
       }... } */
    mthis.POPUP_PHASE =
        {   DO_NOTHING               : 0,
          COUNTDOWN_FOR_SHOW_POPUP : 1,
          NOW_SHOWING              : 2,
          COUNTDOWN_FOR_CLOSE_POPUP: 3 };
    mthis.cache = {};
    /* { <URI> : { element: <HTMLElement>, message: <string> } } */
    mthis.defaultSettings = { 'timeToPopup': 250/*ms*/,
      'timeToClosePopup': 350/*ms*/ };
    mthis.panelBacklinksObservers = {};
    mthis.mouseClientPos = {x:0,y:0};

    mthis.preparePopupInfo =
        function( popups, arg2 )
    {
      var uid, quoteAnchor;
      if( "string" == typeof(arg2) )
      {
        uid = arg2;
      }
      else
      {
        quoteAnchor = arg2;
        uid = utils.getElementUniqueId( quoteAnchor );
      };
      arg2 = undefined;

      if( undefined != popups[ uid ] )
      {
        return popups[ uid ];
      };
      popups[ uid ] =
          { 'brothers'      : [],
            'children'      : [],
            'closeTimer'    : undefined,
            'element'       : undefined,
            'parent'        : undefined,
            'phase'         : mthis.POPUP_PHASE.DO_NOTHING,
            'quoteAnchor'   : quoteAnchor,
            'showTimer'     : undefined,
            'targetPosition': undefined,
            'uid'           : uid };
      return popups[ uid ];
    };

    mthis.setUidOfPopupParent =
        function( element, parentUid )
    {
      /* no parent‐child relation of DOM. parent-child relation of popups. */
      var cdaName = 'data-tsk-parent-popup-uid';
      element.setAttribute( cdaName, parentUid );
      return true;
    };

    mthis.getUidOfPopupParent =
        function( element )
    {
      var cdaName = 'data-tsk-parent-popup-uid';
      var parentUid = element.getAttribute( cdaName );
      if( undefined == parentUid )
      {
        return parentUid;
      };
      return parentUid;
    };

    mthis.getSettings =
        function( name )
    {
      if( undefined === settings[ name ] )
      {
        return mthis.defaultSettings[ name ];
      };
      return settings[ name ];
    };

    mthis.startCountdownForClosePopup =
        function( popupInfo )
    {
      if( mthis.POPUP_PHASE.NOW_SHOWING != popupInfo['phase'] )
      {
        return false;
      };
      var timeToClosePopup = mthis.getSettings('timeToClosePopup');
      popupInfo['phase'] = mthis.POPUP_PHASE.COUNTDOWN_FOR_CLOSE_POPUP;
      popupInfo['closeTimer'] =
          setTimeout( function(){ mthis.PopupHasExpired( popupInfo, true ); },
              timeToClosePopup );
      return true;
    };
    mthis.startCountdownForShowPopup =
        function( popupInfo )
    {
      var quoteLink = popupInfo['quoteAnchor'];
      var uid = popupInfo['uid'];

      if( mthis.POPUP_PHASE.DO_NOTHING != popupInfo['phase'] )
      {
        return false;
      };

      if( undefined != popupInfo['showTimer'] )
      {
        return true;
      };
      popupInfo['phase'] = mthis.POPUP_PHASE.COUNTDOWN_FOR_SHOW_POPUP;
      var timeToPopup = mthis.getSettings( 'timeToPopup' );
      popupInfo['showTimer'] =
          setTimeout( function(){ popupInfo['showTimer'] = undefined;
            mthis.showPopup( popupInfo ); }
              , timeToPopup );
      return true;
    };

    mthis.extendExpirationDate =
        function extendExpirationDate( popupInfo )
    {
      var timeToClosePopup = mthis.getSettings('timeToClosePopup');

      if( mthis.POPUP_PHASE.COUNTDOWN_FOR_CLOSE_POPUP != popupInfo['phase'] )
      {
        return false;
      };
      var timer = popupInfo['closeTimer'];
      if( undefined != timer )
      {
        clearTimeout( popupInfo['closeTimer'] );
      };
      popupInfo['closeTimer'] = undefined;
      popupInfo['phase'] = mthis.POPUP_PHASE.NOW_SHOWING;

      if( undefined == popupInfo['parent'] )
      {
        return true;
      }

      var parentPopupInfo = mthis.popups[ popupInfo['parent'] ];
      if( undefined == parentPopupInfo )
      {
        popupInfo['parent'] = undefined;
      }
      else
      {
        extendExpirationDate( parentPopupInfo );
      };
      return true;
    };

    mthis.touchElement =
        function( event )
    {
      var quoteLink = event.target;
      var popupInfo = mthis.preparePopupInfo( mthis.popups, quoteLink );

      var PP = mthis.POPUP_PHASE;
      var rect;
      switch( popupInfo['phase'] ){
      default:
      case PP.DO_NOTHING:
        /*rect = quoteLink.getBoundingClientRect();*/
        popupInfo['targetPosition'] = {'x': event.pageX, 'y':event.pageY };
        mthis.startCountdownForShowPopup( popupInfo );
        return true;
      case PP.COUNTDOWN_FOR_SHOW_POPUP:
        popupInfo['targetPosition'] = {'x': event.pageX, 'y':event.pageY };
        return true;
      case PP.NOW_SHOWING:
        return true;
      case PP.COUNTDOWN_FOR_CLOSE_POPUP:
        mthis.extendExpirationDate( popupInfo );
        return true;
      };
      return true;
    };

    mthis.untouchElement =
        function( event )
    {
      var quoteLink = event.target;
      var popupInfo = mthis.preparePopupInfo( mthis.popups, quoteLink );

      var PP = mthis.POPUP_PHASE;
      if( PP.COUNTDOWN_FOR_SHOW_POPUP == popupInfo['phase'] )
      {
        var timer = popupInfo['showTimer'];
        if( undefined != timer )
        {
          clearTimeout( timer );
          popupInfo['showTimer'] = undefined;
        };
        popupInfo['phase'] = PP.DO_NOTHING;
        return true;
      }
      else if( PP.NOW_SHOWING == popupInfo['phase'] )
      {
        mthis.startCountdownForClosePopup( popupInfo );
      };
      return true;
    };


    mthis.getRelatedPostCell =
        function getAncientPostCell( element )
    {
      if( null == element )
      {
        return null;
      };
      if( document.body == element )
      {
        return null;
      }
      if( 0 <= element.className.indexOf("postCell") )
      {
        return element;
      };
      return getAncientPostCell( element.parentElement );
    };

    mthis.getRelatedDivMessage =
        function( element )
    {
      var postCell = mthis.getRelatedPostCell( element );
      if( null == postCell )
      {
        return null;
      };
      var divMessageList = postCell.getElementsByClassName("divMessage");
      if( 0 < divMessageList.length )
      {
        return divMessageList[0];
      };
      return null;

    };

    mthis.downloadPostCell =
        function( popupInfo, callback )
    {
      var quoteAnchor = popupInfo['quoteAnchor'];
      var msg;
      if( quoteAnchor.host != location.host )
      {
        callback( popupInfo, null, msg );
        return;
      };

      if( 0 > quoteAnchor.pathname.indexOf("/res/") )
      {
        callback( popupInfo, null, "unexpected uri:" + quoteAnchor );
        return;
      };

      var pathname = quoteAnchor.pathname;
      var hash = quoteAnchor.hash;
      var uri = "";
      if( 0 == hash.length )
      {
        uri = pathname.replace("/res/","/preview/");
      }
      else if( 0 == hash.indexOf("#q") )
      {
        uri = pathname.replace(/\/res\/[^\/]*/,"/preview/") + hash.substring(2) + ".html";
      }
      else
      {
        uri = pathname.replace(/\/res\/[^\/]*/,"/preview/") + hash.substring(1) + ".html";
      };
      uri = "//" + quoteAnchor.host + uri;
      /* ex. "//yamanu.org/chan/preview/123.html" */

      if( undefined != mthis.cache[ uri ] )
      {
        var postCell = mthis.cache[ uri ]['element'];
        if( null != postCell )
        {
          postCell = postCell.cloneNode( true );
        };
        callback( popupInfo, postCell, mthis.cache[ uri ]['message'] );
        return;
      };

      callback( popupInfo, null, "now loading" );

      var xhr = new XMLHttpRequest();
      var fullUri = location.protocol + uri; /* for message */
      xhr.onreadystatechange = function()
      {
        switch( this.readyState )
        {
          case 0:
          case 1:
          case 3:
          return;
          case 4:
          if( 200 <= this.status &&
                300 >  this.status )
          {
            if( 'document' != this.responseType )
            {
              msg = "unknown response contents(1): + " + this.responseType;
              mthis.cache[ uri ] = { 'message': msg };
              callback( popupInfo, null, msg );
              return;
            };

            /*
              freech: #panelContent は空。body 直下に .postCell がある
            */

            var postCellList = this.response.getElementsByClassName('postCell');
            if( 0 >= postCellList.length )
            {
              msg = "unknown response contents: postCell not found: " + fullUri;
              mthis.cache[ uri ] = { 'message': msg };
              window.lastPanelContent = this.response;
              callback( popupInfo, null, msg );
              /*callback( popupInfo, null, msg );*/
              return;
            };
            var postCell = postCellList[0];
            postCell = utils.removeIdAll( document.importNode( postCell, true ) );
            mthis.cache[ uri ] = { 'element': postCell };
            callback( popupInfo, postCell );
            return;
          };
          msg = 'not found(HTTP ' + this.status + '): ' + fullUri;
          mthis.cache[ uri ] = { 'message': msg };
          callback( popupInfo, null, msg );
          return;
        };
      };
      xhr.responseType = 'document';
      xhr.open('GET', uri);
      xhr.send(null);

      return;
    };

    mthis.lookForPostCellFromDocument =
        function( popupInfo, callback )
    {
      var quoteAnchor = popupInfo['quoteAnchor'];
      var localNo = quoteAnchor.hash;
      if( 0 == localNo.length )
      {
        /* "/boardname/res/789.html" -> "789" */
        var matches = quoteAnchor.pathname.match(/.*\/([0-9]*).html/);
        if( null == matches )
        {
          return callback( popupInfo, null, "unexpected location");
        };
        localNo = matches[1];
      }
      else if( 0 == localNo.indexOf("#q") )
      {
        localNo = localNo.substring(2); /* "#q123" -> "123" */
      }
      else
      {
        localNo = localNo.substring(1); /* "#456" -> "456" */
      };
      var postCell = document.getElementById( localNo );
      if( null == postCell )
      {
        return callback( popupInfo, null, "no such post:No." + localNo );
      };
      postCell = postCell.cloneNode(true);

      var divPostsList = postCell.getElementsByClassName("divPosts");
      for( var dpIdx = divPostsList.length - 1; -1 < dpIdx ; --dpIdx )
      {
        divPostsList[ dpIdx ].parentElement.removeChild( divPostsList[ dpIdx ] );
      };
      postCell = utils.removeIdAll( postCell );
      return callback( popupInfo, postCell );
    };

    mthis.lookForPostCell =
        function( popupInfo, callback )
    {
      /* TODO:"//yamanu.org/chang/index.html" とかのスレが複数あるページで、
         通信なしに取得できないか試行すること */
      var here = location;
      var target = popupInfo['quoteAnchor'];
      var postCell;
      if( here.host     == target.host    &&
            here.port     == target.port    &&
            here.pathname == target.pathname  )
      {
        return mthis.lookForPostCellFromDocument( popupInfo, callback);
      };
      return mthis.downloadPostCell( popupInfo, callback );
    };

    mthis.showPopup = function( popupInfo, postCell, errorMessage ) {

      var quoteLink = popupInfo['quoteAnchor'];
      if( undefined == postCell && undefined == errorMessage ) {
        mthis.lookForPostCell( popupInfo, mthis.showPopup );
        return;
      };
      if( undefined != errorMessage ) {
        postCell = document.createElement('DIV');
        postCell.appendChild( document.createTextNode(errorMessage) );
      };
      var originElement = mthis.getRelatedDivMessage( quoteLink );
      if( null == originElement ) {
        originElement = quoteLink;
      };

      var quoteblock;
      if( undefined != popupInfo['element'] ) {
        if( null == popupInfo['element'].firstChild ) {
          popupInfo['element'].appendChild( postCell );

        } else {
          popupInfo['element'].replaceChild( postCell, popupInfo['element'].firstChild );
        };
        quoteblock = popupInfo['element'];
      } else {
        quoteblock = document.createElement('DIV');
        quoteblock.appendChild( postCell );
      };

      quoteblock.className = "tskQuoteblock";
      var uid = popupInfo['uid'];
      mthis.processPostCell( postCell );
      mthis.overridePostCellQuotePopups( postCell, function(e) {
        mthis.setUidOfPopupParent( e, uid );
      } );

      quoteblock.addEventListener("mouseout", function() {
        mthis.startCountdownForClosePopup( popupInfo ); } );

      quoteblock.addEventListener("mousemove", function() {
        mthis.extendExpirationDate( popupInfo );
        return true; } );

      quoteblock.addEventListener("click", function() {
        mthis.extendExpirationDate( popupInfo );
        return true; } );

      quoteblock.style.position = "absolute";
      quoteblock.style.paddingTop = "2px";
      quoteblock.style.paddingLeft = "2px";
      quoteblock.style.paddingRight = "2px";
      quoteblock.style.paddingBottom = "2px";
      quoteblock.style.border = "1px solid " + utils.getBodyForegroundColor();
      quoteblock.style.backgroundColor = utils.getBodyBackgroundColor();
      quoteblock.style.maxWidth = "90%";
      quoteblock.style.zIndex = 2;

      var scrollLeft   = utils.getScrollLeft();
      var scrollRight  = scrollLeft + window.innerWidth;
      var scrollTop    = utils.getScrollTop();
      var scrollBottom = scrollTop + window.innerHeight;

      var divThreads = document.getElementById("divThreads");
      /* css rule のために divThreads に入れる */

      divThreads.appendChild( quoteblock );
      var height    = quoteblock.offsetHeight;
      var width     = quoteblock.offsetWidth;

      var targetPosition = popupInfo['targetPosition'];
      var rect      = originElement.getBoundingClientRect();
      var left    = rect.left + rect.height + scrollLeft;
      var top     = rect.top  + rect.height + scrollTop;

      if( undefined != targetPosition ) {
        left = targetPosition.x;
        top  = targetPosition.y;
      };

      var tmpRight  = left + width;
      var tmpBottom = top  + height;

      if( scrollRight < tmpRight ) {
        left = scrollRight - width;
      };
      if( scrollBottom < tmpBottom ) {
        if ( height > window.innerHeight ) {
          top = scrollTop;
        } else {
          top = scrollBottom - height;
        };
      };

      quoteblock.style.top  = ( top + 5 ) + "px";
      quoteblock.style.left = ( left + 5 ) + "px";

      var parentUid = mthis.getUidOfPopupParent( quoteLink );
      if( undefined != parentUid ) {
        popupInfo['parent']  = parentUid;
        var parentPopupInfo = mthis.popups[ parentUid ];
        if( undefined != parentPopupInfo ) {
          parentPopupInfo['children'].push( popupInfo['uid'] );
        };
      };
      popupInfo['phase']   = mthis.POPUP_PHASE.NOW_SHOWING;
      popupInfo['element'] = quoteblock;

      /* parent の期限を伸ばす: */
      mthis.extendExpirationDate( popupInfo );

      return;
    };
    /* end mthis.showPopup */

    mthis.PopupHasExpired =
        function( popupInfo, deletep )
    {
      var rect = popupInfo['element'].getBoundingClientRect();
      var mcx = mthis.mouseClientPos.x;
      var mcy = mthis.mouseClientPos.y;
      if( rect.left   <= mcx &&
            rect.right  >  mcx &&
            rect.top    <= mcy &&
            rect.bottom >  mcy   )
      {
        popupInfo['closeTimer'] = undefined;
        popupInfo['phase'] = mthis.POPUP_PHASE.NOW_SHOWING;
        return;
      };
      mthis.closePopup( popupInfo, deletep );
    };

    mthis.closePopup =
        function( popupInfo, deletep )
    {
      for( var childIdx in popupInfo['children'] )
      {
        var childUid = popupInfo['children'][ childIdx ];
        var child = mthis.popups[ childUid ];
        if( undefined != child )
        {
          mthis.closePopup( child );
        };
      };
      var element = popupInfo['element'];
      if( undefined != element )
      {
        if( undefined != element.parentElement )
        {
          element.parentElement.removeChild( element );
        };
        utils.toMarkElementDiscarded( element );
      };
      popupInfo['phase'] = mthis.POPUP_PHASE.DO_NOTHING;

      if( deletep )
      {
        delete mthis.popups[ popupInfo['uid'] ];
      };
    };

    mthis.DateToLastCheckMouseIsIn = 0;
    mthis.onBodyMouseMove =
        function( event )
    {
      var now = (+new Date());
      var intervalToCheck = 100;
      if( now > ( intervalToCheck + mthis.DateToLastCheckMouseIsIn ) )
      {
        mthis.checkMouseIsIn( event );
        mthis.DateToLastCheckMouseIsIn = now;
      };

      mthis.mouseClientPos = {x:event.clientX, y:event.clientY};
      return;
    };

    mthis.checkMouseIsIn =
        function( event )
    {
      mthis.mouseClientPos = {x:event.clientX, y:event.clientY};

      var uidsToClosePopup = [];
      var popupInfo;
      for( var key in mthis.popups )
      {
        popupInfo = mthis.popups[ key ];
        if( mthis.POPUP_PHASE.NOW_SHOWING != popupInfo['phase'] )
        {
          continue;
        };

        var rect2 = popupInfo['quoteAnchor'].getBoundingClientRect();
        var rect = popupInfo['element'].getBoundingClientRect();
        var mcx = mthis.mouseClientPos.x;
        var mcy = mthis.mouseClientPos.y;
        if( ( rect.left   <= mcx &&
              rect.right  >  mcx &&
              rect.top    <= mcy &&
              rect.bottom >  mcy   ) ||
              (     rect2.left   <= mcx &&
                    rect2.right  >  mcx &&
                    rect2.top    <= mcy &&
                    rect2.bottom >  mcy   )   )
        {
          continue;
        };
        uidsToClosePopup.push( key );
      };
      for( var idx in uidsToClosePopup )
      {
        key = uidsToClosePopup[ idx ];
        popupInfo = mthis.popups[ key ];
        if( undefined == popupInfo )
        {
          continue;
        };
        var descList = mthis.popupDescendants( popupInfo );
        var noClose = false;
        for( var dlIdx in descList )
        {
          if( mthis.POPUP_PHASE.NOW_SHOWING == descList[ dlIdx ]['phase'] )
          {
            noClose = true;
            break;
          };
        };
        if( ! noClose )
        {
          mthis.closePopup( popupInfo, true );
        };
      };
    };

    mthis.disableQuotePopup =
        function( anchor )
    {
      anchor.removeEventListener("mousemove", mthis.touchElement );
      anchor.removeEventListener("mouseout" , mthis.untouchElement );
    };

    mthis.removeOriginalPopupFeature =
        function( quoteLink )
    {
      /* click でその場所に飛ぶのは残す */
      quoteLink.onmouseenter = null;
      quoteLink.onmouseout = null;
    };

    mthis.enableQuotePopup =
        function( anchor )
    {
      mthis.disableQuotePopup( anchor );
      anchor.addEventListener("mousemove", mthis.touchElement );
      anchor.addEventListener("mouseout" , mthis.untouchElement );
    };

    mthis.processPostCell =
        function( postCell )
    {
      var linkQuoteList = postCell.getElementsByClassName('linkQuote');
      for ( var lqIdx = linkQuoteList.length - 1; -1 < lqIdx ; --lqIdx )
      {
        var linkQuote = linkQuoteList[ lqIdx ];
        linkQuote.removeEventListener( "click", mthis.add_reply_quote );
        linkQuote.onclick = null;
        linkQuote.addEventListener( "click", mthis.add_reply_quote );
      };

      var imgList = postCell.getElementsByTagName("IMG");
      for (var imgIdx = 0, imgLen = imgList.length; imgIdx < imgLen; ++imgIdx) {
        imgList[imgIdx].removeAttribute("width");
        imgList[imgIdx].removeAttribute("height");
      };
      /*
        var panelUploadsList = postCell.getElementsByClassName('panelUploads');
        for( var upIdx = 0, upLen = panelUploadsList.length; upIdx < upLen; ++upIdx )
        {
        var imgs = panelUploadsList[ upIdx ].getElementsByTagName('IMG');
        for( var imIdx = 0, imLen = imgs.length; imIdx < imLen ; ++imIdx )
        {
        imgs[ imIdx ].width = "50%";
        imgs[ imIdx ].height = "50%";
        };
        };*/
    };

    mthis.sharpQRegexp = new RegExp("^#q[0-9]*");
    mthis.add_reply_quote = function()
    {
      var linkQuote = this;

      if( ! mthis.sharpQRegexp.test( linkQuote.hash ) )
      {
        return true;
      };
      var toQuote = linkQuote.hash.substring(2);

      if( undefined !== window.add_quick_reply_quote )
      {
        window.add_quick_reply_quote( toQuote );
      };

      var fieldMessage = document.getElementById('fieldMessage');
      if( null != fieldMessage )
      {
        fieldMessage.value += '>>' + toQuote + '\n';
      };

      return true;
    };

    mthis.overridePostCellQuotePopups =
        function( postCell, hook  )
    {
      var quoteLinks = postCell.getElementsByClassName('quoteLink');
      for( var qlIdx = 0, qlLen = quoteLinks.length; qlIdx < qlLen ; ++qlIdx )
      {
        mthis.overrideQuotePopup( quoteLinks[ qlIdx ] );
        if( hook != undefined )
        {
          hook( quoteLinks[ qlIdx ] );
        };
      };
      var panelBacklinksList = postCell.getElementsByClassName('panelBacklinks');
      for( var pbIdx = 0, pbLen = panelBacklinksList.length; pbIdx < pbLen ; ++pbIdx )
      {
        mthis.overrideChildrenQuotePopup( panelBacklinksList[ pbIdx ], hook );
      };
    };

    mthis.overrideChildrenQuotePopup =
        function( panelBacklinks, hook )
    {
      if( undefined == panelBacklinks.children )
      {
        return;
      };
      for( var anIdx = 0, anLen = panelBacklinks.children.length; anIdx < anLen ; ++anIdx )
      {
        var child = panelBacklinks.children[ anIdx ];
        mthis.removeOriginalPopupFeature( child );
        mthis.enableQuotePopup( child );
        if( hook != undefined )
        {
          hook( child );
        };
      };
    };

    mthis.popupDescendants =
        function popupDescendants( obj, descList )
    {
      if( undefined == descList )
      {
        descList = [];
      };
      if( undefined == obj.children )
      {
        return descList;
      };
      for( var i in obj.children )
      {
        var child = mthis.popups[ obj.children[ i ] ];
        if( undefined == child )
        {
          continue;
        };
        descList.push( child );
        popupDescendants( child, descList );
      };
      return descList;
    };

    mthis.addBodyEvents =
        function()
    {
      mthis.removeBodyEvents();
      document.body.addEventListener("click"    , mthis.checkMouseIsIn );
      document.body.addEventListener("mousemove", mthis.onBodyMouseMove );
    };
    mthis.removeBodyEvents =
        function()
    {
      document.body.removeEventListener("click"    , mthis.checkMouseIsIn );
      document.body.removeEventListener("mousemove", mthis.onBodyMouseMove );
    };

    mthis.overrideQuotePopup =
        function( quoteLink )
    {
      mthis.removeOriginalPopupFeature( quoteLink );
      mthis.enableQuotePopup( quoteLink );
    };

    mthis.startObservePanelBacklinks =
        function( panelBacklinks )
    {
      var cdaName = "data-tsk-observing";
      var nid = utils.getElementUniqueId( panelBacklinks );
      var mo = mthis.panelBacklinksObservers[ nid ];
      var opts = { childList: true };
      if( undefined == mo )
      {
        mo = new MutationObserver( mthis.overrideChildrenQuotePopup );
        mthis.panelBacklinksObservers[ nid ] = mo;
        mo.observe( panelBacklinks, { childList: true } );
      };
      mo.observe( panelBacklinks, opts );
      panelBacklinks.setAttribute( cdaName, "1" );
      return;
    };
    mthis.stopObservePanelBacklinks =
        function( panelBacklinks )
    {
      var cdaName = "data-tsk-observing";
      var nid = utils.getElementUniqueId( panelBacklinks );
      var mo = mthis.panelBacklinksObservers[ nid ];
      if( undefined != mo )
      {
        mo.disconnect();
        delete mthis.panelBacklinksObservers[ nid ];
      };
      panelBacklinks.setAttribute( cdaName, "0" );
      return;
    };

    mthis.trigger = function()
    {
      mthis.enable();
    };

    mthis.enable = function()
    {
      mthis.addBodyEvents();
      /* etCetera の監視対象は .divPosts。Popup の挿入場所は .divPosts の親の親の中。
       * だから Popup 挿入時に冗長呼び出しにはならない */

      feWrapper.postCellCP.appendCP( mthis.overridePostCellQuotePopups );

      var iloops = utils.IntermittentLoops();
      var links;
      var idx = 0;
      var break_ = false;
      var continue_ = true;
      var quoteblockList;

      iloops.push( function(){
        links = document.getElementsByClassName('quoteLink');
        idx = links.length - 1;
      } ).push( function(){
        if( -1 >= idx ){ return break_; };
        mthis.overrideQuotePopup( links[ idx ] );
        --idx;
        return continue_;
      } ).push( function(){
        links = document.getElementsByClassName('panelBacklinks');
        idx = links.length - 1;
      } ).push( function(){
        if( -1 >= idx ){ return break_; };
        var panelBacklinks = links[ idx ];
        mthis.overrideChildrenQuotePopup( panelBacklinks );
        mthis.startObservePanelBacklinks( panelBacklinks );
        --idx;
        return continue_;
      } ).push( function(){
        quoteblockList = document.getElementsByClassName('quoteblock');
        idx = quoteblockList.length - 1;
      } ).push( function(){
        if( -1 >= idx ){ return break_; };
        var quoteblock = quoteblockList[ idx ];
        if( quoteblock.style.display != 'none' )
        {
          quoteblock.style.display = 'none';
        };
        --idx;
        return continue_;
      } ).beginAsync();
    };
    mthis.disable = function()
    {
      mthis.removeBodyEvents();
    };

    return mthis;
  };

  /**********************************
   * LynxChan Front-End Wrapper               *
   **********************************/
  function modFeWrapper()
  {
    window.toshakiii = window.toshakiii || {};
    window.toshakiii.settings = window.toshakiii.settings || {};
    var toshakiii = window.toshakiii;
    var settings = window.toshakiii.settings;
    var utils = window.toshakiii.utils;

    var fewrapper = {};
    window.toshakiii.feWrapper = fewrapper;

    fewrapper.selectedDivOnChangeHandlers = [];
    fewrapper.postCellCP = undefined;
    fewrapper.titleCP = undefined;
    fewrapper.quickReplyOnLoadHandlers = [];

    /*
     * 投稿内のURIアンカーを引数に渡される関数のリスト。
     * あるアンカーに対して、あるハンドラーが true を返した場合は、
     * 他のハンドラーを呼ばない
     */
    fewrapper.messageUriHandlers = [];

    fewrapper.postCellCPInit =
        function postCellCPInit( postCellCP )
    {
      var divPostsList = document.getElementsByClassName('divPosts');
      if( 0 >= divPostsList.length )
      {
        return;
      };

      postCellCP.setObservingElement( divPostsList[0] );
      postCellCP.setObservingOptions( { childList: true } );
      postCellCP.setFuncEnumExistingTargets( function(){
        return document.getElementsByClassName('postCell');
      } );
      postCellCP.setPreProc( utils.CompulsoryProcessing.prototype.preProc_enumAddedNodes );
    };

    fewrapper.callMessageUriHandlers = function( anchor ) {
      for (var hndIdx = 0, hndLen = fewrapper.messageUriHandlers.length;
           hndIdx < hndLen ; ++hndIdx ) {
        if (fewrapper.messageUriHandlers[hndIdx]( anchor ) ) {
          /* like stopImmediatePropagation */
          return true;
        };
      };
      return false;
    };

    fewrapper.callMessageUriHandlersWithMessageUri = function( postCell ) {
      var divMessageList = postCell.getElementsByClassName('divMessage');
      for (var idx = 0, len = divMessageList.length; idx < len ; ++idx ) {
        var divMessage = divMessageList[idx];
        var anchorList = divMessage.getElementsByTagName('A');
        for (var ancIdx = anchorList.length - 1; -1 < ancIdx ; --ancIdx ) {
          var anchor = anchorList[ ancIdx ];
          /* レスアンカーとか他で処理されたリンクを除外する
           * いい加減すぎるような、十分であるような。*/
          if (anchor.textContent === anchor.href) {
            fewrapper.callMessageUriHandlers( anchor );
          };
        };
      };
    };

    fewrapper.titleCPInit = function( titleCP )
    {
      titleCP.setObservingElement( document.head.getElementsByTagName('TITLE')[0] );
      titleCP.setObservingOptions( { childList: true} );
      titleCP.setFuncEnumExistingTargets( function(){ return [titleCP.observingElement]; } );
    };

    fewrapper.enable = function()
    {
      fewrapper.titleCP = new utils.CompulsoryProcessing( fewrapper.titleCPInit );
      fewrapper.postCellCP = new utils.CompulsoryProcessing( fewrapper.postCellCPInit );
      fewrapper.postCellCP.appendCP( fewrapper.callMessageUriHandlersWithMessageUri );
    };

    fewrapper.getBoardUri = function()
    {
      /* /b/ の "b" とか、 /librejp/ の "librejp" とかを返す */
      if( undefined !== window.boardUri )
      {
        return window.boardUri;
      };
      return document.location.pathname.replace(/\/([^\/]*).*/,"$1");
    };

    fewrapper.disable = function(){};
    fewrapper.trigger = function(){ fewrapper.enable(); };

    return fewrapper;
  };

  /**********************************
   * main                           *
   **********************************/
  function main() {
    var lowerCaseUA = window.navigator.userAgent.toLowerCase();
    if ( 0 <= lowerCaseUA.indexOf("gecko") ||
          0 <= lowerCaseUA.indexOf("edge") )
    {
      modUtils().trigger();
      modSettings().trigger();
      modFeWrapper().trigger();
      modEtCetera().trigger();
      modFilePreview().trigger();
      modCatalogSorter().trigger();
      modMultiPopup().trigger();
    } else {
      var script = document.createElement('SCRIPT');
      script.innerText =
          "var toshakiii_errors = [];" +
          "try{("+modUtils        .toString() +")().trigger();}catch(e){toshakiii_errors.push(e);};" +
          "try{("+modSettings     .toString() +")().trigger();}catch(e){toshakiii_errors.push(e);};" +
          "try{("+modFeWrapper    .toString() +")().trigger();}catch(e){toshakiii_errors.push(e);};" +
          "try{("+modEtCetera     .toString() +")().trigger();}catch(e){toshakiii_errors.push(e);};" +
          "try{("+modCatalogSorter.toString() +")().trigger();}catch(e){toshakiii_errors.push(e);};" +
          "try{("+modFilePreview  .toString() +")().trigger();}catch(e){toshakiii_errors.push(e);};" +
          "try{("+modMultiPopup   .toString() +")().trigger();}catch(e){toshakiii_errors.push(e);};" +
          "if( 0 != toshakiii_errors.length ){ alert( toshakiii_errors ); };" +
          "";
      document.head.appendChild( script );
    };
  };

  main();

})();


/*
  if( 0 == (""+location).lastIndexOf("http://127.0.0.1:8082/",0) )
  {
  var postCellList = document.getElementsByClassName('postCell');
  for( var idx = postCellList.length - 1; -1 < idx ; --idx )
  {
  postCellList[idx].parentElement.removeChild( postCellList[idx] );
  };
  window.lastReplyId = 0;
  };
*/
