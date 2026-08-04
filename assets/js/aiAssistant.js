/**
 * Economic Group — AI Market Assistant (FREE / Zero-API version)
 *
 * Fully client-side, zero external API calls, zero cost.
 * Uses a rule-based NLP engine with a comprehensive EGX knowledge base.
 * Bilingual AR/EN — detects user language automatically.
 * Syncs with the site's stock:langchange event.
 *
 * Call window.EGAIAssistant.init() from main.js — already wired.
 */

(function () {
  'use strict';

  /* ================================================================
     1. EGX KNOWLEDGE BASE — stocks, sectors, indices, FAQs
     ================================================================ */

  const STOCKS = [
    // ── Banking & Finance ──────────────────────────────────────────
    { ticker:'COMI',  nameEN:'Commercial International Bank (CIB)', nameAR:'بنك التجاري الدولي CIB',        sector:'banking',     sectorAR:'البنوك',
      descEN:'CIB is Egypt\'s largest private-sector bank by assets and market cap. It is consistently ranked among the strongest banks in Africa and the Middle East, known for robust profitability, high capital adequacy, and a well-diversified loan portfolio.',
      descAR:'CIB هو أكبر بنك خاص في مصر من حيث الأصول والقيمة السوقية، ويُصنَّف باستمرار ضمن أقوى البنوك في أفريقيا والشرق الأوسط، ويتميز بربحية قوية وكفاية رأس مال عالية.' },
    { ticker:'ALEX',  nameEN:'Alexandria Bank',                       nameAR:'بنك الإسكندرية',               sector:'banking',     sectorAR:'البنوك',
      descEN:'Alexandria Bank is a mid-sized Egyptian commercial bank with a growing retail and SME lending book. It has been expanding its digital services and branch network across Egypt.',
      descAR:'بنك الإسكندرية بنك تجاري متوسط الحجم يتمتع بمحفظة تجزئة ومشروعات صغيرة ومتوسطة متنامية، ويوسع خدماته الرقمية وشبكة فروعه.' },
    { ticker:'ADIB',  nameEN:'Abu Dhabi Islamic Bank Egypt',          nameAR:'بنك أبوظبي الإسلامي مصر',     sector:'banking',     sectorAR:'البنوك',
      descEN:'ADIB Egypt is the Egyptian subsidiary of Abu Dhabi Islamic Bank, offering Sharia-compliant banking products. It holds a solid position in the Islamic finance segment in Egypt.',
      descAR:'بنك أبوظبي الإسلامي مصر يقدم منتجات مصرفية متوافقة مع الشريعة الإسلامية، ويتمتع بمركز متين في قطاع التمويل الإسلامي بمصر.' },
    { ticker:'QNBA',  nameEN:'QNB Alahli Bank',                      nameAR:'بنك قطر الوطني الأهلي',        sector:'banking',     sectorAR:'البنوك',
      descEN:'QNB Alahli is one of Egypt\'s largest private banks, backed by Qatar National Bank. It offers a full range of corporate, retail, and investment banking services.',
      descAR:'بنك قطر الوطني الأهلي أحد أكبر البنوك الخاصة في مصر، وتدعمه مجموعة بنك قطر الوطني، ويقدم خدمات مصرفية شاملة للأفراد والشركات.' },
    { ticker:'EGBE',  nameEN:'Export Development Bank of Egypt',     nameAR:'بنك تنمية الصادرات',           sector:'banking',     sectorAR:'البنوك',
      descEN:'EGBE focuses on financing Egyptian exports and trade, playing a strategic role in supporting foreign currency revenues for the Egyptian economy.',
      descAR:'يركز بنك تنمية الصادرات على تمويل الصادرات المصرية والتجارة الخارجية، ويؤدي دوراً استراتيجياً في دعم حصيلة النقد الأجنبي.' },
    { ticker:'MFPC',  nameEN:'Misr Financial (Aman)',                 nameAR:'مصر للتمويل - أمان',           sector:'finance',     sectorAR:'التمويل',
      descEN:'A leading Egyptian non-banking financial services company offering consumer finance, microfinance, and insurance products under the Aman brand.',
      descAR:'شركة رائدة في الخدمات المالية غير المصرفية تقدم تمويل المستهلك والتمويل متناهي الصغر والتأمين تحت علامة أمان.' },
    { ticker:'HRHO',  nameEN:'EFG Hermes Holding',                    nameAR:'المجموعة المالية هيرميس',      sector:'finance',     sectorAR:'التمويل',
      descEN:'EFG Hermes is the leading investment bank and financial services group in the Arab world, offering investment banking, brokerage, asset management, private equity, and non-banking financial services across emerging markets.',
      descAR:'المجموعة المالية هيرميس هي المجموعة الرائدة في مجال الخدمات المالية وبنوك الاستثمار في العالم العربي، وتقدم خدمات الوساطة وإدارة الأصول والبنك الاستثماري في الأسواق الناشئة.' },
    { ticker:'EFIH',  nameEN:'e-Finance for Digital and Financial Investments', nameAR:'إي فاينانس للاستثمارات المالية الرقمية', sector:'finance', sectorAR:'التمويل',
      descEN:'e-Finance operates Egypt\'s national financial switch and digital payments infrastructure. It processes government payments, tax collection, and financial transactions for millions of Egyptians and is a key pillar of Egypt\'s digital transformation.',
      descAR:'إي فاينانس تدير البنية التحتية للمدفوعات الرقمية والمحول المالي الوطني في مصر، وتعالج مدفوعات الحكومة وتحصيل الضرائب ومعاملات ملايين المواطنين.' },
    { ticker:'AMER',  nameEN:'Americana Restaurants',                 nameAR:'أمريكانا ريستورانتس',          sector:'finance',     sectorAR:'التمويل',
      descEN:'Americana Restaurants is one of the largest restaurant franchisors and operators in the Middle East and North Africa, running KFC, Pizza Hut, Hardee\'s, and other global chains across Egypt and the region.',
      descAR:'أمريكانا ريستورانتس من أكبر مشغلي المطاعم في الشرق الأوسط وشمال أفريقيا، وتدير امتيازات KFC وبيتزا هت وهارديز وغيرها.' },

    // ── Real Estate ────────────────────────────────────────────────
    { ticker:'TMGH',  nameEN:'Talaat Moustafa Group (TMG)',           nameAR:'مجموعة طلعت مصطفى',            sector:'realestate',  sectorAR:'العقارات',
      descEN:'TMG is one of Egypt\'s largest real estate developers. Its flagship project is Madinaty, a massive integrated city east of Cairo. The group also developed Al Rehab City and Celia. It has a strong land bank and diversified revenue from hospitality, retail, and residential sales.',
      descAR:'مجموعة طلعت مصطفى هي إحدى أكبر شركات التطوير العقاري في مصر. مشروعها الرائد مدينتي شرق القاهرة، فضلاً عن مدينة الرحاب وسيليا. لديها بنك أراضٍ ضخم وإيرادات متنوعة من الضيافة والتجزئة والمبيعات السكنية.' },
    { ticker:'MNHD',  nameEN:'Madinet Nasr for Housing & Development',nameAR:'مدينة نصر للإسكان والتعمير',  sector:'realestate',  sectorAR:'العقارات',
      descEN:'MNHD is a state-backed real estate developer focused on Nasr City, one of Cairo\'s established urban districts. It develops residential, commercial, and mixed-use properties with a large land reserve in prime Cairo locations.',
      descAR:'شركة مدينة نصر للإسكان والتعمير مطور عقاري حكومي يركز على مدينة نصر، وتطور مشاريع سكنية وتجارية ومتعددة الاستخدامات بمخزون أراضٍ ضخم.' },
    { ticker:'PHDC',  nameEN:'Palm Hills Developments',               nameAR:'بالم هيلز للتطوير العقاري',   sector:'realestate',  sectorAR:'العقارات',
      descEN:'Palm Hills is a leading Egyptian real estate developer with a strong presence in gated communities and mixed-use projects in Greater Cairo, the North Coast, and Upper Egypt, including Palm Hills October and Palm Hills New Cairo.',
      descAR:'بالم هيلز من كبار المطورين العقاريين في مصر، تمتلك حضوراً قوياً في مجمعات السكن المغلق والمشاريع متعددة الاستخدامات في القاهرة الكبرى والساحل الشمالي.' },
    { ticker:'ORHD',  nameEN:'Orascom Development Holding',           nameAR:'أوراسكوم للتنمية',             sector:'realestate',  sectorAR:'العقارات',
      descEN:'Orascom Development develops and manages fully integrated towns including hotels, private villas, apartments, leisure facilities, and infrastructure. Key projects include El Gouna on the Red Sea and Taba Heights in Sinai.',
      descAR:'تطور أوراسكوم مدناً متكاملة تشمل فنادق وفيلات ومرافق ترفيهية وبنية تحتية. أبرز مشاريعها الغردقة (الجونة) وطابا هايتس في سيناء.' },
    { ticker:'EMFD',  nameEN:'Emaar Misr',                            nameAR:'إعمار مصر',                   sector:'realestate',  sectorAR:'العقارات',
      descEN:'Emaar Misr is the Egyptian arm of UAE-based Emaar Properties. Its flagship development is Uptown Cairo, a high-end mixed-use community on the Mokattam hills, along with Marassi on the North Coast.',
      descAR:'إعمار مصر الذراع المصرية لإعمار الإماراتية. أبرز مشاريعها أبتاون القاهرة ومراسي على الساحل الشمالي.' },
    { ticker:'SODIC', nameEN:'SODIC',                                 nameAR:'شركة SODIC للتطوير العقاري',  sector:'realestate',  sectorAR:'العقارات',
      descEN:'SODIC is a premium Egyptian real estate developer known for projects like Eastown, Westown, and SODIC East in New Cairo and Sheikh Zayed. It was acquired by Abu Dhabi\'s Aldar Properties, adding significant financial backing.',
      descAR:'SODIC مطور عقاري مصري راقٍ يمتلك مشاريع إيستاون وويستاون في الشيخ زايد والقاهرة الجديدة، واستحوذت عليها شركة الدار العقارية الإماراتية.' },

    // ── Telecom ────────────────────────────────────────────────────
    { ticker:'ETEL',  nameEN:'Telecom Egypt',                         nameAR:'المصرية للاتصالات',            sector:'telecom',     sectorAR:'الاتصالات',
      descEN:'Telecom Egypt is the country\'s incumbent fixed-line operator and owns a 45% stake in Vodafone Egypt. It is the only company with a landline monopoly and a major infrastructure owner for submarine cables and fiber networks.',
      descAR:'المصرية للاتصالات المشغل الوطني للخطوط الأرضية، وتمتلك 45% من فودافون مصر، وهي أحد أبرز ملاك البنية التحتية للكابلات البحرية والألياف الضوئية.' },
    { ticker:'GTHE',  nameEN:'Global Telecom Holding (GTH)',          nameAR:'القابضة للاتصالات العالمية',  sector:'telecom',     sectorAR:'الاتصالات',
      descEN:'GTH is a leading emerging-markets telecom holding company with operations across Africa and Asia. It is a subsidiary of VEON Ltd and operates mobile networks in several countries.',
      descAR:'القابضة للاتصالات العالمية شركة اتصالات في الأسواق الناشئة تعمل في أفريقيا وآسيا، وهي تابعة لمجموعة VEON.' },

    // ── Energy & Petrochemicals ────────────────────────────────────
    { ticker:'AMOC',  nameEN:'Alexandria Mineral Oils Company',       nameAR:'الإسكندرية للزيوت المعدنية', sector:'energy',      sectorAR:'الطاقة والبتروكيماويات',
      descEN:'AMOC is Egypt\'s leading producer of lubricating base oils and refined petroleum products. It refines crude oil at its Alexandria plant and supplies both domestic and export markets.',
      descAR:'الإسكندرية للزيوت المعدنية المنتج الرئيسي لزيوت التزليق ومنتجات البترول المكررة في مصر، وتُصدر إلى أسواق خارجية.' },
    { ticker:'SCOM',  nameEN:'Sidi Kerir Petrochemicals (SIDPEC)',    nameAR:'سيدي كرير للبتروكيماويات',   sector:'energy',      sectorAR:'الطاقة والبتروكيماويات',
      descEN:'SIDPEC produces polyethylene from natural gas at its Sidi Kerir plant near Alexandria. It is one of the largest petrochemical producers in Egypt and sells to local and global markets.',
      descAR:'سيدي كرير للبتروكيماويات تنتج البولي إيثيلين من الغاز الطبيعي في مصنعها بالقرب من الإسكندرية، وتبيع محلياً وعالمياً.' },

    // ── Food & Beverages ───────────────────────────────────────────
    { ticker:'JUFO',  nameEN:'Juhayna Food Industries',               nameAR:'جهينة للصناعات الغذائية',    sector:'food',        sectorAR:'الغذاء والمشروبات',
      descEN:'Juhayna is Egypt\'s leading dairy and juice producer, with brands covering UHT milk, yogurt, juices, and concentrates. It commands a dominant market share in the packaged dairy segment.',
      descAR:'جهينة الرائدة في صناعة منتجات الألبان والعصائر في مصر بحصة سوقية مهيمنة في قطاع الألبان المعبأة والعصائر.' },
    { ticker:'DOMTY', nameEN:'Arab Dairy (Domty)',                     nameAR:'العربية للصناعات الغذائية - دومتي', sector:'food', sectorAR:'الغذاء والمشروبات',
      descEN:'Domty is one of Egypt\'s top cheese and dairy companies, especially known for processed cheese and white cheese. It distributes through a wide retail network across Egypt.',
      descAR:'دومتي من أبرز شركات الأجبان والألبان في مصر، وتشتهر بالجبن المطبوخ والأبيض، وتوزع عبر شبكة واسعة من المنافذ.' },
    { ticker:'POUL',  nameEN:'Cairo Poultry Group (Dina Farms)',      nameAR:'مجموعة القاهرة للدواجن - مزارع دينا', sector:'food', sectorAR:'الغذاء والمشروبات',
      descEN:'Cairo Poultry Group is a major integrated food company in Egypt operating poultry, dairy (Dina Farms brand), and animal feed businesses. It is one of the largest agri-food groups in the country.',
      descAR:'مجموعة القاهرة للدواجن تمتلك أنشطة متكاملة في الدواجن والألبان (مزارع دينا) والأعلاف، وتُعد من أكبر مجموعات الغذاء الزراعي في مصر.' },
    { ticker:'EAST',  nameEN:'Eastern Company (Cigarettes)',           nameAR:'الشرقية للدخان',              sector:'food',        sectorAR:'الغذاء والمشروبات',
      descEN:'Eastern Company is Egypt\'s dominant tobacco manufacturer and holds a near-monopoly on the domestic cigarette market. It produces leading local brands and has recently entered international markets.',
      descAR:'الشرقية للدخان هي الشركة المهيمنة على صناعة التبغ في مصر وتحتل شبه احتكار في سوق السجائر المحلية، وتنتج علامات تجارية محلية رائدة.' },

    // ── Healthcare & Pharma ────────────────────────────────────────
    { ticker:'ISPH',  nameEN:'Integrated Diagnostic Holding (IDH)',   nameAR:'القابضة للتشخيص المتكامل IDH', sector:'healthcare', sectorAR:'الرعاية الصحية',
      descEN:'IDH is the largest private-sector diagnostics and laboratory network in Egypt, operating under the Al-Borg and Al-Mokhtabar brands. It also has operations in Sudan, Nigeria, and Jordan.',
      descAR:'IDH أكبر شبكة مختبرات تشخيص في القطاع الخاص المصري تعمل تحت علامتي البرج والمختبر، ولها حضور في السودان ونيجيريا والأردن.' },
    { ticker:'EIPICO',nameEN:'Egyptian International Pharmaceutical Industries (EIPICO)', nameAR:'إيبيكو للصناعات الدوائية', sector:'pharma', sectorAR:'الدواء',
      descEN:'EIPICO is one of Egypt\'s largest pharmaceutical manufacturers, producing a wide range of generic drugs and exporting to over 50 countries. It is known for its strong R&D capabilities.',
      descAR:'إيبيكو من أكبر شركات تصنيع الأدوية في مصر، تنتج مجموعة واسعة من الأدوية الجنيسة وتصدر إلى أكثر من 50 دولة.' },
    { ticker:'PHRX',  nameEN:'Pharco Pharmaceuticals',                nameAR:'فاركو للصناعات الدوائية',    sector:'pharma',      sectorAR:'الدواء',
      descEN:'Pharco is a leading Egyptian pharmaceutical company with a specialty in hepatitis C drugs. It became globally recognized for developing affordable HCV treatments critical to Egypt\'s national elimination program.',
      descAR:'فاركو شركة دوائية مصرية رائدة متخصصة في علاجات فيروس سي، واكتسبت شهرة عالمية بتطوير علاجات ميسورة التكلفة ضمن البرنامج القومي.' },

    // ── Cement & Construction ──────────────────────────────────────
    { ticker:'ARCC',  nameEN:'Arabian Cement Company',                nameAR:'الأسمنت العربية',             sector:'cement',      sectorAR:'الأسمنت والمواد البنائية',
      descEN:'Arabian Cement is one of Egypt\'s top cement producers, operating a large clinker plant near Cairo. It serves both residential and infrastructure project demand across Egypt.',
      descAR:'الأسمنت العربية من كبار منتجي الأسمنت في مصر، تمتلك مصنع كلنكر ضخماً وتخدم مشاريع البناء والبنية التحتية.' },
    { ticker:'SVCE',  nameEN:'Sinai Cement',                          nameAR:'أسمنت سيناء',                 sector:'cement',      sectorAR:'الأسمنت والمواد البنائية',
      descEN:'Sinai Cement operates one of Egypt\'s major cement production facilities in the Sinai Peninsula. It is a significant regional supplier benefiting from proximity to North Sinai construction projects.',
      descAR:'تدير شركة أسمنت سيناء أحد مصانع الأسمنت الكبرى في شبه جزيرة سيناء، وتستفيد من قرب مشاريع البناء في شمال سيناء.' },
    { ticker:'OKAZ',  nameEN:'Orascom Construction',                  nameAR:'أوراسكوم للإنشاء والصناعة',  sector:'construction', sectorAR:'الإنشاء',
      descEN:'Orascom Construction is one of the largest construction and engineering companies in the Middle East and North Africa. It executes major infrastructure, industrial, and building projects across the region.',
      descAR:'أوراسكوم للإنشاء من أكبر شركات البناء والهندسة في منطقة الشرق الأوسط وشمال أفريقيا، تنفذ مشاريع ضخمة في البنية التحتية والصناعة.' },
    { ticker:'ORAS',  nameEN:'Orascom Investment Holding',            nameAR:'أوراسكوم للاستثمار القابضة',  sector:'construction', sectorAR:'الإنشاء',
      descEN:'Orascom Investment Holding is the parent investment holding of the Orascom group, with diversified stakes across construction, telecom, tourism, and energy.',
      descAR:'أوراسكوم للاستثمار القابضة هي الذراع الاستثمارية للمجموعة بحصص متنوعة في الإنشاء والاتصالات والسياحة والطاقة.' },
    { ticker:'ABUK',  nameEN:'Abu Qir Fertilizers',                   nameAR:'أبو قير للأسمدة والصناعات الكيماوية', sector:'construction', sectorAR:'الصناعة',
      descEN:'Abu Qir Fertilizers is one of Egypt\'s leading producers of nitrogen-based fertilizers. It exports to global markets and plays a key role in supporting Egypt\'s agricultural sector.',
      descAR:'أبو قير للأسمدة من أبرز منتجي الأسمدة النيتروجينية في مصر، وتُصدر إلى أسواق عالمية وتدعم القطاع الزراعي المصري.' },

    // ── Industrials ────────────────────────────────────────────────
    { ticker:'SWDY',  nameEN:'Elsewedy Electric',                     nameAR:'السويدي إليكتريك',             sector:'industrials', sectorAR:'الصناعة',
      descEN:'Elsewedy Electric is one of the largest integrated energy and infrastructure solutions companies in Egypt and the broader MENA and African region. It manufactures cables, transformers, meters, and turnkey energy projects globally.',
      descAR:'السويدي إليكتريك من أكبر شركات الطاقة والبنية التحتية المتكاملة في مصر والمنطقة، وتصنع الكابلات والمحولات والعدادات وتنفذ مشاريع طاقة متكاملة عالمياً.' },
    { ticker:'SPIN',  nameEN:'Spinning and Weaving Holding',          nameAR:'الشركة القابضة للغزل والنسيج',sector:'industrials', sectorAR:'الصناعة',
      descEN:'Spinning and Weaving Holding is one of Egypt\'s largest state-owned textile companies, comprising multiple subsidiaries involved in cotton ginning, spinning, weaving, and garment manufacturing.',
      descAR:'الشركة القابضة للغزل والنسيج من أكبر شركات النسيج الحكومية في مصر، وتضم شركات تابعة تعمل في حلج القطن والغزل والنسيج وصناعة الملابس.' },
    { ticker:'IRON',  nameEN:'Egyptian Iron and Steel',               nameAR:'الحديد والصلب المصرية',        sector:'industrials', sectorAR:'الصناعة',
      descEN:'Egyptian Iron and Steel is a state-owned steel producer based in Helwan, Cairo. It is one of the oldest heavy industry companies in Egypt, producing long steel products like rebar and wire rod.',
      descAR:'الحديد والصلب المصرية شركة حكومية مقرها حلوان، وهي من أقدم شركات الصناعة الثقيلة في مصر، وتنتج منتجات الصلب الطويل كالحديد المسلح وقضبان الأسلاك.' },

    // ── Transport ──────────────────────────────────────────────────
    { ticker:'AMKE',  nameEN:'Alexandria Container & Cargo Handling', nameAR:'الإسكندرية للحاويات والبضائع', sector:'transport',  sectorAR:'النقل واللوجستيات',
      descEN:'AMKE operates container and cargo handling services at Alexandria port, one of Egypt\'s busiest trade gateways. It benefits from Egypt\'s growing import and export volumes.',
      descAR:'تدير شركة الإسكندرية للحاويات خدمات الحاويات والشحن في ميناء الإسكندرية، أحد أكثر بوابات التجارة ازدحاماً في مصر.' },
    { ticker:'AACP',  nameEN:'Alexandria Port Development',           nameAR:'تطوير ميناء الإسكندرية',       sector:'transport',  sectorAR:'النقل واللوجستيات',
      descEN:'Alexandria Port Development manages port facilities and logistics infrastructure at Alexandria, one of Egypt\'s primary trade and import/export hubs.',
      descAR:'شركة تطوير ميناء الإسكندرية تدير المرافق اللوجستية في ميناء الإسكندرية، أحد أهم مراكز التجارة والاستيراد والتصدير في مصر.' },
  ];

  // Sector descriptions
  const SECTORS = {
    banking:      { en:'Banking & Finance',        ar:'البنوك والتمويل' },
    finance:      { en:'Non-Banking Finance',       ar:'التمويل غير المصرفي' },
    realestate:   { en:'Real Estate',               ar:'العقارات' },
    telecom:      { en:'Telecommunications',        ar:'الاتصالات' },
    energy:       { en:'Energy & Petrochemicals',   ar:'الطاقة والبتروكيماويات' },
    food:         { en:'Food & Beverages',          ar:'الغذاء والمشروبات' },
    healthcare:   { en:'Healthcare',                ar:'الرعاية الصحية' },
    pharma:       { en:'Pharmaceuticals',           ar:'الدواء' },
    cement:       { en:'Cement & Building Materials',ar:'الأسمنت والمواد البنائية' },
    construction: { en:'Construction',              ar:'الإنشاء' },
    industrials:  { en:'Industrials',               ar:'الصناعة' },
    transport:    { en:'Transport & Logistics',     ar:'النقل واللوجستيات' },
  };

  // Index descriptions
  const INDICES = {
    EGX30:  {
      en:'The EGX 30 is Egypt\'s benchmark stock index, tracking the 30 most liquid and highly capitalized companies on the Egyptian Exchange. It is the primary gauge of Egyptian market performance and is widely followed by institutional investors.',
      ar:'مؤشر إيجي إكس 30 هو المؤشر الرئيسي للبورصة المصرية، ويتتبع أداء أكثر 30 شركة سيولةً وتشكيلاً للقيمة السوقية. يُعد المقياس الأول لأداء السوق المصري.'
    },
    EGX70:  {
      en:'The EGX 70 Equal Weight Index tracks 70 active companies listed on the EGX that are not included in the EGX 30. It gives an equal weighting to each constituent, making it a broader measure of mid-cap market performance.',
      ar:'مؤشر إيجي إكس 70 يتتبع 70 شركة نشطة غير مدرجة في المؤشر 30، بأوزان متساوية لكل مكوناته، مما يجعله مقياساً أشمل لأداء الشركات متوسطة الحجم.'
    },
    EGX100: {
      en:'The EGX 100 combines the constituents of both the EGX 30 and EGX 70, covering 100 of the most active listed companies. It provides the broadest index-level view of the Egyptian Exchange.',
      ar:'مؤشر إيجي إكس 100 يجمع مكونات المؤشرين 30 و70، ويغطي 100 شركة من أكثر الشركات نشاطاً، ويوفر أشمل رؤية لمستوى البورصة المصرية.'
    },
  };

  // General market FAQ knowledge
  const FAQ = [
    {
      keys: ['trading hours','session','open time','market hours','ساعات','موعد','جلسة','وقت'],
      en: 'The Egyptian Exchange (EGX) trading session runs Sunday to Thursday, from 10:00 AM to 2:30 PM Cairo time (UTC+2). The market is closed on Fridays, Saturdays, and Egyptian public holidays.',
      ar: 'جلسة تداول البورصة المصرية تعمل من الأحد إلى الخميس، من الساعة 10:00 صباحاً حتى 2:30 ظهراً بتوقيت القاهرة (UTC+2). السوق مغلق أيام الجمعة والسبت والعطلات الرسمية.'
    },
    {
      keys: ['online live trading','online trading','live trading','electronic trading','التداول الالكتروني المباشر','التداول الإلكتروني المباشر','التداول الالكتروني','تداول اونلاين','تداول إلكتروني'],
      en: 'You can access Online Live Trading through the Economic Group\'s official electronic trading platform. Start trading on the Egyptian Exchange directly online:\n\n🔗 https://www.eg-broktrade.com/NewLogin.aspx?ReturnUrl=%2f\n\nLog in with your account credentials to begin live trading sessions.',
      ar: 'يمكنك الوصول إلى خدمة التداول الإلكتروني المباشر عبر المنصة الرسمية للمجموعة الاقتصادية. ابدأ التداول في البورصة المصرية مباشرةً عبر الإنترنت:\n\n🔗 https://www.eg-broktrade.com/NewLogin.aspx?ReturnUrl=%2f\n\nسجّل دخولك ببيانات حسابك لبدء جلسات التداول المباشر.'
    },
    {
      keys: ['open account','how to trade','start trading','فتح حساب','كيف أتداول','ابدأ'],
      en: 'To trade on the Egyptian Exchange, you need to open a brokerage account with a licensed brokerage firm like Economic Group. The process requires a national ID, a bank account, and completion of a Know Your Customer (KYC) form. Once approved, you can fund your account and start trading.\n\nFor Online Live Trading, visit:\n🔗 https://www.eg-broktrade.com/NewLogin.aspx?ReturnUrl=%2f',
      ar: 'لتداول البورصة المصرية، تحتاج إلى فتح حساب وساطة مع شركة وساطة مرخصة مثل المجموعة الاقتصادية. يتطلب الأمر بطاقة رقم قومي وحساب بنكي واستمارة KYC. بعد الموافقة، تودع المبلغ وتبدأ التداول.\n\nللتداول الإلكتروني المباشر، تفضل بزيارة:\n🔗 https://www.eg-broktrade.com/NewLogin.aspx?ReturnUrl=%2f'
    },
    {
      keys: ['circuit breaker','halt','freeze','وقف تداول','فاصل كهربائي'],
      en: 'The EGX applies circuit breakers to limit extreme price swings. Individual stocks are halted if they rise or fall more than 10% in a single session. For major indices, a market-wide halt may be triggered if the EGX 30 moves more than 5% in a single day.',
      ar: 'تطبق البورصة المصرية فواصل أمان لتقييد التذبذبات الحادة. يوقف تداول أي سهم إذا ارتفع أو انخفض أكثر من 10% في جلسة واحدة. وقد يُوقف السوق بالكامل إذا تحرك مؤشر EGX30 أكثر من 5% في يوم واحد.'
    },
    {
      keys: ['dividend','coupon','yield','توزيعات','عائد','كوبون','ربح سنوي'],
      en: 'Egyptian listed companies distribute dividends if approved by the general assembly. Dividends are typically paid annually and are subject to a 10% withholding tax for individual investors. The ex-dividend date determines who qualifies to receive the payout.',
      ar: 'توزع الشركات المصرية المدرجة أرباحاً بموافقة الجمعية العامة. تُدفع الأرباح عادةً سنوياً وتخضع لضريبة استقطاع 10% للمستثمرين الأفراد. يحدد تاريخ الفصل مَن يستحق الأرباح.'
    },
    {
      keys: ['price limit','price band','daily limit','حد السعر','حد يومي','نسبة الحركة'],
      en: 'EGX stocks have a daily price movement limit of ±10% from the previous day\'s closing price. This means a stock cannot rise or fall more than 10% in a single trading session.',
      ar: 'تحركات أسعار أسهم البورصة المصرية محدودة بـ ±10% من سعر إغلاق اليوم السابق، ما يعني أن السهم لا يمكنه الارتفاع أو الانخفاض أكثر من 10% في جلسة واحدة.'
    },
    {
      keys: ['egx','egyptian exchange','بورصة','إيجي إكس','سوق المال'],
      en: 'The Egyptian Exchange (EGX) is one of the oldest stock exchanges in the Middle East and Africa, founded in 1883. It operates two exchanges in Cairo and Alexandria and lists over 250 companies across a range of sectors including banking, real estate, telecom, food, and industrials.',
      ar: 'البورصة المصرية (إيجي إكس) من أقدم أسواق المال في الشرق الأوسط وأفريقيا، تأسست عام 1883، وتضم بورصتي القاهرة والإسكندرية وتُدرج أكثر من 250 شركة في قطاعات متنوعة.'
    },
    {
      keys: ['risk','invest','should i buy','risk disclaimer','استثمار','هل أشتري','مخاطرة'],
      en: 'Investing in stocks involves risk. Prices can go up or down, and past performance is not a guarantee of future results. The information provided here is for educational purposes only and does not constitute investment advice. Please consult a licensed financial advisor before making any investment decisions.',
      ar: 'الاستثمار في الأسهم ينطوي على مخاطر. قد ترتفع الأسعار أو تنخفض، والأداء السابق لا يضمن نتائج مستقبلية. المعلومات هنا للأغراض التعليمية فقط ولا تمثل توصية استثمارية. استشر مستشاراً مالياً مرخصاً قبل اتخاذ أي قرار.'
    },
    {
      keys: ['compare','vs','versus','difference between','قارن','مقارنة','الفرق بين'],
      en: null, ar: null, // handled dynamically
    },
  ];

  /* ================================================================
     2. LANGUAGE DETECTION & NLP HELPERS
     ================================================================ */

  function detectLang(text) {
    return /[\u0600-\u06FF]/.test(text) ? 'ar' : 'en';
  }

  function normalize(text) {
    return text.toLowerCase()
      .replace(/[.,،؟?!؟\-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function findStock(query) {
    const q = normalize(query);
    let match = STOCKS.find(s => q.includes(s.ticker.toLowerCase()));
    if (match) return match;
    match = STOCKS.find(s => q.includes(s.nameEN.toLowerCase().split(' ')[0].toLowerCase()) ||
                              s.nameEN.toLowerCase().split(' ').some(w => w.length > 4 && q.includes(w)));
    if (match) return match;
    match = STOCKS.find(s => {
      const words = s.nameAR.split(' ').filter(w => w.length > 2);
      return words.some(w => query.includes(w));
    });
    return match || null;
  }

  function findTwoStocks(query) {
    const q = normalize(query);
    const found = STOCKS.filter(s =>
      q.includes(s.ticker.toLowerCase()) ||
      s.nameEN.toLowerCase().split(' ').some(w => w.length > 4 && q.includes(w)) ||
      s.nameAR.split(' ').filter(w => w.length > 2).some(w => query.includes(w))
    );
    return found.slice(0, 2);
  }

  function findSector(query) {
    const q = normalize(query);
    const sectorKeywords = {
      banking:      ['bank','banking','cib','qnb','finance','بنك','بنوك','مصرفي'],
      realestate:   ['real estate','property','housing','عقار','عقارات','إسكان','مسكن'],
      telecom:      ['telecom','communication','اتصال','اتصالات'],
      energy:       ['energy','oil','petroleum','gas','طاقة','نفط','بترول','غاز'],
      food:         ['food','dairy','juice','beverage','tobacco','غذاء','ألبان','عصير','مشروبات','دخان'],
      healthcare:   ['health','diagnostic','lab','صحة','مختبر','تشخيص'],
      pharma:       ['pharma','drug','medicine','دواء','صيدل','دوائية'],
      cement:       ['cement','building','أسمنت','بناء','مواد بنائية'],
      construction: ['construct','engineer','انشاء','هندسة','مقاولات'],
      industrials:  ['industrial','electric','steel','textile','صناعة','كهرباء','صلب','نسيج','أسمدة','fertilizer'],
      transport:    ['transport','logistic','port','نقل','لوجست','ميناء'],
    };
    for (const [key, keywords] of Object.entries(sectorKeywords)) {
      if (keywords.some(kw => q.includes(kw))) return key;
    }
    return null;
  }

  function findIndex(query) {
    const q = normalize(query);
    if (q.includes('egx30') || q.includes('egx 30') || q.includes('30')) return 'EGX30';
    if (q.includes('egx70') || q.includes('egx 70') || q.includes('70')) return 'EGX70';
    if (q.includes('egx100') || q.includes('egx 100') || q.includes('100')) return 'EGX100';
    return null;
  }

  /* ================================================================
     3. RESPONSE ENGINE
     ================================================================ */

  function buildResponse(userText, uiLang) {
    const lang   = detectLang(userText);
    const isAr   = lang === 'ar';
    const q      = normalize(userText);

    // ── Greetings ───────────────────────────────────────────────
    const greetings = ['hello','hi','hey','marhaba','ahlan','أهلاً','مرحبا','السلام','هاي'];
    if (greetings.some(g => q.startsWith(g) || q === g)) {
      return isAr
        ? 'أهلاً! يسعدني مساعدتك. يمكنك السؤال عن أي سهم في البورصة المصرية مثل TMGH أو CIB، أو عن مؤشرات السوق، أو ساعات التداول، أو التداول الإلكتروني المباشر، أو أي قطاع تريد.'
        : 'Hello! Happy to help. You can ask me about any EGX-listed stock like TMGH or CIB, market indices, trading hours, Online Live Trading, or any sector you\'re interested in.';
    }

    // ── Thanks ──────────────────────────────────────────────────
    if (['thank','شكر','شكراً','تسلم'].some(g => q.includes(g))) {
      return isAr
        ? 'العفو! هل هناك شيء آخر يمكنني مساعدتك به؟'
        : 'You\'re welcome! Anything else I can help you with?';
    }

    // ── Compare two stocks ───────────────────────────────────────
    const compareWords = ['compare','vs','versus','difference','قارن','مقارنة','الفرق','بين'];
    if (compareWords.some(w => q.includes(w))) {
      const pair = findTwoStocks(userText);
      if (pair.length === 2) return buildComparison(pair[0], pair[1], isAr);
      if (pair.length === 1) {
        return isAr
          ? `وجدت ${pair[0].nameAR} — لكنني أحتاج لاسم السهم الثاني للمقارنة. مثلاً: «قارن بين TMGH و PHDC»`
          : `Found ${pair[0].nameEN} — please also name the second stock to compare. E.g. "Compare TMGH and PHDC"`;
      }
    }

    // ── Sector question ─────────────────────────────────────────
    const sectorKey = findSector(userText);
    if (sectorKey && ['stock','companies','listed','sector','أسهم','شركات','قطاع','ما'].some(w => q.includes(w))) {
      return buildSectorList(sectorKey, isAr);
    }

    // ── Index question ───────────────────────────────────────────
    const indexKey = findIndex(userText);
    if (indexKey) return buildIndexReply(indexKey, isAr);

    // ── Specific stock ───────────────────────────────────────────
    const stock = findStock(userText);
    if (stock) return buildStockReply(stock, isAr);

    // ── List all stocks / sectors ────────────────────────────────
    if (['all stocks','full list','كل الأسهم','قائمة الأسهم','جميع الأسهم'].some(w => q.includes(w))) {
      return buildAllStocksList(isAr);
    }
    if (['sector','sectors','قطاع','قطاعات','التصنيف'].some(w => q.includes(w))) {
      return buildSectorsOverview(isAr);
    }

    // ── FAQ match ────────────────────────────────────────────────
    for (const faq of FAQ) {
      if (faq.keys.some(k => q.includes(k))) {
        if (faq.en === null) continue;
        return isAr ? faq.ar : faq.en;
      }
    }

    // ── What can you do ──────────────────────────────────────────
    if (['what can','help','what do','ماذا تعرف','ماذا تفعل','ما الذي'].some(w => q.includes(w))) {
      return isAr
        ? 'يمكنني مساعدتك في:\n• معلومات مفصلة عن أسهم مثل TMGH أو CIB أو ETEL\n• مقارنة بين سهمين مثل «قارن PHDC و SODIC»\n• قائمة أسهم أي قطاع مثل «أسهم البنوك»\n• شرح مؤشرات EGX30 و EGX70 و EGX100\n• معلومات عن ساعات التداول والحدود اليومية والتوزيعات\n• التداول الإلكتروني المباشر عبر المنصة الرسمية\n• الإجابة على أسئلة عامة عن البورصة المصرية'
        : 'I can help you with:\n• Detailed info on stocks like TMGH, CIB, or ETEL\n• Comparing two stocks, e.g. "Compare PHDC and SODIC"\n• Listing stocks in a sector, e.g. "Banking sector stocks"\n• Explaining EGX30, EGX70, and EGX100 indices\n• Trading hours, daily limits, dividends\n• Online Live Trading via the official platform\n• General questions about the Egyptian Exchange';
    }

    // ── Fallback ─────────────────────────────────────────────────
    return isAr
      ? 'لم أفهم السؤال تماماً. يمكنك السؤال عن سهم محدد مثل TMGH أو COMI، أو كتابة «قائمة الأسهم» أو «ساعات التداول» أو «التداول الإلكتروني المباشر» أو «قارن PHDC و SODIC».'
      : 'I didn\'t quite understand. Try asking about a specific stock like TMGH or COMI, or type "list stocks", "trading hours", "Online Live Trading", or "compare PHDC and SODIC".';
  }

  /* ── Response builders ─────────────────────────────────────── */

  function buildStockReply(s, isAr) {
    const sectorAR = SECTORS[s.sector] ? SECTORS[s.sector].ar : s.sector;
    const sectorEN = SECTORS[s.sector] ? SECTORS[s.sector].en : s.sector;
    if (isAr) {
      return `📊 ${s.nameAR} — ${s.nameEN} (${s.ticker})\n\nالقطاع: ${sectorAR} / ${sectorEN}\n\n${s.descAR}\n\n⚠️ تذكير: هذه معلومات تعريفية فقط وليست توصية استثمارية. لمتابعة سعر السهم الفعلي، يمكنك مراجعة صفحة السوق.`;
    }
    return `📊 ${s.nameEN} — ${s.nameAR} (${s.ticker})\n\nSector: ${sectorEN} / ${sectorAR}\n\n${s.descEN}\n\n⚠️ Reminder: This is educational information only and not investment advice. Visit the Market page for live price data.`;
  }

  function buildComparison(a, b, isAr) {
    const secA_ar = SECTORS[a.sector] ? SECTORS[a.sector].ar : a.sector;
    const secA_en = SECTORS[a.sector] ? SECTORS[a.sector].en : a.sector;
    const secB_ar = SECTORS[b.sector] ? SECTORS[b.sector].ar : b.sector;
    const secB_en = SECTORS[b.sector] ? SECTORS[b.sector].en : b.sector;
    if (isAr) {
      return `📊 مقارنة:\n🔵 ${a.nameAR} — ${a.nameEN} (${a.ticker})\n🟢 ${b.nameAR} — ${b.nameEN} (${b.ticker})\n\n` +
        `🔵 ${a.ticker} — القطاع: ${secA_ar} / ${secA_en}\n${a.descAR}\n\n` +
        `🟢 ${b.ticker} — القطاع: ${secB_ar} / ${secB_en}\n${b.descAR}\n\n` +
        `⚠️ هذه مقارنة تعريفية للشركتين فقط وليست توصية بالشراء أو البيع.`;
    }
    return `📊 Comparing:\n🔵 ${a.nameEN} — ${a.nameAR} (${a.ticker})\n🟢 ${b.nameEN} — ${b.nameAR} (${b.ticker})\n\n` +
      `🔵 ${a.ticker} — Sector: ${secA_en} / ${secA_ar}\n${a.descEN}\n\n` +
      `🟢 ${b.ticker} — Sector: ${secB_en} / ${secB_ar}\n${b.descEN}\n\n` +
      `⚠️ This is a factual company comparison only — not a buy or sell recommendation.`;
  }

  function buildSectorList(sectorKey, isAr) {
    const stocks = STOCKS.filter(s => s.sector === sectorKey);
    const labelAR = SECTORS[sectorKey] ? SECTORS[sectorKey].ar : sectorKey;
    const labelEN = SECTORS[sectorKey] ? SECTORS[sectorKey].en : sectorKey;
    if (!stocks.length) {
      return isAr ? `لم أجد أسهم مدرجة لقطاع ${labelAR} في قاعدة بياناتي حالياً.`
                  : `No stocks found for the ${labelEN} sector in my current database.`;
    }
    // Always show both AR and EN names per stock
    const list = stocks.map(s => `• ${s.ticker} — ${s.nameAR} / ${s.nameEN}`).join('\n');
    return isAr
      ? `📂 أسهم قطاع ${labelAR} / ${labelEN}:\n\n${list}\n\nاسأل عن أي سهم بالاسم أو الرمز للمزيد من التفاصيل.`
      : `📂 ${labelEN} / ${labelAR} sector stocks:\n\n${list}\n\nAsk about any stock by name or ticker for more details.`;
  }

  function buildIndexReply(key, isAr) {
    const info = INDICES[key];
    if (!info) return isAr ? 'لا توجد معلومات عن هذا المؤشر.' : 'No information available for this index.';
    return isAr ? `📈 ${key}\n\n${info.ar}` : `📈 ${key}\n\n${info.en}`;
  }

  function buildAllStocksList(isAr) {
    const grouped = {};
    STOCKS.forEach(s => {
      if (!grouped[s.sector]) grouped[s.sector] = [];
      grouped[s.sector].push(s);
    });
    let out = isAr ? '📋 جميع الأسهم المتاحة في قاعدة البيانات:\n\n' : '📋 All stocks in the database:\n\n';
    for (const [sec, stocks] of Object.entries(grouped)) {
      const label = SECTORS[sec] ? (isAr ? SECTORS[sec].ar : SECTORS[sec].en) : sec;
      out += `${label}:\n`;
      out += stocks.map(s => `  • ${s.ticker} — ${s.nameAR} / ${s.nameEN}`).join('\n');
      out += '\n\n';
    }
    out += isAr
      ? 'اسأل عن أي سهم للمزيد من التفاصيل.'
      : 'Ask about any stock for detailed information.';
    return out;
  }

  function buildSectorsOverview(isAr) {
    const lines = Object.entries(SECTORS).map(([key, val]) => {
      const count = STOCKS.filter(s => s.sector === key).length;
      const name  = isAr ? val.ar : val.en;
      return isAr ? `• ${name} — ${count} أسهم` : `• ${name} — ${count} stocks`;
    });
    return isAr
      ? `📂 القطاعات المتاحة في قاعدة البيانات:\n\n${lines.join('\n')}\n\nاسأل «أسهم البنوك» أو «قطاع العقارات» للحصول على قائمة الأسهم.`
      : `📂 Sectors in the database:\n\n${lines.join('\n')}\n\nAsk "banking stocks" or "real estate sector" to get a list.`;
  }

  /* ================================================================
     4. TRANSLATIONS (UI strings)
     ================================================================ */

  const T = {
    ar: {
      headerName:      'مساعد السوق الذكي',
      headerStatus:    'متصل — بدون API',
      placeholder:     'اسأل عن سهم… مثل: TMGH أو CIB أو «التداول الإلكتروني المباشر»',
      sendLabel:       'إرسال',
      closeLabel:      'إغلاق المحادثة',
      disclaimer:      'معلومات تعريفية فقط — ليست توصية استثمارية.',
      welcome:         'أهلاً! أنا مساعد السوق من Economic Group 🇪🇬\n\nيمكنك السؤال عن:\n• أي سهم بالرمز أو الاسم مثل «TMGH» أو «CIB» أو «السويدي إليكتريك»\n• مقارنة سهمين مثل «قارن PHDC و SODIC»\n• أسهم قطاع كامل مثل «أسهم البنوك»\n• مؤشرات EGX30 أو EGX70\n• ساعات التداول والأسئلة العامة\n• التداول الإلكتروني المباشر',
      chips:           ['ساعات التداول','أسهم البنوك','TMGH','COMI','EGX30','التداول الإلكتروني المباشر'],
      poweredBy:       'يعمل محلياً — بدون API بالكامل',
    },
    en: {
      headerName:      'AI Market Assistant',
      headerStatus:    'Online — No API',
      placeholder:     'Ask about a stock… e.g. TMGH, CIB or "Online Live Trading"',
      sendLabel:       'Send',
      closeLabel:      'Close chat',
      disclaimer:      'Educational info only — not investment advice.',
      welcome:         'Hello! I\'m the EGX Market Assistant from Economic Group 🇪🇬\n\nYou can ask about:\n• Any stock by ticker or name, e.g. "TMGH", "CIB", or "Elsewedy Electric"\n• Comparing two stocks, e.g. "Compare PHDC and SODIC"\n• A full sector list, e.g. "Banking sector stocks"\n• Indices: EGX30, EGX70, EGX100\n• Trading hours, daily limits, dividends\n• Online Live Trading',
      chips:           ['Trading hours','Banking stocks','TMGH','COMI','EGX30','Online Live Trading'],
      poweredBy:       'Runs locally — 100% free, no API',
    },
  };

  /* ================================================================
     5. STATE
     ================================================================ */

  let isOpen   = false;
  let uiLang   = 'ar';

  /* ================================================================
     6. DOM BUILDERS
     ================================================================ */

  function buildWidget() {
    const root = document.createElement('div');
    root.id = 'eg-ai-root';
    root.innerHTML = /* html */`
      <button id="eg-ai-fab" type="button" aria-label="AI Market Assistant" aria-expanded="false" aria-controls="eg-ai-panel">
        <svg class="fab-icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
        </svg>
        <svg class="fab-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div id="eg-ai-panel" role="dialog" aria-modal="true" aria-label="AI Market Assistant" aria-hidden="true">

        <div class="eg-ai-header">
          <div class="eg-ai-header-avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
            </svg>
          </div>
          <div class="eg-ai-header-info">
            <div class="eg-ai-header-name" id="eg-ai-title"></div>
            <div class="eg-ai-header-status">
              <span class="eg-ai-status-dot" aria-hidden="true"></span>
              <span id="eg-ai-status"></span>
            </div>
          </div>
          <button class="eg-ai-header-close" id="eg-ai-close" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="eg-ai-suggestions" id="eg-ai-chips" aria-label="Quick questions"></div>

        <div class="eg-ai-messages" id="eg-ai-messages" role="log" aria-live="polite"></div>

        <div class="eg-ai-disclaimer" id="eg-ai-disclaimer"></div>

        <div class="eg-ai-input-row">
          <textarea id="eg-ai-input" rows="1" autocomplete="off" spellcheck="false"></textarea>
          <button id="eg-ai-send" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

      </div>`;
    document.body.appendChild(root);
  }

  /* ================================================================
     7. UI HELPERS
     ================================================================ */

  function t(key) { return (T[uiLang] || T.en)[key] || key; }

  function applyLang() {
    const $ = id => document.getElementById(id);
    const title   = $('eg-ai-title');
    const status  = $('eg-ai-status');
    const input   = $('eg-ai-input');
    const disc    = $('eg-ai-disclaimer');
    const fab     = $('eg-ai-fab');
    const close   = $('eg-ai-close');
    const send    = $('eg-ai-send');
    const chips   = $('eg-ai-chips');

    if (title)  title.textContent  = t('headerName');
    if (status) status.textContent = t('headerStatus');
    if (input)  input.placeholder  = t('placeholder');
    if (disc)   disc.textContent   = t('disclaimer');
    if (fab)    fab.setAttribute('aria-label', t('headerName'));
    if (close)  close.setAttribute('aria-label', t('closeLabel'));
    if (send)   send.setAttribute('aria-label', t('sendLabel'));

    if (chips) {
      chips.innerHTML = t('chips')
        .map(c => `<button class="eg-ai-chip" type="button">${c}</button>`)
        .join('');
      chips.querySelectorAll('.eg-ai-chip').forEach(btn => {
        btn.addEventListener('click', () => handleSend(btn.textContent));
      });
    }
  }

  function scrollBottom() {
    const el = document.getElementById('eg-ai-messages');
    if (el) el.scrollTop = el.scrollHeight;
  }

  function textToHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    // Convert URLs to clickable links
    let html = div.innerHTML.replace(/\n/g, '<br>');
    html = html.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:var(--color-primary,#0A2647);text-decoration:underline;word-break:break-all;">$1</a>');
    return html;
  }

  function appendMsg(role, text) {
    const wrap = document.getElementById('eg-ai-messages');
    if (!wrap) return;
    const div = document.createElement('div');
    div.className = `eg-ai-msg eg-ai-msg--${role === 'user' ? 'user' : 'bot'}`;
    if (role !== 'user') {
      div.innerHTML = `
        <div class="eg-ai-msg-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
          </svg>
        </div>
        <div class="eg-ai-msg-bubble">${textToHtml(text)}</div>`;
    } else {
      div.innerHTML = `<div class="eg-ai-msg-bubble">${textToHtml(text)}</div>`;
    }
    wrap.appendChild(div);
    scrollBottom();
  }

  /* ================================================================
     8. PANEL OPEN / CLOSE
     ================================================================ */

  function openPanel() {
    isOpen = true;
    document.getElementById('eg-ai-fab')?.classList.add('is-open');
    document.getElementById('eg-ai-fab')?.setAttribute('aria-expanded', 'true');
    const panel = document.getElementById('eg-ai-panel');
    if (panel) { panel.classList.add('is-open'); panel.setAttribute('aria-hidden', 'false'); }
    document.getElementById('eg-ai-input')?.focus();
    scrollBottom();
  }

  function closePanel() {
    isOpen = false;
    document.getElementById('eg-ai-fab')?.classList.remove('is-open');
    document.getElementById('eg-ai-fab')?.setAttribute('aria-expanded', 'false');
    const panel = document.getElementById('eg-ai-panel');
    if (panel) { panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true'); }
    document.getElementById('eg-ai-fab')?.focus();
  }

  /* ================================================================
     9. SEND HANDLER
     ================================================================ */

  function handleSend(text) {
    const raw = (text || '').trim();
    if (!raw) return;

    const input = document.getElementById('eg-ai-input');
    if (input) { input.value = ''; input.style.height = ''; }

    appendMsg('user', raw);

    setTimeout(() => {
      const reply = buildResponse(raw, uiLang);
      appendMsg('assistant', reply);
    }, 80);
  }

  /* ================================================================
     10. EVENT WIRING
     ================================================================ */

  function wireEvents() {
    const fab   = document.getElementById('eg-ai-fab');
    const close = document.getElementById('eg-ai-close');
    const send  = document.getElementById('eg-ai-send');
    const input = document.getElementById('eg-ai-input');

    fab?.addEventListener('click',  () => (isOpen ? closePanel() : openPanel()));
    close?.addEventListener('click', closePanel);
    send?.addEventListener('click',  () => handleSend(input?.value));

    input?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(input.value); }
    });

    input?.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) closePanel();
    });

    document.addEventListener('stock:langchange', e => {
      uiLang = e.detail.lang || 'ar';
      applyLang();
    });
  }

  /* ================================================================
     11. INIT
     ================================================================ */

  function init() {
    uiLang =
      (window.I18n && typeof window.I18n.getLanguage === 'function' ? window.I18n.getLanguage() : null) ||
      localStorage.getItem((window.STOCK_CONFIG && window.STOCK_CONFIG.LANG_STORAGE_KEY) || 'stock_lang') ||
      'ar';

    buildWidget();
    applyLang();
    wireEvents();
    appendMsg('assistant', t('welcome'));
  }

  window.EGAIAssistant = { init };

})();
