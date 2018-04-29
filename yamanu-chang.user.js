// ==UserScript==
// @name        yamanu-chang:endchan用script
// @author      to_sha_ki_ii
// @namespace   to_sha_ki_ii
//
// @include     http://endchan.xyz*
// @include     https://endchan.xyz*
// @include     http://endchan.net*
// @include     https://endchan.net*
// @include     http://infinow.net*
// @include     https://infinow.net*
// @exclude     */.media/*
//
// @include     /https?://endchan5doxvprs5\.onion/.*$/
// @include     /https?://s6424n4x4bsmqs27\.onion/.*$/
// @include     /https?://endchan5doxvprs5\.onion.to/.*$/
// @include     /https?://s6424n4x4bsmqs27\.onion.to/.*$/
//
// @run-at      document-start
//
// @version     2.49
// @description endchan用の再帰的レスポップアップ、Catalogソート、添付ファイルプレビュー、色々
// @grant       none
// ==/UserScript==


/**************************************************
 *  yamanu-chang
 *  Copyright (c) 2018 "to_sha_ki_ii"
 *  This software is released under the MIT License.
 *  http://opensource.org/licenses/mit-license.php
 **************************************************
 *  CSSを利用しました : http://endchan.xyz/librejp/res/5273.html#8133
 */

/*******************************
 * yamanu-chang(山ぬちゃん)です *
 *******************************/

/*
 * ・1行100文字幅
 * ・セミコロンは全ての場所につける。
 * ・"string_as_symbol"
 * ・'string as message'
 * ・文字列定数は直接書く。変数を媒介しない。
 */

/*
 * TODO:
 * ・sendReplyData の hack をオフにできるオプションを追加すること。
 * ・Youtubeのリンクを有効にする補助機能を盛ること
 * ・再生開始機能を盛ること
 */

(function() {

  function modYamanuchang() {
    window.toshakiii = window.toshakiii || {};
    var utils       = window.toshakiii.utils       = window.toshakiii.utils       || {};
    var settings    = window.toshakiii.settings    = window.toshakiii.settings    || {};
    var filePreview = window.toshakiii.filePreview = window.toshakiii.filePreview || {};
    var feWrapper   = window.toshakiii.feWrapper   = window.toshakiii.feWrapper   || {};
    var catalogSort = window.toshakiii.catalogSort = window.toshakiii.catalogSort || {};
    var etCetera    = window.toshakiii.etCetera    = window.toshakiii.etCetera    || {};
    var multiPopup  = window.toshakiii.multiPopup  = window.toshakiii.multiPopup  || {};

    /*********
     * utils *
     *********/
    utils.CompulsoryProcessing = function(initFunc) {
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

    utils.CompulsoryProcessing.prototype.setObservingElement =
      function setObservingElement(element) {
        this.observingElement = element;
      };
    utils.CompulsoryProcessing.prototype.setObservingOptions =
      function setObservingOptions(options) {
        this.observingOptions = options;
      };
    utils.CompulsoryProcessing.prototype.setFuncEnumExistingTargets =
      function setFuncEnumExistingTargets(value) {
        this.funcEnumExistingTargets = value;
      };
    utils.CompulsoryProcessing.prototype.setPreProc =
      function setPreProc(value) {
        this.preProc = value;
      };
    utils.CompulsoryProcessing.prototype.processExistingTargets =
      function processExistingTargets( proc, procAfter) {
        if (null === document.body) {
          document.addEventListener("DOMContentLoaded", this.processExistingTargets.bind(this, proc, procAfter));
          return;
        };

        if (undefined === proc) {
          procAfter();
          return;
        };

        if (undefined === this.funcEnumExistingTargets) {
          return;
        };

        var break_ = false;
        var continue_ = true;
        var iloops = utils.IntermittentLoops();
        var obj = this;
        var tlist, idx;

        iloops.push( function() {
          tlist = obj.funcEnumExistingTargets();
          idx = tlist.length;

        } ).push( function() {
          --idx;
          if (-1 >= idx) {
            return break_;
          };

          proc( tlist[ idx ] );
          return continue_;

        } ).push( function() {
          if (undefined !== procAfter) {
            procAfter();
          };
        } ).beginAsync();
      };

    utils.CompulsoryProcessing.prototype.startApply =
      function startApply() {
        if (null === document.body) {
          document.addEventListener("DOMContentLoaded", this.startApply.bind(this));
          return;
        };

        if (undefined !== this.initFunc) {
          this.initFunc(this);
          this.initFunc = undefined;
        };
        if (undefined === this.mutationObserver &&
            this.observingElement !== undefined &&
            this.observingOptions !== undefined) {
          this.mutationObserver = new MutationObserver( this.defaultCallback.bind(this) );
          this.mutationObserver.observe( this.observingElement, this.observingOptions );
        };
      };

    utils.CompulsoryProcessing.prototype.stopApply =
      function stopApply() {
        if (undefined !== this.mutationObserver) {
          this.mutationObserver.disconnect();
          this.mutationObserver = undefined;
        };
      };

    utils.CompulsoryProcessing.prototype.defaultCallback =
      function defaultCallback( mutationRecords, mutationObserver) {
        if (undefined === this.preProc) {
          this.process(mutationRecords);
          this.processAfter(mutationRecords);
          return;
        };

        var tlist, tidx;
        var break_ = false;
        var continue_ = true;
        var iloops = utils.IntermittentLoops();
        var obj = this;

        iloops.push(function() {
          tlist = obj.preProc( mutationRecords, mutationObserver );
          tidx = tlist.length;
        } ).push( function() {
          --tidx;
          if (-1 >= tidx) {
            return break_;
          };
          obj.process(tlist[tidx]);
          return continue_;
        } ).push( function() {
          obj.processAfter(mutationRecords);
        } ).beginAsync();
      };

    utils.CompulsoryProcessing.prototype.process =
      function process(target) {
        for (var pidx = 0, plen = this.processes.length; pidx < plen ; ++pidx) {
          this.processes[ pidx ](target);
        };
      };

    /* 名前と設計を再考すること */
    utils.CompulsoryProcessing.prototype.processAfter =
      function processAfter() {
        for (var pidx = 0, plen = this.processesAfter.length; pidx < plen ; ++pidx) {
          this.processesAfter[ pidx ]();
        };
      };

    utils.CompulsoryProcessing.prototype.appendCP =
      function appendCP( func, noStartApply, noApplyToExistingTargets) {
        this.processes.push(func);
        if (! noStartApply) {
          this.startApply();
        };
        if (! noApplyToExistingTargets) {
          this.processExistingTargets(func, undefined);
        };
        return func;
      };

    utils.CompulsoryProcessing.prototype.removeCP =
      function removeCP( func, noStopApply) {
        for (var idx = this.processes.length - 1; -1 < idx ; --idx) {
          if (this.processes[ idx ] === func) {
            this.processes.splice( idx, 1 );

            if (! noStopApply &&
                0 === this.processes.length &&
                0 === this.processesAfter.length) {

              this.stopApply();
            };
            return func;
          };
        };
        return null;
      };

    utils.CompulsoryProcessing.prototype.appendAfterCP = function appendAfterCP( func, noStartApply,
        noApplyToExistingTargets) {

      this.processesAfter.push(func);

      if (! noStartApply) {
        this.startApply();
      };

      if (! noApplyToExistingTargets) {
        this.processExistingTargets(undefined, func);
      };
      return func;
    };

    utils.CompulsoryProcessing.prototype.removeAfterCP = function removeCP( func, noStopApply) {
      for (var idx = this.processesAfter.length - 1; -1 < idx ; --idx) {
        if (this.processesAfter[ idx ] === func) {
          this.processesAfter.splice( idx, 1 );
          if (! noStopApply &&
              0 === this.processes.length &&
              0 === this.processesAfter.length) {
            this.stopApply();
          };
          return func;
        };
      };
      return null;
    };

    utils.CompulsoryProcessing.prototype.preProc_enumAddedNodes =
      function preProc_enumAddedNodes(mutationRecords) {
        var tlist = [];
        for (var mrIdx = 0, mrLen = mutationRecords.length; mrIdx < mrLen ; ++mrIdx) {
          var mr = mutationRecords[ mrIdx ];
          for (var anIdx = 0, anLen = mr.addedNodes.length; anIdx < anLen ; ++anIdx) {
            tlist.push( mr.addedNodes[ anIdx ] );
          };
        };
        return tlist;
      };

    utils.noop = function(){};

    utils.endsWith = function endsWith( str, suffix) {
      return -1 !== str.indexOf(suffix, str.length - suffix.length);
    };

    utils.foreEachElementDescendants = function foreEachElementDescendants( element, func) {
      var children, idx, len;
      for (children = element.children, idx = 0, len = element.children.length; idx < len ; ++idx) {
        if (! func( children[ idx ] )) {
          return false;
        };
      };
      for (children = element.children, idx = 0, len = element.children.length; idx < len ; ++idx) {
        if (! foreEachElementDescendants( children[ idx ], func )) {
          return false;
        };
      };
      return true;
    };

    utils.contain = function( array, item) {
      for (var arIdx in array) {
        if (item != array[ arIdx ]) {
          return true;
        };
      };
      return false;
    };

    utils.getFirstLanguage = function() {
      return (window.navigator.languages && window.navigator.languages[0]) ||
        window.navigator.language ||
        window.navigator.userLanguage ||
        window.navigator.browserLanguage;
    };

    utils.getBodyBackgroundColor = function() {
      var cssProperties = window.getComputedStyle(document.body);
      var backgroundColor = cssProperties["background-color"];
      if (backgroundColor == null) {
        return "rgb(255,255,255)";
      };
      return backgroundColor;
    };

    utils.getBodyForegroundColor = function() {
      var cssProperties = window.getComputedStyle(document.body);
      var foregroundColor = cssProperties["color"];
      if (foregroundColor == null) {
        return "rgb(0,0,0)";
      };
      return foregroundColor;
    };

    utils.getScrollTop = function() {
      var v = document.documentElement.scrollTop;
      if (0 == v) {
        return document.body.scrollTop;
      };
      return v;
    };

    utils.getScrollLeft = function() {
      var v = document.documentElement.scrollLeft;
      if (0 == v) {
        return document.body.scrollLeft;
      };
      return v;
    };

    utils.replaceItem = function( array, fromItem, toItem) {
      for (var idx = 0, len = array.length ; idx < len ; ++idx) {
        if (array[ idx ] === fromItem) {
          array[ idx ] = toItem;
        };
      };
      return array;
    };

    utils.leftpad = function( str, n, char) {
      str = str.toString();
      if (n <= str.length) {
        return str;
      };
      if (undefined == char) {
        char = " ";
      };
      return char.repeat( n - str.length ) + str;
    };

    utils.removeIdAll = function removeIdAll(element) {
      element.id = "";
      for (var i in element.children) {
        if (undefined != element.children) {
          removeIdAll( element.children[ i ] );
        };
      };
      return element;
    };

    utils.removePostCells = function() {
      var postCellList = document.getElementsByClassName('postCell');
      for (var idx = postCellList.length - 1; -1 < idx ; --idx) {
        postCellList[idx].parentElement.removeChild( postCellList[idx] );
      };
      window.lastReplyId = 0;
    };

    utils.differenceSet = function( lhs, rhs) {
      var r = {};
      for (var key in lhs) {
        if (! key in rhs) {
          r[ key ] = lhs[ key ];
        };
      };
      return r;
    };

    utils.getYearMonthDateDayHoursMinutesSeconds =
      function( dateObj , useUTC) {
        /* return type: int array */
        /* return value: [ year, month, date, day, hours, minutes, seconds] */
        /*   month: 0 origin */
        if (useUTC) {
          return [
            dateObj.getUTCFullYear(),
            dateObj.getUTCMonth(),
            dateObj.getUTCDate(),
            dateObj.getUTCDay(),
            dateObj.getUTCHours(),
            dateObj.getUTCMinutes(),
            dateObj.getUTCSeconds() ];
        };
        return [
          dateObj.getFullYear(),
          dateObj.getMonth(),
          dateObj.getDate(),
          dateObj.getDay(),
          dateObj.getHours(),
          dateObj.getMinutes(),
          dateObj.getSeconds() ];
      };

    /* IntermittentLoops { */
    utils.IntermittentLoops = function() {
      return new utils.IntermittentLoops__();
      /* ・`IntermittentLoops' enables asynchronous loop execution. *
       * ・makes setTimeout-recursion easier to write.              */
    };

    utils.IntermittentLoops__ = function() {
      this.loopFuncList = [];
    };

    utils.IntermittentLoops__.prototype.push = function(f) {
      this.loopFuncList.push(f);
      return this;
    };

    /* note: the following setTimeout( [function], 0 )   */
    /*       I don't expect 0ms.                         */
    /*       with many browsers 0 stands for about 40ms. */
    utils.IntermittentLoops__.prototype.beginAsync = function() {
      var ilThis = this;
      var loopFuncList = ilThis.loopFuncList;
      var wrappedLoopFuncList = new Array(loopFuncList.length);
      var index = loopFuncList.length - 1;

      /* loop for prepare wrappedLoopFuncList */
      for (; -1 < index ; --index) {
        function createWrappedLoopFunc() {

          var currentLoopFunc = loopFuncList[index];

          var nextLoopFunc = ilThis.doNothing;;
          if (index + 1 < wrappedLoopFuncList.length) {
            nextLoopFunc = wrappedLoopFuncList[ index + 1 ];
          };

          function wrappedLoopFunc() {
            if (currentLoopFunc()) {
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

    utils.IntermittentLoops__.prototype.doNothing = function() {};
    /* } IntermittentLoops */

    utils.elementUidCounter = 0;
    utils.getElementUniqueId = function(element) {
      if (element === element.thisself) {
        /* thisself フィールドが element 自身を示すなら "data-tsk-uid" も有効に設定されているはず */
        return element.getAttribute("data-tsk-uid");
      };

      ++utils.elementUidCounter;

      var uid = "tskuid" + utils.elementUidCounter + "__";
      element.setAttribute( "data-tsk-uid", uid );
      element.thisself = element;

      return uid;
    };

    utils.getElementsByUniqueId = function(euid) {
      var query = '[data-tsk-uid="' + euid + '"]';
      return document.querySelectorAll(query);
    };

    utils.toMarkElementDiscarded = function(element) {
      element.setAttribute("data-tsk-discarded", "1");
    };

    utils.getElementByClassNameFromAncestor = function(element, className) {
      for (; element !== null; element = element.parentElement) {
        for( var clIdx = 0, clLen = element.classList.length; clIdx < clLen; ++clIdx) {
          if (className === element.classList[clIdx]) {
            return element;
          };
        };
      };
      return null;
    };

    utils.getCookie = function(Name) {
      var re = new RegExp(Name + "=[^;]+", "i");
      if (document.cookie.match(re)) {
        return document.cookie.match(re)[0].split("=")[1];
      };
      return null;
    };

    utils.setCookie = function(name, value, days) {
      var expireDate=new Date();
      var expstring=(typeof days!="undefined")?expireDate.setDate(expireDate.getDate()+parseInt(days)):expireDate.setDate(expireDate.getDate()-5);
      document.cookie=name+"="+value+"; expires="+expireDate.toGMTString()+"; path=/";
    };

    utils.deleteCookie = function(name) {
      utils.setCookie(name, "", -1);
    };

    utils.getSetting = function(Name) {
      if (localStorage) {
        return localStorage.getItem(Name);
      }
      var re = new RegExp(Name + "=[^;]+", "i");
      if (document.cookie.match(re)) {
        return document.cookie.match(re)[0].split("=")[1];
      };
      return null;
    };

    utils.setSetting = function(name, value, days) {
      if (localStorage) {
        localStorage.setItem(name, value);
      } else {
        var expireDate = new Date();
        var expstring = (typeof days!="undefined") ?
              expireDate.setDate(expireDate.getDate() + parseInt(days)) :
              expireDate.setDate(expireDate.getDate()-5 );
        document.cookie = name + "=" + value + "; expires=" + expireDate.toGMTString() + "; path=/";
      };
    };

    utils.deleteSetting = function(name) {
      if (localStorage) {
        localStorage.removeItem(name);
      };
      utils.setCookie(name, "", -1);
    };

    utils.createTextLink = function(uri, text) {
      if (undefined === text) {
        text = uri;
      };

      var anchor = document.createElement("A");
      anchor.appendChild( document.createTextNode(text) );
      anchor.href = uri;
      return anchor;
    };

    utils.trigger = function() {
      return;
    };


    /**********************************
     * settings                       *
     **********************************/

    /*                         [<keynames>...] */
    settings.miniDataKeyList = [ 'ThreadAutoRefresh' ];

    settings.getMiniDataIndex = function(keyname) {

      for (var index = 0, length = settings.miniDataKeyList.length;
           index < length; ++index) {

        if (keyname === settings.miniDataKeyList[ index ]) {
          return index;
        };
      };
      return -1;
    };

    settings.setMiniDataContainer = function(value) {
      localStorage.setItem('toshakiii.settings.miniData', JSON.stringify(value) );
    };

    settings.getMiniDataContainer = function() {
      var miniDataStr = localStorage.getItem('toshakiii.settings.miniData');
      var miniData, mdIdx, mdLen;
      if (null == miniDataStr) {
        miniData = Array( settings.miniDataKeyList.length );
        for (mdIdx = 0, mdLen = miniData.length; mdIdx < mdLen ; ++mdIdx) {
          miniData[ mdIdx ] = 0;
        };
      } else {
        miniData = JSON.parse(miniDataStr);
        for (mdIdx = miniData.length, mdLen = settings.miniDataKeyList.length;
             mdIdx < mdLen; ++mdIdx) {
          miniData[ mdIdx ] = 0;
        };
      };
      return miniData;
    };

    settings.getMiniData = function(keyname) {
      var index = settings.getMiniDataIndex(keyname);
      var miniDataContainer = settings.getMiniDataContainer();

      if (0 > index) {
        return null;
      };

      if (index < (miniDataContainer.length)) {
        return miniDataContainer[ index ];
      };

      return null;
    };
    settings.setMiniData = function( keyname, value) {
      var index = settings.getMiniDataIndex(keyname);
      if (0 > index) {
        return null;
      };
      var miniDataContainer = settings.getMiniDataContainer();
      miniDataContainer[ index ] = value;

      settings.setMiniDataContainer(miniDataContainer);
      return value;
    };

    settings.trigger = function() {};
    settings.enable = function() {};
    settings.disable = function() {};

    /**********************************
     * filePreview                    *
     **********************************/
    filePreview.previewMaxWidth = "140px";
    filePreview.previewMaxHeight = "140px";

    filePreview.PREVIEW_CLASSNAME = "toshakiPreviewCell";
    filePreview.PREVIEWS_AREA_CLASSNAME = "toshakiPreviewsArea";

    /* previewCell の className と data-rel-selected-cell に selectedCell の Element Unique Id
     * を設定する */

    filePreview.insertPreviewElement = function( selectedCell, file) {
      if (filePreview.hasPreviewed(selectedCell) )
        return true;

      var previewsArea = filePreview.getPreviewsAreaElement(selectedCell);
      var div = document.createElement('DIV');
      var selectedCellUid = utils.getElementUniqueId(selectedCell);
      var previewCell;
      div.className = filePreview.PREVIEW_CLASSNAME + " preview" + selectedCellUid;
      div.style.display = "inline-block";
      div.setAttribute("data-rel-selected-cell", selectedCellUid);
      previewsArea.appendChild(div);

      if ((350 * 1024 * 1024) <= file.size) {
        previewCell = this.insertDummyElement( div, file, "OVER 350MiB");

      } else if (0 <= file.type.indexOf( 'image/' )) {
        previewCell = filePreview.insertImagePreviewElement( div, file);

      } else if (0 <= file.type.indexOf( 'audio/' ) || 0 <= file.type.indexOf( 'video/' )) {
        previewCell = filePreview.insertAudioVideoPreviewElement( div, file);

      } else {
        previewCell = filePreview.insertDummyElement( div, file);
      };

      return previewCell;
    };



    filePreview.insertImagePreviewElement = function( destElt, file) {
      var fileReader = new FileReader();
      fileReader.onload = function() {
        var dataUri = this.result;
        var elt = document.createElement('IMG');
        elt.src = dataUri.toString();
        elt.style.maxWidth = filePreview.previewMaxWidth;
        elt.style.maxHeight = filePreview.previewMaxHeight;
        elt.style.border = "1px dashed black";
        destElt.appendChild(elt);
      };
      fileReader.readAsDataURL(file);
    };

    filePreview.insertAudioVideoPreviewElement = function( destElt, file) {
      var fileReader = new FileReader();
      fileReader.onload = function() {
        var dataUri = this.result;
        var elt = document.createElement('VIDEO');
        elt.controls = true;
        elt.src = dataUri.toString();
        elt.style.maxWidth = filePreview.previewMaxWidth;
        elt.style.maxHeight = filePreview.previewMaxHeight;
        elt.style.border = "1px dashed black";
        destElt.appendChild(elt);
      };
      fileReader.readAsDataURL(file);
    };

    filePreview.insertDummyElement = function( destElt, file, msg) {
      var elt = document.createElement('DIV');
      var text = document.createTextNode( file.type );
      elt.appendChild(text);
      if (undefined != msg) {
        elt.appendChild( document.createElement('BR') );
        elt.appendChild( document.createTextNode(msg) );
      };

      elt.style.maxWidth = filePreview.previewMaxWidth;
      elt.style.maxHeight = filePreview.previewMaxHeight;
      elt.style.border = "1px dashed black";
      destElt.appendChild(elt);
    };

    filePreview.getPreviewsAreaElement = function(refSelectedCell) {
      return refSelectedCell.parentElement.parentElement
        .getElementsByClassName(filePreview.PREVIEWS_AREA_CLASSNAME)[0];
    };

    filePreview.getPreviewCellByChild = function(element) {
      for (; element.parentElement; element = element.parentElement) {
        if (0 <= element.className.indexOf(filePreview.PREVIEW_CLASSNAME)) {
          return element;
        };
      };
      return null;
    };

    filePreview.hasPreviewed = function(selectedCell) {
      var className = "preview" + utils.getElementUniqueId(selectedCell);
      return 0 != document.getElementsByClassName(className).length;
    };

    filePreview.removeOldPreviews = function() {
      var previewList = document.getElementsByClassName(filePreview.PREVIEW_CLASSNAME);
      var elementsToRemove = [];

      for (var pIdx = 0, pLen = previewList.length; pIdx < pLen; ++pIdx) {
        var selectedCellEuid = previewList[pIdx].getAttribute("data-rel-selected-cell");
        if (0 == utils.getElementsByUniqueId(selectedCellEuid).length) {
          elementsToRemove.push(previewList[pIdx]);
        };
      };

      for (var rIdx = elementsToRemove.length - 1; -1 < rIdx ; --rIdx) {
        var elt = elementsToRemove[rIdx];
        elt.parentElement.removeChild(elt);
      };
    };

    filePreview.selectedDivOnChange = function() {
      /* 本フォームへの ".selectedCell" 追加の前に、クイックリプライへの追加が行なわれることを前提と
       * する */
      if (undefined !== window.selectedFiles) {
        var selectedCells = document.getElementsByClassName("selectedCell");
        var scIdx = 0;
        var scLen = selectedCells.length;
        var mLen = Math.min(selectedCells.length, window.selectedFiles.length);
        filePreview.removeOldPreviews();

        for (; scIdx < mLen ; ++scIdx) {
          if (! filePreview.hasPreviewed(selectedCells[scIdx])) {
            filePreview.insertPreviewElement(selectedCells[scIdx], window.selectedFiles[scIdx]);
          };
        };

        for (; scIdx < scLen; ++scIdx) {
          if (! filePreview.hasPreviewed(selectedCells[scIdx])) {
            filePreview.insertPreviewElement(selectedCells[scIdx], window.selectedFiles[scIdx - mLen]);
          };
        };
      };

      for (var shIdx in feWrapper.selectedDivOnChangeHandlers) {
        feWrapper.selectedDivOnChangeHandlers[shIdx]();
      };
    };

    filePreview.quickReplyOnLoad = function(mutationRecords, mutationObserver) {
      for (var mrIdx = 0, mrLen = mutationRecords.length; mrIdx < mrLen ; ++mrIdx) {
        if (0 >= mutationRecords[ mrIdx ].addedNodes.Length )
          continue;
        for (var anIdx = 0, anLen = mutationRecords[ mrIdx ].addedNodes.length ;
             anIdx < anLen ; ++anIdx) {

          if ("quick-reply" == mutationRecords[ mrIdx ].addedNodes[ anIdx ].id) {
            var selectedCells = mutationRecords[ mrIdx ].addedNodes[ anIdx ]
                  .getElementsByClassName("selectedCell");

            filePreview.insertPreviewsArea(document.getElementById("selectedDivQr"));

            for (var qrhIdx = 0, qrhLen = feWrapper.quickReplyOnLoadHandlers.length;
                 qrhIdx < qrhLen; ++qrhIdx) {

              feWrapper.quickReplyOnLoadHandlers[qrhIdx](
                mutationRecords[mrIdx].addedNodes[anIdx]);
            };

            filePreview.selectedDivOnChange();
          };
        };
      };
    };

    filePreview.insertPreviewsArea = function(refSelectedDiv) {
      var previewsArea = document.createElement("div");
      previewsArea.className = filePreview.PREVIEWS_AREA_CLASSNAME;
      refSelectedDiv.parentElement.insertBefore( previewsArea, refSelectedDiv );
    };

    filePreview.stopSelectedDivObserver = function() {
      if (undefined != filePreview.sdMutationObserver) {
        filePreview.sdMutationObserver.disconnect();
        filePreview.sdMutationObserver = undefined;
      };
    };
    filePreview.startSelectedDivObserver = function() {
      /*
       * 不安定な回線において、filePreview.sdMutationObserver が始まらない場合がある。
       * DOMContentLoaded は設定されていた。selectedDiv 不在が理由ではない。
       */
      if (null === document.body) {
        document.addEventListener("DOMContentLoaded", filePreview.startSelectedDivObserver);
        return;
      };

      var selectedDiv = document.getElementById("selectedDiv");
      if (null === selectedDiv) {
        return;
      };
      var options = { childList: true};
      filePreview.sdMutationObserver = new MutationObserver(filePreview.selectedDivOnChange);
      filePreview.insertPreviewsArea(selectedDiv);
      filePreview.sdMutationObserver.observe( selectedDiv, options );
    };

    filePreview.stopQuickReplyObserver = function() {
      if (undefined != filePreview.qrMutationObserver) {
        filePreview.qrMutationObserver.disconnect();
        filePreview.qrMutationObserver = undefined;
      };
    };

    filePreview.startQuickReplyObserver = function() {
      if (null === document.body) {
        document.addEventListener("DOMContentLoaded", filePreview.startQuickReplyObserver);
        return;
      };
      if (filePreview.qrMutationObserver !== undefined && ! window.show_quick_reply) {
        return;
      };
      var qrOptions = { childList: true};
      filePreview.qrMutationObserver = new MutationObserver(filePreview.quickReplyOnLoad);
      filePreview.qrMutationObserver.observe(document.body, qrOptions);
    };

    filePreview.trigger = function() {
      filePreview.enable();
    };

    filePreview.enable = function() {
      /* 公式対応したら動かさない */
      if (undefined != window.addSelectedFile &&
          0 <= window.addSelectedFile.toString().indexOf("dragAndDropThumb")) {
        return;
      };
      filePreview.startSelectedDivObserver();
      filePreview.startQuickReplyObserver();

      /* スクリプト読み込み前に追加した添付ファイルに対する処理 */
      document.addEventListener("DOMContentLoaded", filePreview.selectedDivOnChange);
    };

    /***************
     * CatalogSort *
     ***************/
    catalogSort.SPAN_ID = "toshakiiiCatalogSortSpan";
    catalogSort.SELECT_ID = "toshakiiiCatalogSortSelect";
    catalogSort.SETTINGS_ID = "toshakiiiCatalogSortSettings";
    catalogSort.REFRESH_STATUS_ID = "toshakiiiCatalogSortRefreshStatus";

    catalogSort.boardUri = document.location.pathname.replace(/\/([^\/]*).*/,"$1");

    catalogSort.catalogLastModified = new Date( document.lastModified );
    catalogSort.nowRefreshing = false;

    catalogSort.cmpfBumpOrder = function(x,y) {
      var a = catalogSort.bumpOrderOfId[ catalogSort.getCatalogCellId(x) ];
      var b = catalogSort.bumpOrderOfId[ catalogSort.getCatalogCellId(y) ];
      return a - b;
    };

    catalogSort.cmpfCreationData = function(x,y) {
      var a = parseInt( catalogSort.getCatalogCellId(y) );
      var b = parseInt( catalogSort.getCatalogCellId(x) );
      return a - b;
    };

    catalogSort.cmpfReplyCount = function(x,y) {
      var f = function(elt) {
        return parseInt( elt.getElementsByClassName("labelReplies")[0].innerHTML );
      };
      var a = f(y);
      var b = f(x);
      return a - b;
    };

    catalogSort.cmpfImageCount = function(x,y) {
      var f = function(elt) {
        return parseInt( elt.getElementsByClassName("labelImages")[0].innerHTML );
      };
      var a = f(y);
      var b = f(x);
      return a - b;
    };

    catalogSort.cmpfRevBumpOrder    = function(x,y) { return -catalogSort.cmpfBumpOrder   (x,y);};
    catalogSort.cmpfRevCreationData = function(x,y) { return -catalogSort.cmpfCreationData(x,y);};
    catalogSort.cmpfRevReplyCount   = function(x,y) { return -catalogSort.cmpfReplyCount  (x,y);};
    catalogSort.cmpfRevImageCount   = function(x,y) { return -catalogSort.cmpfImageCount  (x,y);};

    catalogSort.shuffle =
      function(array) {
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

    catalogSort.tableOrderType = undefined;

    catalogSort.initTableOrderType =
      function() {
        /*
         * funcType == undefined は funcType == 0 と同義とする。
         */
        catalogSort.tableOrderType =
          [
            { name: "Bump order"      , compareFunction: catalogSort.cmpfBumpOrder }
            , { name: "Creation date" , compareFunction: catalogSort.cmpfCreationData }
            , { name: "Reply count"   , compareFunction: catalogSort.cmpfReplyCount }
            , { name: "Image count"   , compareFunction: catalogSort.cmpfImageCount }
            , { name: "Random", funcType: 1, sortFunction: catalogSort.shuffle }
            , { name: "Bump order(reverse)",    compareFunction: catalogSort.cmpfRevBumpOrder }
            , { name: "Creation date(reverse)", compareFunction: catalogSort.cmpfRevCreationData }
            , { name: "Reply count(reverse)",   compareFunction: catalogSort.cmpfRevReplyCount }
            , { name: "Image count(reverse)",   compareFunction: catalogSort.cmpfRevImageCount }
          ];
      };

    catalogSort.bumpOrderOfId = {};

    catalogSort.loadSettingsSageHidedThreads = function() {
      if (undefined === settings.sageHidedThreads) {
        if ("1" == localStorage.getItem( 'toshakiii.settings.sageHidedThreads' )) {
          settings.sageHidedThreads = true;
        } else {
          settings.sageHidedThreads = false;
        };
      };
      return settings.sageHidedThreads;
    };

    catalogSort.saveSettingsSageHidedThreads = function(value) {
      if (value) {
        settings.sageHidedThreads = true;
        localStorage.setItem( 'toshakiii.settings.sageHidedThreads', "1");
      } else {
        settings.sageHidedThreads = false;
        localStorage.setItem( 'toshakiii.settings.sageHidedThreads', "0");
      };
    };

    /* 元 HTML の catalogCell に id は設定されていない */
    catalogSort.getCatalogCellId = function(catalogCell) {
      if (0 != catalogCell.id.length )
        return catalogCell.id;
      var s = catalogCell.getElementsByClassName( "linkThumb" )[0].href;
      var i = s.lastIndexOf("/");
      s = s.substring(1+i);
      i = s.indexOf(".");
      if (0 <= i )
        return catalogCell.id = s.substring(0,i);
      return undefined;
    };

    catalogSort.recordBumpOrder = function() {
      var divThreads = document.getElementById( "divThreads" );
      if (null == divThreads) {
        return false;
      };

      for (var idx = 0, len = divThreads.children.length; idx < len ; ++idx) {
        var id = catalogSort.getCatalogCellId( divThreads.children[idx] );
        if (id.length != 0) {
          catalogSort.bumpOrderOfId[ id ] = idx;
        };
      };
      return true;
    };

    catalogSort.recordBumpOrderFromJson = function(catalogJson) {
      /* json : catalog.json をパースしたもの */
      var bumpOrderOfId = {};
      for (var idx = 0, len = catalogJson.length; idx < len ; ++idx) {
        var id = catalogJson[ idx ].threadId;
        bumpOrderOfId[ id ] = idx;
      };
      catalogSort.bumpOrderOfId = bumpOrderOfId;
    };

    catalogSort.circulateOrderType = function() {
      var selectElt = document.getElementById( catalogSort.SELECT_ID );
      var n = 1 + parseInt(selectElt.value);
      if (n >= selectElt.length) {
        n = 0;
      }
      selectElt.value = n;
      catalogSort.sortCatalogCells();
    };

    catalogSort.MeasuringPerformanceSortCatalogCells = function() {
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
      while( end > (+new Date())) {
        var time = (+new Date());
        catalogSort.sortCatalogCells(false);
        tottimed += (+new Date()) - time;

        time = (+new Date());
        catalogSort.sortCatalogCells(true);
        tottimef += (+new Date()) - time;
        ++count;
      };
      document.body.insertBefore( document.createTextNode( "direct["+tottimed+"]  fragment["+tottimef+"] diff[" + Math.abs( tottimed - tottimef ) + "] / count["+count+"]" ),
          document.body.firstChild );
    };

    catalogSort.shuffleCatalogCells = function() {
      for (var idx = 0, len = catalogSort.tableOrderType.length; idx < len ; ++idx) {
        if (catalogSort.tableOrderType[ idx ].sortFunction == catalogSort.shuffle) {
          var selectElt = document.getElementById( catalogSort.SELECT_ID );
          selectElt.value = idx;
          catalogSort.sortCatalogCells();
          break;
        };
      };
    };

    catalogSort.CatalogCell =
      (function() {
        var ccthis = this;
        var ref = function( array, index, defval) {
          if (array.length > index) {
            return array[ index ];
          };
          return defval;
        };
        var refInnerHTML = function( element, defval) {
          if (undefined == element) {
            return defval;
          };
          if (element.innerHTML) {
            return element.innerHTML;
          };
          return defval;
        };
        ccthis.prepareId = function(catalogCell) {
          if (0 != catalogCell.id.length )
            return catalogCell.id;
          var s = catalogCell.getElementsByClassName( "linkThumb" )[0].href;
          var i = s.lastIndexOf("/");
          s = s.substring(1+i);
          i = s.indexOf(".");
          if (0 <= i )
            return catalogCell.id = s.substring(0,i);
          return undefined;
        };

        ccthis.getLinkThumbElement = function(catalogCell) {
          return ref( catalogCell.getElementsByClassName("linkThumb"), 0, null );
        };
        ccthis.getLabelSubjectElement = function(catalogCell) {
          return ref( catalogCell.getElementsByClassName("labelSubject"), 0, null );
        };
        ccthis.getDivMessageElement = function(catalogCell) {
          return ref( catalogCell.getElementsByClassName("divMessage"), 0, null );
        };
        ccthis.getLabelRepliesElement = function(catalogCell) {
          return ref( catalogCell.getElementsByClassName("labelReplies"), 0, null );
        };
        ccthis.getLabelImagesElement = function(catalogCell) {
          return ref( catalogCell.getElementsByClassName("labelImages"), 0, null );
        };
        ccthis.getLabelPageElement = function(catalogCell) {
          return ref( catalogCell.getElementsByClassName("labelPage"), 0, null );
        };
        ccthis.getLockIndicatorElement = function(catalogCell) {
          return ref( catalogCell.getElementsByClassName("lockIndicator"), 0, null );
        };
        ccthis.getPinIndicatorElement = function(catalogCell) {
          return ref( catalogCell.getElementsByClassName("pinIndicator"), 0, null );
        };
        ccthis.getCyclicIndicatorElement = function(catalogCell) {
          return ref( catalogCell.getElementsByClassName("cyclicIndicator"), 0, null );
        };
        ccthis.getBumpLockIndicatorElement = function(catalogCell) {
          return ref( catalogCell.getElementsByClassName("bumpLockIndicator"), 0, null );
        };
        ccthis.getThreadStatsElement = function(catalogCell) {
          return ref( catalogCell.getElementsByClassName("threadStats"), 0, null);
        };

        ccthis.getRepliesStr = function(catalogCell) {
          return refInnerHTML( ccthis.getLabelRepliesElement(catalogCell), null );
        };
        ccthis.getImagesStr = function(catalogCell) {
          return refInnerHTML( ccthis.getLabelImagesElement(catalogCell), null );
        };
        ccthis.getPageStr = function(catalogCell) {
          return refInnerHTML( ccthis.getLabelPageElement(catalogCell), null );
        };
        ccthis.isLocked = function(catalogCell) {
          return ccthis.getLockIndicatorElement(catalogCell);
        };
        ccthis.isPined = function(catalogCell) {
          return ccthis.getPinIndicatorElement(catalogCell);
        };
        ccthis.isCyclic = function(catalogCell) {
          return ccthis.getCyclicIndicatorElement(catalogCell);
        };
        ccthis.isBumpLocked = function(catalogCell) {
          return ccthis.getBumpLockIndicatorElement(catalogCell);
        };

        ccthis.changeURL = function( catalogCell, value) {
          ccthis.getLinkThumbElement(catalogCell).href = value;
        };
        ccthis.changeThumb = function( catalogCell, value) {
          var linkThumb = ccthis.getLinkThumbElement(catalogCell);
          var firstChild = linkThumb.firstChild;
          if (value) {
            if ('IMG' == firstChild.tagName) {
              firstChild.src = value;
              return;
            } else {
              var img = document.createElement('IMG');
              img.src = value;
              linkThumb.replaceChild( img, firstChild );
              return;
            };
            return;
          };
          if ('IMG' == firstChild.tagName) {
            var text = document.createTextNode("Open");
            linkThumb.replaceChild( text, firstChild );
          };
        };
        ccthis.changeSubject = function( catalogCell, value) {
          ccthis.getLabelSubjectElement(catalogCell).innerHTML = value;
        };
        ccthis.changeMessage = function( catalogCell, value) {
          ccthis.getDivMessageElement(catalogCell).innerHTML
            = value.replace(/\r/g,"").replace(/\n/g,"<br>");
        };

        ccthis.changeRepliesNum = function( catalogCell, value) {
          if (undefined == value ) value = "0";
          ccthis.getLabelRepliesElement(catalogCell).innerHTML = value;
        };
        ccthis.changeImagesNum = function( catalogCell, value) {
          if (undefined == value ) value = "0";
          ccthis.getLabelImagesElement(catalogCell).innerHTML = value;
        };
        ccthis.changePageNum = function( catalogCell, value) {
          if (undefined == value ) value = "0";
          ccthis.getLabelPageElement(catalogCell).innerHTML = value;
        };

        ccthis.changeIndicator = function( catalogCell, value,
            getIndicatorFunction, createElementFunction) {
          var elt = getIndicatorFunction(catalogCell);
          if (elt) {
            if (value) {
              return;
            } else {
              elt.parentElement.removeChild(elt);
              return;
            };
          } else {
            if (value) {
              ccthis.getThreadStatsElement(catalogCell)
                .appendChild( createElementFunction() );
              return;
            } else {
              return;
            };
          };
        };
        ccthis.changeLock = function( catalogCell, value) {
          return ccthis.changeIndicator( catalogCell, value,
              ccthis.getLockIndicatorElement,
              ccthis.makeLockIndicatorElement );
        };
        ccthis.changePin = function( catalogCell, value) {
          return ccthis.changeIndicator( catalogCell, value,
              ccthis.getPinIndicatorElement,
              ccthis.makePinIndicatorElement );
        };
        ccthis.changeCyclic = function( catalogCell, value) {
          return ccthis.changeIndicator( catalogCell, value,
              ccthis.getCyclicIndicatorElement,
              ccthis.makeCyclicIndicatorElement );
        };
        ccthis.changeBumpLock = function( catalogCell, value) {
          return ccthis.changeIndicator( catalogCell, value,
              ccthis.getBumpLockIndicatorElement,
              ccthis.makeBumpLockIndicatorElement );
        };

        ccthis.makeIndicatorElement = function( classnames, title) {
          var elt = document.createElement("span");
          elt.class = classnames;
          elt.title = title;
          return elt;
        };
        ccthis.makeLockIndicatorElement = function() {
          return ccthis.makeIndicatorElement("lockIndicator","Locked");
        };
        ccthis.makePinIndicatorElement = function() {
          return ccthis.makeIndicatorElement("pinIndicator","Sticky");
        };

        ccthis.makeCyclicIndicatorElement = function() {
          return ccthis.makeIndicatorElement("cyclicIndicator","Cyclical Thread");
        };

        ccthis.makeBumpLockIndicatorElement = function() {
          return ccthis.makeIndicatorElement("bumpLockIndicator","Bumplocked");
        };

        return ccthis;
      })();
    /* end: catalogSort.CatalogCell = (function() {...}()) */

    catalogSort.sortCatalogCells = function() {
      var time = (+new Date());
      var parentElt = document.getElementById("divThreads");
      var children = parentElt.children;
      var catalogCells = [];
      var showButtonElts = {};
      var idx = 0;
      var len = 0;
      var n = "";
      for (idx = 0, len = children.length ; idx < len ; ++idx) {
        var child = children[idx];

        if (null != child.firstChild &&
            'A' === child.firstChild.tagName &&
            0 === child.firstChild.innerHTML.lastIndexOf("[Show hidden thread ",0)) {

          n = child.id.replace( /[^0-9]/g, "");
          showButtonElts[ n ] = child;

        } else {
          catalogCells.push( children[idx] );
        };
      };
      children = undefined;

      var selectElt = document.getElementById( catalogSort.SELECT_ID );
      var oIdx = parseInt(selectElt.value);
      localStorage.setItem( "toshakiii.settings.catalogOrderType", oIdx );

      var funcType = catalogSort.tableOrderType[oIdx].funcType;
      if (0 ==  funcType || undefined == funcType) {
        catalogCells.sort( catalogSort.tableOrderType[oIdx].compareFunction );
      }
      else if (1 == funcType) {
        catalogCells = catalogSort.tableOrderType[oIdx].sortFunction(catalogCells);
      };

      /* var cookie = '; ' + document.cookie + "; "; */
      var sageElts = [];
      for (var ccIdx = 0, ccLen = catalogCells.length; ccIdx < ccLen ; ++ccIdx) {
        var catalogCell = catalogCells[ ccIdx ];
        if (catalogCell.id in showButtonElts) {
          var spanElt = showButtonElts[ catalogCell.id ];
          if (settings.sageHidedThreads && spanElt.style.display != 'none') {
            sageElts.push(spanElt);
            sageElts.push(catalogCell);
            continue;
          };
          parentElt.appendChild( showButtonElts[ catalogCell.id ] );
        } else if (settings.sageHidedThreads &&
                   utils.getSetting('hide' + catalogSort.boardUri + 'Thread' + catalogCell.id)) {
          sageElts.push(catalogCell);
          continue;
        };

        parentElt.appendChild(catalogCell);
      };
      for (var seIdx = 0, seLen = sageElts.length; seIdx < seLen ; ++seIdx) {
        parentElt.appendChild( sageElts[ seIdx ] );
      };
    };

    catalogSort.getCatalogJsonUri = function() {
      if (undefined == catalogSort.CatalogJsonUri) {
        catalogSort.CatalogJsonUri = document.URL.replace(/\.html.*/,"") + ".json";
      };
      return catalogSort.CatalogJsonUri;
    };

    catalogSort.showRefreshStatus = function(msg) {
      var refreshStatus = document.getElementById( catalogSort.REFRESH_STATUS_ID );
      var text = document.createTextNode(msg);
      if (refreshStatus.firstChild) {
        refreshStatus.replaceChild( text, refreshStatus.firstChild );
      } else {
        refreshStatus.appendChild(text);
      };
    };

    catalogSort.refreshCatalogCells = function(callback) {
      if (catalogSort.nowRefreshing) {
        return;
      };
      catalogSort.nowRefreshing = true;
      catalogSort.showRefreshStatus("loading");
      var uri = catalogSort.getCatalogJsonUri();

      var loadingBody = false;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange =
        function() {
          switch( this.readyState) {
          case 0:
          case 1:
            catalogSort.showRefreshStatus("requesting");
            break;
          case 2:
            catalogSort.showRefreshStatus("header");
            break;
          case 3:
            if (! loadingBody) {
              catalogSort.showRefreshStatus("body");
              loadingBody = true;
            };
            break;
          case 4:
            switch( this.status) {
            case 304:
              catalogSort.showRefreshStatus("not modified");
              catalogSort.nowRefreshing = false;
              if (callback) callback(false);
              return;
            case 200:
              catalogSort.showRefreshStatus("applying");
              catalogSort.catalogLastModified = new Date( this.getResponseHeader("Last-Modified") );
              catalogSort.applyJsonToCatalog( this.responseText, catalogSort.showRefreshStatus,
                  function() { if (callback) callback(true); } );
              return;
            default:
              catalogSort.showRefreshStatus("error(HTTP "+this.status+")");
              catalogSort.nowRefreshing = false;
              if (callback) callback(false);
            };
          default:
            catalogSort.nowRefreshing = false;
            catalogSort.showRefreshStatus("error(unknown)");
            if (callback) callback(false);
          };
        };

      xhr.open('GET', uri);
      /*
       catalog.html の lastModified は catalog.json のそれより 1秒過去の場合がしばしば。
       */
      var ifModifiedSince = catalogSort.catalogLastModified.toUTCString();
      xhr.setRequestHeader('If-Modified-Since', ifModifiedSince);

      var catalogCells = document.getElementsByClassName("catalogCell");
      if (0 < catalogCells.length &&
          "" == catalogCells[0].id) {
        for (var idx = 0, len = catalogCells.length ; idx < len ; ++idx) {
          catalogSort.CatalogCell.prepareId( catalogCells[ idx ] );
        };
      };
      xhr.send(null);
    };

    catalogSort.applyJsonToCatalog = function( jsontext, msgfunc, callback) {
      var json = undefined;
      try {
        json = JSON.parse(jsontext);
        window.catalogThreads = json;
      } catch(o) {
        msgfunc("JSON error");
        catalogSort.nowRefreshing = false;
        return;
      };

      var break_ = false;
      var iloops = utils.IntermittentLoops();

      var threadCount = 0;
      var threadProcedCount = 0;
      iloops.push
      (function() {
        var threadsToDelete = utils.differenceSet( catalogSort.bumpOrderOfId, json );
        for (var threadId in threadsToDelete) {
          var catalogCell = document.getElementById(threadId);
          catalogCell.parentElement.removeChild(catalogCell);
        };
      } ).push
      (function() {
        catalogSort.recordBumpOrderFromJson(json);
      } );
      var catalogCellInfoOfId = {};
      iloops.push( function() {
        for (var cellInfo in json) {
          ++threadCount;
          catalogCellInfoOfId[ json[ cellInfo ].threadId ] = json[ cellInfo ];
        };
        if (0 == threadCount) {
          threadCount = 1;
        };
      } );

      var newThreadIds = [];
      var beforeProgress = 0;

      iloops.push
      (function() {
        ++threadProcedCount;
        var p = Math.floor( ( 10 * threadProcedCount ) / threadCount ).toString();
        if (p != beforeProgress) {
          msgfunc( p + "0%" );
          beforeProgress = p;
        };
        return catalogSort.applyInfoToCatalogCellLoop( catalogCellInfoOfId, newThreadIds, msgfunc );
      } ).push
      ( function() {
        msgfunc("succeeded");
        catalogSort.sortCatalogCells();
        catalogSort.nowRefreshing = false;
      } );

      if (undefined != window.enableHideThreadLink) {
        iloops.push( function() {
          if (0 >= newThreadIds.length) {
            return false;
          };
          var newThreadId = newThreadIds.pop();
          var catalogCell = document.getElementById(newThreadId);
          if (null == catalogCell) {
            return true;
          };
          window.enableHideThreadLink(catalogCell);
          return true;
        } );
      };

      if (callback) {
        iloops.push(callback);
      };

      iloops.beginAsync();
    };

    /*
     新しく catalogCell 全部を作るのではなく、
     わざわざ既存の DOM を変更するのは、
     他のスクリプトが catalogCell に何か仕込んでいるかも知れないから。
     */
    catalogSort.applyInfoToCatalogCellLoop =
      function( catalogCellInfoOfId, out_newThreadIds, msgfunc) {
        var break_ = false;
        var continue_ = true;

        for (var id in catalogCellInfoOfId) {
          break;
        };
        if (undefined == id) {
          return break_;
        };
        /*msgfunc( "applying["+id+"]" );*/
        var info = catalogCellInfoOfId[ id ];
        var catalogCell = document.getElementById(id);
        if (null == catalogCell) {
          out_newThreadIds.push( info.threadId );
          var newCatalogCell = catalogSort.makeCatalogCell(info);
          document.getElementById("divThreads").appendChild(newCatalogCell);
        } else {
          catalogSort.applyInfoToCatalogCell( info, catalogCell );
        };
        delete catalogCellInfoOfId[ id ];
        return continue_;
      };

    catalogSort.applyInfoToCatalogCell =
      function( catalogCellInfo, catalogCell) {
        var info = catalogCellInfo;
        catalogSort.CatalogCell.changeRepliesNum( catalogCell, info.postCount );
        catalogSort.CatalogCell.changeImagesNum ( catalogCell, info.fileCount );
        catalogSort.CatalogCell.changePageNum   ( catalogCell, info.page );
        catalogSort.CatalogCell.changeLock      ( catalogCell, info.locked );
        catalogSort.CatalogCell.changePin       ( catalogCell, info.pinned );
        catalogSort.CatalogCell.changeCyclic    ( catalogCell, info.cyclic );
        catalogSort.CatalogCell.changeBumpLock  ( catalogCell, info.autoSage );
      };


    catalogSort.catalogCellTemplateHTML = '<div id="00" class="catalogCell"><a class="linkThumb" href="/"><img src="/"></a><p class="threadStats">R:<span class="labelReplies">00</span>/ I:<span class="labelImages">00</span>/ P:<span class="labelPage">00</span></p><p><span class="labelSubject">00</span></p><div class="divMessage">00</div></div>';
    catalogSort.catalogCellTemplateElement = undefined;
    catalogSort.makeCatalogCell = function(catalogCellInfo) {
      if (catalogSort.catalogCellTemplateElement == undefined) {
        var span = document.createElement('SPAN');
        span.innerHTML = catalogSort.catalogCellTemplateHTML;
        catalogSort.catalogCellTemplateElement = span.removeChild ( span.firstChild );
        span = undefined;
      };
      var info = catalogCellInfo;
      var catalogCell = catalogSort.catalogCellTemplateElement.cloneNode(true);

      catalogCell.id = catalogCellInfo.threadId;

      catalogSort.CatalogCell.changeURL( catalogCell,
          "/" + catalogSort.boardUri + "/res/" + catalogCellInfo.threadId + ".html" );
      catalogSort.CatalogCell.changeThumb( catalogCell,
          catalogCellInfo.thumb );

      catalogSort.CatalogCell.changeRepliesNum( catalogCell, info.postCount );
      catalogSort.CatalogCell.changeImagesNum ( catalogCell, info.fileCount );
      catalogSort.CatalogCell.changePageNum   ( catalogCell, info.page );
      catalogSort.CatalogCell.changeLock      ( catalogCell, info.locked );
      catalogSort.CatalogCell.changePin       ( catalogCell, info.pinned );
      catalogSort.CatalogCell.changeCyclic    ( catalogCell, info.cyclic );
      catalogSort.CatalogCell.changeBumpLock  ( catalogCell, info.autoSage );

      catalogSort.CatalogCell.changeSubject   ( catalogCell, info.subject );
      catalogSort.CatalogCell.changeMessage   ( catalogCell, info.message );
      /*catalogCell.getElementsByClassName("hideButton")[0].id =
       'hide' + catalogSort.boardUri + 'Thread' + info.threadID;*/

      return catalogCell;
    };

    catalogSort.makeSortElement = function() {
      var eltSpan = document.createElement('SPAN');
      eltSpan.id = catalogSort.SPAN_ID;

      /* [So] [r] [t by:] */
      var eltASo = document.createElement('A');
      eltASo.appendChild( document.createTextNode("So") );
      var eltAr = document.createElement('A');
      eltAr.appendChild( document.createTextNode("r") );
      var eltAtby = document.createElement('A');
      eltAtby.appendChild( document.createTextNode("t by:") );

      eltASo.addEventListener( 'click', catalogSort.circulateOrderType );
      eltAr.addEventListener( 'click', catalogSort.shuffleCatalogCells );
      eltAtby.addEventListener( 'click', catalogSort.circulateOrderType );

      var eltSelect = document.createElement('SELECT');
      eltSelect.id = catalogSort.SELECT_ID;
      eltSelect.addEventListener( "change", catalogSort.sortCatalogCells );

      var option;
      var optionText;
      for (var idx = 0, len = catalogSort.tableOrderType.length; idx < len ; ++idx) {
        option = document.createElement('OPTION');
        option.setAttribute("value", idx );
        optionText = document.createTextNode( catalogSort.tableOrderType[idx].name );
        option.appendChild(optionText);
        eltSelect.appendChild(option);
      }

      /*
       var eltLSB = document.createTextNode("[");
       var eltARefresh = document.createElement('A');
       eltARefresh.appendChild( document.createTextNode('Refresh') );
       eltARefresh.addEventListener('click', catalogSort.refreshCatalogCells);
       var eltRSB = document.createTextNode("]");
       */

      var eltConfig = document.createElement('A');
      eltConfig.appendChild( document.createTextNode("⚙") );
      eltConfig.addEventListener('click', catalogSort.showCloseDivSettings );

      var eltStatus = document.createElement('SPAN');
      eltStatus.id = catalogSort.REFRESH_STATUS_ID;

      eltSpan.appendChild(eltASo);
      eltSpan.appendChild(eltAr);
      eltSpan.appendChild(eltAtby);
      eltSpan.appendChild(eltSelect);

      /* eltSpan.appendChild(eltLSB);
       eltSpan.appendChild(eltARefresh);
       eltSpan.appendChild(eltRSB); */

      eltSpan.appendChild(eltConfig);

      eltSpan.appendChild(eltStatus);
      return eltSpan;
    };

    catalogSort.closeDivSettings = function() {
      var divSettings = document.getElementById( catalogSort.SETTINGS_ID );
      if (null == divSettings) {
        return;
      };
      divSettings.parentElement.removeChild(divSettings);
    };

    catalogSort.showCloseDivSettings = function() {
      if (null != document.getElementById( catalogSort.SETTINGS_ID )) {
        catalogSort.closeDivSettings();
        return;
      };
      var divSettings = document.createElement('DIV');
      divSettings.id = catalogSort.SETTINGS_ID;
      divSettings.style.border = '1px solid black';
      divSettings.style.display = 'inline-block';
      var checkboxSageHidedThreads = document.createElement('INPUT');
      checkboxSageHidedThreads.addEventListener('change',
          function() {
            catalogSort.saveSettingsSageHidedThreads( this.checked );
          });
      checkboxSageHidedThreads.type = 'checkbox';
      checkboxSageHidedThreads.value = 'sageHidedThreads';
      checkboxSageHidedThreads.checked = settings.sageHidedThreads;

      var closeButton = document.createElement('INPUT');
      closeButton.type = 'button';
      closeButton.addEventListener('click', catalogSort.closeDivSettings );
      closeButton.value = "Close";

      divSettings.appendChild(checkboxSageHidedThreads);
      divSettings.appendChild( document.createTextNode("Hideしたスレは下げる(ソート変更後に適用)") );
      divSettings.appendChild( document.createElement('BR') );
      divSettings.appendChild(closeButton);

      document.getElementById( catalogSort.SPAN_ID ).appendChild(divSettings);
    };

    catalogSort.loadSettings =
      function() {
        catalogSort.loadSettingsSageHidedThreads();
        if (undefined == window.toshakiii.settings.catalogOrderType) {
          var n = "toshakiii.settings.catalogOrderType";
          var v = localStorage.getItem(n);
          if (v == null) {
            window.toshakiii.settings.catalogOrderType = 0;
          } else {
            v = parseInt(v);
            if (isNaN(v)) {
              window.toshakiii.settings.catalogOrderType = 0;
            } else {
              window.toshakiii.settings.catalogOrderType = v;
            };
          };
        };
      };

    catalogSort.override = function override() {
      if (undefined === window.refreshCatalog) {
        if ('complete' === document.readyState) {
          return;
        };
        setTimeout( override, 0 );
      };

      catalogSort.overrideRefreshCatalog();
      /* catalogSort.overrideSetCell(); */
    };

    catalogSort.overrideRefreshCatalog = function overrideRefreshCatalog() {
      if ('function' !== typeof( window.refreshCatalog )) {
        return;
      };
      window.refreshCatalog = function ymncRefreshCatalog(manual) {

        if (window.autoRefresh) {
          clearInterval( window.refreshTimer );
        };

        catalogSort.refreshCatalogCells( function done(changed) {
          if (window.autoRefresh) {
            window.startTimer(manual || changed ? 5 : window.lastRefresh * 2);
          };
          if (!changed) {
            return;
          };

          var assoc = {};
          var dest = [];

          for (var idx = 0, len = window.catalogThreads.length;
               idx < len ; ++idx) {

            assoc[ window.catalogThreads[idx].threadId ] = window.catalogThreads[idx];
          };
          var divThreads = document.getElementById( "divThreads" );

          for (var dtIdx = 0, dtLen = divThreads.children.length ;
               dtIdx < dtLen ; ++dtIdx) {

            if ("" !== divThreads.children[ dtIdx ].id &&
                undefined !== assoc[ divThreads.children[ dtIdx ].id ]) {

              dest.push( assoc[ divThreads.children[ dtIdx ].id ] );
              delete assoc[ divThreads.children[ dtIdx ].id ];
            };
          };
          window.catalogThreads = dest;
          window.search();
        } );
      };
    };

    catalogSort.overrideSetCell = function overrideSetCell() {
      if ('function' !== typeof( window.setCell ) ||
          'function' !== typeof( window.enableHideThreadLink )) {
        return;
      };

      var originalSetCell = window.setCell;
      window.setCell = function ymncSetCell(thread) {
        var element = originalSetCell(thread);
        element.id = thread.threadId;
        element.catalog = true;
        window.enableHideThreadLink(element);

        /* var cookie = '; ' + document.cookie + "; "; */
        if (utils.getSetting('hide' + catalogSort.boardUri + 'Thread' + element.id)) {
          element.style.display = "none";
          var fragment = document.createDocumentFragment();
          fragment.appendChild( createShowThreadLink(element) );
          fragment.appendChild(element);
          return fragment;
        };
        return element;
      };

    };

    function getShowThreadLink(threadElem) {
      return document.getElementById('Show'+catalogSort.boardUri+'Thread'+threadElem.id);
    };

    function createShowThreadLink(threadElem) {
      var threadID = threadElem.id;

      var opHeadElem = threadElem.querySelector('.opHead');
      /* add show thread link if we don't already have one */

      var div = document.createElement(threadElem.catalog?'span':'div');
      div.id = 'Show'+catalogSort.boardUri+'Thread'+threadID;
      var link = document.createElement('a');
      link.textContent = '[Show hidden thread '+threadID+'] ';
      link.href = '#';
      link.onclick = function() {
        console.log('showing thread', threadID);
        threadElem.style.display = threadElem.catalog ? 'inline-block' : 'block';
        if (window.deleteSetting) {
          window.deleteSetting('hide'+catalogSort.boardUri+'Thread'+threadID);
        };
        div.style.display = 'none';
        window.enableHideThreadLink(threadElem);
        return false;
      };
      div.appendChild(link);
      return div;
    };

    catalogSort.disable = function() {
      var elt = document.getElementById( catalogSort.SPAN_ID );
      if (null != elt) {
        var selectElt = document.getElementById( catalogSort.SELECT_ID );
        selectElt.value = 0;
        catalogSort.sortCatalogCells();
        elt.parentElement.removeChild(elt);
      };
    };

    catalogSort.isHereCatalogPage = function() {
      var divThreads = document.getElementById( "divThreads" );
      return null != divThreads &&
        0 < document.getElementsByClassName("catalogCell").length;
    };

    catalogSort.trigger = function() {
      if (! catalogSort.isHereCatalogPage()) {
        return;
      };

      if (! catalogSort.recordBumpOrder()) {
        return;
      };
      catalogSort.initTableOrderType();
      catalogSort.loadSettings();
      catalogSort.enable();
    };

    catalogSort.enable = function() {
      if (! catalogSort.isHereCatalogPage()) {
        return;
      };

      catalogSort.override();

      var divThreads = document.getElementById("divThreads");
      if (null == divThreads) {
        return;
      };
      var elt = catalogSort.makeSortElement();

      divThreads.parentElement.insertBefore( elt, divThreads );

      if (undefined !== window.toshakiii.settings.catalogOrderType) {
        var selectElt = document.getElementById( catalogSort.SELECT_ID );
        if (selectElt.length <= window.toshakiii.settings.catalogOrderType) {
          window.toshakiii.settings.catalogOrderType = 0;
        };
        selectElt.value = window.toshakiii.settings.catalogOrderType;

        catalogSort.sortCatalogCells();
      };
    };

    /**********************************
     * etCetera                       *
     **********************************/
    etCetera.maskFilename = false;
    etCetera.hideLibrejpBottomLeftMascot = false;

    etCetera.setFavicon = function() {
      var innerOPList = document.getElementsByClassName("innerOP");
      if (1 !== innerOPList.length) {
        return false;
      };

      var innerOP = innerOPList[0];

      var imgList = innerOP.getElementsByTagName("IMG");

      if (0 === imgList[0]) {
        return false;
      };

      var link = document.createElement("LINK");
      link.rel = "icon";
      link.href = imgList[0].src;

      document.head.appendChild(link);
      return true;
    };

    etCetera.insertMiscCSS = function() {
      if (null === document.head) {
        setTimeout(etCetera.insertMiscCSS, 0);
        return;
      };
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

      s += '.tskQuoteblock .panelBacklinks + div:not(.panelUploads) {' +
        '  display: block }';

      /* サイトJSのポップアップ用の要素 */
      s += 'body div.quoteblock { display: none !important }';
      var style = document.createElement('STYLE');
      style.type = "text/css";
      style.id = "ymanuchangStyles";
      style.innerHTML = s;
      document.head.appendChild(style);
    };

    etCetera.autoPostingPassowrd = function() {
      var fieldPostingPassword = document.getElementById("fieldPostingPassword");

      if (undefined === localStorage.deletionPassword &&
          null !== fieldPostingPassword && 0 === fieldPostingPassword.value.length) {

        var deletionFieldPassword = document.getElementById("deletionFieldPassword");
        if (null !== deletionFieldPassword && 0 !== deletionFieldPassword.value.length) {
          return;
        };

        var password = "";
        for (var i = 8; 0 < i; --i) {
          password += String.fromCharCode (Math.random () * 94 + 33);
        };

        fieldPostingPassword.value = password;
        if (null !== deletionFieldPassword) {
          deletionFieldPassword.value = password;
        };
      };
    };

    etCetera.markdowns = [
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

    etCetera.markdownTool = function() {
      if (null === document.body) {
        document.addEventListener("DOMContentLoaded", etCetera.markdownTool);
        return;
      };
      etCetera.setMarkdownToolForMainForm();
      etCetera.contextMenuOnMarkdownTool();
    };

    etCetera.contextMenuOnMarkdownTool = function() {
      var fieldMessage = document.getElementById('fieldMessage');
      if (fieldMessage) {
        etCetera.setMarkdownToolOnTextAreaContextMenu(fieldMessage, fieldMessage.id);

        feWrapper.quickReplyOnLoadHandlers.push( etCetera.setMarkdownToolOnQrBodyContextMenu );
      };
    };

    etCetera.setMarkdownToolOnQrBodyContextMenu = function() {
      var qrBody = document.getElementById("qrbody");
      etCetera.setMarkdownToolOnTextAreaContextMenu(qrBody, qrBody.id);
    };

    etCetera.setMarkdownToolForMainForm = function() {
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
      etCetera.setMarkdownToolButton( commentTh, fieldMessage );

      return true;
    };

    etCetera.setMarkdownToolButton = function( container, textarea) {

      for (var markdownIndex = 0, markdownLen = etCetera.markdowns.length;
           markdownIndex < markdownLen ; ++markdownIndex) {

        var Anchor = document.createElement("A");
        var markdown = etCetera.markdowns[ markdownIndex ];
        if (markdown.className)
          Anchor.className = markdown.className;
        Anchor.className = Anchor.className + " ymncMarkdownToolButton";

        for (var name in markdown.style) {
          Anchor.style[name] = markdown.style[name];
        };

        if (markdown.title)
          Anchor.title = markdown.title;

        Anchor.appendChild( document.createTextNode( markdown.name ) );

        (function() {
          var index = markdownIndex;
          Anchor.addEventListener("click", (function closure() {
            etCetera.applyMarkdown( textarea, etCetera.markdowns[index]);
          } ) );
        })();

        container.appendChild( document.createTextNode(" ") );
        container.appendChild(Anchor);
      };
    };

    etCetera.applyMarkdown = function(textarea, markdown) {
      var originalSelectionEnd = +textarea.selectionEnd;
      var originalSelectionStart = +textarea.selectionStart;
      var begTag = markdown.beg;
      var endTag = markdown.end;

      textarea.value = textarea.value.substring(0, originalSelectionEnd ) + endTag +
        textarea.value.substring(originalSelectionEnd);

      textarea.value = textarea.value.substring(0, originalSelectionStart ) + begTag +
        textarea.value.substring(originalSelectionStart);

      textarea.select();
      textarea.selectionStart = begTag.length + originalSelectionStart;
      textarea.selectionEnd = begTag.length + originalSelectionEnd;

    };

    etCetera.setMarkdownToolOnTextAreaContextMenu = function(textarea, textareaId) {
      var menuId = "markdownToolMenu" + textareaId;
      textarea.setAttribute('contextmenu', menuId);

      if (document.getElementById(menuId)) {
        return;
      };

      var menu = document.createElement('MENU');
      var markdownMenu = document.createElement('MENU');

      menu.style.display = 'none';
      menu.setAttribute('type', 'context');
      menu.id = menuId;
      menu.appendChild(markdownMenu);

      markdownMenu.setAttribute('label', "Markdown");

      for (var markdownIndex = 0, markdownLength = etCetera.markdowns.length;
           markdownIndex < markdownLength; ++markdownIndex) {

        var markdown = etCetera.markdowns[ markdownIndex ];
        var menuitem = document.createElement('MENUITEM');

        if (markdown.className)
          menuitem.className = markdown.className;

        if (markdown.title)
          menuitem.title = markdown.title;

        menuitem.textContent = markdown.title;

        for (var name in markdown.style) {
          menuitem.style[name] = menuitem.style[name];
        };

        (function() {
          var markdownN = markdown;
          menuitem.addEventListener('click', function() {
            etCetera.applyMarkdown( textarea, markdownN);
          } );
        })();

        markdownMenu.appendChild(menuitem);
      };
      document.body.appendChild(menu);
    };

    etCetera.makeCanvasFromImg = function(imgElement) {
      var canvas = document.createElement('CANVAS');
      canvas.width  = imgElement.width;
      canvas.height = imgElement.height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(imgElement, 0, 0);
      return canvas;
    };

    etCetera.uploadFileFromClipboard = function() {
      if (null === document.body) {
        document.addEventListener("DOMContentLoaded", etCetera.uploadFileFromClipboard);
        return;
      };
      var fieldMessage = document.getElementById("fieldMessage");
      if (fieldMessage) {
        fieldMessage.contentEditable = true;
        fieldMessage.title = "Ctrl-V to upload";
        fieldMessage.addEventListener('paste', fieldMessageOnPaste );
      };

      if (window.show_quick_reply) {
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

    function fieldMessageOnPaste(event) {
      var items = (event.clipboardData || event.originalEvent.clipboardData).items;

      for (var index in items) {
        var item = items[index];
        if (item.kind === 'file') {
          var blob = item.getAsFile();
          window.addSelectedFile(blob);
        };
      };
    };

    etCetera.UserJs = function() {
      etCetera.setButtonToEditUserJs();
      etCetera.excuteUserJs();
    };

    etCetera.setButtonToEditUserJs = function() {
      var navList = document.getElementsByTagName("NAV");
      if (0 < navList.length) {
        var anchor = document.createElement("A");
        anchor.style.cursor = "pointer";
        anchor.appendChild( document.createTextNode(" [(山仮)UserJS]") );
        anchor.onclick = etCetera.showHideEditBoxForUserJs;

        navList[0].appendChild(anchor);
      };
    };

    etCetera.showHideEditBoxForUserJs = function() {
      var editboxUserJsContainer = document.getElementById("editboxUserJsContainer");
      if (editboxUserJsContainer) {
        if ("none" !== editboxUserJsContainer.style.display) {
          editboxUserJsContainer.style.display = "none";
        } else {
          editboxUserJsContainer.style.display = "block";
        };
      } else {
        var element = etCetera.createUserJsControls();
        document.body.appendChild(element);
      };
    };

    etCetera.createUserJsControls = function() {
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
      blackoutCurtain.onclick = etCetera.showHideEditBoxForUserJs;

      var editboxUserJsDiv = document.createElement("DIV");
      editboxUserJsDiv.id = "editboxUserJsDiv";
      editboxUserJsDiv.style.background = "#f0e0d6";
      editboxUserJsDiv.style.borderColor = "#d9bfb7";
      etCetera.setInnerPostStyle( editboxUserJsDiv.style );
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
      editboxUserJsCloseButton.onclick = etCetera.showHideEditBoxForUserJs;
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
      editboxUserJsSaveButton.onclick = etCetera.saveAndRunUserJs;

      editboxUserJsContainer.appendChild(blackoutCurtain);
      editboxUserJsContainer.appendChild(editboxUserJsDiv);
      editboxUserJsDiv.appendChild(editboxUserJsCloseButton);
      editboxUserJsDiv.appendChild(editboxUserJsTitle);
      editboxUserJsDiv.appendChild(editboxUserJs);
      editboxUserJsDiv.appendChild(editboxUserJsSaveButton);

      return editboxUserJsContainer;
    };

    etCetera.saveAndRunUserJs = function() {
      var editboxUserJs = document.getElementById("editboxUserJs");
      if (!editboxUserJs) {
        return;
      };

      localStorage.user_js = editboxUserJs.value;

      etCetera.excuteUserJs();
    };

    etCetera.excuteUserJs = function() {
      if (localStorage.user_js) {
        try { eval( localStorage.user_js ); }
        catch(e) { alert(e); };
      };
    };

    etCetera.setInnerPostStyle = function(destStyle) {
      var innerPostList = document.getElementsByClassName("innerPost");
      var srcStyle;
      if (0 < innerPostList.length) {
        srcStyle = window.getComputedStyle( innerPostList[0], null );
      };
      if (srcStyle) {
        destStyle.background = srcStyle.backgroundColor;
        destStyle.borderTopColor = srcStyle.borderTopColor;
        destStyle.borderLeftColor = srcStyle.borderLeftColor;
        destStyle.borderBottomColor = srcStyle.borderBottomColor;
        destStyle.borderRightColor = srcStyle.borderRightColor;
        destStyle.fontSize = srcStyle.fontSize;
        destStyle.color = srcStyle.color;
      };
    };

    etCetera.movePostBox = function() {
      if (0 <= document.location.href.indexOf("/res/")) {
        var postBox = document.getElementById("postBox");
        if (postBox) {
          document.body.appendChild(postBox);
        };
      };
    };

    etCetera.setCheckboxOfDancingMascot = function() {
      if (null === document.body) {
        document.addEventListener("DOMContentLoaded", etCetera.setCheckboxOfDancingMascot);
        return;
      };
      etCetera.hideLibrejpBottomLeftMascot =
        'true' === utils.getSetting('ymncLibrejpBottomLeftMascot');

      var input = document.createElement('INPUT');
      input.type = 'checkbox';
      input.id = 'myHideLibrejpBottomLeftMascot';
      input.onclick = etCetera.updateShowHideLibrejpBottomLeftMascot;
      input.checked = etCetera.hideLibrejpBottomLeftMascot;

      var label = document.createElement('LABEL');
      label.style.display = 'inline';
      label.appendChild(input);
      label.appendChild( document.createTextNode( "右下マスコット非表示" ) );

      var origin = document.querySelector('select[name=switchcolorcontrol]');

      if (origin) {
        origin.parentElement.appendChild(label);
      };

      etCetera.updateShowHideLibrejpBottomLeftMascot();
    };

    etCetera.updateShowHideLibrejpBottomLeftMascot = function(ev) {

      var style_id = "styleHideLibrejpBottomLeftMascot";

      if (ev) {
        etCetera.hideLibrejpBottomLeftMascot = ev.target.checked;
        utils.setSetting('ymncLibrejpBottomLeftMascot', etCetera.hideLibrejpBottomLeftMascot );
      };

      var style = document.getElementById( style_id );

      if (etCetera.hideLibrejpBottomLeftMascot) {

        if (null === style) {
          style = document.createElement('STYLE');
          style.type = "text/css";
          style.id = style_id;
          style.innerHTML =
            "body:after, body:before { content: none !important; }"
            + "body:before { content: none !important; }";
          document.head.appendChild(style);
        };

      } else {
        if (null !== style) {
          style.parentElement.removeChild(style);
        };
      };
    };

    etCetera.setCheckboxOfMaskFilenameMode = function() {
      if (null === document.body) {
        document.addEventListener("DOMContentLoaded", etCetera.setCheckboxOfMaskFilenameMode);
        return;
      };

      etCetera.maskFilename =
        'true' === utils.getSetting('ymncMaskFilename');

      var input = document.createElement('INPUT');
      input.type = 'checkbox';
      input.id = 'ymncMaskFilenameCheckbox';
      input.onclick = etCetera.updateMaskFilenameMode;
      input.checked = etCetera.maskFilename;

      var label = document.createElement('LABEL');
      label.style.display = 'block';
      label.appendChild(input);
      label.appendChild( document.createTextNode('常に投稿ファイル名をマスクする') );

      var origin = document.getElementById('postBox');
      if (origin) {
        origin.insertBefore( label, origin.firstChild );
      };
    };

    etCetera.updateMaskFilenameMode = function(ev) {

      if (ev) {
        etCetera.maskFilename = ev.target.checked;
        utils.setSetting('ymncMaskFilename', etCetera.maskFilename );
      };

      etCetera.maskAllFilename( etCetera.maskFilename );
    };

    /* filename から拡張子を得る。
     * 拡張子の長さが"."を含めずにmaxExtLen以上の長さの場合は、拡張子とみなさず空白を返す。
     * maxExtLen: 省略時は4
     */
    etCetera.getFilenameExtension = function( filename, maxExtLen) {

      if (! maxExtLen) {
        maxExtLen = 4;
      };

      var dotpos = filename.lastIndexOf(".");

      if (0 > dotpos) {
        return "";
      };

      var lastPart = filename.substring(dotpos);

      if (1 + maxExtLen < lastPart.length) {
        return "";
      };

      return lastPart;
    };

    etCetera.defineProperty = function( obj, propertyName, propertyValue) {

      Object.defineProperty( obj, propertyName,
          { enumerable: false,
            configurable: false,
            writable: true,
            value: propertyValue } );
    };

    /* 設定によりFile名を自動的に設定する時の関数 */
    etCetera.maskAllFilename = function(doMaskIfTrue) {

      if (null == window.selectedFiles) {
        return;
      };

      /* Tor-BrowserではDateの精度が落とされ下2桁が00になる。対策で乱数を足す */
      var randomNum = (+new Date()) + Math.floor(Math.random() * 99);

      for (var idx = 0, len = window.selectedFiles.length; idx < len ; ++idx) {

        var file = window.selectedFiles[idx];

        /* file.ymncFilenameMaskMode は
         *  undefined: 元のファイル名のまま
         *   "random": プログラムが指定したランダムな名前
         *     "user": ユーザーが指定した名前
         * この関数では doMaskIfTrue が false の場合でも、"user" のマスクは外さない
         */

        if (doMaskIfTrue && file.ymncFilenameMaskMode === undefined) {
          /* マスク要求、現在マスクしていないからマスクする */
          file.ymncOriginalName = file.name.toString(); /* cloneがわりのtoString */
          etCetera.defineProperty( file, 'name',
              randomNum.toString() + etCetera.getFilenameExtension( file.name ) );
          file.ymncFilenameMaskMode = "random";

        } else if (doMaskIfTrue && file.ymncFilenameMaskMode !== undefined) {
          /* マスク要求だが、現在マスク済だからなにもしない */
        } else if (! doMaskIfTrue && file.ymncFilenameMaskMode === undefined) {
          /* マスク外し要求だが、現在マスクしていないのでなにもしない */
        } else if (! doMaskIfTrue && file.ymncFilenameMaskMode === "user") {
          /* マスク外し要求だが、現在ユーザー指定だから外さない */

        } else if (! doMaskIfTrue && file.ymncFilenameMaskMode === "random") {
          /* マスク外し要求、その通り外す */
          etCetera.defineProperty( file, 'name', file.ymncOriginalName );
          file.ymncFilenameMaskMode = undefined;
        } else {
          document.body.appendChild( document.createTextNode(
            "yamanu-changにバグ(etCetera.maskAllFilename)" ) );
        };

        ++randomNum;
      };

      etCetera.updateSelectedFilenameLabels();
    };

    etCetera.updateSelectedFilenameLabels = function updateSelectedFilenameLabels() {

      var nameLabelList = document.getElementsByClassName("nameLabel");

      var formCount = 1; /* メインフォームの分の1 */
      var quickReplyElt = document.getElementById("quick-reply");

      if (quickReplyElt) {
        ++formCount;
      };

      var nlIdx = 0;
      /* var nlLen = nameLabelList.length; */

      for (; 0 < formCount ; --formCount) {

        for (var sfIdx = 0, sfLen = window.selectedFiles.length; sfIdx < sfLen ;
             ++sfIdx, ++nlIdx) {

          var nameLabel = nameLabelList[nlIdx];
          while ( nameLabel.firstChild) {
            nameLabel.removeChild( nameLabel.firstChild );
          };

          var nameInput = document.createElement("INPUT");
          nameInput.value = window.selectedFiles[sfIdx].name;
          nameInput.style.width = "75%";

          var setFilenameFunc = (function() {
            var index = sfIdx;
            return function (ev) {
              if (window.selectedFiles[ index ].name === ev.target.value) {
                return true;
              };
              if (undefined === window.selectedFiles[ index ].ymncFilenameMaskMode) {
                /* cloneがわりのtoString */
                window.selectedFiles[ index ].ymncOriginalName =
                  window.selectedFiles[ index ].name.toString();
              };
              window.selectedFiles[ index ].ymncFilenameMaskMode = "user";
              etCetera.defineProperty( window.selectedFiles[ index ],
                  "name", ev.target.value );
              return true;
            };
          } )();
          nameInput.addEventListener("blur", setFilenameFunc );
          /* nameInput.addEventListener("keyup", setFilenameFunc ); */

          var modosuButton = document.createElement("SPAN");
          modosuButton.appendChild( document.createTextNode("元") );
          modosuButton.title = "元のファイル名に戻します(" + window.selectedFiles[ sfIdx ].ymncOriginalName + ")";
          var setOriginalFilenameFunc = (function() {
            var index = sfIdx;
            return function (ev) {
              if (undefined !== window.selectedFiles[ index ].ymncOriginalName) {
                etCetera.defineProperty( window.selectedFiles[ index ],
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
          var setRandomFilenameFunc = (function() {
            var index = sfIdx;
            return function (ev) {
              if (undefined === window.selectedFiles[ index ].ymncOriginalName) {
                window.selectedFiles[ index ].ymncOriginalName =
                  window.selectedFiles[ index ].name.toString();
              };
              etCetera.defineProperty( window.selectedFiles[ index ],
                  "name", ((+new Date()) + Math.floor(Math.random() * 99)).toString()
                  + etCetera.getFilenameExtension(
                    window.selectedFiles[ index ].ymncOriginalName ) );
              window.selectedFiles[ index ].ymncFilenameMaskMode = "random";

              updateSelectedFilenameLabels();
              return true;
            };
          } )();
          randomizeButton.addEventListener("click", setRandomFilenameFunc );

          modosuButton.style.cursor = 'pointer';
          randomizeButton.style.cursor = 'pointer';

          nameLabel.appendChild(nameInput);
          nameLabel.appendChild(modosuButton);
          nameLabel.appendChild( document.createTextNode(" ") );
          nameLabel.appendChild(randomizeButton);

        };
      };
    };

    etCetera.setPostCellPlayersLoopMode = function(postCell) {

      var videos = postCell.getElementsByTagName('VIDEO');
      for (var vIdx = videos.length - 1; -1 < vIdx; vIdx = vIdx - 1 | 0) {
        videos[vIdx].setAttribute('loop', true);
      };

      var audios = postCell.getElementsByTagName('AUDIO');
      for (var aIdx = audios.length - 1; -1 < aIdx; aIdx = aIdx - 1 | 0) {
        audios[aIdx].setAttribute('loop', true);
      };
    };

    etCetera.overrideEmbedYoutubeButton = function(youtube_wrapper) {
      if ("1" === youtube_wrapper.getAttribute("data-tsk-overrode")) {
        return 0;
      };
      var embedButtons = youtube_wrapper.getElementsByTagName('A');
      if (0 >= embedButtons.length) {
        return -1;
      };
      var embedButton = embedButtons[0];
      embedButton.onclick = null;
      embedButton.addEventListener("click", etCetera.onYoutubeEmbedButtonClick);
      embedButton.replaceChild(document.createTextNode("embeD") , embedButton.firstChild);
      youtube_wrapper.setAttribute("data-tsk-overrode","1");
      return 1;
    };

    etCetera.overrideEmbedNiconicoButton = function( niconico_wrapper) {
      if ("1" === niconico_wrapper.getAttribute("data-tsk-overrode")) {
        return 0;
      };
      var embedButtons = niconico_wrapper.getElementsByTagName('A');
      if (0 >= embedButtons.length) {
        return -1;
      };
      var embedButton = embedButtons[0];
      embedButton.onclick = null;
      embedButton.addEventListener("click", etCetera.onNiconicoEmbedButtonClick );
      embedButton.replaceChild( document.createTextNode("embeD") , embedButton.firstChild );
      niconico_wrapper.setAttribute("data-tsk-overrode","1");
      return 1;
    };

    etCetera.onYoutubeEmbedButtonClick = function(ev) {
      var iframes = this.parentElement.getElementsByTagName('IFRAME');
      if (0 < iframes.length) {
        var brs = this.parentElement.getElementsByTagName('BR');
        for (var ifIdx = 0, ifLen = iframes.length; ifIdx < ifLen ; ++ifIdx) {
          iframes[ifIdx].parentElement.removeChild( iframes[ifIdx] );
        };
        for (var brIdx = 0, brLen = brs.length; brIdx < brLen ; ++brIdx) {
          brs[brIdx].parentElement.removeChild( brs[brIdx] );
        };
        this.replaceChild( document.createTextNode("embeD"), this.firstChild );
        ev.preventDefault();
        return false;
      };
      var youtubeUri = this.href.replace(/youtu.be\//,"www.youtube.com/watch?v=")
            .replace(/watch\?v=/, 'embed/') + "?autoplay=1";
      if ("https:" == location.protocol) {
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

    etCetera.getAncestorPostCellId = function(elt) {
      for (;; elt = elt.parentElement) {
        if (elt.parentElement.tagName == 'BODY') {
          return null;
        };
        if (0 <= elt.className.indexOf("postCell")) {
          return elt.id;
        };

      };
      return null;
    };

    etCetera.onNiconicoEmbedButtonClick = function(ev) {
      var iframes = this.parentElement.getElementsByTagName('IFRAME');
      var divs = this.parentElement.getElementsByTagName('DIV');
      if (0 < iframes.length || 0 < divs.length) {
        for (var ifIdx = 0, ifLen = iframes.length; ifIdx < ifLen ; ++ifIdx) {
          iframes[ifIdx].parentElement.removeChild( iframes[ifIdx] );
        };
        for (var dvIdx = 0, dvLen = divs.length; dvIdx < dvLen ; ++dvIdx) {
          divs[dvIdx].parentElement.removeChild( divs[dvIdx] );
        };
        var brs = this.parentElement.getElementsByTagName('BR');
        for (var brIdx = 0, brLen = brs.length; brIdx < brLen ; ++brIdx) {
          brs[brIdx].parentElement.removeChild( brs[brIdx] );
        };

        this.replaceChild( document.createTextNode("embeD"), this.firstChild );
        ev.preventDefault();
        return false;
      };

      if ("https:" == location.protocol) {
        var div = document.createElement('DIV');
        div.style.border = "1px solid red";
        var br = document.createElement('BR');
        var anchor = document.createElement("A");
        anchor.href = this.href;
        anchor.appendChild( document.createTextNode(this.href) );

        div.appendChild( document.createTextNode("埋め込み不可: https —×→ http" ) );
        div.appendChild(br);
        div.appendChild(anchor);

        this.parentElement.appendChild(div);

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
      this.parentElement.appendChild(iframe);
      this.replaceChild( document.createTextNode("closE"), this.firstChild );
      ev.preventDefault();
      return false;
    };

    etCetera.overrideWrapperAll = function() {
      var IntermittentLoops = utils.IntermittentLoops;
      var iloops = IntermittentLoops();
      var idx = 0;
      var youtubeWrappers;
      var niconicoWrappers;
      var break_ = false;
      var continue_ = true;

      iloops.push( function() {
        youtubeWrappers = document.getElementsByClassName('youtube_wrapper');
        idx = youtubeWrappers.length - 1;
      } ).push( function() {
        if (-1 >= idx) {
          return break_;
        };
        etCetera.overrideEmbedYoutubeButton( youtubeWrappers[ idx ] );
        --idx;
        return continue_;
      } ).push( function() {
        niconicoWrappers = document.getElementsByClassName('niconico_wrapper');
        idx = niconicoWrappers.length - 1;
      } ).push( function() {
        if (-1 >= idx) {
          return break_;
        };
        etCetera.overrideEmbedNiconicoButton( niconicoWrappers[ idx ] );
        --idx;
        return continue_;
      } ).beginAsync();
    };

    etCetera.defaultEmbedOpen = function( embedButton, playerWrapper, options) {
      var iframe = document.createElement('IFRAME');
      iframe.width = options.width || 560;
      iframe.height = options.height || 315;
      iframe.src = options.src;
      iframe.allowfullscreen = options.allowfullscreen || true;
      iframe.frameborder = options.frameBorder || "no";
      iframe.scrolling = options.scrolling || "no";
      iframe.style.maxWidth = "100%";
      playerWrapper.appendChild(iframe);
    };

    etCetera.appendEmbedControl = function(anchor, options) {
      var wrapper = document.createElement('SPAN');
      var button = document.createElement('A');
      var playerWrapper = document.createElement('SPAN');
      button.href = anchor.href;
      playerWrapper.style.display = 'none';
      button.textContent = "embeD";
      wrapper.appendChild( document.createTextNode(" [") );
      wrapper.appendChild(button);
      wrapper.appendChild( document.createTextNode("]") );
      wrapper.appendChild(playerWrapper);

      button.setAttribute('data-embeded', "false");
      button.addEventListener("click", function(ev) {
        ev.preventDefault();
        var button = this;
        if ("false" === button.getAttribute('data-embeded')) {
          button.setAttribute('data-embeded', "true");
          button.textContent = "closE";
          etCetera.defaultEmbedOpen( button, playerWrapper, options );
          playerWrapper.style.display = 'inline';
          return;
        };
        button.textContent = "embeD";
        button.setAttribute('data-embeded', "false");
        if ('remove' === options.closeStyle) {
          while(playerWrapper.firstChild) {
            playerWrapper.removeChild( playerWrapper.firstChild );
          };
        };
        playerWrapper.style.display = 'none';
        return;
      } );

      anchor.parentNode.insertBefore( wrapper, anchor.nextSibling );
    };

    etCetera.enableSoundcloudEmbed = function(anchor) {
      if (( 0 !== anchor.href.lastIndexOf( "https://soundcloud.com/", 0 ) &&
            0 !== anchor.href.lastIndexOf( "http://soundcloud.com/", 0 ) ) ||
          anchor.href == "https://soundcloud.com/" ||
          utils.endsWith( anchor.pathname, "/tracks" ) ||
          3 >= anchor.href.toString().split("/").length) {
        return false;
      };

      var o = {}; /* ref. defaultEmbedOpen */
      o.width = "100%";
      o.height = "166";
      o.scrolling = "no";
      o.frameborder = "no";
      o.src = "https://w.soundcloud.com/player/?url=" + encodeURIComponent(anchor.href)
        + "&auto_play=true";
      o.closeStyle = 'remove';

      etCetera.appendEmbedControl(anchor, o );
      return true;
    };

    etCetera.enableYoutubeEmbed = function(anchor) {
      if (0 !== anchor.href.lastIndexOf("https://youtu.be/", 0) &&
          0 !== anchor.href.lastIndexOf("https://www.youtube.com/watch?") &&
          0 !== anchor.href.lastIndexOf("http://youtu.be/", 0 ) &&
          0 !== anchor.href.lastIndexOf("http://www.youtube.com/watch?")) {
        return false;
      };

      var uri = anchor.href.replace(/youtu.be\//,"www.youtube.com/watch?v=")
            .replace(/watch\?v=/, 'embed/').replace(/(^[^&]*)&/, '$1?');
      /* .replace(/([&?])t=/,'$1start='); */
      if (0 <= uri.indexOf('?')) {
        uri = uri + '&autoplay=1';
      } else {
        uri = uri + '?autoplay=1';
      };

      if ("https:" == location.protocol) {
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

      etCetera.appendEmbedControl(anchor, o );
      return true;
    };

    etCetera.insertFakeRefreshButton = function() {
      var refreshButton = document.getElementById("refreshButton");
      if (null == refreshButton) {
        return;
      };
      var fakeRefresh = document.createElement('A');
      fakeRefresh.addEventListener("click",function() {
        window.lastReplyId = 0;
        window.refreshPosts(true);
      } );
    };

    etCetera.presetImageGeometry = function() {
      var iloops = utils.IntermittentLoops();
      var imgLinks;
      var idx = 0;
      var len = 0;
      iloops.push( function() {
        imgLinks = document.getElementsByClassName('imgLink');
      } ).push( function() {
        idx = 0;
        len = imgLinks.length;
      } ).push( function() {
        if (idx >= len) {
          return false;
        };
        var imgLink = imgLinks[idx];
        var img = imgLink.firstChild;
        if (null == img) {
          return true;
        };
        imgLink.style.minWidth = 255;
        imgLink.style.minHeight = 255;

        return true;
      } ).beginAsync();

    };

    etCetera.jaDateFormat = function jaDateFormat(d) {
      /* 2016/12/31(Sat)13:59:59 形式 */
      var leftpad = utils.leftpad;
      var year, month, date, hours, minutes, seconds, day;

      [ year, month, date, day, hours, minutes, seconds ] =
        utils.getYearMonthDateDayHoursMinutesSeconds(d);

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

    etCetera.firstLanguage =
      (window.navigator.languages && window.navigator.languages[0]) ||
      window.navigator.language ||
      window.navigator.userLanguage ||
      window.navigator.browserLanguage;

    etCetera.dateFromStringForOverride = function dateFromStringForOverride(str) {
      var firstLanguage = etCetera.firstLanguage;

      var m = str.match(/(\d+)\/(\d+)\/(\d+)\s+\([A-Za-z]+\)\s+(\d+):(\d+):(\d+)/);
      if (m) {
        var d = new Date();
        d.setUTCFullYear(+m[3]);
        d.setUTCMonth(+m[1]-1);
        d.setUTCDate(+m[2]);
        d.setUTCHours(+m[4]);
        d.setUTCMinutes(+m[5]);
        d.setUTCSeconds(+m[6]);

        if ('ja' === firstLanguage ||
            'ja-JP' === firstLanguage) {
          return etCetera.jaDateFormat(d);
        };
        return d.toLocaleString(firstLanguage)
          + ' ('+d.toLocaleString(firstLanguage, {weekday:"short"} )+')';
      };
      return undefined;
    };

    etCetera.overrideDateFromString = function overrideDateFromString() {

      if (undefined === window.dateFromString) {
        if ('complete' === document.readyState) {
          return;
        };
        setTimeout( overrideDateFromString, 0 );
        return;
      };

      if ('function' !== typeof( window.dateFromString )) {
        return;
      };

      window.dateFromString = etCetera.dateFromStringForOverride;
      if ('function' === typeof( window.updateTimes )) {
        window.updateTimes();
      };
    };

    etCetera.fixGoogleChromeMp3Mime = function fixGoogleChromeMp3Mime() {
      if (undefined === window.sendReplyData) {
        if ('complete' === document.readyState) {
          return;
        };
        setTimeout( fixGoogleChromeMp3Mime, 0 );
        return;
      };
      if ('function' !== typeof( window.sendReplyData ) ||
          'function' !== typeof( window.checkExistance )) {
        return;
      };

      var originalCheckExistance = window.checkExistance;
      window.checkExistance = function ymnccheckExistance() {
        if ('audio/mp3' === arguments[0].type) {
          arguments[0].type = 'audio/mpeg';
          Object.defineProperty( arguments[0], "type",
              { enumerable: false,
                configurable: false,
                writable: true,
                value: 'audio/mpeg' } );
        };
        return originalCheckExistance.apply( window, Array.prototype.slice.call(arguments) );
      };

      var fixMp3BlobMime = function(files) {
        try {
          var data_audio_mpeg = 'data:audio/mpeg;';
          var data_audio_mp3 = 'data:audio/mp3;';
          var IANA_mp3_mime = 'audio/mpeg';
          var Chrome_mp3_mime = 'audio/mp3';
          for (var i in files) {
            var file = files[ i ];
            if (0 == file.content.indexOf( data_audio_mp3 )) {
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
        } catch(e) {};
      };

      var originalSendReplyData = window.sendReplyData;
      window.sendReplyData = function ymncSendReplyData(files) {
        fixMp3BlobMime(files);
        return originalSendReplyData.apply( window, Array.prototype.slice.call(arguments) );
      };

      var originalQRsendReplyData = window.QRsendReplyData;
      window.QRsendReplyData = function ymncQRsendReplyData(files) {
        fixMp3BlobMime(files);
        return originalQRsendReplyData.apply( window, Array.prototype.slice.call(arguments) );
      };
    };

    etCetera.addConsecutiveNumberStyle = function() {
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
      document.head.appendChild(style);
    };

    etCetera.isHiddenCDAName = 'data-is-hidden';
    etCetera.insertButtonShowHidePostingForm = function() {
      var postingForm = document.getElementById('postingForm');
      var topAnchorElement = document.getElementById('top');
      if (null === postingForm ||
          null === topAnchorElement) {
        return;
      };
      var showHideAnchor = document.createElement('A');
      var showText = document.createTextNode('[Show hidden posting form]');
      showHideAnchor.appendChild(showText);

      showHideAnchor.setAttribute( etCetera.isHiddenCDAName, '1' );
      showHideAnchor.addEventListener('click', etCetera.showHidePostingForm);
      postingForm.style.display = 'none';

      topAnchorElement.parentElement.insertBefore( showHideAnchor, topAnchorElement.nextSibling );
    };

    etCetera.showHidePostingForm = function() {
      var showHideAnchor = this;
      var postingForm = document.getElementById('postingForm');
      if ('0' === showHideAnchor.getAttribute( etCetera.isHiddenCDAName )) {
        showHideAnchor.setAttribute( etCetera.isHiddenCDAName, '1' );
        postingForm.style.display = 'none';
        showHideAnchor.replaceChild( document.createTextNode('[Show hidden posting form]'),
            showHideAnchor.firstChild );
      } else {
        showHideAnchor.setAttribute( etCetera.isHiddenCDAName, '0' );
        postingForm.style.display = '';
        showHideAnchor.replaceChild( document.createTextNode('[Hide a posting form]'),
            showHideAnchor.firstChild );
      };
    };

    etCetera.getContentActionElement = function() {
      var reportFieldReason = document.getElementById('reportFieldReason');
      if (null == reportFieldReason ||
          null == reportFieldReason.parentElement ||
          null == reportFieldReason.parentElement.parentElement ||
          0 > reportFieldReason.parentElement.parentElement.className.indexOf('contentAction')) {
        return null;
      };
      return reportFieldReason.parentElement.parentElement;
    };

    etCetera.insertButtonShowHideContentAction = function() {
      if (null === document.body) {
        document.addEventListener("DOMContentLoaded", etCetera.insertButtonShowHideContentAction);
        return;
      };

      var contentAction = etCetera.getContentActionElement();
      if (null == contentAction) {
        return;
      };
      var showHideAnchor = document.createElement('A');
      showHideAnchor.appendChild( document.createTextNode('[+report/del form]') );
      showHideAnchor.setAttribute( etCetera.isHiddenCDAName, '1' );
      showHideAnchor.addEventListener('click', etCetera.showHideContentAction);

      contentAction.parentElement.insertBefore( showHideAnchor, contentAction );
      contentAction.style.visibility = 'hidden';
    };

    etCetera.showHideContentAction = function() {
      var showHideAnchor = this;
      var target = etCetera.getContentActionElement();
      var toShowText = '[+report/del form]';
      var toHideText = '[-report/del form]';

      if (null == target) {
        return;
      };
      if ('0' === showHideAnchor.getAttribute( etCetera.isHiddenCDAName )) {
        showHideAnchor.setAttribute( etCetera.isHiddenCDAName, '1' );
        target.style.visibility = 'hidden';
        showHideAnchor.replaceChild( document.createTextNode(toShowText),
            showHideAnchor.firstChild );
      } else {
        showHideAnchor.setAttribute( etCetera.isHiddenCDAName, '0' );
        target.style.visibility = 'visible';
        showHideAnchor.replaceChild( document.createTextNode(toHideText),
            showHideAnchor.firstChild );
      };
    };

    etCetera.getAutoRefreshCheckboxElement = function() {
      var labelRefresh = document.getElementById('labelRefresh');
      if (null === labelRefresh) {
        return null;
      };

      var break_ = false;
      var continue_ = true;
      var target = null;

      function f(descendant) {
        if ('INPUT' === descendant.tagName &&
            'checkbox' === descendant.type) {
          target = descendant;
          return break_;
        };
        return continue_;
      };
      utils.foreEachElementDescendants( labelRefresh.parentElement              , f );
      if (null !== target) {
        return target;
      };
      utils.foreEachElementDescendants( labelRefresh.parentElement.parentElement, f );

      return target;
    };

    etCetera.autoRefreshCheckboxPersistent = function() {
      var autoRefreshCheckbox = etCetera.getAutoRefreshCheckboxElement();
      if (null === autoRefreshCheckbox ||
          undefined === window.changeRefresh ||
          undefined === window.autoRefresh) {
        return;
      };

      if (false === window.autoRefresh) {
        /* サイト指定の初期値が false の場合は、この機能は動かさない */
        return;
      };

      /* ブラウザがチェックボックスの状態を覚えていて、ページを開いた時に状態を反映する。
       * autoRefresh の状態はチェックボックスに従わない。
       * autoRefresh はチェックボックスが初期状態で、checked だと思っている。
       * 上記の理由で、autoRefreshCheckbox.dispatchEvent だけで対応することは不可能 */

      if (autoRefreshCheckbox.checked !== window.autoRefresh) {
        window.changeRefresh();
      };

      if (autoRefreshCheckbox.checked !==
          ( 0 !== settings.getMiniData('ThreadAutoRefresh') )) {
        autoRefreshCheckbox.checked = !autoRefreshCheckbox.checked;

        window.changeRefresh();
      };
      autoRefreshCheckbox.addEventListener('change', etCetera.autoRefreshCheckboxOnChange );
    };

    etCetera.autoRefreshCheckboxOnChange = function() {
      var autoRefreshCheckbox = this;
      if (autoRefreshCheckbox.checked) {
        settings.setMiniData('ThreadAutoRefresh', 1);
      } else {
        settings.setMiniData('ThreadAutoRefresh', 0);
      };
    };

    etCetera.titleNewReplysCountReg = /^([(]\d*[)] ).*$/;
    etCetera.procTitle = function procTitle() {
      var boardUri = feWrapper.getBoardUri();
      var title = document.title;
      var newReplys = title.match( etCetera.titleNewReplysCountReg );
      if (null === newReplys) {
        newReplys = "";
      } else {
        newReplys = newReplys[1];
      };
      title = title.substring( newReplys.length );
      var prefix = '/' + boardUri + '/ - ';
      if (0 === title.lastIndexOf( prefix, 0 )) {
        document.title = newReplys + title.substring( prefix.length ) + ' - /' + boardUri + '/';
      };
    };

    /* override と言いつつ、新規設置も行う。
     * 引数は、postCell でなくてもかまわない */
    etCetera.overrideInlinePlayers = function overrideInlinePlayers(postCell) {
      var uploadCellList = postCell.getElementsByClassName('uploadCell');
      for (var idx = uploadCellList.length - 1; -1 < idx; idx = idx - 1 | 0) {
        etCetera.addHookToAudioInlinePlayer(uploadCellList[idx]);
      };
    };

    etCetera.addHookToAudioInlinePlayer = function addHookToAudioInlinePlayer(uploadCell) {
      var audioList = uploadCell.getElementsByTagName('AUDIO');
      var imgList = uploadCell.getElementsByTagName('IMG');
      if (0 >= audioList.length || 0 >= imgList.length) {
        return;
      };

      var img = imgList[0];
      img.addEventListener('click', function() { this.style.display = 'inline'; } );
    };

    etCetera.addQuote = function addQuote() {
      var postIdToQuote = this.hash.substring(2);

      if (typeof window.add_quick_reply_quote != "undefined") {
        window.add_quick_reply_quote(postIdToQuote);
      };

      document.getElementById('fieldMessage').value += '>>' + postIdToQuote + '\n';
    };

    etCetera.insertDeleteCookiesButton = function insertDeleteCookiesButton() {
      if (document.title.toLowerCase() == "400 request header or cookie too large") {
        var ButtonDeleteCookies = document.createElement("button");
        ButtonDeleteCookies.type = "button";
        ButtonDeleteCookies.innerHTML = "delete all cookies on this site(" + document.domain+ ")"
          + "<br> cookie length: " + document.cookie.length +"bytes";

        function deleteCookie(name) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        };
        ButtonDeleteCookies.onclick = function deleteAllCookies() {
          var cookies = document.cookie.split("; ");
          for (var idx = 0, len = cookies.length; idx < len ; ++idx) {
            var eqpos = cookies[ idx ].indexOf( "=" );
            if (0 > eqpos) {
              continue;
            };
            document.cookie = cookies[idx].substring(0, eqpos) + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
          };
          ButtonDeleteCookies.innerHTML = ButtonDeleteCookies.innerHTML + "<br> cookie length: " + document.cookie.length + "bytes";
        };
        document.body.appendChild(ButtonDeleteCookies);
      };
    };

    etCetera.removeNonJsSendButton = function removeNonJsSendButton() {
      /* エンターキーで送信暴発しちゃうのを防ぐために */
      var formButton = document.getElementById('formButton');

      if (formButton !== null && 'none' === formButton.style.display) {
        formButton.parentElement.removeChild(formButton);
      };
    };

    etCetera.disable = function disable() {
      var style = document.getElementById("postsConsecutiveNumberStyle");
      if (null != style) {
        style.parentElement.removeChild(style);
      };
    };

    etCetera.maxRetries = 5;
    etCetera.retryLoading = function (event) {
      /* event.target だけを使う */

      /* 連続アクセスが原因で503が起きているらしい。時間をあけてから処理する */
      setTimeout( function() {

        var target = event.target;
        var count = parseInt(target.getAttribute("data-yamanu-retries-count"));

        if (count < etCetera.maxRetries) {
          ++count;
          target.setAttribute("data-yamanu-retries-count", count.toString());
          event.target.src = event.target.src + "?t=" + (+new Date());

        } else {
          /* count が NaN の場合もここ */
          target.removeEventListener("error", etCetera.retryLoading);
        };
      }, 1500 );
    };

    etCetera.retryFailedImgTags = function() {
      var imgList = Array.apply(null, document.getElementsByTagName("IMG"));
      var imgIndex = 0, imgLength = imgList.length;

      for (; imgIndex < imgLength; ++imgIndex) {

        var img = imgList[imgIndex];

        if (0 <= img.src.indexOf("/.youtube/vi/")) {
          continue;
        };

        if (! img.complete) {
          img.setAttribute("data-yamanu-retries-count", "0");
          img.addEventListener("error", etCetera.retryLoading );

        } else if (0 === img.naturalWidth && 0 === img.naturalHeight) {
          img.setAttribute("data-yamanu-retries-count", "0");
          img.addEventListener("error", etCetera.retryLoading );
          etCetera.retryLoading( { "target": img} );
        };
      };
    };

    etCetera.qrJsRetriesCount = 0;
    etCetera.reloadQrJs = function() {
      if (5 <= etCetera.qrJsRetriesCount ||
          undefined !== window.show_quick_reply) {
        etCetera.uploadFileFromClipboard();
        window.toshakiii.filePreview.startQuickReplyObserver();
        return;
      };
      etCetera.qrJsRetriesCount = 1 + etCetera.qrJsRetriesCount;
      var script = document.createElement("SCRIPT");
      script.src = "/.static/qr.js?t=" + (+new Date());

      document.head.appendChild(script);

      setTimeout( etCetera.reloadQrJs, 1500 );
    };

    etCetera.retryFailedScriptSources = function() {
      /* 読み込みに失敗したjavascript sourcesを再読み込みする。
       * 2017年7月からある 503/502 エラー対策
       * DOMContentLoaded時点で読み込みエラーをキャッチすることはできない
       * だから泥臭い方法で再読み込みを行う
       * Firefox(55あたり)におけるキャッシュバグまではカバーできない */
      var scriptTags = document.getElementsByTagName("SCRIPT");
      var needToReloadQrJs = false;

      for (var scriptIndex = 0, scriptLength = scriptTags.length;
           scriptIndex < scriptLength ; ++scriptIndex) {

        if (0 <= scriptTags[ scriptIndex ].src.indexOf("/.static/qr.js") &&
            undefined === window.show_quick_reply) {

          needToReloadQrJs = true;
        };
      };
      if (needToReloadQrJs) {
        setTimeout( etCetera.reloadQrJs, 1500 );
      };
    };

    etCetera.retryFailedTags = function() {
      etCetera.retryFailedImgTags();
      etCetera.retryFailedScriptSources();
    };

    etCetera.getFileExtension = function(mime) {
      var mimeExt = {
        "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif",
        "audio/mp3": "mp3", "audio/mp4": "mp4", "audio/mpeg": "mp3",
        "video/mp4": "mp4", "video/webm": "webm", "video/x-flv": "flv",
        "text/plain": "txt"
      };

      var ext = mimeExt[mime];

      if (undefined===ext) {
        return "undefined";
      };
      return ext;
    };

    etCetera.getNormalizedMime = function(mime) {
      if ("audio/mp3"===mime) {
        return "audio/mpeg";
      };
      return mime;
    };

    etCetera.addHashToMessage = function() {
      if (null === window.selectedFiles || "true" !== localStorage["addHashToMessage"]) {
        return;
      };

      for (var idx in window.selectedFiles) {
        (function() {
          var file = window.selectedFiles[idx];
          var reader = new FileReader();

          if (! file.ymncAddedHashToMessage && "" !== file.type) {
            file.ymncAddedHashToMessage = true;
            var fieldMessage = document.getElementById('fieldMessage');
            var qrBody = document.getElementById("qrbody");

            reader.onloadend = function(e) {
              var mime = etCetera.getNormalizedMime(file.type);
              var md5 = window.SparkMD5.ArrayBuffer.hash(reader.result);
              var ext = etCetera.getFileExtension(mime);
              var str = "https://endchan.xyz/.media/" + md5 + '-' + mime.replace('/', '') + "." + ext + "\n";

              fieldMessage.value += str;
              if (qrBody) {
                qrBody.value += str;
              };
            };

            reader.readAsArrayBuffer(file);
          };
        })();
      };
    };

    etCetera.insertPostOptionCheckbox = function(settingName, labelString) {
      var input = document.createElement('INPUT');
      input.type = 'checkbox';
      input.id = settingName + "Checkbox";
      input.setAttribute("data-setting-name", settingName);
      input.onclick = etCetera.updatePostOptionCheckbox;
      input.checked = "true" === localStorage[settingName];

      var label = document.createElement('LABEL');
      label.style.display = 'box';
      label.appendChild(input);
      label.appendChild(document.createTextNode(labelString));

      var origin = document.getElementById('postBox');
      if (origin) {
        origin.insertBefore(label, origin.firstChild );
      };
    };

    etCetera.updatePostOptionCheckbox = function(e) {
      var settingName = e.target.getAttribute("data-setting-name");
      localStorage[settingName] = e.target.checked;
    };

    etCetera.interDomainLink = function() {
      if (null === document.body) {
        document.addEventListener("DOMContentLoaded", etCetera.interDomainLink);
        return;
      };
      switch(document.location.host) {
      default: return;
      case "endchan.xyz": case "endchan.net": case "infinow.net": case "endchan.org":
      case "endchan5doxvprs5.onion": case "s6424n4x4bsmqs27.onion":
      case "endchan5doxvprs5.onion.to": case "s6424n4x4bsmqs27.onion.to":
      };

      var topNavList = document.getElementsByClassName("topNav");
      var bottomNavList = document.getElementsByClassName("bottomNav");
      var top = document.getElementById("top");
      var bottom = document.getElementById("bottom");
      var boardHeaderList = document.getElementsByClassName("boardHeader");

      if (top) {
        top.parentElement.insertBefore(etCetera.createInterDomainLinkButton(), top.nextSibling);
        top.parentElement.insertBefore(document.createTextNode(" | "), top.nextSibling);
      };
      if (bottom) {
        bottom.parentElement.insertBefore(etCetera.createInterDomainLinkButton(), bottom.nextSibling);
        bottom.parentElement.insertBefore(document.createTextNode(" | "), bottom.nextSibling);
      };

      for (var tnIdx = 0, tnLen = topNavList.length; tnIdx < tnLen; ++tnIdx) {
        topNavList[tnIdx].appendChild(document.createTextNode(" | "));
        topNavList[tnIdx].appendChild(etCetera.createInterDomainLinkButton());
      };

      for (var bnIdx = 0, bnLen = bottomNavList.length; bnIdx < bnLen; ++bnIdx) {
        bottomNavList[bnIdx].appendChild(document.createTextNode(" | "));
        bottomNavList[bnIdx].appendChild(etCetera.createInterDomainLinkButton());
      };
    };

    etCetera.createInterDomainLinkButton = function() {
      var button = document.createElement("A");
      var openingText = "[-Domain]";
      var closingText = "[+Domain]";
      button.href = "#";
      button.textContent = closingText;
      button.setAttribute("data-expanded", "false");

      button.addEventListener("click", function(event) {
        if ("true"===event.target.getAttribute("data-expanded")) {
          button.setAttribute("data-expanded", "false");
          button.textContent = closingText;

          var element = event.target.domainLinksElement;
          element.parentElement.removeChild(element);
          button.domainLinksElement = undefined;
        } else {
          button.setAttribute("data-expanded", "true");
          button.textContent = openingText;

          button.domainLinksElement = etCetera.createInterDomainLinks();
          event.target.parentElement.insertBefore(button.domainLinksElement,
              event.target.nextSibling);
        };
        event.preventDefault();
        return false;
      });

      return button;
    };

    etCetera.createInterDomainLinks = function() {
      /* .onion.to には案内しない */
      var hosts = [ "https://endchan.xyz", "https://endchan.net", "https://endchan.org",
                    "http://endchan5doxvprs5.onion", "http://s6424n4x4bsmqs27.onion"];

      var createDomainsLinks = function(url) {
        var span = document.createElement("SPAN");
        if (0 === document.location.href.indexOf(url)) {
          span.style.fontWeight = "bold";
        };
        var anotherHere = utils.createTextLink(url + document.location.pathname
            + document.location.search + document.location.hash, "here");
        var blockBypass = utils.createTextLink(url + "/blockBypass.js", "bypass");
        var parts = document.location.href.split("/");

        span.appendChild(document.createTextNode(" [ "));
        span.appendChild(utils.createTextLink(url, url.replace(/https?:\/\//,"")));
        span.appendChild(document.createTextNode(" | "));
        span.appendChild(anotherHere);
        span.appendChild(document.createTextNode(" | "));
        span.appendChild(blockBypass);
        if (5 <= parts.length) {
          var catalog = utils.createTextLink(url + "/" + parts[3] + "/catalog.html", "catalog");
          span.appendChild(document.createTextNode(" | "));
          span.appendChild(catalog);
        };
        span.appendChild(document.createTextNode(" ] "));
        return span;
      };

      var span = document.createElement("SPAN");
      for (var hostIdx in hosts) {
        span.appendChild(createDomainsLinks(hosts[hostIdx]));
      };

      return span;
    };


    etCetera.enable = function enable() {
      /* etCetera.retryFailedTags(); */
      document.addEventListener("DOMContentLoaded", function() {
        etCetera.setFavicon();
      });

      /* feWrapper.postCellCP.appendAfterCP(etCetera.overrideWrapperAll); */
      feWrapper.messageUriHandlers.push(etCetera.enableSoundcloudEmbed);
      feWrapper.messageUriHandlers.push(etCetera.enableYoutubeEmbed);

      feWrapper.postCellCP.appendCP(etCetera.overrideInlinePlayers);
      feWrapper.postCellCP.appendCP(etCetera.setPostCellPlayersLoopMode);

      feWrapper.titleCP.appendAfterCP(etCetera.procTitle);

      /* setTimeout( etCetera.insertButtonShowHidePostingForm, 0 ); */
      setTimeout(etCetera.insertButtonShowHideContentAction, 0);

      setTimeout(etCetera.fixGoogleChromeMp3Mime, 0);

      setTimeout(etCetera.autoRefreshCheckboxPersistent, 0);

      setTimeout(etCetera.overrideDateFromString, 0);

      if (0 <= document.location.href.indexOf("/res/")) {
        setTimeout(etCetera.addConsecutiveNumberStyle, 0);
      };

      etCetera.insertDeleteCookiesButton();

      if (0 > document.location.href.indexOf("/catalog.html")) {
        etCetera.setCheckboxOfMaskFilenameMode();

        feWrapper.selectedDivOnChangeHandlers.push(etCetera.updateMaskFilenameMode);
      };
      etCetera.removeNonJsSendButton();

      if (0 <= document.location.href.indexOf("/librejp/")) {
        etCetera.setCheckboxOfDancingMascot();
      };

      /* etCetera.movePostBox(); */
      etCetera.UserJs();
      etCetera.uploadFileFromClipboard();
      etCetera.markdownTool();
      etCetera.insertMiscCSS();
      etCetera.autoPostingPassowrd();

      /* feWrapper.selectedDivOnChangeHandlers.push(etCetera.addHashToMessage);
       * etCetera.insertPostOptionCheckbox("addHashToMessage", "メッセージにファイルURLを含める");
       */
      localStorage.removeItem("addHashToMessage");

      setTimeout(etCetera.interDomainLink, 0);
    };

    etCetera.trigger = function() {
      etCetera.enable();
    };

    /**********************************
     * MultiPopup                    *
     **********************************/
    multiPopup.popups = {};
    /* { <Element Unique Id>: <Popup Info>, ... }
     *
     * <Popup Info>: {
     *   uid: <ElementUniqueId>:
     *   quoteAnchor: <HTMLAnchorElement>,
     *   targetPosition: {x:<int>, y:<int>},
     *   element: <HTMLElement>,
     *   phase: <int>,
     *   showTimer: <timer ID>,
     *   closeTimer: <timer ID>,
     *   parent: <ElementUniqueId>,
     *   children: [ <ElementUniqueId>, ... ],
     *   brothers: (reseved)[ <ElementUniqueId>, ... ],
     * }
     */
    multiPopup.POPUP_PHASE = {
      DO_NOTHING               : 0,
      COUNTDOWN_FOR_SHOW_POPUP : 1,
      NOW_SHOWING              : 2,
      COUNTDOWN_FOR_CLOSE_POPUP: 3
    };
    multiPopup.cache = {};
    /* { <URI> : { element: <HTMLElement>, message: <string> } } */
    multiPopup.defaultSettings = {
      'timeToPopup': 250/*ms*/,
      'timeToClosePopup': 350/*ms*/
    };
    multiPopup.panelBacklinksObservers = {};
    multiPopup.mouseClientPos = {x:0,y:0};

    multiPopup.preparePopupInfo = function(popups, arg2) {

      var uid, quoteAnchor;
      if ("string" === typeof(arg2)) {
        uid = arg2;
      } else {
        quoteAnchor = arg2;
        uid = utils.getElementUniqueId(quoteAnchor);
      };
      arg2 = undefined;

      if (undefined != popups[ uid ]) {
        return popups[ uid ];
      };
      popups[ uid ] = {
        'brothers'      : [],
        'children'      : [],
        'closeTimer'    : undefined,
        'element'       : undefined,
        'parent'        : undefined,
        'phase'         : multiPopup.POPUP_PHASE.DO_NOTHING,
        'quoteAnchor'   : quoteAnchor,
        'showTimer'     : undefined,
        'targetPosition': undefined,
        'uid'           : uid
      };
      return popups[ uid ];
    };

    multiPopup.setUidOfPopupParent = function( element, parentUid) {
      /* no parent‐child relation of DOM. parent-child relation of popups. */
      var cdaName = 'data-tsk-parent-popup-uid';
      element.setAttribute( cdaName, parentUid );
      return true;
    };

    multiPopup.getUidOfPopupParent = function(element) {
      var cdaName = 'data-tsk-parent-popup-uid';
      var parentUid = element.getAttribute(cdaName);
      if (undefined == parentUid) {
        return parentUid;
      };
      return parentUid;
    };

    multiPopup.getSettings = function(name) {
      if (undefined === settings[ name ]) {
        return multiPopup.defaultSettings[ name ];
      };
      return settings[ name ];
    };

    multiPopup.startCountdownForClosePopup = function(popupInfo) {
      if (multiPopup.POPUP_PHASE.NOW_SHOWING != popupInfo['phase']) {
        return false;
      };
      var timeToClosePopup = multiPopup.getSettings('timeToClosePopup');
      popupInfo['phase'] = multiPopup.POPUP_PHASE.COUNTDOWN_FOR_CLOSE_POPUP;
      popupInfo['closeTimer'] =
        setTimeout( function() { multiPopup.popupHasExpired( popupInfo, true ); },
            timeToClosePopup );
      return true;
    };

    multiPopup.startCountdownForShowPopup = function(popupInfo) {
      var uid = popupInfo['uid'];

      if (multiPopup.POPUP_PHASE.DO_NOTHING != popupInfo['phase']) {
        return false;
      };

      if (undefined != popupInfo['showTimer']) {
        return true;
      };

      popupInfo['phase'] = multiPopup.POPUP_PHASE.COUNTDOWN_FOR_SHOW_POPUP;
      var timeToPopup = multiPopup.getSettings( 'timeToPopup' );

      popupInfo['showTimer'] = setTimeout( function() {
        popupInfo['showTimer'] = undefined;
        multiPopup.showPopup(popupInfo);
      }, timeToPopup );

      return true;
    };

    multiPopup.extendExpirationDate = function extendExpirationDate(popupInfo) {
      var timeToClosePopup = multiPopup.getSettings('timeToClosePopup');

      if (multiPopup.POPUP_PHASE.COUNTDOWN_FOR_CLOSE_POPUP != popupInfo['phase']) {
        return false;
      };
      var timer = popupInfo['closeTimer'];
      if (undefined != timer) {
        clearTimeout( popupInfo['closeTimer'] );
      };
      popupInfo['closeTimer'] = undefined;
      popupInfo['phase'] = multiPopup.POPUP_PHASE.NOW_SHOWING;

      if (undefined == popupInfo['parent']) {
        return true;
      };

      var parentPopupInfo = multiPopup.popups[ popupInfo['parent'] ];
      if (undefined == parentPopupInfo) {
        popupInfo['parent'] = undefined;
      } else {
        extendExpirationDate(parentPopupInfo);
      };
      return true;
    };

    multiPopup.touchElement = function(event) {
      var quoteLink = event.target;
      var popupInfo = multiPopup.preparePopupInfo( multiPopup.popups, quoteLink );

      multiPopup.removeOriginalPopupFeature(quoteLink);

      var PP = multiPopup.POPUP_PHASE;
      var rect;
      switch(popupInfo['phase']) {
      default:
      case PP.DO_NOTHING:
        popupInfo['targetPosition'] = {'x': event.pageX, 'y':event.pageY };
        multiPopup.startCountdownForShowPopup(popupInfo);
        return true;
      case PP.COUNTDOWN_FOR_SHOW_POPUP:
        popupInfo['targetPosition'] = {'x': event.pageX, 'y':event.pageY };
        return true;
      case PP.NOW_SHOWING:
        return true;
      case PP.COUNTDOWN_FOR_CLOSE_POPUP:
        multiPopup.extendExpirationDate(popupInfo);
        return true;
      };
      return true;
    };

    multiPopup.untouchElement = function(event) {
      var quoteLink = event.target;
      var popupInfo = multiPopup.preparePopupInfo( multiPopup.popups, quoteLink );

      var PP = multiPopup.POPUP_PHASE;
      if (PP.COUNTDOWN_FOR_SHOW_POPUP == popupInfo['phase']) {
        var timer = popupInfo['showTimer'];
        if (undefined != timer) {
          clearTimeout(timer);
          popupInfo['showTimer'] = undefined;
        };
        popupInfo['phase'] = PP.DO_NOTHING;
        return true;
      }
      else if (PP.NOW_SHOWING == popupInfo['phase']) {
        multiPopup.startCountdownForClosePopup(popupInfo);
      };
      return true;
    };


    multiPopup.getRelatedPostCell = function getAncientPostCell(element) {
      if (null == element) {
        return null;
      };
      if (document.body == element) {
        return null;
      }
      if (0 <= element.className.indexOf("postCell")) {
        return element;
      };
      return getAncientPostCell( element.parentElement );
    };

    multiPopup.getRelatedDivMessage = function(element) {
      var postCell = multiPopup.getRelatedPostCell(element);
      if (null == postCell) {
        return null;
      };
      var divMessageList = postCell.getElementsByClassName("divMessage");
      if (0 < divMessageList.length) {
        return divMessageList[0];
      };
      return null;

    };

    multiPopup.downloadPostCell = function(popupInfo, callback) {
      var quoteAnchor = popupInfo['quoteAnchor'];
      var msg;
      if (quoteAnchor.host != location.host) {
        callback( popupInfo, null, msg );
        return;
      };

      if (0 > quoteAnchor.pathname.indexOf("/res/")) {
        callback( popupInfo, null, "unexpected uri:" + quoteAnchor );
        return;
      };

      var pathname = quoteAnchor.pathname;
      var hash = quoteAnchor.hash;
      var uri = "";
      if (0 == hash.length) {
        uri = pathname.replace("/res/","/preview/");
      } else if (0 == hash.indexOf("#q")) {
        uri = pathname.replace(/\/res\/[^\/]*/,"/preview/") + hash.substring(2) + ".html";
      } else {
        uri = pathname.replace(/\/res\/[^\/]*/,"/preview/") + hash.substring(1) + ".html";
      };
      uri = "//" + quoteAnchor.host + uri;
      /* ex. "//yamanu.org/chan/preview/123.html" */

      if (undefined != multiPopup.cache[ uri ]) {
        var postCell = multiPopup.cache[ uri ]['element'];
        if (null != postCell) {
          postCell = postCell.cloneNode(true);
        };
        callback( popupInfo, postCell, multiPopup.cache[ uri ]['message'] );
        return;
      };

      callback( popupInfo, null, "now loading" );

      var xhr = new XMLHttpRequest();
      var fullUri = location.protocol + uri; /* for message */
      xhr.onreadystatechange = function() {
        switch( this.readyState) {
        case 0:
        case 1:
        case 3:
          return;
        case 4:
          if (200 <= this.status &&
              300 >  this.status) {
            if ('document' != this.responseType) {
              msg = "unknown response contents(1): + " + this.responseType;
              multiPopup.cache[ uri ] = { 'message': msg };
              callback( popupInfo, null, msg );
              return;
            };

            /* freech: #panelContent は空。body 直下に .postCell がある */

            var postCellList = this.response.getElementsByClassName('postCell');
            if (0 >= postCellList.length) {
              msg = "unknown response contents: postCell not found: " + fullUri;
              multiPopup.cache[ uri ] = { 'message': msg };
              window.lastPanelContent = this.response;
              callback( popupInfo, null, msg );
              /*callback( popupInfo, null, msg );*/
              return;
            };
            var postCell = postCellList[0];
            postCell = utils.removeIdAll( document.importNode( postCell, true ) );
            multiPopup.cache[ uri ] = { 'element': postCell };
            callback( popupInfo, postCell );
            return;
          };
          msg = 'not found(HTTP ' + this.status + '): ' + fullUri;
          multiPopup.cache[ uri ] = { 'message': msg };
          callback( popupInfo, null, msg );
          return;
        };
      };
      xhr.responseType = 'document';
      xhr.open('GET', uri);
      xhr.send(null);

      return;
    };

    multiPopup.postCellContainsText = function(postCell, text) {
      return 0 <= postCell.textContent.indexOf(text);
    };

    multiPopup.lookForPostCellByGreenText = function(popupInfo, callback) {
      var text = popupInfo['quoteAnchor'].textContent.replace(/> */,"");
      var postCell = utils.getElementByClassNameFromAncestor(popupInfo['quoteAnchor'], "postCell");

      /* 上の postCell はポップアップの postCell かも知れない。元々の postCell を使ってたどる */
      postCell = postCell.originalPostCell || postCell;

      postCell = postCell.previousElementSibling;

      for (; null !== postCell; postCell = postCell.previousElementSibling) {

        if (0 <= postCell.className.indexOf("postCell") &&
            multiPopup.postCellContainsText(postCell, text)) {

          return callback(popupInfo, multiPopup.clonePostCellForPopup(postCell));
        };
      };
      return callback(popupInfo, null, "現在ページにはないよ");
    };

    multiPopup.clonePostCellForPopup = function(postCell) {
      var clone = postCell.cloneNode(true);

      var divPostsList = clone.getElementsByClassName("divPosts");
      for (var dpIdx = divPostsList.length - 1; -1 < dpIdx ; --dpIdx) {
        divPostsList[dpIdx].parentElement.removeChild( divPostsList[ dpIdx ] );
      };

      var postCellId = postCell.id;
      clone.originalPostCell = postCell;
      return clone;
    };

    multiPopup.lookForPostCellFromDocument = function(popupInfo, callback) {
      var quoteAnchor = popupInfo['quoteAnchor'];
      var postId = quoteAnchor.hash;

      if (0 == postId.length) {
        /* "/boardname/res/789.html" -> "789" */
        var matches = quoteAnchor.pathname.match(/.*\/([0-9]*).html/);
        if (null == matches) {
          return callback( popupInfo, null, "unexpected location");
        };
        postId = matches[1];
      } else if (0 == postId.indexOf("#q")) {
        postId = postId.substring(2); /* "#q123" -> "123" */
      } else {
        postId = postId.substring(1); /* "#456" -> "456" */
      };

      var postCell = document.getElementById(postId);
      if (null == postCell) {
        return callback(popupInfo, null, "no such post:No." + postId);
      };

      return callback(popupInfo, multiPopup.clonePostCellForPopup(postCell));
    };

    multiPopup.lookForPostCell = function(popupInfo, callback) {
      var here = location;
      var quoteAnchor = popupInfo['quoteAnchor'];
      var postCell;
      if (here.host == quoteAnchor.host &&
          here.port == quoteAnchor.port) {

        return multiPopup.lookForPostCellFromDocument(popupInfo, function( popupInfo, postCell,
            errorMessage) {

          if (null === postCell) {
            return multiPopup.downloadPostCell(popupInfo, callback);
          } else {
            return callback(popupInfo, postCell, errorMessage);
          };
        });
      };

      if ("A" === quoteAnchor.tagName) {
        return multiPopup.downloadPostCell(popupInfo, callback);
      } else {
        return multiPopup.lookForPostCellByGreenText(popupInfo, callback);
      };
    };

    multiPopup.showPopup = function( popupInfo, postCell, errorMessage) {

      var quoteAnchor = popupInfo['quoteAnchor'];
      if (undefined == postCell && undefined == errorMessage) {
        multiPopup.lookForPostCell(popupInfo, multiPopup.showPopup);
        return;
      };
      if (undefined != errorMessage) {
        postCell = document.createElement('DIV');
        postCell.appendChild( document.createTextNode(errorMessage) );
      };

      /* ポップアップの基準位置 */
      var originElement = multiPopup.getRelatedDivMessage(quoteAnchor);
      if (null == originElement) {
        originElement = quoteAnchor;
      };

      var quoteblock;
      if (undefined != popupInfo['element']) {
        if (null == popupInfo['element'].firstChild) {
          popupInfo['element'].appendChild(postCell);

        } else {
          popupInfo['element'].replaceChild( postCell, popupInfo['element'].firstChild );
        };
        quoteblock = popupInfo['element'];
      } else {
        quoteblock = document.createElement('DIV');
        quoteblock.appendChild(postCell);
      };

      quoteblock.className = "tskQuoteblock";
      var uid = popupInfo['uid'];
      multiPopup.processPostCell(postCell);

      var setParentUid = function(quoteLinkOrGreenText) {
        quoteLinkOrGreenText.setAttribute('data-tsk-parent-popup-uid', uid);
      };

      multiPopup.overridePostCellQuotePopups(postCell, setParentUid);
      multiPopup.enableGreenTextPopup(postCell, setParentUid);

      quoteblock.addEventListener("mouseout", function() {
        multiPopup.startCountdownForClosePopup(popupInfo); } );

      quoteblock.addEventListener("mousemove", function() {
        multiPopup.extendExpirationDate(popupInfo);
        return true; } );

      quoteblock.addEventListener("click", function() {
        multiPopup.extendExpirationDate(popupInfo);
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

      divThreads.appendChild(quoteblock);
      var height    = quoteblock.offsetHeight;
      var width     = quoteblock.offsetWidth;

      var targetPosition = popupInfo['targetPosition'];
      var top, left;
      if (undefined === originElement) {
        left = multiPopup.mouseClientPos.x;
        top = multiPopup.mouseClientPos.y;
      } else {
        var rect = originElement.getBoundingClientRect();
        left = rect.left + rect.height + scrollLeft;
        top  = rect.top  + rect.height + scrollTop;
        rect = undefined;
      };

      if (undefined != targetPosition) {
        left = targetPosition.x;
        top  = targetPosition.y;
      };

      var tmpRight  = left + width;
      var tmpBottom = top  + height;

      if (scrollRight < tmpRight) {
        left = scrollRight - width;
      };
      if (scrollBottom < tmpBottom) {
        if (height > window.innerHeight) {
          top = scrollTop;
        } else {
          top = scrollBottom - height;
        };
      };

      quoteblock.style.top  = ( top + 5 ) + "px";
      quoteblock.style.left = ( left + 5 ) + "px";

      var parentUid = multiPopup.getUidOfPopupParent(quoteAnchor);
      if (undefined != parentUid) {
        popupInfo['parent']  = parentUid;
        var parentPopupInfo = multiPopup.popups[ parentUid ];
        if (undefined != parentPopupInfo) {
          parentPopupInfo['children'].push( popupInfo['uid'] );
        };
      };
      popupInfo['phase']   = multiPopup.POPUP_PHASE.NOW_SHOWING;
      popupInfo['element'] = quoteblock;

      /* parent の期限を伸ばす: */
      multiPopup.extendExpirationDate(popupInfo);

      return;
    };
    /* end multiPopup.showPopup */

    multiPopup.popupHasExpired = function(popupInfo, deleteP) {
      var rect = popupInfo['element'].getBoundingClientRect();
      var mcx = multiPopup.mouseClientPos.x;
      var mcy = multiPopup.mouseClientPos.y;
      if (rect.left   <= mcx &&
          rect.right  >  mcx &&
          rect.top    <= mcy &&
          rect.bottom >  mcy  ) {
        popupInfo['closeTimer'] = undefined;
        popupInfo['phase'] = multiPopup.POPUP_PHASE.NOW_SHOWING;
        return;
      };
      multiPopup.closePopup( popupInfo, deleteP);
    };

    multiPopup.closePopup = function(popupInfo, deleteP) {
      for (var childIdx in popupInfo['children']) {
        var childUid = popupInfo['children'][ childIdx ];
        var child = multiPopup.popups[ childUid ];
        if (undefined != child) {
          multiPopup.closePopup(child);
        };
      };
      var element = popupInfo['element'];
      if (undefined != element) {
        if (undefined != element.parentElement) {
          element.parentElement.removeChild(element);
        };
        utils.toMarkElementDiscarded(element);
      };
      popupInfo['phase'] = multiPopup.POPUP_PHASE.DO_NOTHING;

      if (deleteP) {
        delete multiPopup.popups[popupInfo['uid']];
      };
    };

    multiPopup.dateToLastCheckMouseIsIn = 0;
    multiPopup.onBodyMouseMove = function(event) {
      var now = (+new Date());
      var intervalToCheck = 150;

      if (now >= (intervalToCheck + multiPopup.dateToLastCheckMouseIsIn)) {
        multiPopup.checkMouseIsIn(event);
        multiPopup.dateToLastCheckMouseIsIn = now;
      };

      multiPopup.mouseClientPos = {x:event.clientX, y:event.clientY};
      return;
    };

    multiPopup.checkMouseIsIn = function(event) {
      multiPopup.mouseClientPos = {x:event.clientX, y:event.clientY};

      var uidsToClosePopup = [];
      var popupInfo;
      for (var key in multiPopup.popups) {
        popupInfo = multiPopup.popups[key];
        if (multiPopup.POPUP_PHASE.NOW_SHOWING != popupInfo['phase']) {
          continue;
        };

        var rect2 = popupInfo['quoteAnchor'].getBoundingClientRect();
        var rect = popupInfo['element'].getBoundingClientRect();
        var mcx = multiPopup.mouseClientPos.x;
        var mcy = multiPopup.mouseClientPos.y;
        if ((rect.left   <= mcx &&
             rect.right  >  mcx &&
             rect.top    <= mcy &&
             rect.bottom >  mcy ) ||
            (rect2.left   <= mcx &&
             rect2.right  >  mcx &&
             rect2.top    <= mcy &&
             rect2.bottom >  mcy )) {
          continue;
        };
        uidsToClosePopup.push(key);
      };

      for (var idx in uidsToClosePopup) {
        key = uidsToClosePopup[idx];
        popupInfo = multiPopup.popups[key];
        if (undefined === popupInfo) {
          continue;
        };
        var descList = multiPopup.getPopupDescendants(popupInfo);
        var close = true;
        for (var deIdx in descList) {
          if (multiPopup.POPUP_PHASE.NOW_SHOWING === descList[deIdx]['phase']) {
            close = false;
            break;
          };
        };
        if (close) {
          multiPopup.closePopup(popupInfo, true);
        };
      };
    };

    multiPopup.disablePopup = function(anchor) {
      anchor.removeEventListener("mousemove", multiPopup.touchElement);
      anchor.removeEventListener("mouseout" , multiPopup.untouchElement);
    };

    multiPopup.removeOriginalPopupFeature = function(quoteAnchor) {
      /* click でその場所に飛ぶのは残す */
      quoteAnchor.onmouseenter = null;
      quoteAnchor.onmouseout = null;
    };

    multiPopup.enablePopup = function(element) {
      multiPopup.disablePopup(element);
      element.addEventListener("mousemove", multiPopup.touchElement);
      element.addEventListener("mouseout" , multiPopup.untouchElement);
    };

    multiPopup.processPostCell = function(postCell) {
      var linkQuoteList = postCell.getElementsByClassName('linkQuote');
      for (var lqIdx = linkQuoteList.length - 1; -1 < lqIdx ; --lqIdx) {
        var linkQuote = linkQuoteList[ lqIdx ];
        linkQuote.removeEventListener( "click", multiPopup.add_reply_quote );
        linkQuote.onclick = null;
        linkQuote.addEventListener( "click", multiPopup.add_reply_quote );
      };

      var imgList = postCell.getElementsByTagName("IMG");
      for (var imgIdx = 0, imgLen = imgList.length; imgIdx < imgLen; ++imgIdx) {
        imgList[imgIdx].removeAttribute("width");
        imgList[imgIdx].removeAttribute("height");
      };
    };

    multiPopup.sharpQRegexp = new RegExp("^#q[0-9]*");
    multiPopup.add_reply_quote = function() {
      var linkQuote = this;

      if (! multiPopup.sharpQRegexp.test( linkQuote.hash )) {
        return true;
      };
      var toQuote = linkQuote.hash.substring(2);

      if (undefined !== window.add_quick_reply_quote) {
        window.add_quick_reply_quote(toQuote);
      };

      var fieldMessage = document.getElementById('fieldMessage');
      if (null != fieldMessage) {
        fieldMessage.value += '>>' + toQuote + '\n';
      };

      return true;
    };

    multiPopup.enableGreenTextPopup = function(postCell, afterOverrideHook) {
      var greenTextList = postCell.getElementsByClassName('greenText');
      for (var gtIdx = 0, gtLen = greenTextList.length; gtIdx < gtLen; ++gtIdx) {
        multiPopup.enablePopup(greenTextList[gtIdx]);
        if (afterOverrideHook != undefined) {
          afterOverrideHook(greenTextList[gtIdx]);
        };
      }
    };


    multiPopup.overridePostCellQuotePopups = function(postCell, afterOverrideHook) {
      var quoteLinks = postCell.getElementsByClassName('quoteLink');
      for (var qlIdx = 0, qlLen = quoteLinks.length; qlIdx < qlLen ; ++qlIdx) {
        multiPopup.overrideQuotePopup( quoteLinks[ qlIdx ] );
        if (afterOverrideHook != undefined) {
          afterOverrideHook(quoteLinks[qlIdx]);
        };
      };

      var panelBacklinksList = postCell.getElementsByClassName('panelBacklinks');
      for (var pbIdx = 0, pbLen = panelBacklinksList.length; pbIdx < pbLen ; ++pbIdx) {
        multiPopup.overrideChildrenQuotePopup(panelBacklinksList[pbIdx], afterOverrideHook);
      };
    };

    multiPopup.overrideChildrenQuotePopup = function(panelBacklinks, afterOverrideHook) {
      if (undefined !== panelBacklinks.children) {
        for (var anIdx = 0, anLen = panelBacklinks.children.length; anIdx < anLen ; ++anIdx) {
          var child = panelBacklinks.children[anIdx];
          multiPopup.removeOriginalPopupFeature(child);
          multiPopup.enablePopup(child);
          if (afterOverrideHook != undefined) {
            afterOverrideHook(child);
          };
        };
      };
    };

    multiPopup.getPopupDescendants = function getPopupDescendants(obj, descList) {
      if (undefined == descList) {
        descList = [];
      };
      if (undefined == obj.children) {
        return descList;
      };
      for (var i in obj.children) {
        var child = multiPopup.popups[obj.children[i]];
        if (undefined == child) {
          continue;
        };
        descList.push(child);
        getPopupDescendants(child, descList);
      };
      return descList;
    };

    multiPopup.addBodyEvents = function() {
      multiPopup.removeBodyEvents();
      document.body.addEventListener("click"    , multiPopup.checkMouseIsIn );
      document.body.addEventListener("mousemove", multiPopup.onBodyMouseMove );
    };
    multiPopup.removeBodyEvents = function() {
      document.body.removeEventListener("click"    , multiPopup.checkMouseIsIn );
      document.body.removeEventListener("mousemove", multiPopup.onBodyMouseMove );
    };

    multiPopup.overrideQuotePopup = function(quoteLink) {
      multiPopup.removeOriginalPopupFeature(quoteLink);
      multiPopup.enablePopup(quoteLink);
    };

    multiPopup.startObservePanelBacklinks = function(panelBacklinks) {
      var cdaName = "data-tsk-observing";
      var nid = utils.getElementUniqueId(panelBacklinks);
      var mo = multiPopup.panelBacklinksObservers[ nid ];
      var opts = { childList: true };
      if (undefined == mo) {
        mo = new MutationObserver( multiPopup.overrideChildrenQuotePopup );
        multiPopup.panelBacklinksObservers[ nid ] = mo;
        mo.observe( panelBacklinks, { childList: true } );
      };
      mo.observe( panelBacklinks, opts );
      panelBacklinks.setAttribute( cdaName, "1" );
      return;
    };

    multiPopup.stopObservePanelBacklinks = function(panelBacklinks) {
      var cdaName = "data-tsk-observing";
      var nid = utils.getElementUniqueId(panelBacklinks);
      var mo = multiPopup.panelBacklinksObservers[ nid ];
      if (undefined != mo) {
        mo.disconnect();
        delete multiPopup.panelBacklinksObservers[ nid ];
      };
      panelBacklinks.setAttribute( cdaName, "0" );
      return;
    };

    multiPopup.disableLoadQuote = function() {
      if (undefined === window.loadQuote) {
        if ('complete' === document.readyState) {
          return;
        };
        setTimeout( multiPopup.disableLoadQuote, 0 );
      };
    };

    multiPopup.trigger = function() {
      multiPopup.enable();
    };

    multiPopup.enable = function() {
      if (null === document.body) {
        document.addEventListener("DOMContentLoaded", multiPopup.enable);
        return;
      };
      multiPopup.addBodyEvents();
      /* etCetera の監視対象は .divPosts。Popup の挿入場所は .divPosts の親の親の中。
       * だから Popup 挿入時に冗長呼び出しにはならない */

      feWrapper.postCellCP.appendCP( multiPopup.overridePostCellQuotePopups );
      feWrapper.postCellCP.appendCP( multiPopup.enableGreenTextPopup );
      multiPopup.disableLoadQuote();

      var iloops = utils.IntermittentLoops();
      var links;
      var idx = 0;
      var break_ = false;
      var continue_ = true;
      var quoteblockList;

      iloops.push( function() {
        links = document.getElementsByClassName('quoteLink');
        idx = links.length - 1;
      } ).push( function() {
        if (-1 >= idx) { return break_; };
        multiPopup.overrideQuotePopup( links[ idx ] );
        --idx;
        return continue_;
      } ).push( function() {
        links = document.getElementsByClassName('panelBacklinks');
        idx = links.length - 1;
      } ).push( function() {
        if (-1 >= idx) { return break_; };
        var panelBacklinks = links[ idx ];
        multiPopup.overrideChildrenQuotePopup(panelBacklinks);
        multiPopup.startObservePanelBacklinks(panelBacklinks);
        --idx;
        return continue_;
      } ).beginAsync();
    };

    multiPopup.disable = function() {
      multiPopup.removeBodyEvents();
    };


    /**********************************
     * LynxChan Front-End Wrapper     *
     **********************************/
    feWrapper.selectedDivOnChangeHandlers = [];
    feWrapper.postCellCP = undefined;
    feWrapper.titleCP = undefined;
    feWrapper.quickReplyOnLoadHandlers = [];

    /*
     * 投稿内のURIアンカーを引数に渡される関数のリスト。
     * あるアンカーに対して、あるハンドラーが true を返した場合は、
     * 他のハンドラーを呼ばない
     */
    feWrapper.messageUriHandlers = [];

    feWrapper.postCellCPInit = function(postCellCP) {
      var divPostsList = document.getElementsByClassName('divPosts');
      if (0 >= divPostsList.length) {
        return;
      };

      postCellCP.setObservingElement( divPostsList[0] );
      postCellCP.setObservingOptions( { childList: true } );
      postCellCP.setFuncEnumExistingTargets( function() {
        return document.getElementsByClassName('postCell');
      } );
      postCellCP.setPreProc( utils.CompulsoryProcessing.prototype.preProc_enumAddedNodes );
    };

    feWrapper.callMessageUriHandlers = function(anchor) {

      for (var hndIdx = 0, hndLen = feWrapper.messageUriHandlers.length;
           hndIdx < hndLen ; ++hndIdx) {

        if (feWrapper.messageUriHandlers[hndIdx](anchor)) {
          /* like stopImmediatePropagation */
          return true;
        };
      };
      return false;
    };

    feWrapper.callMessageUriHandlersWithMessageUri = function(postCell) {
      var divMessageList = postCell.getElementsByClassName('divMessage');
      for (var idx = 0, len = divMessageList.length; idx < len ; ++idx) {
        var divMessage = divMessageList[idx];
        var anchorList = divMessage.getElementsByTagName('A');
        for (var ancIdx = anchorList.length - 1; -1 < ancIdx ; --ancIdx) {
          var anchor = anchorList[ ancIdx ];
          /* レスアンカーとか他で処理されたリンクを除外する
           * いい加減すぎるような、十分であるような。*/
          if (anchor.textContent === anchor.href) {
            feWrapper.callMessageUriHandlers(anchor);
          };
        };
      };
    };

    feWrapper.titleCPInit = function(titleCP) {
      titleCP.setObservingElement( document.head.getElementsByTagName('TITLE')[0] );
      titleCP.setObservingOptions( { childList: true} );
      titleCP.setFuncEnumExistingTargets( function() { return [titleCP.observingElement]; } );
    };

    feWrapper.enable = function() {
      feWrapper.titleCP = new utils.CompulsoryProcessing( feWrapper.titleCPInit );
      feWrapper.postCellCP = new utils.CompulsoryProcessing( feWrapper.postCellCPInit );
      feWrapper.postCellCP.appendCP( feWrapper.callMessageUriHandlersWithMessageUri );
    };

    feWrapper.getBoardUri = function() {
      /* /b/ の "b" とか、 /librejp/ の "librejp" とかを返す */
      if (undefined !== window.boardUri) {
        return window.boardUri;
      };
      return document.location.pathname.replace(/\/([^\/]*).*/,"$1");
    };

    feWrapper.disable = function() {};
    feWrapper.trigger = function() { feWrapper.enable(); };

    utils.trigger();
    settings.trigger();
    feWrapper.trigger();
    etCetera.trigger();
    filePreview.trigger();
    catalogSort.trigger();
    multiPopup.trigger();
  };

  /**********************************
   * main                           *
   **********************************/
  function main() {
    var lowerCaseUA = window.navigator.userAgent.toLowerCase();
    if (0 <= lowerCaseUA.indexOf("gecko") ||
        0 <= lowerCaseUA.indexOf("edge")) {
      modYamanuchang();
    } else {
      var script = document.createElement('SCRIPT');
      script.id = "yamanuchangScript";
      script.innerText = ""
        + "var toshakiii_errors = [];"
        + "try{"
        + "("+modYamanuchang.toString() +")();"
        + "}catch(e) {toshakiii_errors.push(e);};"
        + "if (0 != toshakiii_errors.length) { alert( toshakiii_errors ); };"
        + "";
      document.head.appendChild(script);
    };
  };

  main();

})();
