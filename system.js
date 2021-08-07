"use strict";

//   _    _ _
//  | | _(_) |_
//  | |/ / | __|
//  |   <| | |_
//  |_|\_\_|\__|
//
// THIS IS THE KIT KERNEL, KIT APPS FRAMEWORK AND KIT WINDOW SYSTEM
// http://web.kitit.ml/
// https://github.com/mtsgi/kit

// Copyright 2021 mtsgi
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

class System {
  static version = "0.2.1";
  static username = localStorage.getItem("kit-username");
  static appdir = localStorage.getItem("kit-appdir");
  static loc = { ...location };

  static bootopt = new URLSearchParams(location.search);

  static mouseX = 0;
  static mouseY = 0;

  static display = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  static selectedElement = null;
  static selectedText = null;

  static dom = (_pid, ..._elems) => {
    let q = "";
    if (!_elems.length) q = ",#winc" + _pid;
    else
      for (const i of _elems) {
        q += [",#winc", _pid, " ", i].join("");
      }
    return $(q.substring(1));
  };

  static qs = (_pid, ..._elems) => {
    let q = "";
    if (!_elems.length) q = ",#winc" + _pid;
    else
      for (let i of _elems) {
        q += [",#winc", _pid, " ", i].join("");
      }
    return document.querySelectorAll(q.substring(1));
  };

  static userarea = {};
  static recycle = {};

  static appCache = {};
  static args = {};
  static launchpath = {};

  static support = $.support;
  static debugmode = false;
  static isMobile = false;
  static serviceWorker = null;

  static battery = null;

  static log = [];
  static noop = () => {};

  static launchLock = false;

  static UI = {
    // Elements
    Header: {
      Dropdown: {}
    },
    Footer: {},
    Launcher: {},
    Sightre: {},
    ContextMenu: {},

    // Methods
    getWindow: (pid) => document.querySelector(`#w${pid}`),
    getWt: (pid) => document.querySelector(`#wt${pid}`),
    getWinc: (pid) => document.querySelector(`#winc${pid}`),
    getTask: (pid) => document.querySelector(`#t${pid}`)
  };

  static init = () => {
    // Set System.UI elements
    System.UI.Header.header = document.querySelector("header");
    System.UI.Header.desktops = document.querySelector("#desktops");
    System.UI.Header.sightre = document.querySelector("#kit-header-sightre");
    System.UI.Header.username = document.querySelector("#kit-header-username");
    System.UI.Header.unmax = document.querySelector("#kit-header-unmax");
    System.UI.Header.Dropdown.sound = document.querySelector("#dropdown-sound");
    System.UI.Header.time = document.querySelector("#kit-header-time");
    System.UI.Header.powerButton = document.querySelector(".power-button");

    System.UI.Footer.footer = document.querySelector("footer");

    System.UI.ContextMenu.contextMenu = document.querySelector("#kit-context");
    System.UI.ContextMenu.input = document.querySelector("#kit-context-input");
    System.UI.ContextMenu.elem = document.querySelector("#kit-context-elem");
    System.UI.ContextMenu.elemGroup = document.querySelector("#kit-contextgroup-elem");
    System.UI.ContextMenu.textGroup = document.querySelector("#kit-contextgroup-text");
    System.UI.ContextMenu.desktopGroup = document.querySelector("#kit-contextgroup-desktop");
    System.UI.ContextMenu.customGroup = document.querySelector("#kit-contextgroup-custom");

    System.UI.desktopSelector = document.querySelector("#kit-desktop-selector");
    System.UI.wallpaper = document.querySelector("#kit-wallpaper");

    if (localStorage.getItem("kit-pid")) pid = localStorage.getItem("kit-pid");

    if (!localStorage.getItem("kit-username"))
      localStorage.setItem("kit-username", "ユーザー");
    System.UI.Header.username.innerText = localStorage.getItem("kit-username");

    if (localStorage.getItem("kit-lock") == null)
      localStorage.setItem("kit-lock", "false");

    if (System.bootopt.get("safe"))
      System.UI.wallpaper.style.background = "#404040";
    else if (localStorage.getItem("kit-wallpaper")) {
      System.UI.wallpaper.style.background = localStorage.getItem("kit-wallpaper");
      System.UI.wallpaper.style.backgroundSize = "cover";
      System.UI.wallpaper.style.backgroundPosition = "center center";
    }

    if (!localStorage.getItem("kit-default-browser"))
      localStorage.setItem("kit-default-browser", "browser");

    if (localStorage.getItem("kit-darkmode") == "true") KWS.darkmode = true;

    if (System.bootopt.get("safe")) {
      document
        .querySelector("#kit-theme-file")
        .setAttribute("href", "./system/theme/theme-light.css");
    } else {
      if (!localStorage.getItem("kit-theme")) {
        localStorage.setItem("kit-theme", "theme-default.css");
      }
      document
        .querySelector("#kit-theme-file")
        .setAttribute("href", `./system/theme/${localStorage.getItem("kit-theme")}`);
    }

    if (!localStorage.getItem("kit-appdir"))
      localStorage.setItem("kit-appdir", "./app/");
    System.appdir = localStorage.getItem("kit-appdir");

    if (localStorage.getItem("kit-installed"))
      System.installed = JSON.parse(localStorage.getItem("kit-installed"));

    if (localStorage.getItem("kit-screentime"))
      KWS.screenTime = JSON.parse(localStorage.getItem("kit-screentime"));

    if (localStorage["kit-userarea"])
      System.userarea = JSON.parse(localStorage["kit-userarea"]);
    if (localStorage["kit-recycle"])
      System.recycle = JSON.parse(localStorage["kit-recycle"]);

    if (localStorage.getItem("kit-shutted-down") == "false") {
      Notification.push(
        "お知らせ",
        "kitは前回終了時、正しくシャットダウンされませんでした。",
        "system"
      );
    }
    localStorage.setItem("kit-shutted-down", false);

    Notification.push(
      "kitへようこそ",
      localStorage["kit-username"] + "さん、こんにちは。",
      "system",
      null,
      null,
      "documents/icon.png",
      [
        {
          label: "kitについて",
          func: () => System.launch("settings", { view: "about" })
        }
      ]
    );

    if (!localStorage.getItem("kit-startup")) {
      localStorage.setItem("kit-startup", "welcome");
    }

    System.startup = localStorage.getItem("kit-startup").split(",");
    if (System.bootopt.get("safe")) {
      Notification.push(
        "セーフブート",
        "現在、kitをセーフモードで起動しています。",
        "system"
      );
    };

    KWS.Util.hide(System.UI.Header.unmax);

    if (System.bootopt.get('safe')) setInterval(System.updateTime, 1000);
    else setInterval(System.updateTime, 100);

    // Event handlers

    // Virtual Desktops
    System.UI.Header.desktops.addEventListener('click', () => {
      const closeFunc = () => {
        KWS.currentDesktop.elem.classList.remove('selected-section');
        System.UI.desktopSelector.classList.remove('-is-open');
      };
      if (System.UI.desktopSelector.classList.contains('-is-open')) {
        closeFunc();
      }
      else {
        KWS.currentDesktop.elem.classList.add('selected-section');
        System.UI.desktopSelector.classList.add('-is-open');
        System.UI.desktopSelector.innerHTML = '';
        KWS.desktops.forEach(desktop => {
          const elem = document.createElement('div');
          elem.dataset.index = desktop.index;
          if (localStorage.getItem("kit-wallpaper")) {
            elem.style.background = localStorage.getItem("kit-wallpaper");
            elem.style.backgroundSize = "cover";
            elem.style.backgroundPosition = "center center";
          }
          if (KWS.currentDesktopIndex === desktop.index) {
            elem.classList.add('-active');
          }
          elem.addEventListener('click', () => {
            if (KWS.currentDesktopIndex === desktop.index) closeFunc();
            else {
              KWS.currentDesktop = desktop.index;
              // Switch unmax button and the footer
              if (KWS.currentDesktop.maximized.pid === null) {
                KWS.Util.show(System.UI.Footer.footer);
                KWS.Util.hide(System.UI.Header.unmax);
              } 
              else {
                KWS.Util.hide(System.UI.Footer.footer);
                KWS.Util.show(System.UI.Header.unmax);
              } 
            }
          });
          const input = document.createElement('input');
          input.type = 'text';
          input.value = desktop.name;
          input.addEventListener('click', (e) => e.stopPropagation());
          input.addEventListener('blur', () => {
            desktop.name = input.value;
            desktop.elem.dataset.name = input.value;
          });
          elem.appendChild(input);
          System.UI.desktopSelector.appendChild(elem);
        });

        const addButton = document.createElement('div');
        addButton.classList.add("-add-button");
        addButton.innerHTML = '<strong>+</strong><span>追加する</span>';
        addButton.addEventListener('click', () => {
          new Desktop(`Desktop ${KWS.desktops.length}`);
          closeFunc();
          KWS.Util.show(System.UI.Footer.footer);
          KWS.Util.hide(System.UI.Header.unmax);
        });
        System.UI.desktopSelector.appendChild(addButton);
      }
    });
    // Unmax
    System.UI.Header.unmax.addEventListener('click', () => {
      KWS.unmax(KWS.currentDesktop.maximized.pid);
    });
    // Task List
    $("#footer-tasks").click(function () {
      if ($("#kit-tasks").is(":visible")) {
        $("#kit-tasks").html("").fadeOut(300);
      } else {
        $("#task-ctx").fadeOut(200);
        $("#kit-tasks")
          .html($("#tasks").html())
          .fadeIn(300)
          .css("z-index", "9997");
      }
    });
    $.getJSON("system/testload.json").fail(() => {
      $("#body")
        .append(`<div id='wcors' class="window windowactive" style="top: 70px; left: 50px; width: calc(100% - 100px)">
              <div class="wt">問題が発生しました</div>
              <div class="winc">JSONデータ読み込みに失敗しました。<br>
              クロスオリジン制約によりkitアプリケーションの動作が制限されている場合があります。<br>
              詳細は<a class="kit-hyperlink" onclick="location.href = 'https://mtsgi.github.io/kitdocs/#/cors'">こちらの記事</a>をご確認ください。</div>
          </div>`);
      $(
        '<kit-button-alt class="kit-block kit-text-c m">閉じる</kit-button-alt>'
      )
        .appendTo("#wcors .winc")
        .on("click", () => {
          $("#wcors").remove();
        });
    });

    $.getJSON("config/desktop.json", (data) => {
      Desktop.icons = data;
      new Desktop('Desktop');
      if (!System.bootopt.get('safe')) {
        for (let i of System.startup) {
          if (i != "") System.launch(i);
        }
      }
      if (localStorage.getItem("kit-fusen")) {
        KWS.fusen.list = JSON.parse(localStorage.getItem("kit-fusen"));
        for (let key in KWS.fusen.list) {
          KWS.fusen.add(KWS.fusen.list[key]);
        }
      }
      if (System.bootopt.get('safe') === 'true') {
        System.alert({
          title: "セーフブート",
          content: 
            `現在、kitをセーフモードで起動しています。<br />
            <a class='kit-hyperlink' onclick='System.reboot()'>通常モードで再起動</a>`,
          windowTitle: "system"
        });
      }
      if (localStorage.getItem("kit-lock") === "true") {
        System.lock();
      }
    }).fail(function () {
      Notification.push(
        "読み込みに失敗",
        "デスクトップ(config/desktop.json)の読み込みに失敗しました。",
        "system"
      );
      new Desktop('Desktop');
    });

    $.getJSON("config/apps.json", System.initLauncher).fail(function () {
      Notification.push(
        "ランチャー初期化失敗",
        "アプリケーション一覧(config/apps.json)の読み込みに失敗しました。",
        "system"
      );
    });
    $("#kit-tasks").delegate(".task", "click", function () {
      System.close(this.id.slice(1));
      $(this).hide();
    });

    $("#footer-noti").click(function () {
      $("#last-notification").hide("drop", { direction: "right" }, 300);
      if ($("#notifications").is(":visible")) {
        $("#notifications").hide("drop", { direction: "right" }, 300);
      } else {
        $("#notifications").show("drop", { direction: "right" }, 300);
      }
    });
    $("#last-notification-close").click(function () {
      $("#last-notification").hide("drop", { direction: "right" }, 300);
    });
    $("#notifications-dnp")
      .prop("checked", false)
      .on("change", () => {
        if ($("#notifications-dnp").is(":checked")) {
          Notification.goodnight = true;
        } else Notification.goodnight = false;
      });

    $(".power-button").click(function () {
      $("#notifications").hide("drop", { direction: "right" }, 300);
      $("#last-notification").hide("drop", { direction: "right" }, 300);
      $("#kit-wallpaper").css("filter", "blur(5px)");
      KWS.Util.hide(KWS.currentDesktop.elem);
      KWS.currentDesktop.elem.classList.remove('selected-section');
      System.UI.desktopSelector.classList.remove('-is-open');
      $(
        "footer, header, #launcher, #task-ctx, #kit-sightre, .dropdown"
      ).hide();
      $("#kit-power").show();
    });
    $("#kit-power-back").click(function () {
      $("section, header, footer, #kit-wallpaper, .dropdown").css(
        "filter",
        "none"
      );
      KWS.Util.show(KWS.currentDesktop.elem);
      $("footer, header").show();
      $("#kit-power").hide();
    });
    $("#kit-power-shutdown").click(function () {
      System.shutdown();
    });
    $("#kit-power-reboot").click(function () {
      System.reboot();
    });
    $("#kit-power-suspend").click(function () {
      location.reload();
      $("section, header, footer, #kit-wallpaper").css("filter", "none");
      $("#kit-power").fadeOut(300);
      System.alert(
        "サスペンド機能",
        "サスペンド機能はこのバージョンのkitではサポートされていません。"
      );
    });
    $("#kit-power-lock").click(function () {
      System.lock();
    });
    $("#lock-password").on("keypress", function (e) {
      if (e.which == 13) $("#lock-unl").click();
    });
    $("#lock-unl")
      .on("click", function () {
        if (
          !localStorage.getItem("kit-password") ||
          $("#lock-password").val() == localStorage.getItem("kit-password")
        ) {
          $("header, footer").show();
          $("section, header, footer, #kit-wallpaper").css("filter", "none");
          $("#lock-password").val("");
          KWS.Util.show(KWS.currentDesktop.elem);
          KWS.Util.hide(document.querySelector('#desktop-l'));
        } else $("#lock-password").effect("bounce", { distance: 12, times: 4 }, 500);
      })
      .hover(
        function () {
          $("#lock-unl span").removeClass("fa-lock").addClass("fa-lock-open");
        },
        function () {
          $("#lock-unl span").removeClass("fa-lock-open").addClass("fa-lock");
        }
      );

    $("#launch").click(function () {
      $("#notifications").hide("drop", { direction: "right" }, 300);
      if ($("#launcher").is(":visible")) {
        $("#kit-wallpaper").css("filter", "none");
        KWS.currentDesktop.elem.removeAttribute('hidden');
        $("#launcher").hide();
      } else {
        KWS.currentDesktop.elem.setAttribute('hidden', '');
        $("#kit-wallpaper").css("filter", "blur(5px)");
        $("#task-ctx").hide();
        $("#launcher").show();
      }
    });

    //Sightre
    $("#kit-header-sightre").on("click", () => {
      if ($("#kit-sightre").is(":visible")) {
        $("#kit-sightre").fadeOut(300);
      } else {
        $("#kit-sightre-results").html("");
        $("#kit-sightre").show();
        $("#kit-sightre-form").val("").focus();
      }
    });
    let sightrePrevWord = "";
    $("#kit-sightre-form")
      .on("keypress", (e) => {
        let _word = $("#kit-sightre-form").val();
        if (e.which == 13 && _word) {
          if (_word == "kit") {
            S.alert(
              "",
              "<div style='text-align:left;'>　＿　　　　＿　＿　<br>｜　｜　＿（＿）　｜＿　<br>｜　｜／　／　｜　＿＿｜<br>｜　　　〈｜　｜　｜＿　<br>｜＿｜＼＿ ＼ ＿＼＿＿｜</div><hr>",
              S.version
            );
            return;
          }
          $(".kit-sightre-result.-first").click();
          sightrePrevWord = "";
          $("#kit-sightre-form").val("");
          $("#kit-sightre-results").html("");
          $("#kit-sightre").fadeOut(300);
        }
      })
      .on("keydown keyup change", (e) => {
        let _word = $("#kit-sightre-form").val();
        if (e.which == 27) $("#kit-sightre").fadeOut(300);
        else {
          if (_word == sightrePrevWord) return;
          $("#kit-sightre-results").html("");
          if (!_word) return;
          sightrePrevWord = _word;
          if (_word.indexOf("kish ") == 0 || _word.indexOf("🥧 ") == 0) {
            let _cmd = _word.substring(_word.indexOf(" ") + 1);
            if (_cmd) {
              $(`<div class='kit-sightre-result -first'>
                              <img class='--icon' src='app/kish/icon.png'/>
                              <div class='--info'>
                                  <div class='--name'>${_cmd}</div>
                                  <div class='--desc'>kishでコマンドを実行</div>
                              </div>
                              <div class='--open fa fa-arrow-right'></div>
                          </div>`)
                .appendTo("#kit-sightre-results")
                .on("click", () => {
                  System.launch("kish", { rc: [_cmd] });
                });
            }
          } else if (
            _word.indexOf("http://") == 0 ||
            _word.indexOf("https://") == 0 ||
            _word.indexOf("localhost") == 0
          ) {
            $(`<div class='kit-sightre-result -first'>
                          <img class='--icon' src='app/browser/icon.png'/>
                          <div class='--info'>
                              <div class='--name'>${_word}</div>
                              <div class='--desc'>ブラウザでURLを開く</div>
                          </div>
                          <div class='--open fa fa-arrow-right'></div>
                      </div>`)
              .appendTo("#kit-sightre-results")
              .on("click", () => {
                System.launch(localStorage.getItem("kit-default-browser"), {
                  url: _word
                });
              });
          } else {
            $(`<div class='kit-sightre-result -first'>
                          <img class='--icon' src='system/icons/q.png'/>
                          <div class='--info'>
                              <div class='--name'>${_word}</div>
                              <div class='--desc'>アプリを起動する</div>
                          </div>
                          <div class='--open fa fa-arrow-right'></div>
                      </div>`)
              .appendTo("#kit-sightre-results")
              .on("click", () => {
                let _args = null;
                try {
                  if (_word.split(",")[1])
                    _args = JSON.parse(_word.split(",").slice(1).join().trim());
                } catch (error) {
                  Notification.push("引数の解釈に失敗", error, "system");
                }
                System.launch(_word.split(",")[0], _args);
              });
          }
          for (let i in System.apps) {
            if (i.indexOf(_word) == 0 || S.apps[i].name.indexOf(_word) == 0) {
              $(`<div class='kit-sightre-result -app'>
                              <img class='--icon' src='${S.apps[i].icon}'/>
                              <div class='--info'>
                                  <div class='--name'>${S.apps[i].name}</div>
                                  <div class='--desc'>kitアプリケーション - ${i}</div>
                              </div>
                              <div class='--open fa fa-arrow-right'></div>
                          </div>`)
                .appendTo("#kit-sightre-results")
                .on("click", () => {
                  System.launch(i);
                  $("#kit-sightre-results").html("");
                  $("#kit-sightre").fadeOut(300);
                });
            }
          }
          for (let i in System.userarea) {
            if (i.indexOf(_word) == 0 || i.indexOf(_word) == 0) {
              $(`<div class='kit-sightre-result -file'>
                              <i class="fa fa-file --icon"></i>
                              <div class='--info'>
                                  <div class='--name'>${i}</div>
                                  <div class='--desc'>ファイル - 種類：${S.userarea[i].type} - ユーザー：${System.username}</div>
                              </div>
                              <div class='--open fa fa-arrow-right'></div>
                          </div>`)
                .appendTo("#kit-sightre-results")
                .on("click", () => {
                  System.open(i);
                  $("#kit-sightre-results").html("");
                  $("#kit-sightre").fadeOut(300);
                });
            }
          }
          $(`<div class='kit-sightre-result -link'>
                      <i class="fa fa-search --icon"></i>
                      <div class='--info'>
                          <div class='--name'>${_word}</div>
                          <div class='--desc'>をWebで検索</div>
                      </div>
                      <div class='--open fa fa-arrow-right'></div>
                  </div>`)
            .appendTo("#kit-sightre-results")
            .on("click", () => {
              System.launch("browser", {
                url: "https://www.bing.com/search?q=" + _word
              });
              $("#kit-sightre-results").html("");
              $("#kit-sightre").fadeOut(300);
            });
          $(`<div class='kit-sightre-result -link'>
                      <i class="fab fa-wikipedia-w --icon"></i>
                      <div class='--info'>
                          <div class='--name'>${_word}</div>
                          <div class='--desc'>wikipediaの記事を表示</div>
                      </div>
                      <div class='--open fa fa-arrow-right'></div>
                  </div>`)
            .appendTo("#kit-sightre-results")
            .on("click", () => {
              System.launch("browser", {
                url: "https://ja.wikipedia.org/wiki/" + _word
              });
              $("#kit-sightre-results").html("");
              $("#kit-sightre").fadeOut(300);
            });
        }
      });

    $("#dropdown-sound-slider").slider({
      min: 0,
      max: 100,
      step: 1,
      value: 100,
      change: (e, ui) => {
        System.audio.level = ui.value;
        $("#dropdown-sound-level").text(ui.value);
        localStorage.setItem("kit-audio-level", ui.value);
        for (let i in System.audio.list) {
          System.audio.list[i].volume = System.audio.level / 100;
        }
        if (ui.value == 0)
          $("#kit-header-sound-icon")
            .removeClass("fa-volume-up")
            .addClass("fa-volume-mute");
        else
          $("#kit-header-sound-icon")
            .removeClass("fa-volume-mute")
            .addClass("fa-volume-up");
      }
    });
    if (localStorage["kit-audio-level"])
      System.audio.volume(localStorage["kit-audio-level"]);

    $("#dropdown-sound-silent")
      .prop("checked", false)
      .on("change", () => {
        if ($("#dropdown-sound-silent").is(":checked")) {
          System.audio.silent = true;
          $("#kit-header-sound-icon")
            .removeClass("fa-volume-up")
            .addClass("fa-volume-mute");
        } else {
          System.audio.silent = false;
          $("#kit-header-sound-icon")
            .removeClass("fa-volume-mute")
            .addClass("fa-volume-up");
        }
      });

    $("#kit-header-user").on("click", () => System.launch("user"));

    $("#kit-context-open").on("click", function () {
      System.alert("選択された要素", System.selectedElement.cloneNode(true));
    });
    $("#kit-context-search").on("click", function () {
      KWS.Util.hide(System.UI.ContextMenu.contextMenu, { duration: 300 });
      System.launch("browser", {
        url: `https://www.bing.com/search?q=${$("#kit-context-input").val()}`
      });
    });
    $("#kit-context-input").keypress(function (e) {
      if (e.which == 13) $("#kit-context-search").click();
    });
    $("#kit-context a").on("click", function () {
      KWS.Util.hide(System.UI.ContextMenu.contextMenu, { duration: 300 });
    });
    $("#kit-context-vacuum").on("click", function () {
      for (let i in process) {
        KWS.vacuum(S.mouseX, S.mouseY);
      }
      setTimeout(() => {
        $(".window").css("transition", "none");
      }, 500);
    });
    $("#kit-context-fusen").on("click", function () {
      KWS.fusen.add("");
    });

    $(document)
      .delegate("a", "click", function () {
        if (this.href) {
          System.launch(localStorage.getItem("kit-default-browser"), {
            url: this.href
          });
          return false;
        }
      })
      .on("mousemove", function (e) {
        System.mouseX = e.clientX;
        System.mouseY = e.clientY;
      })
      .delegate(".textbox", "keypress", function (e) {
        if (e.which == 13 && this.id) {
          if ($("#" + this.id + " + .kit-button").length) {
            Notification.push("debug", this.id, "system");
            $("#" + this.id + " + .kit-button").click();
          } else if ($("#" + this.id + " + kit-button").length) {
            Notification.push("debug", this.id, "system");
            $("#" + this.id + " + kit-button").click();
          }
        }
      });

    window.onresize = () => {
      System.display.width = window.innerWidth;
      System.display.height = window.innerHeight;

      if (KWS.currentDesktop.maximized.pid) {
        KWS.resize(
          KWS.currentDesktop.maximized.pid,
          System.display.width,
          System.display.height - 30
        );
      }
    };
  };

  static ajaxWait = () => {
    return new Promise((resolve) => {
      let interval = setInterval(() => {
        if (this.launchLock === false) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  };

  static updateTime = () => {
    const now = new Date();
    System.time.obj = now;
    let day = now.getDay();
    let y = now.getFullYear();
    let m = ('00' + (now.getMonth() + 1)).slice(-2);
    let d = ('00' + now.getDate()).slice(-2);
    let h = ('00' + now.getHours()).slice(-2);
    let i = ('00' + now.getMinutes()).slice(-2);
    let s = ('00' + now.getSeconds()).slice(-2);
    System.time = {
      obj: now,
      day,
      y,
      m,
      d,
      h,
      i,
      s
    }
    System.UI.Header.time.innerText = `${h}:${i}:${s}`;
  }
  static setBattery = function () {
    if (navigator.getBattery)
      navigator.getBattery().then((e) => {
        const _lv = e.level * 100;
        System.battery = _lv;
        return _lv;
      });
  };

  static screenshot = function (_pid, _popup) {
    let _elem = document.querySelector("body");
    if (_pid) _elem = document.querySelector("#w" + _pid);
    html2canvas(_elem).then((canvas) => {
      if (_popup) {
        canvas.style.border = "1px solid #909090";
        S.save(canvas.toDataURL("image/png"), "image");
      }
      return canvas;
    });
  };

  static obj2img = function (_obj, _popup) {
    let _elem = _obj[0];
    html2canvas(_elem).then((canvas) => {
      if (_popup) {
        canvas.style.border = "1px solid #909090";
        S.save(canvas.toDataURL("image/png"), "image");
      }
      return canvas;
    });
  };

  static save = (data, type) => {
    System.launch("fivr", {
      save: data,
      type
    });
  };

  static open = (filename) => {
    System.launch("fivr", {
      open: filename
    });
  };

  static preventClose = (_pid) => {
    if (!process[_pid]) return false;
    process[_pid].preventclose = true;
    return true;
  };

  static shutdown = (_opt) => {
    $("#last-notification-close").click();
    $("#kit-power-back").click();
    for (let i in process) {
      if (process[i].preventclose == true) {
        S.dialog(
          "シャットダウンの中断",
          "pid" +
            System.appCache[System.launchpath[i]].name +
            "がシャットダウンを妨げています。<br>強制終了してシャットダウンを続行する場合は[OK]を押下してください。",
          () => {
            process[i].preventclose = false;
            System.shutdown();
          }
        );
        return false;
      } else System.close(i);
    }
    $("section").hide();
    $("body").css("background-color", "black");
    $("header, footer").fadeOut(300);
    $("#kit-wallpaper").fadeOut(1500);
    if (_opt == "reboot") location.href = "autorun.html";
    localStorage.setItem("kit-shutted-down", true);
  };

  static reboot = () => System.shutdown("reboot");

  static lock = () => {
    KWS.Util.hide(KWS.currentDesktop.elem);
    KWS.Util.show(document.querySelector('#desktop-l'));

    $("#lock-user-icon").css(
      "background",
      localStorage.getItem("kit-user-color")
    );
    $("section, header, footer").css("filter", "none");
    $("#kit-wallpaper").css("filter", "blur(20px)");
    $("header, footer, #kit-power").hide();

    $("#lock-username").text(localStorage.getItem("kit-username"));
    if (localStorage.getItem("kit-password")) $("#lock-password").show();
    else $("#lock-password").hide();
  };

  static alert = (options, content, windowTitle) => {
    if (typeof options === "object") {
      System.launch("alert", [
        options.title,
        options.content,
        options.windowTitle || options.title
      ]);
    }
    else {
      const title = String(options);
      System.launch("alert", [title, content, windowTitle])
    };
  };

  static dialog = (title, content, func) => {
    System.launch("dialog", {
      title,
      content,
      func
    });
  };

  static appInfo = (_pid) => {
    let title = "",
      content = "";
    let chache = System.appCache[System.launchpath[_pid]];
    let launchpath = System.launchpath[_pid];
    if (chache) {
      title = chache.name + " " + chache.version;
      if (chache.icon && chache.icon != "none")
        content =
          `<img style='height: 96px' src='${launchpath}/${chache.icon}'><br>`;
      for (let i in chache) {
        if (typeof chache[i] != "object")
          content += `<div><span class='kit-font-thin'>"${i} </span>${chache[i]}</div>`;
      }
      content +=
        `<br><span class='kit-font-thin'>起動パス ${launchpath}</span><br><br>`;
    } else title = "取得に失敗しました";
    System.alert({ title, content });
  };

  static apps = new Object();
  static installed = new Array();

  static close = (_str) => {
    const _pid = String(_str);
    $("#w" + _pid).remove();
    $("#t" + _pid).remove();
    $("#task-ctx").hide();
    delete process[_pid];
    KWS.refreshWindowIndex();
  };

  static kill = (_str) => {
    for (let _pid in process) {
      if (process[_pid] && process[_pid].id == _str) System.close(_pid);
    }
  };

  static vacuum = (_left, _top) => {
    KWS.vacuum(_left, _top); //非推奨です(削除予定)。
  };

  static time = {
    obj: new Date(),
    y: "1970",
    m: "1",
    d: "1",
    h: "00",
    i: "00",
    s: "00",
    ms: "0"
  };

  static changeWallpaper = (str) => {
    $("#kit-wallpaper").css("background", str).css("background-size", "cover");
    localStorage.setItem("kit-wallpaper", str);
  };

  // [Deprecated] Use KWS.currentDesktop
  static moveDesktop = (id) => {
    KWS.Util.hide(KWS.currentDesktop.elem);
    KWS.Util.show(document.querySelector(`#desktop-${id}`));
    $("#desktops").html("<span class='far fa-clone'></span>Desktop" + id);
  };

  static avoidMultiple = (_pid, _alert) => {
    const _id = process[_pid].id;
    let _cnt = 0;
    for (let i in process) {
      if (process[i].id == _id) _cnt += 1;
    }
    Notification.push("debug", _cnt);
    if (_cnt > 1) {
      System.close(_pid);
      if (!_alert) {
        System.alert(
          "多重起動",
          "アプリケーション" +
            _id +
            "が既に起動しています。このアプリケーションの多重起動は許可されていません。"
        );
      }
    }
    return _cnt;
  };

  static resizable = function (_pid, _elem, _width, _height) {
    let el = ".winc";
    if (_elem) el = String(_elem);
    if (!_width) _width = null;
    if (!_height) _height = "100";
    $("#w" + _pid).resizable({
      alsoResize: "#w" + _pid + " " + el,
      minWidth: _width,
      minHeight: _height
    });
  };

  static initLauncher = (data) => {
    $("#launcher-apps").html("");
    System.apps = data;
    for (let i in data) {
      $("#launcher-apps").append(
        `<div class='launcher-app' data-launch='${i}'><img src='${data[i].icon}'>${data[i].name}</div>`
      );
    }
    if (!System.bootopt.get("safe")) {
      for (let i of System.installed) {
        $("#launcher-apps").append(
          `<div class='launcher-app' data-launch='${i.path}' data-define-id='${i.id}'><img src='${i.icon}'>${i.name}</div>`
        );
      }
    }
    $(".launcher-app").on("click", function () {
      $("#launch").click();
      System.launch($(this).attr("data-launch"));
    });
  };

  static eval = (expr) => {
    return Function(`"use strict"; return(${expr})`)();
  };

  static launch = async (path, args) => {
    while (this.launchLock) await this.ajaxWait();
    this.launchLock = true;

    let _pid = pid;
    System.args[_pid] = args;
    let _path = path;
    if (_path.lastIndexOf("/") == _path.length - 1) {
      _path = _path.substring(0, _path.length - 1);
    } else if (_path.indexOf("/") == -1) {
      _path = System.appdir + _path;
    }

    System.launchpath[_pid] = _path;

    if (System.appCache[_path]) {
      if (KWS.currentDesktop.maximized.pid !== null) {
        KWS.unmax(KWS.currentDesktop.maximized.pid);
      }
      appData(System.appCache[_path]);
    } else {
      try {
        $.getJSON(_path + "/define.json", appData).fail(() => {
          Notification.push(
            "kitアプリをロードできません。",
            `${_path}を展開できませんでした。`,
            "system"
          );
          System.launchLock = false;
        });
      } catch (error) {
        Notification.push("System Error", error, "system");
        System.launchLock = false;
      }
    }
  };

  static clip = {
    content: null,
    history: new Array(),

    set: (content) => {
      this.content = content;
      this.history.push(content);
      return content;
    },
    get: () => {
      return this.content;
    }
  };

  static config = new (function () {
    this.apps = new Object();
  })();

  static audio = new (function () {
    this.level = localStorage["kit-audio-level"] || 100;
    this.silent = false;

    this.list = new Array();

    this.volume = function (_level) {
      $("#dropdown-sound-slider").slider("value", _level);
    };

    this.play = function (_audioid, _src) {
      if (!System.audio.list[_audioid]) {
        System.audio.list[_audioid] = new Audio(_src);
        System.audio.list[_audioid].volume = System.audio.level / 100;
      }
      System.audio.list[_audioid].play();
    };

    this.get = function (_audioid) {
      return System.audio.list[_audioid];
    };

    this.pause = function (_audioid) {
      System.audio.list[_audioid].pause();
    };

    this.stop = function (_audioid) {
      System.audio.list[_audioid].pause();
      System.audio.list[_audioid] = null;
    };

    this.seek = function (_audioid, _time) {
      System.audio.list[_audioid].fastSeek(_time);
    };

    this.mute = function (_audioid, _bool) {
      System.audio.list[_audioid].muted = _bool;
    };
  })();
}

class Desktop {
  constructor(name) {
    const elem = document.createElement('section');
    elem.id = `desktop-${KWS.desktops.length}`;
    elem.dataset.name = name;

    // Place icons on the desktop
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'desktop-icons';

    for (let key in Desktop.icons) {
      const iconElem = document.createElement('div');
      iconElem.classList.add('desktop-icon');
      iconElem.addEventListener('click', () => System.launch(key));
      iconElem.innerHTML = `<img src='${Desktop.icons[key].icon}'>${Desktop.icons[key].name}`;
      iconWrapper.appendChild(iconElem);
    }

    elem.appendChild(iconWrapper);

    // Context Menu
    elem.addEventListener('mousedown', () => {
      KWS.Util.hide(System.UI.ContextMenu.contextMenu);
    });
    elem.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      const pointElem = document.elementFromPoint(S.mouseX, S.mouseY);
      System.selectedElement = pointElem;
      System.selectedText = window.getSelection();
      System.UI.ContextMenu.input.value = System.selectedText;
      if (System.UI.ContextMenu.input.value !== '') {
        KWS.Util.show(System.UI.ContextMenu.textGroup);
      }
      else KWS.Util.hide(System.UI.ContextMenu.textGroup);;
      if (pointElem === KWS.currentDesktop.elem) {
        KWS.Util.show(System.UI.ContextMenu.desktopGroup);
        KWS.Util.hide(System.UI.ContextMenu.elemGroup);
      } else {
        KWS.Util.show(System.UI.ContextMenu.elemGroup);
        KWS.Util.hide(System.UI.ContextMenu.desktopGroup);
      }
      System.UI.ContextMenu.elem.innerText =
        pointElem.tagName.toLowerCase() + (pointElem.id ? `#${pointElem.id}` : '');
      
      KWS.Util.hide(System.UI.ContextMenu.customGroup);
  
      const contextId =
        pointElem.getAttribute('data-kit-contextid') || pointElem.getAttribute('kit-context');
      if (contextId) {
        KWS.Util.show(System.UI.ContextMenu.customGroup);
        System.UI.ContextMenu.customGroup.innerHTML = '<div id="kit-context-custom"></div>';
        const contextGroupLabel = KWS.context[contextId].name || contextId;
        document.querySelector("#kit-context-custom").innerText = contextGroupLabel;
        for (let i in KWS.context[contextId]) {
          if (i == "name") continue;
          System.UI.ContextMenu.customGroup.insertAdjacentHTML('beforeend', `
            <a id='kit-context-${contextId}-${i}'>
              <span class='fa ${KWS.context[contextId][i].icon}'></span>
              ${KWS.context[contextId][i].label}
            </a>
          `);
          document
            .querySelector(`#kit-context-${contextId}-${i}`)
            .addEventListener('click', () => {
              KWS.context[contextId][i].function.apply();
              KWS.Util.hide(System.UI.ContextMenu.contextMenu);
            });
        }
      }
      $("#kit-context-size").text(
        pointElem.clientWidth + "✕" + pointElem.clientHeight
      );

      System.UI.ContextMenu.contextMenu.style.left = `${System.mouseX}px`;
      System.UI.ContextMenu.contextMenu.style.top = `${System.mouseY}px`;
      KWS.Util.show(System.UI.ContextMenu.contextMenu);
    });

    document.body.appendChild(elem);

    this.name = name;
    this.elem = elem;
    this.index = KWS.desktops.length;
    KWS.desktops.push(this);
    KWS.currentDesktop = KWS.desktops.length - 1;
  }

  // Load from system
  static icons = {};

  wallpaper = null;
  maximized = {
    pid: null,
    prevWidth: null,
    prevHeight: null,
    prevTop: 0,
    prevLeft: 0
  };
}

class KWS {
  static version = "4.0.0";
  static active = null;

  // Virtual Desktops
  static desktops = [];
  static currentDesktopIndex = null;
  static get currentDesktop() {
    return KWS.desktops[KWS.currentDesktopIndex] || {};
  }
  static set currentDesktop(index) {
    if (KWS.desktops[KWS.currentDesktopIndex]) {
      KWS.Util.hide(KWS.desktops[KWS.currentDesktopIndex].elem);
    }
    KWS.currentDesktopIndex = index;
    KWS.Util.show(KWS.desktops[KWS.currentDesktopIndex].elem);

    System.UI.desktopSelector.childNodes.forEach((el) => {
      if (el.dataset.index === String(index)) el.classList.add('-active');
      else el.classList.remove('-active');
    });
  }

  // Darkmode feature | getter/setter
  static get darkmode() {
    return localStorage.getItem('kit-darkmode') === 'true';
  }
  static set darkmode(value) {
    localStorage.setItem('kit-darkmode', String(value));
    if (value) {
      document
        .querySelector('#kit-darkmode')
        .setAttribute('href', 'system/theme/kit-darkmode.css');
        document.querySelectorAll('.winc-darkmode')
        .forEach(el => el.classList.add('kit-darkmode'));
    }
    else {
      document
        .querySelector('#kit-darkmode')
        .setAttribute('href', null);
      document.querySelectorAll('.winc-darkmode')
        .forEach(el => el.classList.remove('kit-darkmode'));
    }
  }

  static changeWindowTitle = (_pid, _str) => {
    $("#tname" + _pid).text(_str);
    $("#wtname" + _pid).text(_str);
  };

  static minAll = () => {
    for (const i in process) {
      if (process.hasOwnProperty(i) && $(`#w${i}`).is(":visible")) KWS.min(i);
    }
  };

  static min = (_str) => {
    let _pid = String(_str);
    if ($("#w" + _pid).is(":visible")) {
      $("#w" + _pid)
        .css("transition", "none")
        .hide("drop", { direction: "down" }, 300);
      $("#task-ctx").effect("bounce", { distance: 12, times: 1 }, 400);
      $("#t" + _pid).addClass("task-min");
    } else {
      $("#w" + _pid).show("drop", { direction: "down" }, 300);
      $("#task-ctx").effect("bounce", { distance: 12, times: 1 }, 400);
      $("#t" + _pid).removeClass("task-min");
    }
  };

  static max = (_pid) => {
    const cache = System.appCache[System.launchpath[_pid]];
    if (KWS.currentDesktop.maximized.pid || cache.support.fullscreen !== true) {
      Notification.push(
        "最大化に失敗",
        "ウィンドウの最大化に失敗しました。",
        "system"
      );
      return false;
    }
    KWS.currentDesktop.maximized.prevWidth = $("#winc" + _pid).outerWidth();
    KWS.currentDesktop.maximized.prevHeight = $("#winc" + _pid).outerHeight();
    KWS.currentDesktop.maximized.prevTop = $("#w" + _pid).offset().top;
    KWS.currentDesktop.maximized.prevLeft = $("#w" + _pid).offset().left;
    KWS.currentDesktop.maximized.pid = _pid;
    $("#wt" + _pid).addClass("wtmaximize");
    $("#w" + _pid)
      .css({
        top: "0px",
        left: "0px"
      })
      .addClass("windowmaximize")
      .css("z-index", KWS.windowIndex + 1);
    KWS.refreshWindowIndex();
    KWS.resize(_pid, System.display.width, System.display.height - 30);

    KWS.Util.show(System.UI.Header.unmax);
    KWS.Util.hide(System.UI.Footer.footer);
    return true;
  };

  static unmax = (_pid) => {
    if (_pid !== KWS.currentDesktop.maximized.pid) {
      Notification.push(
        "最大化解除に失敗",
        "対象がフルスクリーンウィンドウではありません。"
      );
      return false;
    }
    $("#wt" + _pid).removeClass("wtmaximize");
    $("#w" + _pid)
      .css({
        top: KWS.currentDesktop.maximized.prevTop,
        left: KWS.currentDesktop.maximized.prevLeft
      })
      .removeClass("windowmaximize");
    KWS.Util.show(System.UI.Footer.footer);
    KWS.Util.hide(System.UI.Header.unmax);
    KWS.resize(
      _pid,
      KWS.currentDesktop.maximized.prevWidth,
      KWS.currentDesktop.maximized.prevHeight);
    KWS.currentDesktop.maximized = {
      pid: null,
      prevWidth: null,
      prevHeight: null,
      prevTop: 0,
      prevLeft: 0
    };

    if (!System.appCache[System.launchpath[_pid]].size.height) {
      System.qs(_pid)[0].style.height = "auto";
    }
  };

  static vacuum = (_left, _top) => {
    for (let i in process) {
      $("#w" + i)
        .css("transition", ".5s all ease")
        .css("left", _left)
        .css("top", _top);
    }
    setTimeout(() => {
      $(".window").css("transition", "none");
    }, 500);
  };

  static active = null;
  static windowIndex = 1;

  static refreshWindowIndex = () => {
    let num = $(".window").length;
    let array = new Array();
    let obj = new Object();
    for (let i = 0; i < num; i++) {
      obj = { id: $(".window")[i].id, zindex: $(".window")[i].style.zIndex };
      array.push(obj);
    }
    array.sort((a, b) => {
      return Number(a.zindex - b.zindex);
    });
    for (let i in array) {
      document.getElementById(array[i].id).style.zIndex = i;
      let _pid = String(array[i].id).substring(1);
      if (i == num - 1) {
        $("#" + array[i].id).addClass("windowactive");
        $("#t" + _pid).addClass("t-active");
        KWS.active = _pid;
        process[_pid].isactive = true;
        KWS.screenPrevSwitched = new Date();
        localStorage.setItem("kit-screentime", JSON.stringify(KWS.screenTime));
      } else {
        $("#" + array[i].id).removeClass("windowactive");
        $("#t" + _pid).removeClass("t-active");
        process[_pid].isactive = false;
        if (KWS.active == _pid) {
          let _diff = new Date() - KWS.screenPrevSwitched;
          let _appid = process[_pid].id;
          if (!KWS.screenTime[_appid]) KWS.screenTime[_appid] = new Number();
          if (_diff < 0)
            Notification.push(
              "debug",
              "スクリーンタイムの記録に失敗しました。",
              "system"
            );
          else KWS.screenTime[_appid] += _diff;
        }
      }
    }
    KWS.windowIndex = num;
  };

  static front = (_pid) => {
    $(`#w${_pid}`).css("z-index", KWS.windowIndex + 1);
    KWS.refreshWindowIndex();
  };

  static resize = (_pid, _width, _height) => {
    if (_width) $("#winc" + _pid).css("width", _width);
    if (_height) $("#winc" + _pid).css("height", _height);
  };

  static setTheme = (name) => {
    localStorage.setItem("kit-theme", name);
    if (name !== "none")
      document
        .querySelector('#kit-theme-file')
        .setAttribute('href', `./system/theme/${localStorage.getItem("kit-theme")}`);
    else
      document
        .querySelector('#kit-theme-file')
        .setAttribute('href', '');
    System.moveDesktop(currentDesktop);
  };

  static screenTime = {};

  static screenPrevSwitched = new Date();

  static fusen = new (function () {
    this.fid = 0;
    this.list = {};

    this.add = function (_text) {
      KWS.fusen.list[KWS.fusen.fid] = String(_text);
      $(KWS.currentDesktop.elem).append(
        "<div class='kit-fusen' id='kit-f" +
          KWS.fusen.fid +
          "'><i class='fa fa-quote-left'></i><textarea class='kit-fusen-textarea kit-selectable' data-fid='" +
          KWS.fusen.fid +
          "' kit-context='fusen'>" +
          _text +
          "</textarea></div>"
      );
      $("#kit-f" + KWS.fusen.fid)
        .css({
          left: Number(KWS.fusen.fid) * 40 + 20,
          top: Number(KWS.fusen.fid) * 10 + 100
        })
        .pep({
          elementsWithInteraction: ".kit-fusen-textarea",
          useCSSTranslation: false,
          disableSelect: false,
          shouldEase: true,
          initiate: function () {
            $(this.el).css("ui-opacity", "0.7");
          },
          stop: function () {
            this.el.style.transition = "none";
            $(this.el).css("ui-opacity", "1.0");
          }
        });
      $(".kit-fusen-textarea")
        .off()
        .on("change", function () {
          KWS.fusen.list[$(this).attr("data-fid")] = $(this).val();
          localStorage.setItem("kit-fusen", JSON.stringify(KWS.fusen.list));
        });
      localStorage.setItem("kit-fusen", JSON.stringify(KWS.fusen.list));
      KWS.fusen.fid++;
    };

    this.remove = function (_fid) {
      delete KWS.fusen.list[_fid];
      localStorage.setItem("kit-fusen", JSON.stringify(KWS.fusen.list));
      $("#kit-f" + _fid).remove();
    };
  })();

  static addCustomContext = function (_elem, _contextid, _obj) {
    KWS.context[_contextid] = _obj;
  };

  static context = {
    fusen: {
      name: "ふせん",
      delete: {
        label: "ふせんを削除",
        icon: "fa-trash-alt",
        function: () => {
          KWS.fusen.remove(S.selectedElement.dataset.fid);
        }
      },
      copy: {
        label: "ふせんを複製",
        icon: "fa-copy",
        function: () => {
          KWS.fusen.add(KWS.fusen.list[S.selectedElement.dataset.fid]);
        }
      }
    }
  };

  static Util = {
    hide(elem, options) {
      if (elem) elem.setAttribute('hidden', '');
    },
    show(elem, options) {
      if (elem) elem.removeAttribute('hidden');
    }
  }
}

const Notification = new (function () {
  this.nid = 0;
  this.list = new Object();

  this.goodnight = false;
  this.sound = null;

  this.push = function (_title, _content, _app, _pid, _action, _img, _buttons) {
    let _nid = this.nid;
    if (!System.debugmode && (_title == "debug" || _app == "debug")) {
      return false;
    }
    Notification.list[_nid] = {
      title: _title,
      content: _content,
      app: _app,
      time: System.time.obj.toLocaleString(),
      pid: _pid,
      action: () => {
        if (typeof _action == "function") _action();
        else if (_pid) KWS.front(_pid);
        $("#notifications").hide("drop", { direction: "right" }, 300);
      },
      img: _img
    };
    if (_pid && System.appCache[System.launchpath[_pid]]) {
      _app = `<img src='${System.launchpath[_pid]}/${
        System.appCache[System.launchpath[_pid]].icon
      }'>${System.appCache[System.launchpath[_pid]].name}`;
    }
    if (!this.goodnight) {
      if (this.sound) System.audio.play("n" + this.nid, this.sound);
      $("#last-notification-title").text("").text(_title);
      $("#last-notification-content").text("").text(_content);
      $("#last-notification-app").text("").html(_app);
      $("#last-notification")
        .hide()
        .show("drop", { direction: "right" }, 300)
        .off()
        .on("click", Notification.list[this.nid].action);
      if (_img) $("#last-notification-img").attr("src", _img).show();
      else $("#last-notification-img").attr("src", "").hide();
    }
    let imgtag = "";
    if (_img) imgtag = `<img src='${_img}' alt='' class='notis_img'>`;
    $(`<div class='notis' id='nt${_nid}'>
                ${imgtag}
                <span class='notis_close' id='nc${_nid}'></span>
                <div class='notis_app'>${_app}</div>
                <span>${_title}</span>
                ${_content}
                <div class='notis_buttons'></div>
                <div class='notis_time'>${System.time.obj.toTimeString()}</div>
            </div>`)
      .appendTo("#notifications")
      .on("click", Notification.list[this.nid].action);
    $(`#nc${_nid}`).on("click", (e) => {
      e.stopPropagation();
      $(`#nt${_nid}`).fadeOut(300);
    });
    $("#last-notification-buttons").html("");
    if (_buttons) {
      for (let b of _buttons) {
        $(`<a>${b.label}</a>`)
          .appendTo("#last-notification-buttons")
          .on("click", (e) => {
            e.stopPropagation();
            b.func();
          });
        $(`<a>${b.label}</a>`)
          .appendTo(`#nt${_nid} .notis_buttons`)
          .on("click", (e) => {
            e.stopPropagation();
            b.func();
          });
      }
    }
    this.nid++;
    return this.nid - 1;
  };
})();

class App {
  constructor(_pid) {
    App.e[_pid] = new Object();
    App.d[_pid] = new Object();

    this.process = process[_pid];
    this.cache = System.appCache[System.launchpath[_pid]];

    this.args = System.args[_pid];
    this.close = () => System.close(_pid);
    this.d = App.d[_pid];
    this.dom = (..._args) => System.dom(_pid, ..._args);
    this.e = App.e[_pid];
    this.ntf = (_title, _content, _action, _img, _buttons) =>
      Notification.push(
        _title,
        _content,
        this.info.id,
        _pid,
        _action,
        _img,
        _buttons
      );
    this.qs = (...args) => System.qs(_pid, ...args);
    this.front = () => KWS.front(_pid);

    this.changeWindowTitle = (_t) => App.changeWindowTitle(_pid, _t);
    this.data = (...args) => App.data(_pid, ...args);
    this.event = (...args) => App.event(_pid, ...args);
    this.getPath = (_path) => App.getPath(_pid, _path);
    this.kaf = () => App.kaf(_pid);
    this.load = (_path) => App.load(_pid, _path);
    this.preventClose = (_bool) => App.preventClose(_pid, _bool);
  }

  static changeWindowTitle(_pid, _t) {
    $("#tname" + _pid).text(_t);
    $("#wtname" + _pid).text(_t);
    process[_pid].title = _t;
    return App;
  }

  static context(_cid, _obj) {
    KWS.context[_cid] = _obj;
    return App;
  }

  static data(_pid, _name, _value) {
    if (_value !== undefined) {
      S.dom(_pid, `[kit\\:bind=${_name}]`).val(_value);
      S.dom(_pid, `[kit\\:observe=${_name}]`).text(_value);
      S.dom(_pid, `template[kit\\:for=${_name}] + kit-for`).text("");
      if (typeof _value == "object") {
        for (let elem of S.qs(_pid, `template[kit\\:for=${_name}] + kit-for`)) {
          let _rep =
              App.d[_pid][`__kaf_node_id_${elem.getAttribute("kaf-node-id")}`],
            _result = "";
          for (let i in _value) {
            _result += _rep
              .replace(/{{\s*key\s*}}/g, i)
              .replace(/{{\s*value\s*}}/g, _value[i]);
          }
          elem.innerHTML = _result;
        }
      }
      System.qs(_pid, "[kit\\:if]").forEach((elem) => {
        App.switchIfElem({
          pid: _pid,
          elem: elem
        });
      });
      if (_value) {
        S.dom(_pid, `[kit\\:unless=${_name}]`).hide();
        S.dom(_pid, `[kit\\:disabled=${_name}]`).prop("disabled", true);
      } else {
        S.dom(_pid, `[kit\\:unless=${_name}]`).show();
        S.dom(_pid, `[kit\\:disabled=${_name}]`)
          .prop("disabled", false)
          .removeClass("-disabled");
      }
      return (App.d[_pid][_name] = _value);
    } else if (typeof _name === "object") {
      for (const key in _name) {
        if (_name.hasOwnProperty(key)) App.data(_pid, key, _name[key]);
      }
    } else if (_name) return App.d[_pid][_name];
    else
      return Object.fromEntries(
        Object.entries(App.d[_pid] || {}).filter((d) => d[0].indexOf("__") != 0)
      );
  }

  static event(_pid, _name, _event) {
    if (!App.e[_pid]) App.e[_pid] = new Object();
    if (_event !== undefined) App.e[_pid][_name] = _event;
    else if (typeof _name === "object") {
      for (const key in _name) {
        if (_name.hasOwnProperty(key)) App.event(_pid, key, _name[key]);
      }
    } else if (App.e[_pid][_name]) App.e[_pid][_name].call();
    else if (_name === undefined && _pid) return App.e[_pid];
    return App;
  }

  static getPath(_pid, _path) {
    if (String(_path)[0] != "/") _path = "/" + _path;
    return System.launchpath[_pid] + _path;
  }

  static kaf(_pid) {
    let attrs = [
      "[kit-ref]",
      "[kit-e]",
      "[kit-src]",
      "[kit-alert]",
      "[kit-launch]",
      "[kit-close]",
      "[kit-text]",
      "[kit-html]",
      "[kit\\:bind]",
      "[kit\\:observe]",
      "[kit\\:value]",
      "[kit-value]",
      "[kit-color]",
      "[kit\\:if]",
      "[kit-if]",
      "[kit\\:unless]",
      "[kit\\:for]"
    ];
    const PID = _pid;
    const DATA = App.data(_pid);
    const ARGS = System.args[_pid];
    let _kaf_node_id = 0;
    for (let i of S.qs(_pid, ...attrs)) {
      if (i.hasAttribute("kit-ref")) {
        $(i).on("click", () => App.load(_pid, i.getAttribute("kit-ref")));
      }
      if (i.hasAttribute("kit-e")) {
        let _eqs = i.getAttribute("kit-e").split(",");
        for (let k of _eqs) {
          let _eq = k.split(" ");
          $(i).on(_eq[1] || "click", (e) => {
            if (e.target.classList.contains("-disabled") === false)
              App.e[_pid][_eq[0]].call(this, e);
          });
        }
      }
      if (i.hasAttribute("kit-src")) {
        $(i).attr(
          "src",
          `${System.launchpath[_pid]}/${i.getAttribute("kit-src")}`
        );
      }
      if (i.hasAttribute("kit-alert")) {
        $(i).on("click", () =>
          System.alert({
            title: System.appCache[System.launchpath[_pid]].name,
            content: i.getAttribute("kit-alert")
          })
        );
      }
      if (i.hasAttribute("kit-launch")) {
        $(i).on("click", () => System.launch(i.getAttribute("kit-launch")));
      }
      if (i.hasAttribute("kit-close")) {
        $(i).on("click", () =>
          System.close(i.getAttribute("kit-close") || _pid)
        );
      }
      if (i.hasAttribute("kit-text")) {
        $(i).text(eval(i.getAttribute("kit-text")));
      }
      if (i.hasAttribute("kit-html")) {
        $(i).html(eval(i.getAttribute("kit-html")));
      }
      if (i.hasAttribute("kit:bind")) {
        if (App.d[_pid] == undefined) App.d[_pid] = new Object();
        $(i).on("keydown keyup keypress change", () => {
          let _name = i.getAttribute("kit:bind");
          App.d[_pid][_name] = i.value;
          S.dom(_pid, `[kit\\:observe=${_name}]`).text(i.value);
          System.qs(_pid, "[kit\\:if]").forEach((elem) => {
            App.switchIfElem({
              pid: _pid,
              elem: elem
            });
          });
          if (i.value) {
            S.dom(_pid, `[kit\\:unless=${_name}]`).hide();
            S.dom(_pid, `[kit\\:disabled=${_name}]`)
              .prop("disabled", true)
              .addClass("-disabled");
          } else {
            S.dom(_pid, `[kit\\:unless=${_name}]`).show();
            S.dom(_pid, `[kit\\:disabled=${_name}]`)
              .prop("disabled", false)
              .removeClass("-disabled");
          }
        });
      }
      if (i.hasAttribute("kit:observe")) {
        $(i).text(App.d[_pid][i.getAttribute("kit:observe")]);
      }
      if (i.hasAttribute("kit:value")) {
        $(i).val(App.d[_pid][i.getAttribute("kit:value")]);
      }
      if (i.hasAttribute("kit-value")) {
        $(i).val(eval(i.getAttribute("kit-value")));
      }
      if (i.hasAttribute("kit-color")) {
        $(i).css("color", i.getAttribute("kit-color"));
      }
      if (i.hasAttribute("kit:if")) {
        App.switchIfElem({
          pid: _pid,
          elem: i
        });
      }
      if (i.hasAttribute("kit:unless")) {
        if (App.d[_pid][i.getAttribute("kit:unless")]) {
          $(i).hide();
        } else $(i).show();
      }
      if (i.hasAttribute("kit:disabled")) {
        if (App.d[_pid][i.getAttribute("kit:if")]) {
          i.disabled = true;
          i.classList.add("-disabled");
        } else i.disabled = false;
      }
      if (i.hasAttribute("kit-if")) {
        if (eval(i.getAttribute("kit-if"))) {
          $(i).show();
        } else $(i).hide();
      }
      if (i.hasAttribute("kit:for")) {
        if ("content" in document.createElement("template")) {
          i.setAttribute("kaf-node-id", _kaf_node_id);
          App.d[_pid][`__kaf_node_id_${_kaf_node_id}`] = i.innerHTML;
          i.insertAdjacentHTML(
            "afterend",
            `<kit-for kaf-node-id="${_kaf_node_id}"></kit-for>`
          );
        } else i.style.display = "none";
      }
      _kaf_node_id++;
    }
  }

  static d = {};
  static e = {};

  static load(_pid, _path) {
    if (String(_path)[0] != "/") _path = "/" + _path;
    _path = System.launchpath[_pid] + _path;
    S.dom(_pid).load(_path, () => {
      App.kaf(_pid);
      let _appcache = System.appCache[System.launchpath[_pid]];
      if (!KWS.currentDesktop.maximized.pid && !_appcache.size.height) {
        System.qs(_pid)[0].style.height = "auto";
      }
    });
    return App;
  }

  static preventClose(_pid, _bool = true) {
    process[_pid].preventclose = _bool || true;
    return App;
  }

  static switchIfElem(options) {
    const compArr = options.elem
      .getAttribute("kit:if")
      .split(/(===|!==|==|!=|\?\?|&&|\|\|)/);
    const target = App.d[options.pid][compArr[0].trim()];
    let right = null;
    if (compArr[2]) {
      try {
        right = System.eval(compArr[2]);
      } catch (error) {
        right = App.d[options.pid][compArr[2].trim()];
      }
    }
    let shouldDisp = false;
    switch (compArr[1]) {
      case undefined:
        if (target) shouldDisp = true;
        break;
      case "==":
        if (target == right) shouldDisp = true;
        break;
      case "!=":
        if (target != right) shouldDisp = true;
        break;
      case "===":
        if (target === right) shouldDisp = true;
        break;
      case "!==":
        if (target !== right) shouldDisp = true;
        break;
      case "??":
        if (target !== undefined && target !== null) shouldDisp = true;
        break;
      case "&&":
        if (target && right) shouldDisp = true;
        break;
      case "||":
        if (target || right) shouldDisp = true;
        break;
    }
    if (shouldDisp) $(options.elem).show();
    else $(options.elem).hide();
  }
}

async function launch(str, args, dir) {
  while (System.launchLock) await System.ajaxWait();
  System.launchLock = true;

  let _pid = pid;
  System.args[_pid] = args;
  let _path = dir || System.appdir + str;
  System.launchpath[_pid] = _path;

  if (System.appCache[_path]) {
    if (KWS.currentDesktop.maximized.pid !== null) {
      KWS.unmax(KWS.currentDesktop.maximized.pid);
    }
    appData(System.appCache[_path]);
  } else {
    try {
      $.getJSON(S.launchpath[_pid] + "/define.json", appData).fail(() => {
        Notification.push(
          "kitアプリをロードできません。",
          `${str}を展開できませんでした。`,
          "system"
        );
        System.launchLock = false;
        pid++;
      });
    } catch (error) {
      Notification.push("System Error", error, "system");
      System.launchLock = false;
    }
  }
}

async function appData(data) {
  let _support = {
      fullscreen: false,
      resize: false,
      darkmode: false,
      kaf: true,
      multiple: true
    },
    _size = {},
    _resize = false;
  if (data.support)
    _support = {
      fullscreen:
        typeof data.support.fullscreen == "undefined"
          ? false
          : data.support.fullscreen,
      resize:
        typeof data.support.resize == "undefined" ? false : data.support.resize,
      darkmode:
        typeof data.support.darkmode == "undefined"
          ? false
          : data.support.darkmode,
      kaf: typeof data.support.kaf == "undefined" ? true : data.support.kaf,
      multiple:
        typeof data.support.multiple == "undefined"
          ? true
          : data.support.multiple
    };
  if (data.size)
    _size = {
      width: data.size.width || "auto",
      height: data.size.height || "auto"
    };
  if (data.resize) _resize = data.resize;
  const defobj = {
    id: data.id || null,
    name: data.name || "アプリ名なし",
    icon: data.icon || "none",
    version: data.version || null,
    author: data.author || null,
    support: _support,
    size: _size,
    resize: _resize,
    view: data.view || "default.html",
    script: data.script || "none",
    css: data.css || "none"
  };
  if (!data.id || !data.version || !data.author) {
    Notification.push(
      "起動エラー",
      "起動に失敗しました。詳細情報を得るためには、デバッグモードを有効化してください。",
      "system"
    );
    Notification.push(
      "debug",
      "起動エラー：id, version, authorは必須定義項目です。",
      "system"
    );
    System.launchLock = false;
    return;
  }
  if (defobj.support.multiple == false) {
    if (
      Object.values(process)
        .map((p) => p.id)
        .includes(defobj.id)
    ) {
      Notification.push(
        "多重起動エラー",
        `アプリケーション「${defobj.name}」の多重起動は許可されていません。`,
        "system"
      );
      System.launchLock = false;
      return;
    }
  }
  let _pid = pid;
  process[String(_pid)] = {
    id: defobj.id,
    time: System.time.obj.toLocaleString(),
    isactive: false,
    preventclose: false,
    title: defobj.name
  };
  System.appCache[System.launchpath[pid]] = data;
  app = new App(_pid);
  let _taskAppend = `<span id='t${_pid}'>`;
  const _iconPath = app.getPath(defobj.icon).toString();
  const _viewPath = app.getPath(defobj.view).toString();
  if (defobj.icon != "none") _taskAppend += `<img src='${_iconPath}'>`;
  _taskAppend += `<span id='tname${_pid}'>${defobj.name}<span></span>`;
  $("#tasks").append(_taskAppend);
  $("#t" + _pid)
    .addClass("task")
    .on({
      click: function () {
        if (process[_pid].isactive || $(this).hasClass("task-min"))
          KWS.min(_pid);
        else {
          $("#w" + _pid).css("z-index", KWS.windowIndex + 1);
          KWS.refreshWindowIndex();
        }
      },
      mouseenter: function () {
        $("#task-ctx-name").text(defobj.name);
        if (defobj.icon != "none")
          $("#task-ctx-img").show().attr("src", _iconPath);
        else $("#task-ctx-img").hide();
        $("#task-ctx-ver").text(`v${defobj.version} pid${_pid}`);
        $("#task-ctx-info")
          .off()
          .on("click", function () {
            System.appInfo(_pid);
          });
        $("#task-ctx-sshot")
          .off()
          .on("click", function () {
            System.screenshot(_pid, true);
          });
        $("#task-ctx-min")
          .off()
          .on("click", function () {
            KWS.min(String(_pid));
          });
        if ($(this).hasClass("t-active")) $("#task-ctx-front").hide();
        else $("#task-ctx-front").show();
        $("#task-ctx-front")
          .off()
          .on("click", function () {
            $("#w" + _pid).css("z-index", KWS.windowIndex + 1);
            KWS.refreshWindowIndex();
          });
        $("#task-ctx-close")
          .off()
          .on("click", () => System.close(_pid));
        $("#task-ctx-kill")
          .off()
          .on("click", () => System.kill(defobj.id));
        const _ctxleft = $(this).offset().left,
          _ctxtop = window.innerHeight - $(this).offset().top;
        if (_ctxleft != $("#task-ctx").offset().left) $("#task-ctx").hide();
        $("#task-ctx").css("left", _ctxleft).css("bottom", _ctxtop).show();
      }
    });
  $("section, #kit-tasks").on("mouseenter", function () {
    $("#task-ctx").fadeOut(200);
  });
  $("#t" + _pid).on({
    mouseenter: () => {
      prevWindowIndex = $("#w" + _pid).css("z-index");
      $("#w" + _pid).addClass("win-highlight");
    },
    mouseleave: () => $("#w" + _pid).removeClass("win-highlight")
  });
  let _windowAppend =
    "<div id='w" +
    _pid +
    "'><div id='wt" +
    _pid +
    "' class='wt'><i class='wmzx'><span id='wm" +
    _pid +
    "'></span>";
  if (defobj.support.fullscreen == true)
    _windowAppend += "<span id='wz" + _pid + "'></span>";
  _windowAppend += "<span id='wx" + _pid + "'></span></i>";
  if (defobj.icon != "none") _windowAppend += "<img src='" + _iconPath + "'>";
  _windowAppend +=
    "<span id='wtname" +
    _pid +
    "'>" +
    defobj.name +
    "</span></div><div class='winc winc-" +
    defobj.id +
    "' id='winc" +
    _pid +
    "'></div></div>";
  KWS.currentDesktop.elem.insertAdjacentHTML('beforeend', _windowAppend);

  if (defobj.support.darkmode == true)
    $("#winc" + _pid).addClass("winc-darkmode");
  if (KWS.darkmode) $("#winc" + _pid).addClass("kit-darkmode");

  $("#winc" + _pid)
    .css("width", defobj.size.width)
    .css("height", defobj.size.height);
  if (defobj.resize) {
    let _minwidth = defobj.resize.minWidth ? defobj.resize.minWidth : 200;
    let _minheight = defobj.resize.minHeight ? defobj.resize.minHeight : 40;
    $("#winc" + _pid).windowResizable({
      minWidth: _minwidth,
      minHeight: _minheight
    });
  }

  let windowPos = 50 + (_pid % 10) * 20;
  KWS.windowIndex++;
  $("#w" + _pid)
    .addClass("window")
    .pep({
      elementsWithInteraction: ".winc, .ui-resizable-handle",
      useCSSTranslation: false,
      disableSelect: false,
      shouldEase: true,
      initiate: function () {
        $(this.el).addClass("ui-draggable-dragging");
        KWS.windowIndex++;
        this.el.style.zIndex = KWS.windowIndex;
        KWS.refreshWindowIndex();
      },
      stop: function () {
        this.el.style.transition = "none";
        $(this.el).removeClass("ui-draggable-dragging");
      }
    })
    .on("mousedown", function () {
      $(".window").css("transition", "none");
      $(this).css("z-index", KWS.windowIndex + 1);
      KWS.refreshWindowIndex();
    })
    .css("left", windowPos + "px")
    .css("top", windowPos + "px")
    .css("z-index", KWS.windowIndex);
  KWS.refreshWindowIndex();
  if (defobj.support.fullscreen == true)
    $(`#wt${_pid}`).on("dblclick", () => KWS.max(_pid));
  $(`#wm${_pid}`)
    .addClass("wm fa fa-window-minimize")
    .on("click", () => KWS.min(_pid));
  $(`#wz${_pid}`)
    .addClass("wz fas fa-square")
    .on("click", () => KWS.max(_pid));
  $(`#wx${_pid}`)
    .addClass("wx fa fa-times")
    .on("click", () => System.close(_pid));
  $("#winc" + _pid)
    .resizable()
    .load(app.getPath(defobj.view), (r, s, x) => {
      if (s == "error") {
        Notification.push(
          "起動に失敗しました " + x.status,
          "テンプレートにアクセスできません。" + x.statusText,
          "system"
        );
        System.launchLock = false;
        pid++;
        return false;
      }
      if (
        defobj.css != "none" &&
        !document.querySelector(`#kit-style-${defobj.id}`)
      ) {
        $("head").append(
          '<link href="' +
            app.getPath(defobj.css) +
            '" rel="stylesheet" id="kit-style-' +
            data.id +
            '"></link>'
        );
      }
      if (defobj.script != "none")
        $.getScript(app.getPath(defobj.script), () => {
          if (defobj.support.kaf == true) App.kaf(_pid);
          pid++;
        }).fail(() => {
          if (defobj.support.kaf == true) App.kaf(_pid);
          pid++;
        });
      else if (defobj.support.kaf == true) {
        App.kaf(_pid);
        pid++;
      } else pid++;
      localStorage.setItem("kit-pid", pid);
      System.launchLock = false;
    });
}

const S = System;
window.addEventListener("load", System.init);

App.version = "2.1.1";

var process = {},
  pid = 0,
  app,
  currentCTX = "",
  prevWindowIndex;
