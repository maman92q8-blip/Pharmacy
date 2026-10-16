// ✏️ Edit your site's name, links and categories here.
export const site = {
  name: 'RXperiences',
  tagline: 'كل ما يتعلق بالصيدلة',
  taglineEn: 'All about Pharmacy',
  author: 'موضي أمان',
  description: 'تجارب واقعية لصيادلة وطلبة صيدلة من الكويت والخليج، ومقالات عن الدراسة والعمل في الصيدلة.',
  social: {
    instagram: 'https://instagram.com/moudhi_ea',
    youtube: 'https://youtu.be/b53vCeUeXEE',
    twitter: 'https://twitter.com/m_e_aman',
  },
  booking: 'https://calendly.com/coachmoudi',
};

export const categories: Record<string, { name: string; nameEn: string; image?: string }> = {
  'uk-ireland': { name: 'تجارب من بريطانيا و إيرلندا', nameEn: 'UK & Ireland', image: '/images/2022-05-WhatsApp-Image-2022-05-25-at-7.03.05-PM-1.jpeg' },
  'usa-canada': { name: 'تجارب من أمريكا و كندا', nameEn: 'USA & Canada', image: '/images/2022-05-WhatsApp-Image-2022-05-25-at-7.03.04-PM-2.jpeg' },
  'arab-countries': { name: 'تجارب من دول عربية أخرى', nameEn: 'Arab countries', image: '/images/2022-05-arabworld.jpg' },
  'pharmacy-articles': { name: 'المقالات الصيدلانية', nameEn: 'Pharmacy articles' },
};

export const policyCategories: Record<string, string> = {
  laws: 'القوانين',
  licensing: 'تراخيص مزاولة المهنة',
  pharmacies: 'تنظيم الصيدليات',
  medicines: 'تسجيل وتداول الأدوية',
  official: 'مصادر رسمية',
};
