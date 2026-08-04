/**
 * Economic Group — Market Module
 * Renders: Market Overview (EGX 30/70/100), Top Gainers & Losers, and the
 * full Stocks list — all via official TradingView widgets (see
 * tradingViewWidgets.js), since that's the only legitimate source of real
 * EGX-specific data. The Currencies/Commodities ticker tabs remain our own
 * custom UI, but are now fully live-fetched (see liveMarketData.js).
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
  const { qs, qsa } = window.StockUtils;

  let currenciesData = [];
  let commoditiesData = [];
  let activeTickerTab = 'currencies';
  let dataLoaded = { overview: false, tickers: false, movers: false, stocks: false };

  /* ---------- Market Overview (TradingView) ---------- */

  function loadOverview() {
    if (dataLoaded.overview) return;
    dataLoaded.overview = true;
    window.TradingViewWidgets.renderIndices('tv-indices-widget', window.I18n.getLanguage());
  }

  /* ---------- Ticker Tabs (Currencies / Commodities — still custom UI) ---------- */

  function renderTickerTab(lang) {
    const grid = qs('#ticker-grid');
    if (!grid) return;
    window.StockSkeleton.clearBusy(grid);

    const dataMap = { currencies: currenciesData, commodities: commoditiesData };
    const rows = dataMap[activeTickerTab] || [];
    grid.innerHTML = rows.map((item) => window.StockComponents.miniTickerCard(item, lang, activeTickerTab)).join('');
    window.StockLazy.initRevealObserver();
  }

  function initTickerTabs() {
    const tabs = qsa('[data-ticker-tab]');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');
        activeTickerTab = tab.getAttribute('data-ticker-tab');
        renderTickerTab(window.I18n.getLanguage());
      });
    });
  }

  function loadTickers() {
    if (dataLoaded.tickers) return;
    dataLoaded.tickers = true;
    const grid = qs('#ticker-grid');
    window.StockSkeleton.renderSkeletonCards(grid, 4, 'row');

    Promise.all([
      window.LiveMarketData.fetchCurrencies(),
      window.LiveMarketData.fetchMetals()
    ]).then(([liveCurrencies, liveMetals]) => {
      currenciesData = liveCurrencies;
      commoditiesData = [...liveMetals].sort((a, b) => a.Order - b.Order);
      renderTickerTab(window.I18n.getLanguage());
    });
  }

  /**
   * Re-fetches and re-renders only the ticker tabs.
   */
  function refreshTickers() {
    if (!dataLoaded.tickers) return;
    const lang = window.I18n.getLanguage();

    Promise.all([
      window.LiveMarketData.fetchCurrencies(),
      window.LiveMarketData.fetchMetals()
    ]).then(([liveCurrencies, liveMetals]) => {
      currenciesData = liveCurrencies;
      commoditiesData = [...liveMetals].sort((a, b) => a.Order - b.Order);
      renderTickerTab(lang);
    });
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
    // Reset the dataLoaded flags only for TV widgets so they get rebuilt;
    // keep tickers flag so we don't re-fetch from Frankfurter unnecessarily.

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
    // Custom ticker cards just need a re-render with the new lang
    if (dataLoaded.tickers) {
      renderTickerTab(lang);
    }
  }

  /* ---------- refresh no-op (kept for autoRefresh.js compatibility) ---------- */

  function refresh() {
    // Intentionally empty: nothing Sheet-backed left on the fast cycle.
  }

  /* ---------- Init ---------- */

  function init() {
    initTickerTabs();

    document.addEventListener('stock:langchange', (e) => {
      onLangChange(e.detail.lang);
    });

    const overviewSection = qs('#markets');
    const moversSection   = qs('#movers');
    const stocksSection   = qs('#stocks');

    window.StockLazy.onEnterViewport(overviewSection, () => {
      loadOverview();
      loadTickers();
    });
    window.StockLazy.onEnterViewport(moversSection, loadMovers);
    window.StockLazy.onEnterViewport(stocksSection, loadStocksTable);
  }

  window.StockMarket = { init, refresh, refreshTickers };
})();
