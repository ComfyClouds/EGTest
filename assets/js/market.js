/**
 * Economic Group — Market Module
 * Renders: Market Overview (EGX 30/70/100), Top Gainers & Losers, and the
 * full Stocks list — all via official TradingView widgets (see
 * tradingViewWidgets.js), since that's the only legitimate source of real
 * EGX-specific data.
 *
 * Bilingual / Arabic-first:
 *   The DEFAULT_LANG is 'ar', so all TradingView widgets render with
 *   locale:'ar' on first load — TradingView's own UI labels (column
 *   headers, tooltips, nav tabs) appear in Arabic. When the user switches
 *   language via the header AR/EN toggle, the `stock:langchange` event
 *   fires and every visible widget is destroyed and rebuilt with the new
 *   locale, giving a seamless bilingual experience.
 *
 * Data fetches are deferred until each section scrolls into view.
 */

(function () {
  const { qs } = window.StockUtils;

  let dataLoaded = { overview: false, movers: false, stocks: false };

  /* ---------- Market Overview (TradingView) ---------- */

  function loadOverview() {
    if (dataLoaded.overview) return;
    dataLoaded.overview = true;
    window.TradingViewWidgets.renderIndices('tv-indices-widget', window.I18n.getLanguage());
  }

  /* ---------- Top Gainers / Losers (TradingView) ---------- */

  function loadMovers() {
    if (dataLoaded.movers) return;
    dataLoaded.movers = true;
    window.TradingViewWidgets.renderMovers('tv-movers-widget', window.I18n.getLanguage());
  }

  /* ---------- Stocks List (TradingView) ---------- */

  function loadStocksTable() {
    if (dataLoaded.stocks) return;
    dataLoaded.stocks = true;
    window.TradingViewWidgets.renderStocks('tv-stocks-widget', window.I18n.getLanguage());
  }

  /* ---------- Language Change — rebuild all visible TradingView widgets ---------- */

  function onLangChange(lang) {
    // TradingView widgets are iframes — they cannot be updated in-place.
    // We must destroy and rebuild each visible widget with the new locale.

    if (dataLoaded.overview) {
      dataLoaded.overview = false;
      loadOverview();
    }
    if (dataLoaded.movers) {
      dataLoaded.movers = false;
      loadMovers();
    }
    if (dataLoaded.stocks) {
      dataLoaded.stocks = false;
      loadStocksTable();
    }
  }

  /* ---------- refresh no-op (kept for autoRefresh.js compatibility) ---------- */

  function refresh() {
    // Intentionally empty: nothing Sheet-backed left on the fast cycle.
  }

  /* ---------- Init ---------- */

  function init() {
    document.addEventListener('stock:langchange', (e) => {
      onLangChange(e.detail.lang);
    });

    const overviewSection = qs('#markets');
    const moversSection   = qs('#movers');
    const stocksSection   = qs('#stocks');

    window.StockLazy.onEnterViewport(overviewSection, loadOverview);
    window.StockLazy.onEnterViewport(moversSection, loadMovers);
    window.StockLazy.onEnterViewport(stocksSection, loadStocksTable);
  }

  window.StockMarket = { init, refresh };
})();
