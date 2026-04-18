// Sample menu for Tandoor Flame — swap in your real menu here.
// Prices are stored in paise (₹1 = 100 paise).

export interface MenuSeedItem {
  name: string;
  description: string;
  priceInPaise: number;
  category: string;
  spiceLevel: number;
  isSignature?: boolean;
}

export const menuSeed: MenuSeedItem[] = [
  // Tandoor
  {
    name: "Murgh Malai Tikka",
    description:
      "Hand-boned chicken thigh marinated in cream, cheese and cardamom, charred over live coals.",
    priceInPaise: 42000,
    category: "Tandoor",
    spiceLevel: 1,
    isSignature: true,
  },
  {
    name: "Kakori Kebab",
    description:
      "Silken minced lamb kebab perfumed with cloves and rose, a Lucknowi classic.",
    priceInPaise: 52000,
    category: "Tandoor",
    spiceLevel: 2,
  },
  {
    name: "Tandoori Jhinga",
    description:
      "Jumbo prawns marinated in hung curd, ajwain and yellow chilli, grilled in the tandoor.",
    priceInPaise: 78000,
    category: "Tandoor",
    spiceLevel: 2,
  },
  // Curries
  {
    name: "Butter Chicken",
    description:
      "Our flagship — tandoori chicken in a velvety tomato, cream and fenugreek gravy.",
    priceInPaise: 46000,
    category: "Curries",
    spiceLevel: 2,
    isSignature: true,
  },
  {
    name: "Laal Maas",
    description:
      "Rajasthani mutton curry flamed in Mathania chilli and ghee — fiery and smoky.",
    priceInPaise: 58000,
    category: "Curries",
    spiceLevel: 4,
  },
  {
    name: "Chettinad Pepper Chicken",
    description:
      "Slow-simmered with black pepper, star anise and stone-flower from Tamil Nadu.",
    priceInPaise: 44000,
    category: "Curries",
    spiceLevel: 3,
  },
  {
    name: "Goan Prawn Curry",
    description:
      "Coastal prawns in a coconut and kokum gravy, tempered with curry leaves.",
    priceInPaise: 62000,
    category: "Curries",
    spiceLevel: 2,
  },
  // Biryani
  {
    name: "Awadhi Mutton Biryani",
    description:
      "Long-grain basmati, slow-cooked dum-style with saffron milk and mutton shanks.",
    priceInPaise: 56000,
    category: "Biryani",
    spiceLevel: 2,
    isSignature: true,
  },
  {
    name: "Hyderabadi Chicken Dum Biryani",
    description:
      "Layered with fried onions, mint and a generous pour of ghee, sealed with dough.",
    priceInPaise: 48000,
    category: "Biryani",
    spiceLevel: 3,
  },
  {
    name: "Prawn Biryani",
    description:
      "Tiger prawns and fragrant rice finished with browned cashews and raisins.",
    priceInPaise: 58000,
    category: "Biryani",
    spiceLevel: 2,
  },
  // Breads & sides
  {
    name: "Butter Naan",
    description: "Pillowy tandoor-baked naan brushed with white butter.",
    priceInPaise: 9000,
    category: "Breads",
    spiceLevel: 0,
  },
  {
    name: "Garlic Kulcha",
    description: "Stuffed with minced garlic, coriander and green chilli.",
    priceInPaise: 11000,
    category: "Breads",
    spiceLevel: 1,
  },
  {
    name: "Burani Raita",
    description: "Thick curd, smoked garlic and cumin.",
    priceInPaise: 15000,
    category: "Sides",
    spiceLevel: 0,
  },
  // Desserts
  {
    name: "Shahi Tukda",
    description:
      "Ghee-fried bread soaked in saffron rabri, topped with pistachio and rose petals.",
    priceInPaise: 22000,
    category: "Desserts",
    spiceLevel: 0,
  },
  {
    name: "Kulfi Falooda",
    description: "House-churned malai kulfi with vermicelli, basil seeds and rose syrup.",
    priceInPaise: 24000,
    category: "Desserts",
    spiceLevel: 0,
  },
];
