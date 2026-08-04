/**
 * Economic Group — News Module
 * Fetches Egyptian economic news from Google News RSS via rss2json API,
 * renders them as a horizontal carousel (newest first), with prev/next
 * arrow buttons. Falls back to static sample data if the fetch fails.
 */

(function () {
  const { qs } = window.StockUtils;

  const FALLBACK_NEWS = [
    {
      ID: 'fallback-1',
      TitleAR: 'سعر الدولار مقابل الجنيه اليوم في البنوك المصرية',
      TitleEN: 'Dollar vs Egyptian Pound exchange rate today',
      SummaryAR: 'تابع آخر أسعار صرف الدولار الأمريكي مقابل الجنيه المصري في البنوك الرسمية.',
      SummaryEN: 'Follow the latest USD/EGP exchange rates across official Egyptian banks.',
      ContentAR: '<p>تابع آخر أسعار صرف الدولار الأمريكي مقابل الجنيه المصري في البنوك الرسمية.</p>',
      ContentEN: '<p>Follow the latest USD/EGP exchange rates across official Egyptian banks.</p>',
      CategoryAR: 'اقتصاد', CategoryEN: 'Economy',
      Date: new Date().toISOString(), Image: '', link: '#'
    },
    {
      ID: 'fallback-2',
      TitleAR: 'تقرير البنك المركزي عن التضخم والنمو في مصر',
      TitleEN: 'Central Bank report on inflation and growth in Egypt',
      SummaryAR: 'أصدر البنك المركزي المصري تقريره الدوري حول معدلات التضخم والنمو الاقتصادي.',
      SummaryEN: 'The Central Bank of Egypt released its periodic report on inflation and economic growth rates.',
      ContentAR: '<p>أصدر البنك المركزي المصري تقريره الدوري حول معدلات التضخم والنمو الاقتصادي.</p>',
      ContentEN: '<p>The Central Bank of Egypt released its periodic report on inflation and economic growth rates.</p>',
      CategoryAR: 'اقتصاد', CategoryEN: 'Economy',
      Date: new Date(Date.now() - 86400000).toISOString(), Image: '', link: '#'
    },
    {
      ID: 'fallback-3',
      TitleAR: 'مؤشر EGX30 يغلق على ارتفاع وسط نشاط للمستثمرين العرب',
      TitleEN: 'EGX30 closes higher amid Arab investor activity',
      SummaryAR: 'أنهى مؤشر EGX30 جلسة التداول على ارتفاع ملحوظ مدعوماً بمشتريات المستثمرين العرب.',
      SummaryEN: 'The EGX30 index ended the trading session notably higher, supported by Arab investor buying.',
      ContentAR: '<p>أنهى مؤشر EGX30 جلسة التداول على ارتفاع ملحوظ مدعوماً بمشتريات المستثمرين العرب.</p>',
      ContentEN: '<p>The EGX30 index ended the trading session notably higher, supported by Arab investor buying.</p>',
      CategoryAR: 'بورصة', CategoryEN: 'Markets',
      Date: new Date(Date.now() - 172800000).toISOString(), Image: '', link: '#'
    },
    {
      ID: 'fallback-4',
      TitleAR: 'تصريحات حكومية بشأن حزمة التحفيز الاقتصادي الجديدة',
      TitleEN: 'Government statements on new economic stimulus package',
      SummaryAR: 'كشف مسؤولون حكوميون عن تفاصيل حزمة التحفيز الاقتصادي الجديدة الرامية إلى دعم القطاع الخاص.',
      SummaryEN: 'Government officials revealed details of the new economic stimulus package aimed at supporting the private sector.',
      ContentAR: '<p>كشف مسؤولون حكوميون عن تفاصيل حزمة التحفيز الاقتصادي الجديدة.</p>',
      ContentEN: '<p>Government officials revealed details of the new economic stimulus package.</p>',
      CategoryAR: 'اقتصاد', CategoryEN: 'Economy',
      Date: new Date(Date.now() - 259200000).toISOString(), Image: '', link: '#'
    },
    {
      ID: 'fallback-5',
      TitleAR: 'ارتفاع الصادرات المصرية غير النفطية في الربع الثالث',
      TitleEN: 'Egyptian non-oil exports rise in Q3',
      SummaryAR: 'سجلت الصادرات المصرية غير النفطية ارتفاعاً ملحوظاً خلال الربع الثالث من العام الجاري.',
      SummaryEN: 'Egyptian non-oil exports recorded a notable increase during the third quarter of the current year.',
      ContentAR: '<p>سجلت الصادرات المصرية غير النفطية ارتفاعاً ملحوظاً خلال الربع الثالث من العام الجاري.</p>',
      ContentEN: '<p>Egyptian non-oil exports recorded a notable increase during the third quarter.</p>',
      CategoryAR: 'تجارة', CategoryEN: 'Trade',
      Date: new Date(Date.now() - 345600000).toISOString(), Image: '', link: '#'
    },
    {
      ID: 'fallback-6',
      TitleAR: 'قرارات الاجتماع الأخير للجنة السياسة النقدية',
      TitleEN: 'Latest Monetary Policy Committee meeting decisions',
      SummaryAR: 'أعلنت لجنة السياسة النقدية عن قراراتها بشأن أسعار الفائدة في اجتماعها الأخير.',
      SummaryEN: 'The Monetary Policy Committee announced its decisions on interest rates at its latest meeting.',
      ContentAR: '<p>أعلنت لجنة السياسة النقدية عن قراراتها بشأن أسعار الفائدة في اجتماعها الأخير.</p>',
      ContentEN: '<p>The Monetary Policy Committee announced its decisions on interest rates at its latest meeting.</p>',
      CategoryAR: 'بنوك', CategoryEN: 'Banking',
      Date: new Date(Date.now() - 432000000).toISOString(), Image: '', link: '#'
    }
  ];

  const RSS_URL = 'https://news.google.com/rss/search?q=%D8%A7%D9%82%D8%AA%D8%B5%D8%A7%D8%AF+%D9%85%D8%B5%D8%B1&hl=ar&gl=EG&ceid=EG:ar';
  const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

  let newsData  = [];
  let loaded    = false;
  let cardIndex = 0;   // index of the leftmost visible card

  // How many cards fit in the viewport (recalculated on each nav)
  function visibleCount() {
    const w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function mapItem(item, index) {
    const image = (item.thumbnail && item.thumbnail.startsWith('http'))
      ? item.thumbnail : '';
    const desc = (item.description || '').replace(/<[^>]+>/g, '').trim();
    return {
      ID:        String(index),
      TitleAR:   item.title || '',
      TitleEN:   item.title || '',
      SummaryAR: desc,
      SummaryEN: desc,
      ContentAR: `<p>${desc}</p><p><a href="${item.link}" target="_blank" rel="noopener noreferrer">اقرأ المقال كاملاً ←</a></p>`,
      ContentEN: `<p>${desc}</p><p><a href="${item.link}" target="_blank" rel="noopener noreferrer">Read full article ←</a></p>`,
      CategoryAR: 'اقتصاد',
      CategoryEN: 'Economy',
      Date:  item.pubDate || new Date().toISOString(),
      Image: image,
      link:  item.link || '#'
    };
  }

  // ── Carousel navigation ─────────────────────────────────
  function updateCarousel() {
    const grid = qs('#news-grid');
    const prev = qs('#news-prev');
    const next = qs('#news-next');
    if (!grid) return;

    const cards   = Array.from(grid.children);
    const visible = visibleCount();
    const maxIndex = Math.max(0, cards.length - visible);

    // Clamp index
    cardIndex = Math.max(0, Math.min(cardIndex, maxIndex));

    // Measure one card width + gap (gap is --space-5 = 24px)
    const cardEl  = cards[0];
    const gap     = 24; // var(--space-5)
    const cardW   = cardEl ? cardEl.offsetWidth + gap : 0;

    grid.style.transform = `translateX(${-(cardIndex * cardW)}px)`;

    // RTL: flip direction
    if (document.documentElement.dir === 'rtl') {
      grid.style.transform = `translateX(${cardIndex * cardW}px)`;
    }

    if (prev) prev.disabled = cardIndex === 0;
    if (next) next.disabled = cardIndex >= maxIndex;
  }

  function initCarousel() {
    const prev = qs('#news-prev');
    const next = qs('#news-next');

    if (prev) {
      prev.addEventListener('click', () => {
        cardIndex = Math.max(0, cardIndex - 1);
        updateCarousel();
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        const visible  = visibleCount();
        const maxIndex = Math.max(0, newsData.length - visible);
        cardIndex = Math.min(maxIndex, cardIndex + 1);
        updateCarousel();
      });
    }

    window.addEventListener('resize', () => {
      cardIndex = 0;
      updateCarousel();
    });
  }

  // ── Render ───────────────────────────────────────────────
  function render(lang) {
    const grid = qs('#news-grid');
    if (!grid) return;
    window.StockSkeleton.clearBusy(grid);

    // Sort newest → oldest
    const sorted = [...newsData].sort((a, b) => new Date(b.Date) - new Date(a.Date));

    grid.innerHTML = sorted.map((item) => window.StockComponents.newsCard(item, lang)).join('');
    window.StockLazy.initRevealObserver();

    // Reset and update carousel position
    cardIndex = 0;
    updateCarousel();
  }

  // ── Fetch ────────────────────────────────────────────────
  function load() {
    if (loaded) return;
    loaded = true;

    const grid = qs('#news-grid');
    window.StockSkeleton.renderSkeletonCards(grid, 6, 'news');
    initCarousel();

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          newsData = data.items.slice(0, 9).map(mapItem);
        } else {
          throw new Error('Empty or error response from rss2json');
        }
      })
      .catch((err) => {
        console.warn('[News] RSS fetch failed, using fallback data:', err);
        newsData = FALLBACK_NEWS;
      })
      .finally(() => {
        render(window.I18n.getLanguage());
      });
  }

  function getById(id) {
    return newsData.find((n) => String(n.ID) === String(id));
  }

  function init() {
    document.addEventListener('stock:langchange', (e) => {
      if (loaded) render(e.detail.lang);
    });
    window.StockLazy.onEnterViewport(qs('#news'), load);
  }

  window.StockNews = { init, getById };
})();
