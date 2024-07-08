export class UserNode {
  public user: any;
  public children: UserNode[];

  constructor(user: any) {
    this.user = user;
    this.children = [];
  }

  // Add a method to add a child node to this user
  addChild(childNode: UserNode): void {
    this.children.push(childNode);
  }
}

export const levelIncomePercentage = [
  0, 0.5, 0.5, 1, 1, 1, 1, 2, 2, 2, 3
];

export const TeamIncomeData = [
  {
    id: 1,
    totalBusiness: 5000,
    Daily: 3,
    durationInMonth: 2,
    monthlyReward: 90,
    totalReward: 180,
  },
  {
    id: 2,
    totalBusiness: 12000,
    Daily: 5,
    durationInMonth: 3,
    monthlyReward: 150,
    totalReward: 450,
  },
  {
    id: 3,
    totalBusiness: 24000,
    Daily: 8,
    durationInMonth: 6,
    monthlyReward: 240,
    totalReward: 1440,
  },
  {
    id: 4,
    totalBusiness: 60000,
    Daily: 14,
    durationInMonth: 9,
    monthlyReward: 420,
    totalReward: 3780,
  },
  {
    id: 5,
    totalBusiness: 120000,
    Daily: 25,
    durationInMonth: 12,
    monthlyReward: 750,
    totalReward: 9000,
  },
  {
    id: 6,
    totalBusiness: 170000,
    Daily: 36,
    durationInMonth: 15,
    monthlyReward: 1080,
    totalReward: 16200,
  },
  {
    id: 7,
    totalBusiness: 240000,
    Daily: 47,
    durationInMonth: 18,
    monthlyReward: 1410,
    totalReward: 33840,
  },
  {
    id: 8,
    totalBusiness: 480000,
    Daily: 88,
    durationInMonth: 24,
    monthlyReward: 2640,
    totalReward: 63360,
  },
  {
    id: 9,
    totalBusiness: 1000000,
    Daily: 211,
    durationInMonth: 30,
    monthlyReward: 6330,
    totalReward: 189900,
  },
];

export const StarBusinessData = [
  { id: 1, business: 3000, reward: "Domestic Tour", label: "Domestic Tour" },
  { id: 2, business: 5000, reward: 200, label: "" },
  {
    id: 3,
    business: 11000,
    reward: "International Tour",
    label: "International Tour",
  },
  { id: 4, business: 25000, reward: 1000, label: "" },
  { id: 5, business: 50000, reward: 2100, label: "" },
  { id: 6, business: 100000, reward: 4500, label: "" },
  { id: 7, business: 270000, reward: 10000, label: "" },
  { id: 8, business: 600000, reward: 15000, label: "" },
  { id: 9, business: 1200000, reward: 30000, label: "" },
  { id: 10, business: 2800000, reward: 50000, label: "" },
  { id: 11, business: 5500000, reward: 120000, label: "" },
  { id: 12, business: 11000000, reward: 350000, label: "" },
];

export const packages = [100, 200, 500, 1000, 2000, 5000, 10000];

export const eligibleLevelsData = [
  {amount: 100, level:1, incomeInPercent:0.5},
  {amount: 200, level:2, incomeInPercent:0.5},
  {amount: 500, level:3, incomeInPercent:1},
  {amount: 1000, level:5, incomeInPercent:1},
  {amount: 2000, level:7, incomeInPercent:2},
  {amount: 5000, level:9, incomeInPercent:2},
  {amount: 10000, level:10, incomeInPercent:3},
]