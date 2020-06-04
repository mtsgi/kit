((_pid, _app) => {
  if(System.isMobile) {
    _app.data('swinfo', System.serviceWorker ? `${System.serviceWorker.scope}で有効` : '無効');
  } else {
    _app.data('swinfo', 'モバイルではありません');
  }

  _app.event({
    mobile() {
      location.href = 'mobile.html'
    },
    desktop() {
      location.href = 'index.html'
    }
  });
})(pid, app);
