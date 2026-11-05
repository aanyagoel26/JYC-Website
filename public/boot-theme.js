(() => {
  const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches === true;
  let theme = systemPrefersDark ? 'dark' : 'light';
  try {
    const saved = localStorage.getItem('jyc-theme');
    if (saved === 'dark' || saved === 'light') theme = saved;
  } catch {}
  document.documentElement.dataset.theme = theme;
  const themeColor = theme === 'dark' ? '#050811' : '#f8fafc';
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
    meta.content = themeColor;
  });
})();
