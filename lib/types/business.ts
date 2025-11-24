export interface ProfileData {
  id: string;
  name: string;
  bio: string;
  role: string;
  location: string;
  timesHired: number;
  totalEarnings: number;
  profileCompletion: number;
  avatar?: string;
  skills: string[];
  stack: StackItem[];
  socialLinks: SocialLink[];
  works: WorkItem[];
}

export interface StackItem {
  name: string;
  icon: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface WorkItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnail?: string;
  tags?: string[];
  createdAt: Date;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryTime: number;
  category: string;
}

export interface Recommendation {
  id: string;
  from: {
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  rating: number;
  createdAt: Date;
}
