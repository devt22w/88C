import type { Messages } from '../types';
import { productsEn } from './products.en';
import { legalEn } from './legal.en';

/**
 * English — the base catalogue. Every other locale mirrors this shape.
 *
 * Product names, prices, discount rates and shade counts follow the real
 * catalogue. The two description lines are written for this build rather than
 * lifted from the brand's own marketing copy — drop the official text in when
 * you have it, it is one field per product per locale.
 */
export const en: Messages = {
  meta: {
    title: 'MQNY — Cosmetics Store',
    description:
      'Best sellers, new arrivals and member-only coupons, shipped the same day.'
  },
  promo: {
    text: 'Join MQNY and get a welcome coupon on your first order.',
    close: 'CLOSE'
  },
  nav: {
    login: 'Login',
    join: 'Join',
    delivery: 'Delivery',
    contact: 'Contact',
    searchPlaceholder: 'Search for a product'
  },
  categories: {
    all: 'ALL',
    eye: 'EYE',
    lip: 'LIP',
    face: 'FACE',
    accTool: 'ACC&TOOL',
    alarm: 'Event alerts',
    event: 'EVENT',
    cs: 'CS'
  },
  hero: {
    slides: [
      {
        headline: ['JOIN AND', 'SAVE 5%'],
        lines: ['Members get a 5% discount coupon.', 'Valid on orders over {amount}.'],
        alt: 'Membership coupon'
      },
      {
        headline: ['BEST OF', 'THE SHELF'],
        lines: ['The nine products our customers reorder most.', 'Restocked and ready to ship today.'],
        alt: 'Best sellers'
      },
      {
        headline: ['NEW IN', 'THIS WEEK'],
        lines: ['Three arrivals just landed on the shelf.', 'From juicy tints to lip plumpers.'],
        alt: 'New arrivals'
      }
    ]
  },
  sections: {
    best: {
      title: 'BEST ITEM',
      subtitle: 'Our most loved best sellers'
    },
    fresh: {
      title: 'NEW ITEM',
      subtitle: 'Hot new arrivals from MQNY'
    }
  },
  product: {
    addToCart: 'ADD TO CART',
    copy: productsEn
  },
  midBanner: {
    panels: [
      {
        eyebrow: '',
        headline: ['', ''],
        alt: ''
      },
      {
        eyebrow: '',
        headline: ['', ''],
        alt: ''
      }
    ]
  },
  footer: {
    company: {
      nameLabel: 'Company',
      name: 'PLACEHOLDER COSMETICS CO., LTD.',
      ceoLabel: 'CEO',
      ceo: 'Hong Gil-dong',
      registrationLabel: 'Business registration',
      registration: '000-00-00000',
      businessCheck: 'Verify business',
      mailOrderLabel: 'Mail-order licence',
      mailOrder: '0000-Seoul-0000',
      privacyOfficerLabel: 'Privacy officer',
      privacyOfficer: 'privacy@example.com [Hong Gil-dong]',
      address:
        'Address : 00, Example-ro 00-gil, Gangnam-gu, Seoul, Republic of Korea (00000)'
    },
    copyright: [
      'Copyright © PLACEHOLDER COSMETICS CO., LTD. All rights reserved.',
      'Replace the company details and account numbers with the real operating entity.'
    ],
    policies: {
      brandStory: 'BRAND STORY',
      shoppingGuide: 'SHOPPING GUIDE',
      terms: 'TERMS OF USE',
      privacyPolicy: 'PRIVACY POLICY',
      businessCheck: 'VERIFY BUSINESS'
    },
    cs: {
      title: 'CS CENTER',
      heading: 'Customer service hours',
      phoneLabel: 'Chat with us',
      hours: ['OPEN  10:00 – 17:00', 'LUNCH  12:00 – 13:00', 'SAT, SUN, HOLIDAY OFF']
    },
    bank: {
      title: 'BANK INFO',
      holder: 'Account holder : PLACEHOLDER COSMETICS',
      businessTitle: 'BUSINESS',
      partnership: 'Stockist & partnership',
      bulkOrder: 'Bulk order enquiry',
      banks: { kb: 'KB', shinhan: 'Shinhan' }
    },
    notice: [
      'Returns : 00, Example-ro 00-gil, Gangnam-gu, Seoul (00000) Returns Centre',
      'Consumer enquiries and complaints : 0000-0000 / help@example.com'
    ]
  },
  sideMenu: {
    loginPrompt: 'Sign in to continue.',
    login: 'LOGIN',
    join: 'JOIN',
    myPage: 'MY PAGE',
    cart: 'CART',
    order: 'ORDER',
    delivery: 'DELIVERY',
    coupon: 'COUPON',
    qna: 'Q&A',
    myInfo: 'MY INFO'
  },
  search: {
    title: 'SEARCH',
    placeholder: 'Search for a product',
    hotKeywords: [
      'lipstick',
      'lip tint',
      'eyebrow',
      'eyeliner',
      'shadow palette',
      'lip plumper',
      'multi balm',
      'brightening cream'
    ],
    popular: 'POPULAR',
    results: '{n} results',
    empty: 'Nothing matches that yet.',
    seeAll: 'See every product'
  },
  account: {
    inert: 'Front-end only — this form is not wired to a backend yet.',
    login: {
      tabMember: 'MEMBER LOGIN',
      tabGuest: 'GUEST ORDER',
      secure: 'Secure connection',
      id: 'ID',
      password: 'Password',
      remember: 'Remember my ID',
      findId: 'Find ID',
      findPassword: 'Find password',
      submit: 'LOGIN',
      snsTitle: 'SNS LOGIN',
      joinHeading: 'Join and enjoy member-only benefits',
      joinLines: [
        'Not an MQNY member yet?',
        'Sign up and unlock the membership rewards.'
      ],
      joinButton: 'JOIN'
    },
    join: {
      title: 'JOIN',
      lead: 'Fill in the details below to create your account.',
      name: 'Name',
      id: 'ID',
      password: 'Password',
      passwordConfirm: 'Confirm password',
      email: 'Email',
      phone: 'Mobile number',
      agreeAll: 'I agree to all of the following',
      agreeTerms: 'I have read and agree to the Terms of Use',
      agreePrivacy: 'I have read and agree to the Privacy Policy',
      agreeHint: '',
      submit: 'CREATE ACCOUNT'
    },
    delivery: {
      title: 'DELIVERY',
      lead: 'Track an order with the number from your confirmation email.',
      orderNo: 'Order number',
      name: 'Name on the order',
      submit: 'TRACK ORDER',
      memberNote: 'Members can see every order under MY PAGE.'
    },
    contact: {
      title: 'CONTACT',
      lead: 'Send us a question and we will reply during service hours.',
      subject: 'Subject',
      email: 'Your email',
      message: 'Message',
      submit: 'SEND',
      csTitle: 'CS CENTER'
    }
  },
  support: {
    sending: 'Sending…',
    sent: 'Thank you — your message is with our customer service team. We reply during service hours.',
    failed: 'The message could not be sent. Please try again, or call the numbers below.',
    required: 'Please fill in your name, your email and your message.',
    contact: {
      name: 'Your name',
      email: 'Your email',
      phone: 'Mobile number (optional)',
      subject: 'Subject',
      message: 'Message',
      submit: 'SEND',
      infoTitle: 'REACH US DIRECTLY',
      phoneLabel: 'Phone',
      kakaoLabel: 'KakaoTalk',
      messengerLabel: 'Facebook Messenger',
      emailLabel: 'Email',
      addressLabel: 'Address'
    },
    delivery: {
      trackTitle: 'TRACK AN ORDER',
      trackLead: 'Enter the order number from your confirmation, with the email used to order.',
      orderId: 'Order number',
      email: 'Email on the order',
      track: 'TRACK ORDER',
      notFound: 'No order matches that number and email.',
      searching: 'Looking it up…',
      placed: 'Placed',
      paid: 'Paid',
      stage: 'Status',
      tracking: 'Tracking',
      enquiryTitle: 'ASK ABOUT A DELIVERY',
      enquiryLead: 'Tell us the order number and what you need, and we will come back to you.',
      message: 'What do you need help with?',
      submit: 'SEND ENQUIRY',
      shippingTitle: 'SHIPPING',
      shippingLines: [
        'Shipping is {fee}, and free on orders over {threshold}.',
        'Orders ship from #9061 National Highway, Bagong Kalsada, Calamba City, 4027 Laguna.'
      ]
    }
  },
  auth: {
    checking: 'Checking your account…',
    signOut: 'LOGOUT',
    myPage: 'MY PAGE',
    signedInAs: 'Signed in as {email}',
    errors: {
      badCredentials: 'That email and password do not match an account.',
      emailTaken: 'An account already uses this email. Try logging in instead.',
      weakPassword: 'Use at least 8 characters for the password.',
      mismatch: 'The two passwords are not the same.',
      agreeRequired: 'Please agree to the terms and the privacy policy.',
      unavailable: 'Accounts are unavailable right now. Please try again later.',
      generic: 'Something went wrong. Please try again.'
    },
    confirmEmail: 'Account created. Check your inbox and confirm your email address, then log in.',
    account: {
      title: 'MY PAGE',
      lead: 'Your details and your orders.',
      profileTitle: 'MY DETAILS',
      name: 'Name',
      phone: 'Mobile number',
      address: 'Address',
      city: 'City',
      postal: 'Postal code',
      save: 'SAVE',
      saved: 'Saved'
    },
    orders: {
      title: 'MY ORDERS',
      empty: 'No orders yet.',
      emptyCta: 'Start shopping',
      placed: 'Placed',
      total: 'Total',
      items: 'Items',
      tracking: 'Tracking',
      view: 'View order',
      status: {
        pending: 'Awaiting payment',
        paid: 'Paid',
        failed: 'Payment failed',
        cancelled: 'Cancelled',
        review: 'Under review'
      },
      fulfilment: {
        unfulfilled: 'Preparing',
        packing: 'Packing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        returned: 'Returned'
      }
    }
  },
  recover: {
    findIdTitle: 'FIND ID',
    findIdLead: 'Your ID is the email address you signed up with. If you have forgotten the password, reset it below.',
    title: 'RESET PASSWORD',
    lead: 'Enter your email and we will send you a link to set a new password.',
    email: 'Email',
    submit: 'SEND RESET LINK',
    sending: 'Sending…',
    sent: 'If that email has an account, a reset link is on its way. Check your inbox and your spam folder.',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    save: 'SAVE PASSWORD',
    saved: 'Password changed. You are signed in.',
    expired: 'This reset link has expired or has already been used. Please ask for a new one.',
    backToLogin: 'Back to login'
  },
  notifications: {
    title: 'NOTIFICATIONS',
    empty: 'Nothing yet.',
    markAll: 'Mark all read',
    viewOrder: 'View order',
    kinds: {
      order_paid: 'Payment received for order {order}.',
      order_packing: 'Order {order} is being packed.',
      order_shipped: 'Order {order} has shipped. {tracking}',
      order_delivered: 'Order {order} was delivered.',
      order_returned: 'Order {order} was returned.',
      order_failed: 'Payment for order {order} did not go through.',
      review_published: 'Your review is now published.'
    }
  },
  paymentStatus: {
    badge: 'COMING SOON',
    title: 'Online payment is almost ready',
    body: 'Card, GCash, Maya and QR Ph are being set up with our payment provider. Until that is live, an order is settled in cash.',
    cashTitle: 'PAYING IN CASH, FOR NOW',
    cashSteps: [
      'Send us the items you want through the contact form, Messenger or KakaoTalk.',
      'Customer service confirms the total, the shipping fee and when it can reach you.',
      'You pay in cash on delivery or at the counter, and your receipt comes with the parcel.'
    ],
    cta: 'MESSAGE CUSTOMER SERVICE'
  },
  guide: {
    title: 'SHOPPING GUIDE',
    lead: 'Everything about ordering here, in the order it happens.',
    steps: [
      {
        heading: '1 · Choose',
        body: 'Open a product, pick a shade if it has one, then ADD TO CART or BUY NOW. A shade that has run out cannot be selected.'
      },
      {
        heading: '2 · Check your cart',
        body: 'Change quantities or remove a line in the cart. The total shown is the total you pay — nothing is added later.'
      },
      {
        heading: '3 · Your details',
        body: 'Fill in the name, email, mobile number and address the parcel should reach. Members have theirs filled in already.'
      },
      {
        heading: '4 · Pay',
        body: 'You move to the payment provider’s own secure page, pay, and come back to an order page that confirms it.'
      }
    ],
    payTitle: 'HOW YOU CAN PAY',
    payBody:
      'Card, GCash, Maya, GrabPay and QR Ph. Card details are typed on the payment provider’s page, never on this site. Payment is charged in Philippine pesos; prices shown in other currencies are converted for reference.',
    shipTitle: 'SHIPPING',
    shipBody:
      'Shipping is {fee}, and free on orders over {threshold}. Orders ship from #9061 National Highway, Bagong Kalsada, Calamba City, 4027 Laguna.',
    trackTitle: 'FOLLOWING YOUR ORDER',
    trackBody:
      'Use the order number from your confirmation together with the email you ordered with. Members see every order under MY PAGE, and the bell tells them when an order is packed, shipped or delivered.',
    memberTitle: 'WHY JOIN',
    memberBody:
      'A member keeps their order history, their delivery address and their notifications in one place, and can write a review on a product.',
    returnTitle: 'IF SOMETHING IS WRONG',
    returnBody:
      'Contact customer service with your order number and a photo of the item as soon as you notice. Our team will tell you what to do next.',
    ctaTrack: 'TRACK AN ORDER',
    ctaContact: 'CONTACT US'
  },
  cs: {
    title: 'CS CENTER',
    lead: 'Talk to a person. These are the same lines the resort answers on.',
    hoursTitle: 'SERVICE HOURS',
    channelsTitle: 'WAYS TO REACH US',
    phoneLabel: 'Phone',
    kakaoLabel: 'KakaoTalk',
    messengerLabel: 'Facebook Messenger',
    emailLabel: 'Email',
    addressLabel: 'Address',
    ctaContact: 'SEND A MESSAGE',
    ctaTrack: 'TRACK AN ORDER',
    ctaGuide: 'SHOPPING GUIDE',
    note: 'Messages sent outside service hours are answered on the next working day.'
  },
  legal: legalEn,
  missing: {
    title: ' COMING SOON',
    lead: 'This link is in the navigation, but its page has not been built.',
    back: 'Back to the shop'
  },
  list: {
    home: 'HOME',
    here: 'You are here',
    count: '{n} products',
    empty: 'Nothing in this category yet.',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    sort: {
      newest: 'Newest',
      lowPrice: 'Low price',
      popular: 'Popular',
      reviews: 'Reviews',
      views: 'Most viewed'
    },
    sortUnavailable: 'Needs review and view data before it can sort.'
  },
  cart: {
    title: 'CART',
    empty: 'Your cart is empty.',
    continueShopping: 'Continue shopping',
    product: 'Product',
    quantity: 'Qty',
    price: 'Price',
    remove: 'Remove',
    shade: 'Shade',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'Free',
    total: 'Total',
    toCheckout: 'CHECKOUT',
    added: 'ADDED ✓',
    chooseShade: 'Choose a shade first',
    checkoutTitle: 'CHECKOUT',
    customerHeading: 'Shipping details',
    summaryHeading: 'Order summary',
    name: 'Full name',
    email: 'Email',
    phone: 'Mobile number',
    address: 'Street address',
    city: 'City',
    postal: 'Postal code',
    required: 'Please fill in every field.',
    invalidEmail: 'Please enter a valid email address.',
    pay: 'PAY WITH CARD · GCASH · MAYA',
    paying: 'Opening secure checkout…',
    chargedInPhp: 'PayMongo charges in Philippine pesos. The total below is exactly what you pay.',
    methods: 'Cards, GCash, Maya, GrabPay and QR Ph are offered on the next, secure PayMongo page.',
    unavailable: 'Payments are not connected yet — the checkout service has not been deployed.',
    failed: 'Checkout could not start: {reason}',
    resultTitle: 'ORDER',
    resultPaid: 'Payment received — thank you!',
    resultPending: 'Confirming your payment…',
    resultPendingLong: 'Still waiting for confirmation. This page updates by itself.',
    resultFailed: 'The payment did not go through.',
    resultCancelled: 'This checkout expired or was cancelled.',
    resultReview: 'Payment received, but the amount differs from the order. We will contact you.',
    resultNotFound: 'We could not find this order.',
    orderNumber: 'Order no.',
    paidWith: 'Paid with',
    backToCart: 'Back to cart'
  },
  reviews: {
    title: 'REVIEWS',
    count: '{n} reviews',
    none: 'No reviews yet.',
    pending: 'Your review is waiting to be published.',
    writeTitle: 'WRITE A REVIEW',
    titleLabel: 'Title (optional)',
    bodyLabel: 'How did you find it?',
    submit: 'POST REVIEW',
    sending: 'Sending…',
    thanks: 'Thank you — your review appears once it has been checked.',
    tooShort: 'Please write a little more.',
    failed: 'The review could not be saved. Please try again.',
    signInToWrite: 'Log in to write a review'
  },
  detail: {
    consumerPrice: 'Retail price',
    soldOut: 'SOLD OUT',
    lowStock: 'Only {n} left',
    salePrice: 'Our price',
    points: 'Reward points',
    shipping: 'Shipping',
    shippingFree: 'free over {amount}',
    selectLabel: 'Shade',
    optionRequired: '[Required] Please choose a shade',
    optionPlaceholder: 'Choose a shade',
    total: 'Total',
    pieces: 'item',
    buyNow: 'BUY NOW',
    addToCart: 'ADD TO CART',
    share: 'Share',
    back: 'Back to shop',
    detailHeading: 'PRODUCT DETAILS',
    detailNote: 'Long-form detail imagery drops into the product_gallery slots.'
  },
  recent: {
    title: 'RECENTLY VIEWED',
    tabRecent: 'RECENT VISIT',
    tabMost: 'MOST VISITED',
    empty: 'You have not opened a product yet.',
    emptyMost: 'No visits counted yet.',
    loading: 'Loading…',
    views: '{n} views',
    viewsOne: '{n} view'
  },
  top: {
    label: 'TOP'
  },
  a11y: {
    logo: 'Store wordmark',
    cart: 'Cart',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    openSearch: 'Open search',
    closeSearch: 'Close search',
    openRecent: 'Open recently viewed',
    closeRecent: 'Close recently viewed',
    prevSlide: 'Previous slide',
    nextSlide: 'Next slide',
    goToSlide: 'Go to slide',
    languageSwitcher: 'Language',
    switchTo: {
      en: 'Switch to English',
      id: 'Ganti ke Bahasa Indonesia',
      ko: '한국어로 전환'
    }
  }
};
