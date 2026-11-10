(() => {
  let theme = null;
  const requested = new URLSearchParams(window.location.search).get('jyc-theme');
  if (requested === 'dark' || requested === 'light') theme = requested;
  if (!theme) {
    try {
      const saved = localStorage.getItem('jyc-theme');
      if (saved === 'dark' || saved === 'light') theme = saved;
    } catch {}
  }
  if (!theme) {
    theme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = theme;
  const themeColor = theme === 'dark' ? '#080d1c' : '#f1eadb';
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
    meta.content = themeColor;
  });
})();
