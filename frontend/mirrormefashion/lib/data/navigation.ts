// navigation-data.ts
import {
  ShoppingCart, Menu, User, Heart, Bell, Store, Home, MessageCircle, Users,
  Sparkles, BookOpen, Settings, Star, ChevronRight, ShoppingBag, CreditCard,
  ImageIcon, BarChart3, Info, Mail, HelpCircle, MessageSquare, Shield, FileText,
  LogIn, UserPlus, Phone, X, Facebook, Twitter, Instagram, Youtube
} from "lucide-react";

export const navigationItems = [
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

export const sidebarData = {
  quickAccess: [
    { icon: Home, label: "Dashboard", href: "/dashboard", color: "text-blue-600" },
    { icon: Bell, label: "Notifications", href: "/notifications", badge: 5, color: "text-orange-600" },
    { icon: MessageCircle, label: "Messages", href: "/messages", badge: 3, color: "text-green-600" },
    { icon: ShoppingCart, label: "Cart", href: "/cart", color: "text-red-600" },
  ],
  mainSections: [
    {
      title: "Social & Community",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: [
        { icon: User, label: "My Profile", href: "/profile" },
        { icon: Users, label: "All Profiles", href: "/profiles" },
        { icon: Users, label: "Friends", href: "/friends" },
      ],
    },
    {
      title: "Shopping",
      icon: Store,
      color: "text-red-600",
      bgColor: "bg-red-50",
      items: [
        { icon: Store, label: "Shop", href: "/shop" },
        { icon: ShoppingBag, label: "Products", href: "/products" },
        { icon: Heart, label: "Wishlist", href: "/wishlist" },
        { icon: CreditCard, label: "Checkout", href: "/checkout" },
      ],
    },
    {
      title: "Personal Tools",
      icon: Sparkles,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: [
        { icon: ImageIcon, label: "Media", href: "/media" },
        { icon: BarChart3, label: "Body Shape", href: "/body-shape" },
        { icon: BarChart3, label: "Recommendations", href: "/recommendations" },
      ],
    },
  ],
  secondarySections: [
    {
      title: "Information",
      icon: BookOpen,
      color: "text-gray-600",
      items: [
        { icon: BookOpen, label: "Blog", href: "/blog" },
        { icon: Info, label: "About", href: "/about" },
        { icon: Mail, label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Support & Settings",
      icon: Settings,
      color: "text-gray-600",
      items: [
        { icon: Settings, label: "Settings", href: "/settings" },
        { icon: HelpCircle, label: "Help & Support", href: "/help" },
        { icon: MessageSquare, label: "Send Feedback", href: "/feedback" },
      ],
    },
  ],
  legal: [
    { icon: Shield, label: "Privacy Policy", href: "/privacy" },
    { icon: FileText, label: "Terms of Service", href: "/terms" },
  ],
};

export const socialLinks = [
  { href: "https://facebook.com", icon: Facebook, title: "Facebook", colorClass: "text-blue-600 hover:text-blue-700" },
  { href: "https://twitter.com", icon: Twitter, title: "Twitter", colorClass: "text-sky-500 hover:text-sky-600" },
  { href: "https://instagram.com", icon: Instagram, title: "Instagram", colorClass: "text-pink-600 hover:text-pink-700" },
  { href: "https://youtube.com", icon: Youtube, title: "YouTube", colorClass: "text-red-600 hover:text-red-700" },
];
