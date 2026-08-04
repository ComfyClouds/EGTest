/**
 * Economic Group — News Module
 * Fetches Egyptian economic news from Google News RSS via rss2json API,
 * falling back to static sample data if the request fails.
 * Defers the fetch until the section scrolls into view.
 */

(function () {
  const { qs } = window.StockUtils;

  // Fallback articles shown when the RSS fetch fails (offline / API down)
  const FALLBACK_NEWS = [
    {
      ID: 'fallback-1',
      title: 'سعر الدولار مقابل الجنيه اليوم في البنوك المصرية',
      link: '#',
      pubDate: new Date().toISOString(),
      thumbnail: 'https://picsum.photos/seed/egyptbank/600/375',
      description: 'تابع آخر أسعار صرف الدولار الأمريكي مقابل الجنيه المصري في البنوك الرسمية.',
      isFallback: true
    },
    {
      ID: 'fallback-2',
      title: 'تقرير البنك المركزي عن التضخم والنمو في مصر',
      link: '#',
      pubDate: new Date().toISOString(),
      thumbnail: 'https://picsum.photos/seed/centralbank/600/375',
      description: 'أصدر البنك المركزي المصري تقريره الدوري حول معدلات التضخم والنمو الاقتصادي.',
      isFallback: true
    },
    {
      ID: 'fallback-3',
      title: 'مؤشر EGX30 يغلق على ارتفاع وسط نشاط للمستثمرين العرب',
      link: '#',
      pubDate: new Date().toISOString(),
      thumbnail: 'https://picsum.photos/seed/stockegypt/600/375',
      description: 'أنهى مؤشر EGX30 جلسة التداول على ارتفاع ملحوظ مدعوماً بمشتريات المستثمرين العرب.',
      isFallback: true
    },
    {
      ID: 'fallback-4',
      title: 'تصريحات حكومية بشأن حزمة التحفيز الاقتصادي الجديدة',
      link: '#',
      pubDate: new Date().toISOString(),
      thumbnail: 'https://picsum.photos/seed/cairoeconomy/600/375',
      description: 'كشف مسؤولون حكوميون عن تفاصيل حزمة التحفيز الاقتصادي الجديدة الرامية إلى دعم القطاع الخاص.',
      isFallback: true
    },
    {
      ID: 'fallback-5',
      title: 'ارتفاع الصادرات المصرية غير النفطية في الربع الثالث',
      link: '#',
      pubDate: new Date().toISOString(),
      thumbnail: 'https://picsum.photos/seed/exports/600/375',
      description: 'سجلت الصادرات المصرية غير النفطية ارتفاعاً ملحوظاً خلال الربع الثالث من العام الجاري.',
      isFallback: true
    },
    {
      ID: 'fallback-6',
      title: 'قرارات الاجتماع الأخير للجنة السياسة النقدية',
      link: '#',
      pubDate: new Date().toISOString(),
      thumbnail: 'https://picsum.photos/seed/monetary/600/375',
      description: 'أعلنت لجنة السياسة النقدية عن قراراتها بشأن أسعار الفائدة في اجتماعها الأخير.',
      isFallback: true
    }
  ];

  const RSS_URL = 'https://news.google.com/rss/search?q=%D8%A7%D9%82%D8%AA%D8%B5%D8%A7%D8%AF+%D9%85%D8%B5%D8%B1&hl=ar&gl=EG&ceid=EG:ar';
  const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

  let newsData = [];
  let loaded = false;

  /**
   * Maps a raw RSS item from rss2json into the shape the rest of the
   * site expects (same fields newsCard.js and newsModal read).
   */
  function mapItem(item, index) {
    // rss2json returns a thumbnail field; fall back to a deterministic
    // picsum image so every card always has a photo.
    const image = (item.thumbnail && item.thumbnail.startsWith('http'))
      ? item.thumbnail
      : `https://picsum.photos/seed/${encodeURIComponent(item.link || index)}/600/375`;

    return {
      ID:          String(index),
      // Both AR and EN point to the same RSS title — Google News
      // already returns Arabic content because of the ceid=EG:ar param.
      TitleAR:     item.title || '',
      TitleEN:     item.title || '',
      SummaryAR:   item.description ? item.description.replace(/<[^>]+>/g, '') : '',
      SummaryEN:   item.description ? item.description.replace(/<[^>]+>/g, '') : '',
      // Modal "read more" content: link out to the original article.
      ContentAR:   `<p>${(item.description || '').replace(/<[^>]+>/g, '')}</p><p><a href="${item.link}" target="_blank" rel="noopener noreferrer">اقرأ المقال كاملاً ←</a></p>`,
      ContentEN:   `<p>${(item.description || '').replace(/<[^>]+>/g, '')}</p><p><a href="${item.link}" target="_blank" rel="noopener noreferrer">Read full article ←</a></p>`,
      CategoryAR:  'اقتصاد',
      CategoryEN:  'Economy',
      Date:        item.pubDate || new Date().toISOString(),
      Image:       image,
      link:        item.link || '#'
    };
  }

  function render(lang) {
    const grid = qs('#news-grid');
    if (!grid) return;
    window.StockSkeleton.clearBusy(grid);
    grid.innerHTML = newsData.map((item) => window.StockComponents.newsCard(item, lang)).join('');
    window.StockLazy.initImageFadeIn();
    window.StockLazy.initRevealObserver();
  }

  function load() {
    if (loaded) return;
    loaded = true;

    const grid = qs('#news-grid');
    window.StockSkeleton.renderSkeletonCards(grid, 6, 'news');

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          newsData = data.items.slice(0, 6).map(mapItem);
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
