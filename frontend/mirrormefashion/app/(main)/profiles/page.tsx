"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import FeaturedProfiles from "@/components/featured-profiles"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, Filter, X } from "lucide-react"
import type { UserProfile } from "@/lib/api/types"

const mockProfiles: UserProfile[] = [
  {
    id: "1",
    name: "Zahed Dtef",
    username: "zaheddtef",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Fashion enthusiast & style creator. Sharing my journey and latest finds!",
    followers: 12345,
    following: 567,
    posts: 234,
    isFollowing: false,
    isVerified: true,
    location: "New York, NY",
    website: "https://zahed-fashion.com",
    joinedDate: "January 2023",
    gender: "Male",
    bodyShape: "Athletic",
    stylePreferences: ["Streetwear", "Minimalist", "Casual"],
  },
  {
    id: "2",
    name: "Jane Doe",
    username: "janedoe",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Lover of vintage fashion and sustainable style. Join me on my eco-friendly journey!",
    followers: 8765,
    following: 321,
    posts: 150,
    isFollowing: true,
    isVerified: false,
    location: "Los Angeles, CA",
    website: "https://janedoe-vintage.com",
    joinedDate: "March 2022",
    gender: "Female",
    bodyShape: "Hourglass",
    stylePreferences: ["Vintage", "Bohemian", "Elegant"],
  },
  {
    id: "3",
    name: "Alex Smith",
    username: "alex_style",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Curating modern and chic looks for every occasion. Fashion is my passion!",
    followers: 2500,
    following: 150,
    posts: 80,
    isFollowing: false,
    isVerified: false,
    location: "London, UK",
    website: "https://alexsmithstyle.com",
    joinedDate: "July 2023",
    gender: "Male",
    bodyShape: "Lean",
    stylePreferences: ["Chic", "Modern", "Formal"],
  },
  {
    id: "4",
    name: "Sarah Lee",
    username: "sarah_fashion",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Exploring the world of fashion, one outfit at a time. Sustainable choices, stylish life.",
    followers: 5000,
    following: 200,
    posts: 120,
    isFollowing: true,
    isVerified: true,
    location: "Paris, France",
    website: "https://sarahleefashion.com",
    joinedDate: "November 2021",
    gender: "Female",
    bodyShape: "Pear",
    stylePreferences: ["Sustainable", "Minimalist", "Bohemian"],
  },
  {
    id: "5",
    name: "Mike Johnson",
    username: "mike_threads",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Streetwear enthusiast and sneakerhead. Sharing my latest pickups and style tips.",
    followers: 7000,
    following: 400,
    posts: 90,
    isFollowing: false,
    isVerified: false,
    location: "Tokyo, Japan",
    website: "https://mikethreads.com",
    joinedDate: "April 2023",
    gender: "Male",
    bodyShape: "Muscular",
    stylePreferences: ["Streetwear", "Sporty", "Urban"],
  },
]

export default function ProfilesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState("all")
  const [bodyShapeFilter, setBodyShapeFilter] = useState("all")
  const [stylePreferenceFilter, setStylePreferenceFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("default")
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      let tempProfiles = [...mockProfiles]

      // Filter by search term (name or username)
      if (searchTerm) {
        tempProfiles = tempProfiles.filter(
          (profile) =>
            profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            profile.username.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Filter by gender
      if (genderFilter !== "all") {
        tempProfiles = tempProfiles.filter((profile) => profile.gender === genderFilter)
      }

      // Filter by body shape
      if (bodyShapeFilter !== "all") {
        tempProfiles = tempProfiles.filter((profile) => profile.bodyShape === bodyShapeFilter)
      }

      // Filter by style preference
      if (stylePreferenceFilter !== "all") {
        tempProfiles = tempProfiles.filter((profile) => profile.stylePreferences.includes(stylePreferenceFilter))
      }

      // Sort profiles
      if (sortOrder === "followers-desc") {
        tempProfiles.sort((a, b) => b.followers - a.followers)
      } else if (sortOrder === "posts-desc") {
        tempProfiles.sort((a, b) => b.posts - a.posts)
      } else if (sortOrder === "name-asc") {
        tempProfiles.sort((a, b) => a.name.localeCompare(b.name))
      }

      setFilteredProfiles(tempProfiles)
      setLoading(false)
    }, 500) // Simulate network delay
    return () => clearTimeout(timer)
  }, [searchTerm, genderFilter, bodyShapeFilter, stylePreferenceFilter, sortOrder])

  const handleClearFilters = () => {
    setSearchTerm("")
    setGenderFilter("all")
    setBodyShapeFilter("all")
    setStylePreferenceFilter("all")
    setSortOrder("default")
  }

  const allGenders = Array.from(new Set(mockProfiles.map((p) => p.gender)))
  const allBodyShapes = Array.from(new Set(mockProfiles.map((p) => p.bodyShape)))
  const allStylePreferences = Array.from(new Set(mockProfiles.flatMap((p) => p.stylePreferences)))

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary-700">Discover Profiles</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md border border-primary-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-primary-700">Filters</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearFilters}
              className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Clear Filters</span>
            </Button>
          </div>

          <div className="mb-6">
            <Label htmlFor="search-profiles" className="mb-2 block text-lg font-medium text-primary-700">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 h-5 w-5" />
              <Input
                id="search-profiles"
                placeholder="Search profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-primary-200 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="gender-select" className="mb-2 block text-lg font-medium text-primary-700">
              Gender
            </Label>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger
                id="gender-select"
                className="border-primary-200 focus:border-primary-500 focus:ring-primary-500"
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                {allGenders.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <Label htmlFor="body-shape-select" className="mb-2 block text-lg font-medium text-primary-700">
              Body Shape
            </Label>
            <Select value={bodyShapeFilter} onValueChange={setBodyShapeFilter}>
              <SelectTrigger
                id="body-shape-select"
                className="border-primary-200 focus:border-primary-500 focus:ring-primary-500"
              >
                <SelectValue placeholder="Select body shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Body Shapes</SelectItem>
                {allBodyShapes.map((shape) => (
                  <SelectItem key={shape} value={shape}>
                    {shape}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <Label htmlFor="style-preference-select" className="mb-2 block text-lg font-medium text-primary-700">
              Style Preference
            </Label>
            <Select value={stylePreferenceFilter} onValueChange={setStylePreferenceFilter}>
              <SelectTrigger
                id="style-preference-select"
                className="border-primary-200 focus:border-primary-500 focus:ring-primary-500"
              >
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                {allStylePreferences.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <Label htmlFor="sort-order" className="mb-2 block text-lg font-medium text-primary-700">
              Sort By
            </Label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger
                id="sort-order"
                className="border-primary-200 focus:border-primary-500 focus:ring-primary-500"
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="followers-desc">Most Followers</SelectItem>
                <SelectItem value="posts-desc">Most Posts</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse border border-primary-100"
                >
                  <div className="flex flex-col items-center p-6">
                    <Skeleton className="w-24 h-24 rounded-full mb-4 bg-primary-100" />
                    <Skeleton className="h-6 w-3/4 mb-2 bg-primary-100" />
                    <Skeleton className="h-4 w-1/2 mb-4 bg-primary-100" />
                    <Skeleton className="h-10 w-full bg-primary-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProfiles.length > 0 ? (
            <FeaturedProfiles profiles={filteredProfiles} />
          ) : (
            <div className="text-center py-12">
              <Filter className="mx-auto h-12 w-12 text-primary-400 mb-4" />
              <h3 className="text-xl font-semibold text-primary-700 mb-2">No profiles found</h3>
              <p className="text-primary-500">Try adjusting your filters or search term.</p>
              <Button onClick={handleClearFilters} className="mt-4 bg-primary-600 hover:bg-primary-700 text-white">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
