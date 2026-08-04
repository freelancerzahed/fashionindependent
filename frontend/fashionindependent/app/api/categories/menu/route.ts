import { NextResponse } from "next/server"
import { BACKEND_URL } from "@/config"

const fallbackCategories = [
  {
    id: "womenswear",
    name: "Womenswear",
    href: "/category/womenswear",
    subcategories: [
      { id: "tops", name: "Tops", href: "/category/tops" },
      { id: "bottoms", name: "Bottoms", href: "/category/bottoms" },
      { id: "dresses", name: "Dresses", href: "/category/dresses" },
    ],
  },
  {
    id: "menswear",
    name: "Menswear",
    href: "/category/menswear",
    subcategories: [
      { id: "shirts", name: "Shirts", href: "/category/shirts" },
      { id: "jackets", name: "Jackets", href: "/category/jackets" },
      { id: "footwear", name: "Footwear", href: "/category/footwear" },
    ],
  },
  {
    id: "kidswear",
    name: "Kidswear",
    href: "/category/kidswear",
    subcategories: [
      { id: "kids-tops", name: "Kids Tops", href: "/category/kids-tops" },
      { id: "kids-bottoms", name: "Kids Bottoms", href: "/category/kids-bottoms" },
    ],
  },
  {
    id: "wearables",
    name: "Wearables",
    href: "/category/wearables",
    subcategories: [
      { id: "fitness-trackers", name: "Fitness Trackers", href: "/category/fitness-trackers" },
      { id: "smart-jewelry", name: "Smart Jewelry", href: "/category/smart-jewelry" },
    ],
  },
]

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/categories/menu`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json(
        {
          result: true,
          categories: fallbackCategories,
          status: 200,
        },
        { status: 200 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        result: true,
        categories: fallbackCategories,
        status: 200,
      },
      { status: 200 }
    )
  }
}
