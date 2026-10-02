import type { Messages } from '../types';
import { productsKo } from './products.ko';

/**
 * Korean.
 *
 * Product names, prices, discount rates and shade counts are the real
 * catalogue. The two description lines are written for this build — swap them
 * for the official product copy when you have it; it is one field per locale.
 *
 * Korean sets shorter than English at the same point size, so the fixed boxes
 * have room — but the display face (Fjalla One) carries no Hangul, which is why
 * `html[lang="ko"]` promotes Noto Sans KR to the front of the stacks.
 */
export const ko: Messages = {
  meta: {
    title: 'MQNY 엠큐엔와이',
    description: '베스트 아이템, 신상품, 회원 전용 쿠폰까지 — 당일 출고되는 코스메틱 스토어.'
  },
  promo: {
    text: '신규회원 가입하시면 3,000원 쿠폰을 드립니다.',
    close: '닫기'
  },
  nav: {
    login: 'LOGIN',
    join: 'JOIN',
    delivery: 'DELIVERY',
    contact: 'CONTACT',
    searchPlaceholder: '검색어를 입력해 주세요.'
  },
  categories: {
    all: 'ALL',
    eye: 'EYE',
    lip: 'LIP',
    face: 'FACE',
    accTool: 'ACC&TOOL',
    alarm: '행사알림이',
    event: 'EVENT',
    cs: 'CS'
  },
  hero: {
    slides: [
      {
        headline: ['가입하고', '5% 할인받기'],
        lines: ['MQNY 회원이 되시면 5% 할인쿠폰을 드립니다.', '{amount} 이상 구매 시 사용 가능합니다.'],
        alt: '회원 가입 쿠폰'
      },
      {
        headline: ['베스트', '아이템'],
        lines: ['가장 많이 사랑받은 아홉 가지 제품.', '재입고 완료, 오늘 바로 발송됩니다.'],
        alt: '베스트 아이템'
      },
      {
        headline: ['신상품', '먼저 만나기'],
        lines: ['이번 주 새로 입고된 세 가지 신상품.', '틴트부터 립플럼퍼까지 한 번에.'],
        alt: '신상품'
      }
    ]
  },
  sections: {
    best: {
      title: 'BEST ITEM',
      subtitle: '가장 사랑받는 베스트 아이템'
    },
    fresh: {
      title: 'NEW ITEM',
      subtitle: 'MQNY의 새로운 신상품'
    }
  },
  product: {
    addToCart: '장바구니 담기',
    copy: productsKo
  },
  midBanner: {
    panels: [
      {
        eyebrow: 'Membership',
        headline: ['첫 구매 회원에게만', '드리는 할인 쿠폰'],
        alt: '멤버십 쿠폰'
      },
      {
        eyebrow: 'Bundle Deal',
        headline: ['두 개 담으면', '배송비 없이 바로'],
        alt: '번들 기획전'
      }
    ]
  },
  footer: {
    company: {
      nameLabel: '상호',
      name: 'PLACEHOLDER COSMETICS CO., LTD.',
      ceoLabel: '대표',
      ceo: '홍길동',
      registrationLabel: '사업자등록번호',
      registration: '000-00-00000',
      businessCheck: '사업자정보확인',
      mailOrderLabel: '통신판매업신고',
      mailOrder: '0000-서울-0000',
      privacyOfficerLabel: '개인정보관리책임자',
      privacyOfficer: 'privacy@example.com [홍길동]',
      address: '주소 : 서울특별시 강남구 예시로00길 00 (00000)'
    },
    copyright: [
      'Copyright © PLACEHOLDER COSMETICS CO., LTD. All rights reserved.',
      '회사 정보와 계좌번호는 실제 사업자 정보로 교체해 주세요.'
    ],
    policies: {
      brandStory: '브랜드스토리',
      shoppingGuide: '이용안내',
      privacyPolicy: '개인정보처리방침',
      businessCheck: '사업자정보확인'
    },
    cs: {
      title: 'CS CENTER',
      heading: '고객센터 운영안내',
      phoneLabel: '카카오톡 상담',
      hours: ['운영시간  10:00 – 17:00', '점심시간  12:00 – 13:00', '휴무안내  토, 일, 공휴일']
    },
    bank: {
      title: 'BANK INFO',
      holder: '예금주 : PLACEHOLDER COSMETICS',
      businessTitle: 'BUSINESS',
      partnership: '입점 · 제휴 문의',
      bulkOrder: '대량 구매 문의',
      banks: { kb: '국민', shinhan: '신한' }
    },
    notice: [
      '반품주소 : 서울특별시 강남구 예시로00길 00 (00000) 반품물류센터',
      '소비자상담 및 불만처리 : 0000-0000 / help@example.com'
    ]
  },
  sideMenu: {
    loginPrompt: '로그인이 필요합니다.',
    login: '로그인',
    join: '회원가입',
    myPage: 'MY PAGE',
    cart: 'CART',
    order: 'ORDER',
    delivery: 'DELIVERY',
    coupon: 'COUPON',
    qna: 'Q&A',
    myInfo: 'MY INFO'
  },
  search: {
    title: '검색',
    placeholder: '검색어를 입력해 주세요.',
    hotKeywords: ['립스틱', '립틴트', '아이브로우', '아이라이너', '섀도우팔레트', '립플럼퍼', '멀티밤', '미백크림'],
    popular: '인기 검색어',
    results: '검색 결과 {n}개',
    empty: '검색 결과가 없습니다.',
    seeAll: '전체 상품 보기'
  },
  account: {
    inert: '프런트엔드 전용입니다. 아직 백엔드에 연결되어 있지 않습니다.',
    login: {
      tabMember: '회원 로그인',
      tabGuest: '비회원 주문조회',
      secure: '보안접속',
      id: '아이디',
      password: '비밀번호',
      remember: '아이디 저장',
      findId: '아이디찾기',
      findPassword: '비밀번호찾기',
      submit: '로그인',
      snsTitle: 'SNS LOGIN',
      joinHeading: '회원가입 하고 회원만의 특별한 혜택을 누려보세요',
      joinLines: ['아직 회원이 아니신가요?', '회원가입 후 특별한 멤버쉽 혜택을 누려보세요.'],
      joinButton: '회원가입'
    },
    join: {
      title: '회원가입',
      lead: '아래 정보를 입력하시면 회원가입이 완료됩니다.',
      name: '이름',
      id: '아이디',
      password: '비밀번호',
      passwordConfirm: '비밀번호 확인',
      email: '이메일',
      phone: '휴대전화',
      agreeTerms: '이용약관에 동의합니다',
      agreePrivacy: '개인정보처리방침에 동의합니다',
      submit: '가입하기'
    },
    delivery: {
      title: '배송조회',
      lead: '주문번호로 배송 상태를 조회하실 수 있습니다.',
      orderNo: '주문번호',
      name: '주문자명',
      submit: '조회하기',
      memberNote: '회원은 마이페이지에서 전체 주문을 확인하실 수 있습니다.'
    },
    contact: {
      title: '문의하기',
      lead: '문의를 남겨주시면 운영시간 내에 답변드립니다.',
      subject: '제목',
      email: '이메일',
      message: '문의 내용',
      submit: '보내기',
      csTitle: 'CS CENTER'
    }
  },
  support: {
    sending: '보내는 중…',
    sent: '문의가 접수되었습니다. 운영시간 내에 답변드리겠습니다.',
    failed: '문의를 보내지 못했습니다. 다시 시도하시거나 아래 번호로 연락해 주세요.',
    required: '이름, 이메일, 문의 내용을 입력해 주세요.',
    contact: {
      name: '이름',
      email: '이메일',
      phone: '휴대전화 (선택)',
      subject: '제목',
      message: '문의 내용',
      submit: '보내기',
      infoTitle: '바로 연락하기',
      phoneLabel: '전화',
      kakaoLabel: '카카오톡',
      messengerLabel: '페이스북 메신저',
      emailLabel: '이메일',
      addressLabel: '주소'
    },
    delivery: {
      trackTitle: '배송 조회',
      trackLead: '주문번호와 주문에 사용한 이메일을 입력해 주세요.',
      orderId: '주문번호',
      email: '주문 이메일',
      track: '조회하기',
      notFound: '해당 주문번호와 이메일로 조회되는 주문이 없습니다.',
      searching: '조회 중…',
      placed: '주문일',
      paid: '결제일',
      stage: '배송 상태',
      tracking: '운송장',
      enquiryTitle: '배송 문의',
      enquiryLead: '주문번호와 문의 내용을 남겨주시면 확인 후 답변드립니다.',
      message: '문의 내용',
      submit: '문의 보내기',
      shippingTitle: '배송 안내',
      shippingLines: [
        '배송비는 {fee}이며 {threshold} 이상 구매 시 무료입니다.',
        '출고지 : #9061 National Highway, Bagong Kalsada, Calamba City, 4027 Laguna'
      ]
    }
  },
  auth: {
    checking: '계정을 확인하고 있습니다…',
    signOut: '로그아웃',
    myPage: '마이페이지',
    signedInAs: '{email} 계정으로 로그인했습니다',
    errors: {
      badCredentials: '이메일 또는 비밀번호가 일치하지 않습니다.',
      emailTaken: '이미 가입된 이메일입니다. 로그인해 주세요.',
      weakPassword: '비밀번호는 8자 이상으로 입력해 주세요.',
      mismatch: '두 비밀번호가 일치하지 않습니다.',
      agreeRequired: '이용약관과 개인정보 처리방침에 동의해 주세요.',
      unavailable: '지금은 회원 기능을 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.',
      generic: '문제가 발생했습니다. 다시 시도해 주세요.'
    },
    confirmEmail: '가입이 완료되었습니다. 메일함에서 이메일을 인증한 뒤 로그인해 주세요.',
    account: {
      title: '마이페이지',
      lead: '회원 정보와 주문 내역입니다.',
      profileTitle: '회원 정보',
      name: '이름',
      phone: '휴대폰 번호',
      address: '주소',
      city: '시 / 군 / 구',
      postal: '우편번호',
      save: '저장',
      saved: '저장되었습니다'
    },
    orders: {
      title: '주문 내역',
      empty: '아직 주문이 없습니다.',
      emptyCta: '쇼핑하러 가기',
      placed: '주문일',
      total: '결제 금액',
      items: '상품',
      tracking: '운송장',
      view: '주문 보기',
      status: {
        pending: '결제 대기',
        paid: '결제 완료',
        failed: '결제 실패',
        cancelled: '취소됨',
        review: '확인 중'
      },
      fulfilment: {
        unfulfilled: '상품 준비 중',
        packing: '포장 중',
        shipped: '배송 중',
        delivered: '배송 완료',
        returned: '반품됨'
      }
    }
  },
  recover: {
    findIdTitle: '아이디 찾기',
    findIdLead: '아이디는 가입하신 이메일 주소입니다. 비밀번호를 잊으셨다면 아래에서 재설정해 주세요.',
    title: '비밀번호 재설정',
    lead: '이메일을 입력하시면 새 비밀번호를 설정할 수 있는 링크를 보내드립니다.',
    email: '이메일',
    submit: '재설정 링크 보내기',
    sending: '보내는 중…',
    sent: '해당 이메일로 가입된 계정이 있다면 재설정 링크를 보냈습니다. 메일함과 스팸함을 확인해 주세요.',
    newPassword: '새 비밀번호',
    confirmPassword: '새 비밀번호 확인',
    save: '비밀번호 저장',
    saved: '비밀번호가 변경되었습니다. 로그인되었습니다.',
    expired: '재설정 링크가 만료되었거나 이미 사용되었습니다. 다시 요청해 주세요.',
    backToLogin: '로그인으로 돌아가기'
  },
  notifications: {
    title: '알림',
    empty: '알림이 없습니다.',
    markAll: '모두 읽음 처리',
    viewOrder: '주문 보기',
    kinds: {
      order_paid: '{order} 주문의 결제가 완료되었습니다.',
      order_packing: '{order} 주문을 포장하고 있습니다.',
      order_shipped: '{order} 주문이 발송되었습니다. {tracking}',
      order_delivered: '{order} 주문이 배송 완료되었습니다.',
      order_returned: '{order} 주문이 반품되었습니다.',
      order_failed: '{order} 주문의 결제가 실패했습니다.',
      review_published: '작성하신 후기가 게시되었습니다.'
    }
  },
  guide: {
    title: '이용안내',
    lead: '주문부터 수령까지, 순서대로 안내해 드립니다.',
    steps: [
      {
        heading: '1 · 상품 선택',
        body: '상품 페이지에서 컬러를 선택한 뒤 장바구니에 담거나 바로 구매하세요. 품절된 컬러는 선택하실 수 없습니다.'
      },
      {
        heading: '2 · 장바구니 확인',
        body: '장바구니에서 수량을 변경하거나 상품을 삭제하실 수 있습니다. 표시된 금액이 실제 결제 금액이며, 추가되는 비용은 없습니다.'
      },
      {
        heading: '3 · 배송 정보 입력',
        body: '받으실 분의 이름, 이메일, 휴대전화, 주소를 입력해 주세요. 회원은 저장된 정보가 자동으로 입력됩니다.'
      },
      {
        heading: '4 · 결제',
        body: '결제사의 보안 페이지로 이동해 결제하신 뒤, 주문 확인 페이지로 돌아오시게 됩니다.'
      }
    ],
    payTitle: '결제 수단',
    payBody:
      '카드, GCash, Maya, GrabPay, QR Ph를 이용하실 수 있습니다. 카드 정보는 결제사 페이지에서만 입력되며 본 사이트에는 저장되지 않습니다. 결제는 필리핀 페소로 이루어지며, 다른 통화로 보이는 금액은 참고용 환산 금액입니다.',
    shipTitle: '배송 안내',
    shipBody:
      '배송비는 {fee}이며 {threshold} 이상 구매 시 무료입니다. 출고지는 #9061 National Highway, Bagong Kalsada, Calamba City, 4027 Laguna 입니다.',
    trackTitle: '주문 조회',
    trackBody:
      '주문번호와 주문에 사용하신 이메일로 조회하실 수 있습니다. 회원은 마이페이지에서 전체 주문을 확인하실 수 있으며, 포장·발송·배송 완료 시 알림으로 안내해 드립니다.',
    memberTitle: '회원 혜택',
    memberBody:
      '회원이 되시면 주문 내역과 배송지, 알림을 한곳에서 관리하실 수 있고 상품 후기도 작성하실 수 있습니다.',
    returnTitle: '문제가 있을 때',
    returnBody:
      '상품에 이상이 있으면 주문번호와 사진을 준비하셔서 고객센터로 연락해 주세요. 확인 후 안내해 드리겠습니다.',
    ctaTrack: '배송 조회',
    ctaContact: '문의하기'
  },
  cs: {
    title: 'CS CENTER',
    lead: '상담원과 바로 연결됩니다. 리조트에서 운영하는 번호와 동일합니다.',
    hoursTitle: '운영 시간',
    channelsTitle: '문의 채널',
    phoneLabel: '전화',
    kakaoLabel: '카카오톡',
    messengerLabel: '페이스북 메신저',
    emailLabel: '이메일',
    addressLabel: '주소',
    ctaContact: '문의 남기기',
    ctaTrack: '배송 조회',
    ctaGuide: '이용안내',
    note: '운영 시간 외에 남기신 문의는 다음 영업일에 답변드립니다.'
  },
  missing: {
    title: '준비 중인 페이지입니다',
    lead: '메뉴에는 있지만 아직 만들어지지 않은 페이지입니다.',
    back: '쇼핑 계속하기'
  },
  list: {
    home: '홈',
    here: '현재 위치',
    count: '{n}개의 상품',
    empty: '이 카테고리에는 아직 상품이 없습니다.',
    prevPage: '이전 페이지',
    nextPage: '다음 페이지',
    sort: {
      newest: '신상품',
      lowPrice: '낮은가격',
      popular: '인기상품',
      reviews: '사용후기',
      views: '조회수'
    },
    sortUnavailable: '후기·조회 데이터가 연결되면 정렬할 수 있습니다.'
  },
  cart: {
    title: '장바구니',
    empty: '장바구니가 비어 있습니다.',
    continueShopping: '쇼핑 계속하기',
    product: '상품',
    quantity: '수량',
    price: '가격',
    remove: '삭제',
    shade: '컬러',
    subtotal: '상품금액',
    shipping: '배송비',
    free: '무료',
    total: '결제금액',
    toCheckout: '주문하기',
    added: '담았습니다 ✓',
    chooseShade: '컬러를 먼저 선택해 주세요',
    checkoutTitle: '주문/결제',
    customerHeading: '배송 정보',
    summaryHeading: '주문 상품',
    name: '이름',
    email: '이메일',
    phone: '휴대전화',
    address: '주소',
    city: '시 / 군 / 구',
    postal: '우편번호',
    required: '모든 항목을 입력해 주세요.',
    invalidEmail: '올바른 이메일 주소를 입력해 주세요.',
    pay: '카드 · GCASH · MAYA 결제',
    paying: '안전한 결제 페이지를 여는 중…',
    chargedInPhp: 'PayMongo는 필리핀 페소로 결제됩니다. 아래 금액이 실제 결제 금액입니다.',
    methods: '다음 PayMongo 결제 페이지에서 카드, GCash, Maya, GrabPay, QR Ph를 이용할 수 있습니다.',
    unavailable: '아직 결제가 연결되지 않았습니다. 결제 서비스가 배포되지 않았습니다.',
    failed: '결제를 시작할 수 없습니다: {reason}',
    resultTitle: '주문',
    resultPaid: '결제가 완료되었습니다. 감사합니다!',
    resultPending: '결제를 확인하는 중…',
    resultPendingLong: '아직 확인 중입니다. 이 페이지는 자동으로 새로고침됩니다.',
    resultFailed: '결제가 완료되지 않았습니다.',
    resultCancelled: '결제가 만료되었거나 취소되었습니다.',
    resultReview: '결제는 완료되었으나 주문 금액과 다릅니다. 곧 연락드리겠습니다.',
    resultNotFound: '주문을 찾을 수 없습니다.',
    orderNumber: '주문번호',
    paidWith: '결제수단',
    backToCart: '장바구니로'
  },
  reviews: {
    title: '사용후기',
    count: '후기 {n}개',
    none: '아직 후기가 없습니다.',
    pending: '작성하신 후기는 확인 후 게시됩니다.',
    writeTitle: '후기 작성',
    titleLabel: '제목 (선택)',
    bodyLabel: '사용해 보신 느낌을 남겨주세요.',
    submit: '후기 등록',
    sending: '등록 중…',
    thanks: '감사합니다. 확인 후 게시됩니다.',
    tooShort: '조금 더 자세히 작성해 주세요.',
    failed: '후기를 저장하지 못했습니다. 다시 시도해 주세요.',
    signInToWrite: '로그인 후 후기를 작성하실 수 있습니다'
  },
  detail: {
    consumerPrice: '소비자가',
    soldOut: '품절',
    lowStock: '{n}개 남았습니다',
    salePrice: '판매가',
    points: '적립금',
    shipping: '배송비',
    shippingFree: '{amount} 이상 구매 시 무료',
    selectLabel: '컬러',
    optionRequired: '[필수] 옵션을 선택해 주세요',
    optionPlaceholder: '컬러를 선택하세요',
    total: '총 상품금액',
    pieces: '개',
    buyNow: '바로 구매',
    addToCart: '장바구니',
    share: '공유하기',
    back: '쇼핑 계속하기',
    detailHeading: '상세 정보',
    detailNote: '상세 이미지는 product_gallery 슬롯에 들어갑니다.'
  },
  recent: {
    title: '최근 본 상품',
    tabRecent: '최근 방문',
    tabMost: '누적 인기',
    empty: '아직 열어본 상품이 없습니다.',
    emptyMost: '아직 집계된 방문이 없습니다.',
    loading: '불러오는 중…',
    views: '조회 {n}회',
    viewsOne: '조회 {n}회'
  },
  top: {
    label: 'TOP'
  },
  a11y: {
    logo: '스토어 로고',
    cart: '장바구니',
    openMenu: '메뉴 열기',
    closeMenu: '메뉴 닫기',
    openSearch: '검색 열기',
    closeSearch: '검색 닫기',
    openRecent: '최근 본 상품 열기',
    closeRecent: '최근 본 상품 닫기',
    prevSlide: '이전 슬라이드',
    nextSlide: '다음 슬라이드',
    goToSlide: '슬라이드로 이동',
    languageSwitcher: '언어',
    switchTo: {
      en: 'Switch to English',
      id: 'Ganti ke Bahasa Indonesia',
      ko: '한국어로 전환'
    }
  }
};
