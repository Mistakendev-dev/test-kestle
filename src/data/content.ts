export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'What is an NFA?',
    answer: 'NFA stands for "No Full Access." It means you receive the account login credentials, but the original registration email is not included. NFA accounts are significantly cheaper and are ideal for alt accounts, fresh starts, or casual play. If you want complete ownership including email, look for our FA (Full Access) products.',
  },
  {
    question: 'How quickly will I receive my order?',
    answer: 'Delivery is automated and typically instant. As soon as your order is confirmed, your account credentials are displayed on the order page and sent to your email. In rare cases of manual review, delivery can take up to a few hours.',
  },
  {
    question: 'Which games are supported?',
    answer: 'We currently stock accounts for 15+ major titles including Rust, Counter-Strike 2, GTA V, Call of Duty, Fortnite, Apex Legends, Rainbow Six Siege, Valorant, Escape from Tarkov, PUBG, Rocket League, Minecraft, Overwatch 2, Battlefield, and DayZ. New games are added based on demand.',
  },
  {
    question: 'What happens if I have an issue with my account?',
    answer: 'Every order is covered by our replacement warranty. If the credentials do not work or the account does not match the description, contact support within the warranty window and we will replace the account or refund you. Our support team resolves most cases within a few hours.',
  },
  {
    question: 'Do you offer support?',
    answer: 'Yes — our support team is available 24/7 through Discord and email. Average first response time is under 15 minutes on Discord. For order issues, include your order ID so we can locate your purchase instantly.',
  },
  {
    question: 'Can I see what products are available?',
    answer: 'All live stock is shown on the products page with real-time availability indicators. Items marked "In Stock" are ready for instant delivery. Low-stock items show a badge so you know when inventory is running out.',
  },
];

/**
 * Demo marketplace activity shown in the corner ticker. These are illustrative
 * placeholders for the UI — not real orders or customer transactions.
 */
export const notificationPool: { title: string; detail: string }[] = [
  { title: 'Rust NFA', detail: 'Stock restocked' },
  { title: 'CS2 Prime', detail: 'Recently viewed' },
  { title: 'Valorant NFA', detail: 'Price updated' },
  { title: 'GTA V Modded', detail: 'Low stock' },
  { title: 'Fortnite OG Skins', detail: 'Recently added' },
  { title: 'Tarkov EOD', detail: 'Low stock' },
  { title: 'Minecraft Java FA', detail: 'Stock restocked' },
  { title: 'Apex Heirloom', detail: 'Recently viewed' },
  { title: 'R6 Diamond', detail: 'Recently added' },
];
