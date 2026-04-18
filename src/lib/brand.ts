// Centralized brand config — swap these values to rebrand the entire site.
export const brand = {
  name: "Tandoor Flame",
  shortName: "Tandoor Flame",
  tagline: "Royal Indian non-vegetarian cuisine, slow-cooked over live coals.",
  description:
    "From Awadhi dum biryani to Chettinad pepper chicken, every plate at Tandoor Flame is hand-crafted by chefs who have spent decades perfecting the craft of Indian non-vegetarian cooking.",
  cuisineFocus: "Modern Indian • Mughlai • Chettinad • Coastal",
  city: "Bengaluru, India",
  address: "No. 42, Lavelle Road, Bengaluru 560001",
  phone: "+91 80 4000 1234",
  whatsapp: "+91 80 4000 1234",
  email: "hello@tandoorflame.test",
  hours: [
    { days: "Monday – Thursday", time: "12:00 PM – 11:00 PM" },
    { days: "Friday – Sunday", time: "12:00 PM – 12:30 AM" },
  ],
  instagram: "https://instagram.com/tandoorflame",
  taxRate: 0.05, // 5% GST (adjust as needed)
  currency: "INR",
  currencySymbol: "₹",
};

export type Brand = typeof brand;
