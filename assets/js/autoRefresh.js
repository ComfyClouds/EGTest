/**
 * Economic Group — Auto Refresh
 * Periodically re-fetches and re-renders live market data, with no page
 * reload: the market open/closed status dot in the hero panel (still
 * Sheets-backed, via MarketStatus). The "Live Snapshot" numbers themselves
 * are a TradingView widget now (see tradingViewWidgets.js) and refresh
 * internally, same as Market Overview/Top Movers/Stocks — so hero.js's
 * refresh() only touches MarketStatus, and market.js's own refresh() is a
 * no-op.
 *
 * Only refreshes sections that have already been loaded — it respects the
 * same lazy-load system used on first load, so it never forces a section
 * the user hasn't scrolled to yet. Pauses while the browser tab is in the
 * background (Page Visibility API) and does one immediate catch-up refresh
 * when the tab becomes visible again.
 *
 * In demo mode (STOCK_CONFIG.USE_SAMPLE_DATA = true) the hero panel's
 * Sheets-backed data never changes, so the refreshed numbers will look
 * identical — that's expected.
 */

(function () {
  let fastIntervalId = null;

  function fastTick() {
    if (document.hidden) return;
    window.StockHero?.refresh?.();
    window.StockMarket?.refresh?.();
  }

  function start() {
    if (!window.STOCK_CONFIG.AUTO_REFRESH_ENABLED) return;
    stop();
    fastIntervalId = setInterval(fastTick, window.STOCK_CONFIG.AUTO_REFRESH_INTERVAL_MS);
  }

  function stop() {
    if (fastIntervalId) clearInterval(fastIntervalId);
    fastIntervalId = null;
  }

  function init() {
    start();
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        fastTick();
      }
    });
  }

  window.StockAutoRefresh = { init, start, stop };
})();
