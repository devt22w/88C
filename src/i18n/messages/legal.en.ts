import type { Messages } from '../types';

/**
 * TERMS OF USE and PRIVACY POLICY — English, the governing text.
 *
 * Written for what this shop actually does: an online cosmetics store run from
 * Calamba, Laguna, priced and charged in Philippine pesos through PayMongo
 * (cash for now), with member accounts, reviews and enquiries kept in Supabase.
 * The structure follows the Data Privacy Act of 2012 (RA 10173) and its IRR,
 * the Consumer Act (RA 7394) and the Internet Transactions Act of 2023
 * (RA 11967).
 *
 * Have counsel read it before launch: the return window, the retention periods
 * and the operator's registered name are business decisions, not just copy.
 */
export const legalEn: Messages['legal'] = {
  effective: 'Effective {date}',
  contents: 'CONTENTS',
  governingLanguage:
    'This document is also available in other languages. If a translation differs from the English version, the English version prevails.',
  print: 'Print',
  accept: 'ACCEPT',
  scrollToAccept: '',
  readDone: '',
  close: 'Close',
  seeTerms: 'Read the Terms of Use',
  seePrivacy: 'Read the Privacy Policy',

  // -------------------------------------------------------------------------
  // TERMS OF USE
  // -------------------------------------------------------------------------
  terms: {
    title: 'TERMS OF USE',
    lead: 'The agreement between you and {operator} when you use this store.',
    intro: [
      'These Terms of Use ("Terms") govern your access to and use of {site} and its online store (the "Store"), operated by {operator} ("we", "us", "our"). By creating an account, placing an order or otherwise using the Store, you agree to these Terms and to our Privacy Policy. If you do not agree, please do not use the Store.'
    ],
    sections: [
      {
        id: 'operator',
        heading: '1. Who we are',
        body: [
          'The Store is operated by {operator}, a business based in Calamba City, Laguna, Philippines. You can reach us at:',
          ['Email: {email}', 'Phone: {phone}', 'Address: {address}']
        ]
      },
      {
        id: 'eligibility',
        heading: '2. Eligibility and your account',
        body: [
          'You must be at least 18 years old to create an account or place an order. If you are younger, you may use the Store only with the involvement and consent of a parent or legal guardian.',
          'When you create an account you agree to:',
          [
            'give true, accurate and complete information, and keep it up to date;',
            'keep your password confidential and not share your account with anyone;',
            'tell us straight away if you believe someone else has used your account;',
            'accept responsibility for activity on your account, except where it results from our own failure to protect it.'
          ],
          'Your email address is your login ID. You can update your details at any time under MY PAGE, and you can ask us to close your account at any time (see Section 15).'
        ]
      },
      {
        id: 'products',
        heading: '3. Products and product information',
        body: [
          'We sell cosmetics, skincare and beauty accessories. We take care to describe each product accurately, but please note:',
          [
            'shade swatches and photographs are a guide only — colours vary with screens, lighting and skin tone;',
            'ingredient lists and directions printed on the packaging take precedence over the description on the Store;',
            'cosmetics can cause reactions. Read the ingredients, do a patch test before first use, and stop using a product that irritates your skin. If you have a skin condition or allergy, ask a doctor before use;',
            'nothing on the Store is medical advice.'
          ],
          'Products are offered while stocks last. A product or shade shown as sold out cannot be ordered.'
        ]
      },
      {
        id: 'prices',
        heading: '4. Prices and fees',
        body: [
          'Prices are in Philippine pesos (PHP) and include any applicable VAT unless stated otherwise. Prices shown in another currency are converted for your reference only; you are always charged in PHP.',
          'A shipping fee is added at checkout unless your order qualifies for free shipping. The total shown on the checkout page before you pay is the full amount you will be charged.',
          'If a product is listed at an obviously wrong price because of a technical or typographical error, we may cancel the order and refund anything you have paid in full. We will tell you before doing so.'
        ]
      },
      {
        id: 'orders',
        heading: '5. Placing an order',
        body: [
          'Placing an order is an offer to buy the products in your cart. A contract between you and us is formed when we confirm your payment (or, for cash orders, when customer service confirms the order with you).',
          'We may decline or cancel an order — for example, if a product is no longer available, the payment is not completed, the delivery address cannot be served, or we reasonably suspect fraud or resale in bulk. If we cancel an order you have paid for, we refund you in full.',
          'Your order number and a confirmation are sent to the email address you give. Keep them: you need both to follow an order without an account.'
        ]
      },
      {
        id: 'payment',
        heading: '6. Payment',
        body: [
          'Online payment is processed by our payment provider, PayMongo, by card, GCash, Maya, GrabPay or QR Ph. You enter your payment details on PayMongo\'s secure page; we never see or store your full card number.',
          'Until online payment is live, orders are arranged through customer service and paid in cash on delivery or at our counter. We will confirm the total, including shipping, before you pay.',
          'An order is treated as paid only once the payment provider confirms it to us, or once we receive the cash.'
        ]
      },
      {
        id: 'delivery',
        heading: '7. Shipping and delivery',
        body: [
          'Orders ship from Calamba City, Laguna, to addresses within the Philippines. Delivery times given on the Store or by customer service are estimates, not guarantees, and may be longer during holidays, sales or bad weather.',
          'Please make sure your name, mobile number and address are correct. If a parcel cannot be delivered because the details were wrong or nobody was available to receive it, we may charge the cost of sending it again.',
          'Risk of loss passes to you when the parcel is delivered to the address you gave. You can follow your order under MY PAGE or on the DELIVERY page.'
        ]
      },
      {
        id: 'returns',
        heading: '8. Returns, exchanges and refunds',
        body: [
          'Your rights under the Consumer Act of the Philippines (RA 7394) and other applicable laws are not affected by this section.',
          'Damaged, defective or wrong items. If a product arrives damaged, defective, expired or different from what you ordered, contact customer service within 7 days of delivery with your order number and photographs of the item and its packaging. We will replace it or refund you in full, including the shipping fee, at your choice.',
          'Change of mind. Because cosmetics are personal-care products, we can accept a change-of-mind return only if the item is unopened, unused and in its original sealed packaging, and you contact us within 7 days of delivery. In that case the cost of returning the item is yours.',
          'Refunds are made to the original payment method (or by bank transfer or cash for cash orders) within a reasonable time after we receive and check the returned item. How quickly the money reaches you can depend on your bank or e-wallet.',
          'Please do not send anything back before customer service has confirmed the return; parcels returned without arrangement may not be accepted.'
        ]
      },
      {
        id: 'promotions',
        heading: '9. Coupons, promotions and reward points',
        body: [
          'Coupons, discounts and reward points are subject to the conditions stated with each offer. Unless the offer says otherwise:',
          [
            'the welcome coupon is for new members and can be used once, on a first order that meets the stated minimum;',
            'coupons cannot be combined, exchanged for cash or transferred to another account;',
            'reward points have no cash value and are cancelled if the order that earned them is cancelled or refunded;',
            'we may withdraw a coupon or points obtained by fraud, by opening several accounts, or by mistake.'
          ]
        ]
      },
      {
        id: 'reviews',
        heading: '10. Reviews and other content you send us',
        body: [
          'You may post reviews of products you have bought, and send us enquiries. You keep ownership of what you write, but you give us a free, non-exclusive licence to publish, display and translate your review on the Store and in our own promotion of the Store.',
          'Reviews must be honest and about the product. We may decline, hide or remove any review that is false or misleading, offensive, unlawful, contains someone else\'s personal information, advertises something, or infringes another person\'s rights. Reviews are checked before they are published.'
        ]
      },
      {
        id: 'use',
        heading: '11. Acceptable use',
        body: [
          'When using the Store you must not:',
          [
            'break any law, or use the Store for fraud, including using a payment method you are not authorised to use;',
            'try to gain access to another person\'s account, our systems or data that is not yours;',
            'interfere with the Store\'s security or operation, or introduce viruses or harmful code;',
            'copy, scrape or harvest content or data from the Store by automated means without our written permission;',
            'buy products for commercial resale without our agreement (please use the bulk-order enquiry instead).'
          ]
        ]
      },
      {
        id: 'ip',
        heading: '12. Intellectual property',
        body: [
          'The Store and its content — text, design, graphics, photographs and logos — belong to us or to our licensors, including the brands whose products we sell, and are protected by the Intellectual Property Code of the Philippines (RA 8293). You may view and print pages for your own personal use. Any other use requires our written permission.'
        ]
      },
      {
        id: 'third-parties',
        heading: '13. Third-party services and links',
        body: [
          'Some services on the Store are provided by third parties, such as payment processing by PayMongo and delivery by couriers. Their own terms and privacy policies also apply when you use them. Links to other websites, such as our social media pages, are for convenience; we are not responsible for the content of those sites.'
        ]
      },
      {
        id: 'liability',
        heading: '14. Our responsibility to you',
        body: [
          'We provide the Store with reasonable care and skill, but we cannot promise that it will always be available or free of errors. We may suspend parts of it for maintenance or for reasons beyond our control.',
          'To the extent permitted by law, we are not liable for loss that was not reasonably foreseeable, for loss caused by events beyond our reasonable control, or for business losses. Our total liability for an order is limited to the amount you paid for it.',
          'Nothing in these Terms limits or excludes our liability where the law does not allow it, including liability for death or personal injury caused by our negligence, for fraud, or under the Consumer Act.'
        ]
      },
      {
        id: 'termination',
        heading: '15. Suspending or closing an account',
        body: [
          'You may close your account at any time by contacting customer service. Orders already placed will still be completed, and we keep the records described in our Privacy Policy for as long as the law requires.',
          'We may suspend or close an account that breaks these Terms, is used for fraud, or has been compromised. Unless the law or an investigation prevents it, we will tell you why.'
        ]
      },
      {
        id: 'changes',
        heading: '16. Changes to these Terms',
        body: [
          'We may update these Terms to reflect changes in the law or in how the Store works. The effective date at the top of this page shows when they last changed. If a change materially affects you, we will tell you on the Store or by email before it takes effect. The Terms in force when you placed an order apply to that order.'
        ]
      },
      {
        id: 'law',
        heading: '17. Governing law and complaints',
        body: [
          'These Terms are governed by the laws of the Republic of the Philippines.',
          'If something goes wrong, please contact customer service first — most problems are solved quickly that way. If we cannot resolve your complaint, you may bring it to the Department of Trade and Industry (DTI) or any other competent government agency. Any court action shall be brought in the proper courts of Calamba City, Laguna, without prejudice to any right you have as a consumer to bring it elsewhere.'
        ]
      },
      {
        id: 'contact',
        heading: '18. Contact us',
        body: [
          'Questions about these Terms can be sent to {email}, or to customer service at {phone}, Monday to Friday, 10:00 – 17:00 (closed for lunch 12:00 – 13:00, and on weekends and holidays).'
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------
  // PRIVACY POLICY
  // -------------------------------------------------------------------------
  privacy: {
    title: 'PRIVACY POLICY',
    lead: 'What personal data we collect, why, and the rights you have over it.',
    intro: [
      '{operator} ("we", "us", "our") respects your privacy and is committed to protecting your personal data in line with the Data Privacy Act of 2012 (Republic Act No. 10173), its Implementing Rules and Regulations, and the issuances of the National Privacy Commission (NPC).',
      'This Privacy Policy explains how we collect, use, share, store and protect personal data when you visit {site}, create an account, place an order, write a review or contact us. It applies to the online store only.'
    ],
    sections: [
      {
        id: 'controller',
        heading: '1. Who is responsible for your data',
        body: [
          '{operator} is the personal information controller for the data described in this Policy.',
          ['Address: {address}', 'Data Protection Officer: {privacyEmail}', 'Phone: {phone}']
        ]
      },
      {
        id: 'collect',
        heading: '2. Personal data we collect',
        body: [
          'We collect only what we need to run the store. Depending on how you use it, that is:',
          [
            'Account data — your name, email address, mobile number (optional) and password. Your password is stored only in hashed form; we cannot read it.',
            'Delivery details — the street address, city and postal code you save under MY PAGE or enter at checkout.',
            'Order data — the products, shades and quantities you buy, the amounts charged, order dates and status, and courier and tracking details.',
            'Payment data — the payment method used, the payment reference and the amount and fees reported by our payment provider. Your card number, CVC, and e-wallet or bank login are entered on PayMongo\'s page and never reach us.',
            'Enquiries — the name, email, phone number and message you send through the contact or delivery forms.',
            'Reviews — the rating, title and text you post, linked to your account.',
            'Notifications — the order and review updates shown to you under the bell icon.',
            'Consent record — the date and version of the Terms of Use and Privacy Policy you agreed to when you joined.',
            'Usage data — which products are viewed, recorded with a random visitor number that is not linked to your name or account, and the language you choose.'
          ],
          'We do not collect sensitive personal information (such as health, government ID numbers or religious beliefs) through the Store, and we ask you not to send it to us in enquiries or reviews.'
        ]
      },
      {
        id: 'how',
        heading: '3. How we collect it',
        body: [
          [
            'Directly from you, when you create an account, check out, update MY PAGE, write a review or send an enquiry.',
            'From our payment provider, PayMongo, which tells us whether a payment succeeded and how it was made.',
            'From couriers, which give us tracking and delivery status.',
            'Automatically, from your browser, when you view products (see Section 9).'
          ]
        ]
      },
      {
        id: 'use',
        heading: '4. Why we use it, and on what basis',
        body: [
          'Under Section 12 of the Data Privacy Act we may process personal data only on a lawful basis. We use your data:',
          [
            'to create and run your account, and to let you log in — to fulfil our contract with you;',
            'to take, charge for, pack, ship and track your orders, and to send order confirmations and status updates — to fulfil our contract with you;',
            'to answer your enquiries and handle returns, refunds and complaints — to fulfil our contract with you, and in our legitimate interest in serving customers well;',
            'to publish your reviews after checking them — with the consent you give by submitting a review;',
            'to keep invoices, receipts and accounting records, and to respond to lawful requests from authorities — to comply with our legal obligations, including tax law;',
            'to prevent fraud and abuse and keep the Store secure — in our legitimate interest;',
            'to count product views and improve the Store — in our legitimate interest, using data that does not identify you.'
          ],
          'We send marketing emails or messages only if you have separately agreed to receive them, and you can withdraw that consent at any time. We do not use your data for automated decision-making or profiling that produces legal or similarly significant effects on you.'
        ]
      },
      {
        id: 'share',
        heading: '5. Who we share it with',
        body: [
          'We do not sell or rent your personal data. We share it only with the following, and only as much as each needs:',
          [
            'PayMongo — to process online payments;',
            'courier and delivery partners — your name, mobile number and delivery address, so they can deliver your parcel;',
            'Supabase — which hosts our database and account sign-in;',
            'Vercel — which hosts the website;',
            'Resend — which sends our order and account emails;',
            'government agencies, courts or regulators — when the law requires it, or to establish, exercise or defend legal claims.'
          ],
          'The service providers above process data on our instructions under agreements that require them to protect it, and they may not use it for their own purposes.'
        ]
      },
      {
        id: 'transfer',
        heading: '6. Data stored outside the Philippines',
        body: [
          'Some of our service providers store data on servers outside the Philippines. When that happens we remain responsible for your data, as the Data Privacy Act requires, and we use providers that apply security measures at least comparable to those required by Philippine law.'
        ]
      },
      {
        id: 'retention',
        heading: '7. How long we keep it',
        body: [
          [
            'Account data — for as long as your account is open. When you close it, we delete or anonymise it within 30 days, except what we must keep for the reasons below.',
            'Order, payment and invoice records — for as long as tax and accounting laws require (currently at least five years from the transaction), then deleted.',
            'Enquiries — up to two years after the matter is closed.',
            'Reviews — until you ask us to remove them or your account is closed; after closure a published review may remain without your name.',
            'Product-view records — kept only in a form that does not identify you.'
          ],
          'When data is no longer needed, it is securely deleted or anonymised so that it can no longer identify you.'
        ]
      },
      {
        id: 'security',
        heading: '8. How we protect it',
        body: [
          'We use organisational, physical and technical measures to protect your data against loss, misuse and unauthorised access, including:',
          [
            'encrypted (HTTPS) connections for every page and form;',
            'passwords stored only as secure hashes;',
            'database rules that let each member see only their own account, orders and notifications;',
            'access to customer data limited to staff who need it for their work, and bound by confidentiality;',
            'card and e-wallet details handled only by PayMongo, never by our servers.'
          ],
          'If a personal data breach occurs that is likely to put you at real risk of serious harm, we will notify the National Privacy Commission and the affected people within 72 hours of becoming aware of it, as NPC rules require.'
        ]
      },
      {
        id: 'storage',
        heading: '9. Browser storage and cookies',
        body: [
          'The Store does not use advertising or third-party tracking cookies. It keeps a few small items in your browser\'s local storage so that the site works:',
          [
            'your sign-in session, so you stay logged in;',
            'your cart, so it is still there when you come back;',
            'your recently viewed products, which stay on your device;',
            'your language choice;',
            'a random visitor number used only to count product views.'
          ],
          'You can clear these at any time through your browser settings. If you do, you will be logged out and your cart and recently viewed list will be emptied.'
        ]
      },
      {
        id: 'rights',
        heading: '10. Your rights',
        body: [
          'Under the Data Privacy Act you have the right to:',
          [
            'be informed about how your personal data is processed;',
            'access the personal data we hold about you;',
            'object to processing, and withdraw consent you have given;',
            'correct (rectify) data that is wrong or incomplete;',
            'have your data erased or blocked when it is no longer needed or was processed unlawfully;',
            'receive your data in a commonly used electronic format (data portability);',
            'be indemnified for damages caused by inaccurate, false or unlawfully obtained or used data;',
            'file a complaint with the National Privacy Commission.'
          ],
          'You can update most details yourself under MY PAGE. For anything else, email our Data Protection Officer at {privacyEmail}. We may ask you to confirm your identity first, and we will respond within 30 days. Exercising these rights is free of charge.',
          'If you are not satisfied with our response, you may contact the National Privacy Commission at www.privacy.gov.ph or complaints@privacy.gov.ph.'
        ]
      },
      {
        id: 'children',
        heading: '11. Children',
        body: [
          'The Store is not directed at children under 18, and we do not knowingly collect their personal data without the consent of a parent or guardian. If you believe a child has given us personal data, contact us and we will delete it.'
        ]
      },
      {
        id: 'changes',
        heading: '12. Changes to this Policy',
        body: [
          'We may update this Policy when our practices or the law change. The effective date at the top shows when it last changed. If we make a material change, we will tell you on the Store or by email, and where the law requires it we will ask for your consent again.'
        ]
      },
      {
        id: 'contact',
        heading: '13. Contact us',
        body: [
          'For any question about this Policy or your personal data, contact our Data Protection Officer:',
          ['{operator}', 'Email: {privacyEmail}', 'Phone: {phone}', 'Address: {address}']
        ]
      }
    ]
  }
};
