/**
 * i18n contract.
 *
 * Every hard-coded string on the page lives in a message catalogue typed
 * against `Messages`, so a missing or misspelled key is a compile error rather
 * than a blank spot on the page at runtime.
 */
export const LOCALES = ['en', 'id', 'ko'] as const;

export type Locale = (typeof LOCALES)[number];

/** English is the base language: new visitors land here (see LocaleProvider). */
export const DEFAULT_LOCALE: Locale = 'en';

/** the switcher label for each locale, always written in that locale */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  id: 'ID',
  ko: 'KO'
};

/** the BCP-47 tag used for <html lang> and for Intl formatting */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: 'en-PH',
  id: 'id-ID',
  ko: 'ko-KR'
};

/**
 * Product ids, so a catalogue cannot forget to translate one.
 *
 * b* / n* are the nine BEST and three NEW cards on the home page; e*, l*, f*
 * and a* are the rest of the catalogue, reached through the category pages.
 */
export type ProductId =
  | 'b1'
  | 'b2'
  | 'b3'
  | 'b4'
  | 'b5'
  | 'b6'
  | 'b7'
  | 'b8'
  | 'b9'
  | 'n1'
  | 'n2'
  | 'n3'
  | 'e1'
  | 'e2'
  | 'e3'
  | 'e4'
  | 'e5'
  | 'l1'
  | 'l2'
  | 'l3'
  | 'l4'
  | 'l5'
  | 'l6'
  | 'l7'
  | 'l8'
  | 'f1'
  | 'f2'
  | 'f3'
  | 'f4'
  | 'f5'
  | 'f6'
  | 'f7'
  | 'f8'
  | 'f9'
  | 'f10'
  | 'a1'
  | 'a2'
  | 'a3'
  | 'a4';

export interface ProductCopy {
  /** single line, ellipsised by the card — keep it short */
  name: string;
  /** exactly two lines: the tag line and the benefit line */
  desc: [string, string];
}

export interface SlideCopy {
  /** each entry is one rendered line of the headline */
  headline: string[];
  /** the two support lines under it */
  lines: [string, string];
  alt: string;
}

export interface BannerCopy {
  eyebrow: string;
  /** the two-line headline */
  headline: [string, string];
  alt: string;
}

export interface Messages {
  meta: {
    title: string;
    description: string;
  };
  promo: {
    text: string;
    close: string;
  };
  nav: {
    login: string;
    join: string;
    delivery: string;
    contact: string;
    searchPlaceholder: string;
  };
  categories: {
    all: string;
    eye: string;
    lip: string;
    face: string;
    accTool: string;
    alarm: string;
    event: string;
    cs: string;
  };
  hero: {
    slides: SlideCopy[];
  };
  sections: {
    best: { title: string; subtitle: string };
    fresh: { title: string; subtitle: string };
  };
  product: {
    addToCart: string;
    copy: Record<ProductId, ProductCopy>;
  };
  midBanner: {
    panels: BannerCopy[];
  };
  footer: {
    company: {
      nameLabel: string;
      name: string;
      ceoLabel: string;
      ceo: string;
      registrationLabel: string;
      registration: string;
      businessCheck: string;
      mailOrderLabel: string;
      mailOrder: string;
      privacyOfficerLabel: string;
      privacyOfficer: string;
      address: string;
    };
    copyright: [string, string];
    policies: {
      brandStory: string;
      shoppingGuide: string;
      privacyPolicy: string;
      businessCheck: string;
    };
    cs: {
      title: string;
      heading: string;
      phoneLabel: string;
      hours: [string, string, string];
    };
    bank: {
      title: string;
      holder: string;
      businessTitle: string;
      partnership: string;
      bulkOrder: string;
      banks: { kb: string; shinhan: string };
    };
    notice: [string, string];
  };
  sideMenu: {
    loginPrompt: string;
    login: string;
    join: string;
    myPage: string;
    cart: string;
    order: string;
    delivery: string;
    coupon: string;
    qna: string;
    myInfo: string;
  };
  search: {
    title: string;
    placeholder: string;
    hotKeywords: string[];
    /** the heading above the ticker, shown while the box is empty */
    popular: string;
    /** '{n} results' — the live count under the box */
    results: string;
    /** nothing matched what has been typed so far */
    empty: string;
    /** the row that opens the full listing instead of one product */
    seeAll: string;
  };
  /** the four utility pages behind LOGIN / JOIN / DELIVERY / CONTACT */
  account: {
    /** every form here is front-end only until a backend is wired up */
    inert: string;
    login: {
      tabMember: string;
      tabGuest: string;
      secure: string;
      id: string;
      password: string;
      remember: string;
      findId: string;
      findPassword: string;
      submit: string;
      snsTitle: string;
      joinHeading: string;
      joinLines: [string, string];
      joinButton: string;
    };
    join: {
      title: string;
      lead: string;
      name: string;
      id: string;
      password: string;
      passwordConfirm: string;
      email: string;
      phone: string;
      agreeTerms: string;
      agreePrivacy: string;
      submit: string;
    };
    delivery: {
      title: string;
      lead: string;
      orderNo: string;
      name: string;
      submit: string;
      memberNote: string;
    };
    contact: {
      title: string;
      lead: string;
      subject: string;
      email: string;
      message: string;
      submit: string;
      csTitle: string;
    };
  };
  /** CONTACT and DELIVERY, once both talk to the database */
  support: {
    sending: string;
    sent: string;
    failed: string;
    required: string;
    contact: {
      name: string;
      email: string;
      phone: string;
      subject: string;
      message: string;
      submit: string;
      infoTitle: string;
      phoneLabel: string;
      kakaoLabel: string;
      messengerLabel: string;
      emailLabel: string;
      addressLabel: string;
    };
    delivery: {
      trackTitle: string;
      trackLead: string;
      orderId: string;
      email: string;
      track: string;
      notFound: string;
      searching: string;
      placed: string;
      paid: string;
      stage: string;
      tracking: string;
      enquiryTitle: string;
      enquiryLead: string;
      message: string;
      submit: string;
      shippingTitle: string;
      /** the two lines that state the shipping rule and where it ships from */
      shippingLines: [string, string];
    };
  };
  /** everything behind a real account: sign in, sign up, MY PAGE */
  auth: {
    /** shown while the browser is still working out who is signed in */
    checking: string;
    signOut: string;
    myPage: string;
    signedInAs: string;
    /** sign-in and sign-up failures, in words a shopper can act on */
    errors: {
      badCredentials: string;
      emailTaken: string;
      weakPassword: string;
      mismatch: string;
      agreeRequired: string;
      unavailable: string;
      generic: string;
    };
    /** the account created, but the address has to be confirmed first */
    confirmEmail: string;
    account: {
      title: string;
      lead: string;
      profileTitle: string;
      name: string;
      phone: string;
      address: string;
      city: string;
      postal: string;
      save: string;
      saved: string;
    };
    orders: {
      title: string;
      empty: string;
      emptyCta: string;
      placed: string;
      total: string;
      items: string;
      tracking: string;
      view: string;
      status: {
        pending: string;
        paid: string;
        failed: string;
        cancelled: string;
        review: string;
      };
      fulfilment: {
        unfulfilled: string;
        packing: string;
        shipped: string;
        delivered: string;
        returned: string;
      };
    };
  };
  /** forgotten password, and the bell in the header */
  recover: {
    findIdTitle: string;
    findIdLead: string;
    title: string;
    lead: string;
    email: string;
    submit: string;
    sending: string;
    sent: string;
    newPassword: string;
    confirmPassword: string;
    save: string;
    saved: string;
    expired: string;
    backToLogin: string;
  };
  notifications: {
    title: string;
    empty: string;
    markAll: string;
    viewOrder: string;
    /** '{order}' is the short order number, '{tracking}' the consignment note */
    kinds: {
      order_paid: string;
      order_packing: string;
      order_shipped: string;
      order_delivered: string;
      order_returned: string;
      order_failed: string;
      review_published: string;
    };
  };
  /** a route that exists in the navigation but has no page yet */
  missing: {
    title: string;
    lead: string;
    back: string;
  };
  /** category listing page */
  list: {
    home: string;
    here: string;
    /** '{n}' is replaced with the product count */
    count: string;
    empty: string;
    prevPage: string;
    nextPage: string;
    /** the five sort links on the right of the TOTAL bar */
    sort: {
      newest: string;
      lowPrice: string;
      popular: string;
      reviews: string;
      views: string;
    };
    /** tooltip on a sort that has no data behind it yet */
    sortUnavailable: string;
  };
  /** cart, checkout and the payment result page */
  cart: {
    title: string;
    empty: string;
    continueShopping: string;
    product: string;
    quantity: string;
    price: string;
    remove: string;
    shade: string;
    subtotal: string;
    shipping: string;
    free: string;
    total: string;
    toCheckout: string;
    added: string;
    chooseShade: string;
    checkoutTitle: string;
    customerHeading: string;
    summaryHeading: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal: string;
    required: string;
    invalidEmail: string;
    pay: string;
    paying: string;
    chargedInPhp: string;
    methods: string;
    unavailable: string;
    /** '{reason}' is replaced with the server's message */
    failed: string;
    resultTitle: string;
    resultPaid: string;
    resultPending: string;
    resultPendingLong: string;
    resultFailed: string;
    resultCancelled: string;
    resultReview: string;
    resultNotFound: string;
    orderNumber: string;
    paidWith: string;
    backToCart: string;
  };
  /** product detail page */
  /** stars and written reviews under a product */
  reviews: {
    title: string;
    /** '{n} reviews' beside the average */
    count: string;
    none: string;
    pending: string;
    writeTitle: string;
    titleLabel: string;
    bodyLabel: string;
    submit: string;
    sending: string;
    thanks: string;
    tooShort: string;
    failed: string;
    signInToWrite: string;
  };
  detail: {
    consumerPrice: string;
    /** the product, or the chosen shade, cannot be bought right now */
    soldOut: string;
    /** '{n}' is how many are left */
    lowStock: string;
    salePrice: string;
    points: string;
    shipping: string;
    shippingFree: string;
    selectLabel: string;
    optionRequired: string;
    optionPlaceholder: string;
    total: string;
    pieces: string;
    buyNow: string;
    addToCart: string;
    share: string;
    back: string;
    detailHeading: string;
    detailNote: string;
  };
  recent: {
    title: string;
    /** the two views the panel offers once it is open */
    tabRecent: string;
    tabMost: string;
    empty: string;
    emptyMost: string;
    loading: string;
    /** '{n} views' under a most-visited thumbnail */
    views: string;
    /** the same line when the count is exactly one */
    viewsOne: string;
  };
  top: {
    label: string;
  };
  /** strings that are never seen but are read aloud or indexed */
  a11y: {
    logo: string;
    cart: string;
    openMenu: string;
    closeMenu: string;
    openSearch: string;
    closeSearch: string;
    openRecent: string;
    closeRecent: string;
    prevSlide: string;
    nextSlide: string;
    goToSlide: string;
    languageSwitcher: string;
    switchTo: Record<Locale, string>;
  };
}
