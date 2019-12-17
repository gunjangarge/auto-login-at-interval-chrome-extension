$(function() {
  var ext = chrome.extension.getBackgroundPage(),
    $usernameDivId = $("#username-id"),
    $usernameValue = $("#username-value"),
    $passwordDivId = $("#password-id"),
    $passwordValue = $("#password-value"),
    $loginButtonDivId = $("#login-button-id"),
    $min = $('#minutes'),
    swapButtons = function() {
      $("#start,#stop").toggle();
    };

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var timer = ext.timers.get(tabs[0].id);
    if (timer) {
      swapButtons();
      var usernameDivId = timer.usernameDivId;
      var usernameValue = timer.usernameValue;
      var passwordDivId = timer.passwordDivId;
      var passwordValue = timer.passwordValue;
      var loginButtonDivId = timer.loginButtonDivId;
      var min = timer.interval / (60 * 1000);
      $min.val(Math.floor(min));
      $usernameDivId.val(usernameDivId);
      $usernameValue.val(usernameValue);
      $passwordDivId.val(passwordDivId);
      $passwordValue.val(passwordValue);
      $loginButtonDivId.val(loginButtonDivId);
      $min.val(min);
    } else {
      $min.val(localStorage.defaultSec || 15);
    }
  });

  $("#start").on("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var usernameDivId = $usernameDivId.val();
      var usernameValue = $usernameValue.val();
      var passwordDivId = $passwordDivId.val();
      var passwordValue = $passwordValue.val();
      var loginButtonDivId = $loginButtonDivId.val();
      var interval = $min.val() * 60 * 1000;

      ext.timers.set(
        tabs[0],
        interval,
        usernameDivId,
        usernameValue,
        passwordDivId,
        passwordValue,
        loginButtonDivId
      );
    });
    swapButtons();
  });

  $("#stop").on("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      ext.timers.remove(tabs[0].id);
    });
    swapButtons();
  });

  setTimeout(function() {
    $min.focus()[0].select();
  }, 100);
});
