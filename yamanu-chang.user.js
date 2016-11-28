// ==UserScript==
// @name        yamanu-chang
// @namespace   to_sha_ki_ii
// @description endchan: catalog sorter, preview upload files, recursive quote popup
// @include     /https?://endchan\.xyz/.*$/
// @include     /https?://infinow\.net/.*$/
//
// @include     http*://bunkerchan.xyz/*/*
// @include     http*://bunkerchan.xyz/*/res/*
// @include     http*://freech.net/*/*
// @include     http*://freech.net/*/res/*
// @include     http*://spacechan.xyz/*/*
// @include     http*://spacechan.xyz/*/res/*
// @include     http*://32ch.org/*/*
// @include     http*://32ch.org/*/res/*
// @include     http*://waifuchan.moe/*/*
// @include     http*://waifuchan.moe/*/res/*
// @include     http*://spqrchan.org/*/*
// @include     http*://spqrchan.org/*/res/*
//
// @version     1.86
// @grant       none
// ==/UserScript==

/**************************************************
 *  yamanu-chang
 *  Copyright (c) 2016 "to_sha_ki_ii"
 *  This software is released under the MIT License.
 *  http://opensource.org/licenses/mit-license.php
 **************************************************
 *  CSSを利用しました : http://endchan.xyz/librejp/res/5273.html#8133
 */

/*
 yamanu-chang(山ぬちゃん)です。
・(v1.86 2016.11.28 21:43 JST)
  ・再帰的ポップアップで、OP引用時にレス全部が出てくる不具合を修正。
  ・スレ内通し番号が出て来る場所を修正。引用ブロック内で出ないように。
  ・freech.net で再帰的ポップアップが動かないのを修正
  ・ポップアップ待機中の「now loading」表示を追加
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

  ┌────┐
  │導入方法│
  └────┘
      前の
        ・"endchan: catalog sort"
        ・"endchan: preview upload files"
      は無効にしてください。(あるいは、削除)

  ・このファイルを "yamanu-chang.user.js" という名前にします
  ※Windowsの場合は、拡張子の表示をしてから名前をつけてください

  ・Firefox: addon の Greasemonkey を入れてから、
  このファイルをブラウザウィンドウに Drag & Drop で放り込む

  ・Google Chrome : 設定→拡張機能を開いて、このファイルを Drag & Drop で放り込む

  ・IE, Opera, Safari  : 確認していません。

(※ Firefox の場合、
    ツール → アドオン → (猿マークの)ユーザースクリプト
    で、インストールされている ユーザースクリプト一覧が出るよ。
 )
  ----------------------------------------
 */

/* var yamanuchangDebug = true;
   var yamanuchangVersion = "1.86"; */



/*
  ・1行100文字
  ・セミコロンは全ての場所につける。
  ・"human readable"
  ・'system_constant_value'

  ・trigger, enable, disable
*/

(function(){
    // pthis: modFilePreview
    // sthis: modCatalogSorter
    // mthis: modMultiPopup
    // efpthis: modEtcForPosts
    // ethis: DOM Elementを指すthis
    // cthis: 一時使用用

    /*********
     * utils *
     *********/
    function modUtils()
    {
	if( undefined === window.toshakiii )
	{   window.toshakiii = {};};

	var uthis = {};

	window.toshakiii.utils = uthis;

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

        uthis.IntermittentLoops =
            function()
        {
            var ilthis = this;
            this.funcs = [];
            this.push = function( f )
            {
                ilthis.funcs.push( f );
                return ilthis;
            };

            this.exec = function()
            {
                var funcs = ilthis.funcs;
                var tFuncs = new Array( funcs.length );
                var idx = funcs.length - 1;

                for(; -1 < idx ; --idx )
                {
                    function mew()
                    {
                        var f = funcs[idx];
                        var n = idx + 1 < tFuncs.length ?
                                tFuncs[ idx + 1 ] :
                                ilthis.nop;
                        function me()
                        {
                            if( f() )
                            {
                                setTimeout( me, 0 );
                            }
                            else
                            {
                                setTimeout( n, 0 );
                            };
                        };
                        return me;
                    };
                    tFuncs[ idx ] = mew();
                };
                setTimeout( tFuncs[0], 0 );
            };
            return this;
        };

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
                .exec();
        };

        uthis.elementOfUid = {};
        uthis.uidCounter = 0;
        uthis.getElementUniqueId =
            function( element )
        {
            ++uthis.uidCounter;

            var cdaName = "data-tsk-uid";
            var uid = element.getAttribute( cdaName );

            if( null != uid &&
                uthis.elementOfUid[ uid ] === element )
            {
                return uid;
            };

            uid = "tskuid" + uthis.uidCounter + "__";
            element.setAttribute( cdaName, uid );
            uthis.elementOfUid[ uid ] = element;
            return uid;
        };
	uthis.toMarkElementDiscarded =
	    function( element )
	{
	    element.setAttribute( "data-tsk-discarded", "1" );
	};

        uthis.trigger =
            function()
        {
            return;
        };

        return uthis;
    };

    /**********************************
     * filePreview                    *
     **********************************/
    function modFilePreview()
    {
        if( undefined === window.toshakiii )
        {   window.toshakiii = {}; };
        if( undefined === window.toshakiii.settings )
        {   window.toshakiii.settings = {}; };

        var pthis = {};

        window.toshakiii.filePreview = pthis;

        pthis.previewMaxWidth = "140px";
        pthis.previewMaxHeight = "140px";

        pthis.PREVIEW_CLASSNAME = "toshakiPreviewCell";
        pthis.PREVIEWS_AREA_CLASSNAME = "toshakiPreviewsArea";

        /*
         * endchan公式の $(".selectedCell") に設定する Custom Data Attribute名
         * selectedCell.getAttribute( POINTER_CDA_NAME ) が、ある previewCell の ClassName の
         * ひとつに対応する。
         */
        pthis.POINTER_CDA_NAME = "data-toshaki-preview-pointer";

        pthis.insertPreviewElement =
            function( selectedCell, file, pointer )
        {
            if( pthis.hasPreviewed( selectedCell ) )
            {
                return true;
            };

            var previewsArea = pthis.getPreviewsAreaElement( selectedCell );
            var span = document.createElement('SPAN');
            span.className = pthis.PREVIEW_CLASSNAME + " " + pointer;
            selectedCell.setAttribute( pthis.POINTER_CDA_NAME, pointer);
            previewsArea.appendChild( span );

            if( ( 350 * 1024 * 1024 ) <= file.size )
            {
                return this.insertDummyElement( span, file, "OVER 350MiB");
            }
            else if( 0 <= file.type.indexOf( 'image/' ) )
            {
                return pthis.insertImagePreviewElement( span, file);
            }
            else if( 0 <= file.type.indexOf( 'audio/' ) ||
                     0 <= file.type.indexOf( 'video/' ) )
            {
                return pthis.insertAudioVideoPreviewElement( span, file);
            };

            return this.insertDummyElement( span, file);
        };

        pthis.insertImagePreviewElement =
            function( destElt, file)
        {
            var fileReader = new FileReader();
            fileReader.onload = function()
            {
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

        pthis.insertAudioVideoPreviewElement =
            function( destElt, file)
        {
            var fileReader = new FileReader();
            fileReader.onload = function()
            {
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

        pthis.insertDummyElement =
            function( destElt, file, msg )
        {
            var elt = document.createElement('DIV');
            var text = document.createTextNode( file.type );
            elt.appendChild( text );
            if( undefined != msg )
            {
                elt.appendChild( document.createElement('BR') );
                elt.appendChild( document.createTextNode( msg ) );
            };

            elt.style.maxWidth = pthis.previewMaxWidth;
            elt.style.maxHeight = pthis.previewMaxHeight;
            elt.style.border = "1px dashed black";
            destElt.appendChild( elt );
        };

        pthis.getPreviewsAreaElement =
            function( refSelectedCell )
        {
            return refSelectedCell.parentElement.parentElement
                .getElementsByClassName( pthis.PREVIEWS_AREA_CLASSNAME )[0];
        };

        pthis.hasPreviewed =
            function( selectedCell )
        {
            return selectedCell.hasAttribute( pthis.POINTER_CDA_NAME );
            /*
              function( selectedCell, pointer){
              var previewsArea = pthis.getPreviewsAreaElement( selectedCell );
              return 0 < previewsArea.getElementsByClassName( pointer ).length;}
            */
        };

        pthis.removeOldPreviews =
            function()
        {
            var alivePointers = pthis.getAlivePointers();
            var previewElts = document.getElementsByClassName( pthis.PREVIEW_CLASSNAME );
            var toRemoveElts = [];
            var peIdx = 0;
            var previewElt;
            var needsRemove;
            var aliveIdx;
            var aliveLen = alivePointers.length;
            var alivePointer;
            for( peIdx = previewElts.length - 1 ; peIdx > -1 ; --peIdx )
            {
                previewElt = previewElts[ peIdx ];
                needsRemove = true;
                for( aliveIdx = 0 ; aliveIdx < aliveLen ; ++aliveIdx )
                {
                    alivePointer = alivePointers[ aliveIdx ];
                    if( 0 <= previewElt.className.indexOf( alivePointer ) )
                    {
                        needsRemove = false;
                        break;
                    };
                };
                if( needsRemove )
                {
                    toRemoveElts.push( previewElt );
                };
            };

            var treIdx = 0;
            var treLen = toRemoveElts.length;
            for( ; treIdx < treLen ; ++treIdx )
            {
                toRemoveElts[ treIdx ].parentElement.removeChild( toRemoveElts[ treIdx ] );
            };
        };

        pthis.getAlivePointers =
            function()
        {
            var elts = document.getElementsByClassName("selectedCell");
            var a = [];
            for( var idx = 0, len = elts.length ; idx < len ; ++idx )
            {
                if( elts[ idx ].hasAttribute( pthis.POINTER_CDA_NAME ) )
                {
                    var name = elts[ idx ].getAttribute( pthis.POINTER_CDA_NAME );
                    if( null != name )
                    {
                        a.push( name );
                    };
                };
            };
            return a;
        };

        pthis.selectedDivOnChange =
            function( mutationRecords, mutationObserver )
        {
            /* 本フォームへの ".selectedCell" 追加の前に、クイックリプライへの追加が行なわれる
               ことを前提としたコード*/
            var selectedCells = document.getElementsByClassName("selectedCell");
            var selectedCell;
            var scIdx = 0;
            var mLen = Math.min( selectedCells.length, window.selectedFiles.length );
            var pointers = new Array( mLen );
            pthis.removeOldPreviews();

            for( ; scIdx < mLen ; ++scIdx )
            {
                selectedCell = selectedCells[ scIdx ];
                if( selectedCell.hasAttribute( pthis.POINTER_CDA_NAME ) )
                {
                    pointers[ scIdx ] = selectedCell.getAttribute( pthis.POINTER_CDA_NAME );
                }
                else
                {
                    pointers[ scIdx ] = "p"+(+new Date())+"p"+scIdx;
                    pthis.insertPreviewElement( selectedCells[ scIdx ],
                                                window.selectedFiles[ scIdx ],
                                                pointers[ scIdx ] );
                };
            };

            var quickReplyElt = document.getElementById("quick-reply");
            if( null != quickReplyElt )
            {
                var scLen = selectedCells.length;
                for( ; scIdx < scLen ; ++scIdx )
                {
                    var fIdx = scIdx - window.selectedFiles.length;
                    pthis.insertPreviewElement( selectedCells[ scIdx ],
                                                window.selectedFiles[ fIdx ],
                                                pointers[ fIdx ] );
                };
            };
        };

        pthis.quickReplyOnLoad =
            function( mutationRecords, mutationObserver )
        {
            for( var mrIdx = 0, mrLen = mutationRecords.length;
                 mrIdx < mrLen ; ++mrIdx )
            {
                if( 0 >= mutationRecords[ mrIdx ].addedNodes.Length )
                {
                    continue;
                }
                for( var anIdx = 0, anLen = mutationRecords[ mrIdx ].addedNodes.length ;
                     anIdx < anLen ; ++anIdx )
                {
                    if( "quick-reply" == mutationRecords[ mrIdx ].addedNodes[ anIdx ].id )
                    {
                        var selectedCells = mutationRecords[ mrIdx ].addedNodes[ anIdx ]
                            .getElementsByClassName("selectedCell");
                        for( var scIdx = 0, scLen = selectedCells.length;
                             scIdx < scLen ; ++scIdx )
                        {
                            selectedCells[ scIdx ].removeAttribute( pthis.POINTER_CDA_NAME );
                        };

                        pthis.insertPreviewsArea( document.getElementById("selectedDivQr") );
                        pthis.selectedDivOnChange();
                    };
                };
            };

        };

        pthis.insertPreviewsArea =
            function( refSelectedDiv )
        {
            var previewsArea = document.createElement("div");
            previewsArea.className = pthis.PREVIEWS_AREA_CLASSNAME;
            refSelectedDiv.parentElement.insertBefore( previewsArea, refSelectedDiv );
        };

        pthis.stopSelectedDivObserver =
            function()
        {
            if( undefined != pthis.sdMutationObserver )
            {
                pthis.sdMutationObserver.disconnect();
                pthis.sdMutationObserver = undefined;
            };
        };
        pthis.startSelectedDivObserver =
            function()
        {
            var selectedDiv = document.getElementById("selectedDiv");
            if( null == selectedDiv )
            {
                return;
            };
            var options = { childList: true};
            pthis.sdMutationObserver = new MutationObserver( pthis.selectedDivOnChange );
            pthis.insertPreviewsArea( selectedDiv );
            pthis.sdMutationObserver.observe( selectedDiv, options );
        };

        pthis.stopQuickReplyObserver =
            function()
        {
            if( undefined != pthis.qrMutationObserver )
            {
                pthis.qrMutationObserver.disconnect();
                pthis.qrMutationObserver = undefined;
            };
        };
        pthis.startQuickReplyObserver =
            function()
        {
            if( ! window.show_quick_reply )
            {
                return;
            };
            var qrOptions = { childList: true};
            pthis.qrMutationObserver = new MutationObserver( pthis.quickReplyOnLoad );
            pthis.qrMutationObserver.observe( document.body, qrOptions);
        };

        pthis.trigger =
            function()
        {
            pthis.enable();
        };

        pthis.enable =
            function()
        {
            /* 公式対応したら動かない */
            if( undefined != window.addSelectedFile &&
                0 <= window.addSelectedFile.toString().indexOf("dragAndDropThumb") )
            {
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
        if( undefined === window.toshakiii )
        {   window.toshakiii = {}; };
        if( undefined === window.toshakiii.settings )
        {   window.toshakiii.settings = {}; };

        var sthis = {};
        var settings = window.toshakiii.settings;
        var utils = window.toshakiii.utils;

        window.toshakiii.catalogSorter = sthis;

        sthis.SPAN_ID = "toshakiiiCatalogSortSpan";
        /*sthis.LABEL_ID = "toshakiiiCatalogSortLabel";*/
        sthis.SELECT_ID = "toshakiiiCatalogSortSelect";
        sthis.SETTINGS_ID = "toshakiiiCatalogSortSettings";
        sthis.REFRESH_STATUS_ID = "toshakiiiCatalogSortRefreshStatus";

        sthis.boardUri = document.location.pathname.replace(/\/([^/]*).*/,"$1");
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
            function( useFragment )
        {
            var time = (+new Date());
            var parentElt = document.getElementById("divThreads");
            var children = parentElt.children;
            var catalogCells = [];
            var spanElts = {};
            var idx = 0;
            var len = 0;
            var n = "";
            for( idx = 0, len = children.length ; idx < len ; ++idx )
            {
                if( "SPAN" == children[idx].tagName )
                {
                    n = children[idx].id.replace( /[^0-9]/g, "");
                    spanElts[ n ] = children[idx];
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

            var fragment;
            if( useFragment )
            {
                fragment = document.createDocumentFragment();
            }
            else
            {
                fragment = parentElt;
            };


            var cookie = '; ' + document.cookie + "; ";
            var sageElts = [];
            for( var ccIdx = 0, ccLen = catalogCells.length; ccIdx < ccLen ; ++ccIdx )
            {
                var catalogCell = catalogCells[ ccIdx ];
                if( catalogCell.id in spanElts )
                {
                    var spanElt = spanElts[ catalogCell.id ];
                    if( settings.sageHidedThreads && spanElt.style.display != 'none' )
                    {
                        sageElts.push( spanElt );
                        sageElts.push( catalogCell );
                        continue;
                    }
                    fragment.appendChild( spanElts[ catalogCell.id ] );
                    /*parentElt.appendChild( spanElts[ catalogCells[idx].id ] );*/
                }
                else if( settings.sageHidedThreads &&
                         0 <= cookie.indexOf( '; hide' + sthis.boardUri + 'Thread' + catalogCell.id + "=true;" ) )
                {
                    sageElts.push( catalogCell );
                    continue;
                };

                fragment.appendChild( catalogCell );
                /*parentElt.appendChild( catalogCells[idx] );*/
            };
            for( var seIdx = 0, seLen = sageElts.length; seIdx < seLen ; ++seIdx )
            {
                fragment.appendChild( sageElts[ seIdx ] );
            };
            if( useFragment )
            {
                parentElt.appendChild( fragment );
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

        /*
         {"message":"音楽の話がしたい",
         "threadId":628,
         "postCount":186,
         "fileCount":21,
         "page":2,
         "subject":null,
         "locked":false,
         "pinned":false,
         "cyclic":false,
         "autoSage":false,
         "creation":"2016-10-06T16:20:39.382Z",
         "lastBump":"2016-11-08T14:09:45.207Z",
         "thumb":"/.media/t_bcee5a0d124c22893ef4ee5fac33ebc4-imagepng"}

         {"message":"とちゃきはPC内にいろんな画像を持ってるでしょう。前ダウンロードしたとか。ここで投稿して、何でも良い。",
         "threadId":17232,
         "page":1,
         "subject":"ランダム画像スレ",
         "locked":false,
         "pinned":false,
         "cyclic":false,
         "autoSage":false,
         "creation":"2016-11-08T13:42:49.833Z",
         "lastBump":"2016-11-08T13:42:49.833Z",
         "thumb":"/.media/t_4eb26ffa7d0fc369d76df38bc241ec54-imagejpeg"}

         {"message":"We have our own Japanese internet radio station. Please drop by and listen to music with us.\n\nhttps://chiru.no/\n\n\n我々は独自の日本のインターネットラジオ局を持っています。立ち寄り、私たちと音楽を聴いてみてください。",
         "threadId":17121,
         "postCount":9,
         "page":1,
         "subject":null,
         "locked":false,
         "pinned":false,
         "cyclic":false,
         "autoSage":false,
         "creation":"2016-11-07T19:09:21.601Z",
         "lastBump":"2016-11-08T05:18:19.688Z",
         "thumb":"/.media/f10bd7a5ef9be449d14bc095d2dcbbfc-imagejpeg"},

         <div id="17232" class="catalogCell">
         <a class="linkThumb" href="/librejp/res/17232.html">
         <img src="/.media/t_4eb26ffa7d0fc369d76df38bc241ec54-imagejpeg"></a>
         <p class="threadStats">R:
         <span class="labelReplies">12</span>
         / I:
         <span class="labelImages">60</span>
         / P:
         <span class="labelPage">3</span>
         </p>
         <p>
         <span class="labelSubject">ランダム画像スレ</span></p>
         <div class="divMessage">とちゃきはPC内にいろんな画像を持ってるでしょう。前ダウンロードしたとか。ここで投稿して、何でも良い。</div>
         <span> </span>
         <a style="text-decoration: underline;" id="hidelibrejpThread17232">[X]</a>
         </div>
         */

        /*
         <div id="00" class="catalogCell">
         <a class="linkThumb" href="/">
         <img src="/"></a>
         <p class="threadStats">R:
         <span class="labelReplies">00</span>
         / I:
         <span class="labelImages">00</span>
         / P:
         <span class="labelPage">00</span>

         <span class="lockIndicator" title="Locked"></span>
         <span class="pinIndicator" title="Sticky"></span>
         <span class="cyclicIndicator" title="Cyclical Thread"></span>
         <span class="bumpLockIndicator" title="Bumplocked"></span>
         </p>
         <p>
         <span class="labelSubject">00</span></p>
         <div class="divMessage">00</div>
         <a style="text-decoration: underline;" id="hidelibrejpThread00">[X]</a>
         </div>
         */
        sthis.catalogCellTemplateHTML = '<div id="00" class="catalogCell"><a class="linkThumb" href="/"><img src="/"></a><p class="threadStats">R:<span class="labelReplies">00</span>/ I:<span class="labelImages">00</span>/ P:<span class="labelPage">00</span></p><p><span class="labelSubject">00</span></p><div class="divMessage">00</div></div>';
        sthis.catalogCellTemplateElement = undefined;

        /*
         ・hide ボタン実装
         ・消滅スレを消す
         */
        sthis.refreshCatalogCells =
            function()
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
                switch( this.readyState )
                {
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
                    switch( this.status )
                    {
                    case 304:
                        sthis.showRefreshStatus("not modified");
                        sthis.nowRefreshing = false;
                        return;
                    case 200:
                        sthis.showRefreshStatus("applying");
                        sthis.catalogLastModified = new Date( this.getResponseHeader("Last-Modified") );
                        sthis.applyJsonToCatalog( this.responseText, sthis.showRefreshStatus );
                        return;
                    default:
                        sthis.showRefreshStatus("error(HTTP "+this.status+")");
                        sthis.nowRefreshing = false;
                    };
                default:
                    sthis.nowRefreshing = false;
                    sthis.showRefreshStatus("error(unknown)");
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
            function( jsontext, msgfunc )
        {
            var json = undefined;
            try
            {
                json = JSON.parse( jsontext );
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

            iloops.exec();
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
            eltAr.href = '#';
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

            var eltLSB = document.createTextNode("[");
            var eltARefresh = document.createElement('A');
            eltARefresh.href = '#';
            eltARefresh.appendChild( document.createTextNode('Refresh') );
            eltARefresh.addEventListener('click', sthis.refreshCatalogCells);
            var eltRSB = document.createTextNode("]");

            var eltConfig = document.createElement('A');
            eltConfig.appendChild( document.createTextNode("⚙") );
            eltConfig.addEventListener('click', sthis.showCloseDivSettings );

            var eltStatus = document.createElement('SPAN');
            eltStatus.id = sthis.REFRESH_STATUS_ID;

            eltSpan.appendChild( eltASo );
            eltSpan.appendChild( eltAr );
            eltSpan.appendChild( eltAtby );
            eltSpan.appendChild( eltSelect );

            eltSpan.appendChild( eltLSB );
            eltSpan.appendChild( eltARefresh );
            eltSpan.appendChild( eltRSB );

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
     * EtcForPosts                    *
     **********************************/
    function modEtcForPosts()
    {
        if( undefined === window.toshakiii )
        {   window.toshakiii = {}; };
        if( undefined === window.toshakiii.settings )
        {   window.toshakiii.settings = {}; };

        var efpthis = {};
        var utils = window.toshakiii.utils;

        window.toshakiii.etcForPosts = efpthis;

	efpthis.postCellOnLoadHooks = [];
        efpthis.divPostsMutationObserver = undefined;

        efpthis.startObserveDivPosts =
            function()
        {
            var divPostsList = document.getElementsByClassName('divPosts');
            if( 0 >= divPostsList.length )
            {
                return;
            };
            var divPosts = divPostsList[0];
            efpthis.divPostsMutationObserver =
                new MutationObserver( efpthis.onRefresh );
            efpthis.divPostsMutationObserver.observe( divPosts, { childList: true } );
        };


        /*efpthis.enableEmbedYoutubeButton =*/
        efpthis.overrideEmbedYoutubeButton =
            function( youtube_wrapper )
        {
            var embedButtons = youtube_wrapper.getElementsByTagName('A');
            if( 0 >= embedButtons.length )
            {
                return;
            };
            var embedButton = embedButtons[0];
            embedButton.onclick = null;
            embedButton.addEventListener("click", efpthis.onYoutubeEmbedButtonClick );
            embedButton.replaceChild( document.createTextNode("embeD") , embedButton.firstChild );
        };

        efpthis.overrideEmbedNiconicoButton =
            function( niconico_wrapper )
        {
            var embedButtons = niconico_wrapper.getElementsByTagName('A');
            if( 0 >= embedButtons.length )
            {
                return;
            };
            var embedButton = embedButtons[0];
            embedButton.onclick = null;
            embedButton.addEventListener("click", efpthis.onNiconicoEmbedButtonClick );
            embedButton.replaceChild( document.createTextNode("embeD") , embedButton.firstChild );
        };

        efpthis.onYoutubeEmbedButtonClick =
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
                    .replace(/watch\?v=/, 'embed/');
            if( "https:" == location.protocol )
            {
                youtubeUri = youtubeUri.replace(/^http:/,"https:");
            };
            var iframe = document.createElement('IFRAME');
            iframe.width = 560;
            iframe.height = 315;
            iframe.frameBorder = 0;
            iframe.allowFullScreen = true;
            iframe.src = youtubeUri;
            this.parentElement.appendChild( document.createElement('BR') );
            this.parentElement.appendChild(iframe);
            this.replaceChild( document.createTextNode("closE"), this.firstChild );
            ev.preventDefault();
            return false;
        };

        efpthis.getAncestorPostCellId =
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

        efpthis.onNiconicoEmbedButtonClick =
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
                div.appendChild( document.createTextNode("https から http へはつなげられないから、") );
                div.appendChild( document.createElement('BR') );
                div.appendChild( document.createTextNode("ニコニコ動画の埋め込みはできません。") );
                div.appendChild( document.createElement('BR') );
                div.appendChild( document.createTextNode("http から http へはつなげられるから") );
                div.appendChild( document.createElement('BR') );
                div.appendChild( document.createTextNode("埋め込みで見たければ http のここへ") );
                div.appendChild( document.createElement('BR') );
                div.style.border = "1px solid red";
                var httpthreUri = location.href.replace(/^https/,"http");
                var httpthreLink = document.createElement('A');
                httpthreLink.href = httpthreUri + "#" + efpthis.getAncestorPostCellId( this );
                httpthreLink.appendChild( document.createTextNode( httpthreLink.href ) );
                div.appendChild( httpthreLink );
                this.parentElement.appendChild( document.createElement('BR') );
                this.parentElement.appendChild( div );

                this.replaceChild( document.createTextNode("closE"), this.firstChild );
                ev.preventDefault();
                return false;
            };
            var videoUri = this.href.replace(/nico.ms/,"embed.nicovideo.jp/watch")
                    .replace(/www\.nicovideo/,"embed.nicovideo");
            var iframe = document.createElement('IFRAME');

            iframe.width = 560;
            iframe.height = 315;
            iframe.frameBorder = 0;
            iframe.allowFullScreen = true;
            iframe.src = videoUri;
            iframe.alt = "https で見てる人はニコニコの埋め込みはできません。\n" +
                "Google Chrome の人の場合は、アドレスバー右に出て来る「盾を破った」アイコンをクリックすると、\n" +
                "埋め込めます。";
            this.parentElement.appendChild( document.createElement('BR') );
            this.parentElement.appendChild( iframe );
            this.replaceChild( document.createTextNode("closE"), this.firstChild );
            ev.preventDefault();
            return false;
        };

        efpthis.onRefresh = function( mutationRecords, mutationObserver)
        {
            var mrs = mutationRecords;
            for( var mrIdx = 0, mrLen = mrs.length; mrIdx < mrLen ; ++mrIdx )
            {
                var mr = mrs[ mrIdx ];
                for( var anIdx = 0, anLen = mr.addedNodes.length; anIdx < anLen ; ++anIdx )
                {
                    var addedNode = mr.addedNodes[ anIdx ];
                    var youtube_wrappers = addedNode.getElementsByClassName("youtube_wrapper");
                    for( var ywIdx = 0, ywLen = youtube_wrappers.length; ywIdx < ywLen ; ++ywIdx )
                    {
                        efpthis.overrideEmbedYoutubeButton( youtube_wrappers[ ywIdx ] );
                    };
                    var niconico_wrappers = addedNode.getElementsByClassName("niconico_wrapper");
                    for( var nwIdx = 0, nwLen = niconico_wrappers.length; nwIdx < nwLen ; ++nwIdx )
                    {
                        efpthis.overrideEmbedNiconicoButton( niconico_wrappers[ nwIdx ] );
                    };
		    var hooks = efpthis.postCellOnLoadHooks;
		    for( var hkIdx = 0, hkLen = hooks.length; hkIdx < hkLen ; ++hkIdx )
		    {
			if( 0 <= addedNode.className.indexOf('postCell') )
			{
			    hooks[ hkIdx ]( addedNode );
			};
		    };
                };
            };


            efpthis.localizeDateTimeLabelAll();
        };


        efpthis.timezoneOffset = 0;

        efpthis.localDaysList =
            { 'undefined': ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
              ,'-540' : ["日","月","火","水","木","金","土"] };

        efpthis.getDayText =
            function( day, dayTextList )
        {
            return dayTextList[ day ];
        };

        efpthis.dateFormatA =
            function( d, dayTextList, useUTC )
        {
            /* 2016/12/31(Sat)13:59:59 形式 */
            var leftpad = utils.leftpad;
            var year, month, date, hours, minutes, seconds, day;

            if( useUTC )
            {
                [ year, month, date, hours, minutes, seconds ] =
                    [ d.getUTCFullYear().toString(),
                      (d.getUTCMonth() + 1).toString(),
                      d.getUTCDate().toString(),
                      d.getUTCHours().toString(),
                      d.getUTCMinutes().toString(),
                      d.getUTCSeconds().toString() ];
                day = efpthis.getDayText( d.getUTCDay(), dayTextList );;
            }
            else
            {
                [ year, month, date, hours, minutes, seconds ] =
                    [ d.getFullYear().toString(),
                      (d.getMonth() + 1).toString(),
                      d.getDate().toString(),
                      d.getHours().toString(),
                      d.getMinutes().toString(),
                      d.getSeconds().toString() ];
                day = efpthis.getDayText( d.getDay(), dayTextList );;
            };


            var text =
                    year + "/"
                    + leftpad( month, 2, "0") + "/"
                    + leftpad( date , 2, "0") +
                    "(" + day + ")"
                    + leftpad( hours, 2, "0") + ":" +
                    leftpad( minutes, 2, "0") + ":" +
                    leftpad( seconds, 2, "0");
            return text;
        };

        efpthis.localizeDateTimeLabel =
            function( labelCreated )
        {
            if( labelCreated.hasAttribute("data-original-date-text") )
            {
                return false;
            };

            var originalText = labelCreated.innerHTML;

            labelCreated.setAttribute("data-original-date-text", originalText);

            var month, date, year, hours, minutes, seconds;
            var matches = originalText.match(/(..)\/(..)\/(....) \(...\) (..):(..):(..)/);
            if( null == matches )
            {
                console.log( originalText + ":" + originalText );
                return true;
            };
            month   = matches[1];
            date    = matches[2];
            year    = matches[3];
            hours   = matches[4];
            minutes = matches[5];
            seconds = matches[6];

            if( seconds == undefined )
            {
                return true;
            };
            var d = new Date( Date.UTC( year, parseInt(month) - 1, date, hours, minutes, seconds) );
            var local = efpthis.dateFormatA( d, efpthis.localDaysList[ efpthis.timezoneOffset ] );
            labelCreated.replaceChild( document.createTextNode( local ),
                                       labelCreated.firstChild );
            var title_text = "original: " + originalText;
            if( efpthis.timezoneOffset != -540 )
            {
                var jaD = new Date( Date.UTC( year, parseInt(month) - 1, date, hours,
                                              540 + parseInt(minutes), seconds) );
                var jaT = efpthis.dateFormatA( jaD, efpthis.localDaysList[ -540 ], true );
                title_text += "\n日本:" + jaT;
            };
            labelCreated.title = title_text;
            return true;
        };

        efpthis.localizeDateTimeLabelAll =
            function()
        {
            var IntermittentLoops = utils.IntermittentLoops;
            var iloops = IntermittentLoops();
            var labelCreatedList;
            var idx = 0;
            var offset = efpthis.timezoneOffset;

            iloops.push( function(){
                labelCreatedList = document.getElementsByClassName('labelCreated');
                idx = labelCreatedList.length - 1;
            } ).push( function(){
                if( -1 >= idx )
                {
                    return false;
                };
                var continue_ = efpthis.localizeDateTimeLabel( labelCreatedList[ idx ] );
                --idx;
                return continue_;
            } ).exec();
        };

        /*efpthis.iframeLazyLoad =
            function()
        {
            var elts = Array.prototype.slice.call(document.getElementsByTagName('IFRAME'));

            elts.forEach(function(elt) {
                var src = elts.getAttribute('src');
                elt.removeAttribute('src');
                elt.alt = src;

                function onclickf()
                {
                    elt.setAttribute('src', src );
                    elt.removeEventListener('click', onclickf);
                };
                elt.addEventListener('click', onclickf );
            });
        };*/

        efpthis.overrideWrapperAll =
            function()
        {
            var IntermittentLoops = utils.IntermittentLoops;
            var iloops = IntermittentLoops();
            var idx = 0;
            var youtubeWrappers;
            var niconicoWrappers;

            /*
             意味なかった。
            var iframes;
            iloops.push( function(){
                iframes = document.getElementsByTagName('IFRAME');
                idx = iframes.length - 1;
            } ).push( function(){
                if( -1 >= idx )
                {
                    return false;
                };
                var iframe = iframes[ idx ];
                if( 0 != iframe.src.indexOf("https://www.youtube.com/")  )
                {
                    return true;
                };
                var span = document.createElement('SPAN');
                var anchor = document.createElement('A');
                span.className = 'youtube_wrapper';
                anchor.href = iframe.src;
                anchor.appendChild( document.createTextNode( "embeD" ) );
                span.appendChild( document.createTextNode( iframe.src + " [" ) );
                span.appendChild( anchor );
                span.appendChild( document.createTextNode( " ]" ) );
                iframe.parentElement.replaceChild( span, iframe );
                --idx;
                return true;
            } );
             */
            iloops.push( function(){
                youtubeWrappers = document.getElementsByClassName('youtube_wrapper');
                idx = youtubeWrappers.length - 1;
            } ).push( function(){
                if( -1 >= idx )
                {
                    return false;
                };
                efpthis.overrideEmbedYoutubeButton( youtubeWrappers[ idx ] );
                --idx;
                return true;
            } ).push( function(){
                niconicoWrappers = document.getElementsByClassName('niconico_wrapper');
                idx = niconicoWrappers.length - 1;
            } ).push( function(){
                if( -1 >= idx )
                {
                    return false;
                };
                efpthis.overrideEmbedNiconicoButton( niconicoWrappers[ idx ] );
                --idx;
                return true;
            } ).exec();
        };

        efpthis.insertFakeRefreshButton =
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

        efpthis.presetImageGeometry =
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
            } ).exec();

        };

        efpthis.addConsecutiveNumberStyle =
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
                "div.divPosts div.postCell{counter-increment:consecutiveNumber;}" +
                "div.divPosts div.postCell div.innerPost:before{content:counter(consecutiveNumber);}";
            document.head.appendChild( style );
        };

        efpthis.disable =
            function()
        {
            var style = document.getElementsById("postsConsecutiveNumberStyle");
            if( null != style )
            {
                style.parentElement.removeChild( style );
            }
        };
        efpthis.enable =
            function()
        {
            /*意味ない : efpthis.iframeLazyLoad();*/
            efpthis.startObserveDivPosts();
            setTimeout( efpthis.localizeDateTimeLabelAll, 0 );
            setTimeout( efpthis.overrideWrapperAll, 0 );
            setTimeout( efpthis.addConsecutiveNumberStyle, 0 );
        };
        efpthis.trigger = function()
        {
            efpthis.timezoneOffset = new Date().getTimezoneOffset();
            efpthis.enable();
        };
        return efpthis;
    };

    /**********************************
     * MultiPopup                    *
     **********************************/
    function modMultiPopup()
    {
        if( undefined === window.toshakiii )
        {   window.toshakiii = {}; };
        if( undefined === window.toshakiii.settings )
        {   window.toshakiii.settings = {}; };

        var mthis = {};
        var settings = window.toshakiii.settings;
        var utils = window.toshakiii.utils;

        window.toshakiii.multiPopup = mthis;
	var etcForPosts = window.toshakiii.etcForPosts;

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
	    switch( popupInfo['phase'] )
	    {
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
		uri = pathname.replace(/\/res\/[^/]*/,"/preview/") + hash.substring(2) + ".html";
	    }
	    else
	    {
		uri = pathname.replace(/\/res\/[^/]*/,"/preview/") + hash.substring(1) + ".html";
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
		case 0: /* TODO: show messages */
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

        mthis.showPopup =
            function( popupInfo, postCell, errorMessage )
        {
	    var quoteLink = popupInfo['quoteAnchor'];
            if( undefined == postCell && undefined == errorMessage )
            {
                mthis.lookForPostCell( popupInfo, mthis.showPopup );
                return;
            };
            if( undefined != errorMessage )
            {
                postCell = document.createElement('DIV');
                postCell.appendChild( document.createTextNode(errorMessage) );
            };
	    var originElement = mthis.getRelatedDivMessage( quoteLink );
	    if( null == originElement )
	    {
		originElement = quoteLink;
	    };

	    var quoteblock;
	    if( undefined != popupInfo['element'] )
	    {
		if( null == popupInfo['element'].firstChild )
		{
		    popupInfo['element'].appendChild( postCell );
		}
		else
		{
		    popupInfo['element'].replaceChild( postCell, popupInfo['element'].firstChild );
		};
		quoteblock = popupInfo['element'];
	    }
	    else
	    {
		quoteblock = document.createElement('DIV');
		quoteblock.appendChild( postCell );
	    };

            quoteblock.className = "tskQuoteblock";
	    var uid = popupInfo['uid'];
            mthis.overridePostCellQuotePopups( postCell,
					       function( e ){
						   mthis.setUidOfPopupParent( e, uid );
					       } );

	    quoteblock.addEventListener("mouseout" , function(){
		mthis.startCountdownForClosePopup( popupInfo ); } );

	    quoteblock.addEventListener("mousemove", function(){
		mthis.extendExpirationDate( popupInfo );
		return true; } );

	    quoteblock.addEventListener("click",     function(){
		mthis.extendExpirationDate( popupInfo );
		return true; } );

            quoteblock.style.position = "absolute";
            quoteblock.style.paddingTop = "2px";
            quoteblock.style.paddingLeft = "2px";
            quoteblock.style.paddingRight = "2px";
            quoteblock.style.paddingBottom = "2px";
            quoteblock.style.border = "1px solid " + utils.getBodyForegroundColor();
            quoteblock.style.backgroundColor = utils.getBodyBackgroundColor();

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
	    if( undefined != targetPosition )
	    {
		left = targetPosition.x;
		top  = targetPosition.y;
	    };
            var tmpRight  = left + width;
            var tmpBottom = top  + height;

            if( scrollRight < tmpRight )
            {
                left = scrollRight - width;
            };
            if( scrollBottom < tmpBottom )
            {
                top = scrollBottom - height;
            };

	    quoteblock.style.top  = top + "px";
	    quoteblock.style.left = left + "px";

	    var parentUid = mthis.getUidOfPopupParent( quoteLink );
	    if( undefined != parentUid )
	    {
		popupInfo['parent']  = parentUid;
		var parentPopupInfo = mthis.popups[ parentUid ];
		if( undefined != parentPopupInfo )
		{
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

	mthis.DateToLastCheckMouseIn = 0;
	mthis.onBodyMouseMove =
	    function( event )
	{
	    var now = (+new Date());
	    var intervalToCheck = 100;
	    if( now > ( intervalToCheck + mthis.DateToLastCheckMouseIn ) )
	    {
		mthis.checkMouseIn( event );
		mthis.DateToLastCheckMouseIn = now;
	    };

	    mthis.mouseClientPos = {x:event.clientX, y:event.clientY};
	    return;
	};
	
	mthis.checkMouseIn =
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
		    ( rect2.left   <= mcx &&    
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
	    document.body.addEventListener("click"    , mthis.checkMouseIn );
	    document.body.addEventListener("mousemove", mthis.onBodyMouseMove );
	};
	mthis.removeBodyEvents =
	    function()
	{
	    document.body.removeEventListener("click"    , mthis.checkMouseIn );
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
	    /* etcForPostsの監視対象は .divPosts 、Popup の挿入場所は .divPosts の親の親の中。
	     * だから Popup 挿入時に冗長呼び出しにはならない */
	    etcForPosts.postCellOnLoadHooks.push( mthis.overridePostCellQuotePopups );
	    
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
	    } ).exec();
	};
	mthis.disable = function()
	{
	    mthis.removeBodyEvents();
	};

	return mthis;
    };


    /**********************************
     * main                           *
     **********************************/
    function main()
    {
	if( false )
	{
	    var script = document.createElement('SCRIPT');
	    script.innerText =
		"try{("+modUtils        .toString() +")().trigger();}catch(e){};" +
		"try{("+modEtcForPosts  .toString() +")().trigger();}catch(e){};" +
		"try{("+modCatalogSorter.toString() +")().trigger();}catch(e){};" +
		"try{("+modFilePreview  .toString() +")().trigger();}catch(e){};" +
		"try{("+modMultiPopup   .toString() +")().trigger();}catch(e){};" +
		"";
	    document.head.appendChild( script );
	}
	else if( 0 <= window.navigator.userAgent.toLowerCase().indexOf("chrome") )
	{
	    location.href = "javascript:" +
		"try{("+modUtils        .toString() +")().trigger();}catch(e){};" +
		"try{("+modEtcForPosts  .toString() +")().trigger();}catch(e){};" +
		"try{("+modCatalogSorter.toString() +")().trigger();}catch(e){};" +
		"try{("+modFilePreview  .toString() +")().trigger();}catch(e){};" +
		"try{("+modMultiPopup   .toString() +")().trigger();}catch(e){};" +
		"";
	}
	else
	{
	    modUtils().trigger();
	    modEtcForPosts().trigger();
	    modFilePreview().trigger();
	    modCatalogSorter().trigger();
	    modMultiPopup().trigger();
	};
    };
    main();
})();

/*
演技用
(function(){
    if( location.protocol == "https:" )
    {
	var elts = document.getElementsByClassName("postCell");
	for( var i = elts.length - 1 ; -1 < i ; --i )
	{
	    var elt = elts[ i ];
	    elt.parentElement.removeChild( elt );
	};
	setTimeout( function(){ location.href = "javascript: window.lastReplyId=0;"; }, 100 );
    };
})();
*/
/*window.refreshPosts(true);*/