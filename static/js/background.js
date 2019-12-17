var stringifiedTimer = localStorage.getItem("_timers");
var _timers = stringifiedTimer ? JSON.parse(stringifiedTimer) : {};
(function() {
  var timers = {
    get: function(id) {
      return _timers[id] || false;
    },
    set: function(
      tab,
      interval,
      usernameDivId,
      usernameValue,
      passwordDivId,
      passwordValue,
      loginButtonDivId,
      nextRefresh
    ) {
      if (!nextRefresh) {
        nextRefresh = new Date().getTime() + interval;
      }
      var id = tab.id;
      _timers[id] && timers.remove(tab.id);
      _timers[id] = {
        tab: tab,
        nextRefresh,
        interval: interval,
        usernameDivId: usernameDivId,
        usernameValue: usernameValue,
        passwordDivId: passwordDivId,
        passwordValue: passwordValue,
        loginButtonDivId: loginButtonDivId,
        timer: timers.start(
          id,
          interval,
          usernameDivId,
          usernameValue,
          passwordDivId,
          passwordValue,
          loginButtonDivId
        )
      };
    },
    remove: function(id) {
      if (_timers[id]) {
        chrome.browserAction.setBadgeText({ tabId: id, text: "" });
        clearInterval(_timers[id].timer);
        delete _timers[id];
      }
      localStorage.setItem("_timers", JSON.stringify(_timers));
    },
    start: function(
      id,
      interval,
      usernameDivId,
      usernameValue,
      passwordDivId,
      passwordValue,
      loginButtonDivId
    ) {
      return setInterval(function() {
        if (_timers[id] && new Date().getTime() >= _timers[id].nextRefresh) {

          var config = {
            usernameDivId: usernameDivId,
            usernameValue: usernameValue,
            passwordDivId: passwordDivId,
            passwordValue: passwordValue,
            loginButtonDivId: loginButtonDivId
          };
          chrome.tabs.executeScript(
            id,
            {
              code: "var config = " + JSON.stringify(config) + ";"
            },
            function() {
              chrome.tabs.executeScript(
                id,
                { file: "static/js/content_script.js" },
                function() {
                  setTimeout(function() {
                    _timers[id].nextRefresh =
                      new Date().getTime() + _timers[id].interval + 999;
                  }, 1);
                }
              );
            }
          );
        } else if (_timers[id]) {
          chrome.browserAction.getBadgeText({ tabId: id }, currentTab => {
            if (typeof currentTab === "undefined") {
              delete _timers[id];
              return;
            }
          });

          _timers[id]["timeLeft"] = moment(
            _timers[id].nextRefresh - new Date().getTime()
          );

          chrome.browserAction.setBadgeBackgroundColor({
            tabId: id,
            color: "#FF9800"
          });

          duration = moment.duration(
            _timers[id].nextRefresh - new Date().getTime(),
            "milliseconds"
          );
          fromMinutes = Math.floor(duration.asMinutes());
          fromSeconds = Math.floor(duration.asSeconds() - fromMinutes * 60);
          time =
            Math.floor(duration.asSeconds()) >= 60
              ? (fromMinutes <= 9 ? "0" + fromMinutes : fromMinutes) +
                ":" +
                (fromSeconds <= 9 ? "0" + fromSeconds : fromSeconds)
              : "00:" + (fromSeconds <= 9 ? "0" + fromSeconds : fromSeconds);
          chrome.browserAction.setBadgeText({
            tabId: id,
            text: time
          });
        } else {
          timers.remove(id);
        }
        localStorage.setItem("_timers", JSON.stringify(_timers));
      }, 100);
    }
  };
  if (stringifiedTimer) {
    Object.keys(_timers).forEach(function(index, elem) {
      timers.start(
        parseInt(index),
        elem.interval,
        elem.usernameDivId,
        elem.usernameValue,
        elem.passwordDivId,
        elem.passwordValue,
        elem.loginButtonDivId
      );
    });
  }
  // Set timers on the window object so we can access it from the popdown
  window.timers = timers;
})();
