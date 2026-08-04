/**
 * Economic Group — TradingView Widget Embeds
 *
 * Embeds TradingView's official, free widgets for EGX 30/70/100 and
 * EGX-listed companies. This is deliberately NOT a custom-rendered table —
 * TradingView has no public data API (confirmed directly: even third-party
 * "TradingView API" scraping services say outright "there is no official
 * TradingView API for accessing stock data programmatically"). Scraping
 * their internal endpoints would violate their Terms of Service and could
 * break without warning, so it isn't done here. Their official embeddable
 * widgets are the only legitimate way to show real TradingView-sourced EGX
 * data — which means these three sections now render TradingView's own
 * branded UI, not our custom design system.
 *
 * Widgets used (all free, no API key, official TradingView embed scripts):
 *    - Market Overview  → EGX 30 / EGX 70 / EGX 100
 *    - Hotlists          → Top Gainers / Losers / Most Active for EGX
 *    - Screener          → full searchable/sortable EGX company list
 *
 * Bilingual support: all widgets accept a `locale` parameter. When the
 * page language is Arabic ('ar'), TradingView renders its own UI labels
 * (column headers, tooltips, buttons) in Arabic. Stock ticker symbols and
 * company names shown by TradingView reflect their own database — EGX
 * companies appear with Arabic names in TradingView's system where
 * available. The widget UI direction is also adjusted to RTL for Arabic.
 */

(function () {
  const SCRIPT_BASE = 'https://s3.tradingview.com/external-embedding';

  function clearContainer(container) {
    if (container) container.innerHTML = '';
  }

  /**
   * Builds the exact DOM structure TradingView's embed scripts expect:
   * a wrapper div, an empty "widget" div they inject their iframe into,
   * a copyright line (required by their terms), and a <script> tag whose
   * text content is the JSON config. Built with real DOM APIs (not
   * innerHTML) because injected <script> tags via innerHTML never execute —
   * the browser only runs scripts inserted through the DOM API.
   */
  function buildWidget(widgetName, config, copyrightLabel) {
    const wrapper = document.createElement('div');
    wrapper.className = 'tradingview-widget-container';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    wrapper.appendChild(widgetDiv);

    const copyrightDiv = document.createElement('div');
    copyrightDiv.className = 'tradingview-widget-copyright';
    const link = document.createElement('a');
    link.href = 'https://www.tradingview.com/';
    link.rel = 'noopener nofollow';
    link.target = '_blank';
    const span = document.createElement('span');
    span.className = 'blue-text';
    span.textContent = copyrightLabel;
    link.appendChild(span);
    copyrightDiv.appendChild(link);
    wrapper.appendChild(copyrightDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `${SCRIPT_BASE}/embed-widget-${widgetName}.js`;
    script.async = true;
    script.text = JSON.stringify(config);
    wrapper.appendChild(script);

    return wrapper;
  }

  /**
   * Maps our internal lang code to TradingView's locale string.
   * TradingView supports 'ar' natively — the widget UI (column headers,
   * tooltips, navigation) renders in Arabic when locale is 'ar'.
   */
  function tvLocale(lang) {
    return lang === 'ar' ? 'ar' : 'en';
  }

  /**
   * Bilingual copyright labels shown beneath each widget.
   */
  function copyrightText(label, lang) {
    if (lang === 'ar') {
      const labels = {
        indices: 'مؤشرات البورصة المصرية — TradingView',
        movers:  'أكثر الأسهم تحركاً في مصر — TradingView',
        stocks:  'فاحص أسهم البورصة المصرية — TradingView',
        ticker:  'شريط السوق — TradingView',
        hero:    'لقطة السوق المصري — TradingView'
      };
      return labels[label] || 'TradingView';
    }
    const labels = {
      indices: 'EGX Indices by TradingView',
      movers:  'Egypt hotlists by TradingView',
      stocks:  'Egypt stock screener by TradingView',
      ticker:  'Stock Market Ticker by TradingView',
      hero:    'EGX Snapshot by TradingView'
    };
    return labels[label] || 'TradingView';
  }

  /**
   * Market Overview widget, configured with a single custom tab holding
   * exactly EGX 30 / EGX 70 / EGX 100.
   */
  function renderIndices(containerId, lang) {
    const container = document.getElementById(containerId);
    if (!container) return;
    clearContainer(container);

    const widget = buildWidget(
      'market-overview',
      {
        colorTheme: 'light',
        locale: tvLocale(lang),
        width: '100%',
        height: '400',
        showChart: true,
        showFloatingTooltip: false,
        isTransparent: false,
        tabs: [
          {
            title: lang === 'ar' ? 'مؤشرات البورصة المصرية' : 'EGX Indices',
            symbols: [
              { s: 'EGX:EGX30',     d: lang === 'ar' ? 'مؤشر EGX 30' : 'EGX 30' },
              { s: 'EGX:EGX70EWI',  d: lang === 'ar' ? 'مؤشر EGX 70' : 'EGX 70' },
              { s: 'EGX:EGX100EWI', d: lang === 'ar' ? 'مؤشر EGX 100' : 'EGX 100' }
            ]
          }
        ]
      },
      copyrightText('indices', lang)
    );
    container.appendChild(widget);
  }

  /**
   * Hotlists widget, scoped to the EGX exchange. Shows Top Gainers / Top
   * Losers / Most Active as tabs within one widget.
   */
  function renderMovers(containerId, lang) {
    const container = document.getElementById(containerId);
    if (!container) return;
    clearContainer(container);

    const widget = buildWidget(
      'hotlists',
      {
        colorTheme: 'light',
        dateRange: '1D',
        exchange: 'EGX',
        showChart: false,
        locale: tvLocale(lang),
        width: '100%',
        height: '500',
        isTransparent: false,
        showSymbolLogo: true,
        showFloatingTooltip: true
      },
      copyrightText('movers', lang)
    );
    container.appendChild(widget);
  }

  /**
   * Screener widget, scoped to the Egypt market.
   */
  function renderStocks(containerId, lang) {
    const container = document.getElementById(containerId);
    if (!container) return;
    clearContainer(container);

    const widget = buildWidget(
      'screener',
      {
        width: '100%',
        height: '600',
        defaultColumn: 'overview',
        defaultScreen: 'general',
        showToolbar: true,
        locale: tvLocale(lang),
        market: 'egypt',
        colorTheme: 'light'
      },
      copyrightText('stocks', lang)
    );
    container.appendChild(widget);
  }

  /**
   * Ticker Tape widget — scrolling strip under the header.
   */
  function renderTickerTape(containerId, lang) {
    const container = document.getElementById(containerId);
    if (!container) return;
    clearContainer(container);

    const widget = buildWidget(
      'ticker-tape',
      {
        symbols: [
          { proName: 'EGX:EGX30', description: lang === 'ar' ? 'EGX 30 — المؤشر الرئيسي'       : 'EGX 30 Index' },
          { proName: 'EGX:COMI',  description: lang === 'ar' ? 'COMI — البنك التجاري الدولي'    : 'COMI — CIB' },
          { proName: 'EGX:TMGH',  description: lang === 'ar' ? 'TMGH — طلعت مصطفى'              : 'TMGH — Talaat Moustafa' },
          { proName: 'EGX:HRHO',  description: lang === 'ar' ? 'HRHO — المجموعة المالية هيرميس' : 'HRHO — EFG Hermes' },
          { proName: 'EGX:SWDY',  description: lang === 'ar' ? 'SWDY — السويدي إليكتريك'        : 'SWDY — El Sewedy Electric' },
          { proName: 'EGX:ETEL',  description: lang === 'ar' ? 'ETEL — المصرية للاتصالات'       : 'ETEL — Telecom Egypt' },
          { proName: 'EGX:ORAS',  description: lang === 'ar' ? 'ORAS — أوراسكوم للإنشاءات'      : 'ORAS — Orascom Construction' },
          { proName: 'EGX:EAST',  description: lang === 'ar' ? 'EAST — الشرقية للدخان'          : 'EAST — Eastern Co.' },
          { proName: 'EGX:ABUK',  description: lang === 'ar' ? 'ABUK — أبو قير للأسمدة'         : 'ABUK — Abu Qir Fertilizers' },
          { proName: 'EGX:EFIH',  description: lang === 'ar' ? 'EFIH — إي فاينانس'              : 'EFIH — e-Finance' }
        ],
        showSymbolLogo: true,
        isTransparent: false,
        displayMode: 'adaptive',
        colorTheme: 'light',
        locale: tvLocale(lang)
      },
      copyrightText('ticker', lang)
    );
    container.appendChild(widget);
  }

  /**
   * Symbol Overview widget for the hero panel.
   */
  function renderHeroSnapshot(containerId, lang) {
    const container = document.getElementById(containerId);
    if (!container) return;
    clearContainer(container);

    const widget = buildWidget(
      'symbol-overview',
      {
        symbols: [
          [lang === 'ar' ? 'مؤشر EGX 30' : 'EGX 30', 'EGX:EGX30|1D'],
          ['COMI', 'EGX:COMI|1D'],
          ['TMGH', 'EGX:TMGH|1D'],
          ['HRHO', 'EGX:HRHO|1D'],
          ['SWDY', 'EGX:SWDY|1D']
        ],
        chartOnly: false,
        width: '100%',
        height: '260',
        locale: tvLocale(lang),
        colorTheme: 'dark',
        isTransparent: true,
        autosize: false,
        showVolume: false,
        showMA: false,
        hideDateRanges: true,
        hideMarketStatus: false,
        hideSymbolLogo: false,
        scalePosition: 'no',
        scaleMode: 'Normal',
        fontSize: '11',
        noTimeScale: true,
        valuesTracking: '1',
        changeMode: 'price-and-percent',
        chartType: 'area'
      },
      copyrightText('hero', lang)
    );
    container.appendChild(widget);
  }

  window.TradingViewWidgets = { renderIndices, renderMovers, renderStocks, renderTickerTape, renderHeroSnapshot };
})();
