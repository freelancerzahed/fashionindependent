"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Tag,
  TrendingUp,
  Package,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const categories = [
  {
    id: "1",
    name: "Dresses",
    slug: "dresses",
    description: "Elegant dresses for all occasions",
    productCount: 156,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-15",
    subcategories: ["Casual Dresses", "Evening Dresses", "Maxi Dresses"],
  },
  {
    id: "2",
    name: "Tops",
    slug: "tops",
    description: "Stylish tops and blouses",
    productCount: 234,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-14",
    subcategories: ["T-Shirts", "Blouses", "Tank Tops"],
  },
  {
    id: "3",
    name: "Bottoms",
    slug: "bottoms",
    description: "Pants, jeans, and skirts",
    productCount: 189,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-13",
    subcategories: ["Jeans", "Pants", "Skirts", "Shorts"],
  },
  {
    id: "4",
    name: "Outerwear",
    slug: "outerwear",
    description: "Jackets, coats, and cardigans",
    productCount: 87,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-12",
    subcategories: ["Jackets", "Coats", "Cardigans"],
  },
  {
    id: "5",
    name: "Accessories",
    slug: "accessories",
    description: "Bags, jewelry, and more",
    productCount: 145,
    status: "inactive",
    image: "/placeholder.svg?height=60&width=60",
    createdAt: "2024-01-11",
    subcategories: ["Bags", "Jewelry", "Scarves", "Belts"],
  },
]

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
      case "inactive":
        return (
          <Badge variant="secondary" className="text-xs">
            Inactive
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        )
    }
  }

  const statsCards = [
    { title: "Total Categories", value: "24", icon: Tag, color: "bg-primary-500" },
    { title: "Active Categories", value: "21", icon: Tag, color: "bg-green-500" },
    { title: "Total Products", value: "1,234", icon: Package, color: "bg-primary-600" },
    { title: "Avg Products/Category", value: "51", icon: TrendingUp, color: "bg-primary-700" },
  ]

  const nextStats = () => {
    setCurrentStatsIndex((prev) => (prev + 1) % statsCards.length)
  }

  const prevStats = () => {
    setCurrentStatsIndex((prev) => (prev - 1 + statsCards.length) % statsCards.length)
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden px-1">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold truncate">Categories</h1>
          <p className="text-sm text-gray-600 truncate">{filteredCategories.length} categories</p>
        </div>
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full flex-shrink-0 ml-2 bg-primary-600 hover:bg-primary-700">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto mx-2">
            <DialogHeader>
              <DialogTitle className="text-base">Add New Category</DialogTitle>
            </DialogHeader>
            <AddCategoryForm onClose={() => setIsAddCategoryOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-600">Organize your products into categories</p>
        </div>
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <AddCategoryForm onClose={() => setIsAddCategoryOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Stats Slider */}
      <div className="md:hidden px-1">
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {(() => {
                  const IconComponent = statsCards[currentStatsIndex].icon
                  return <IconComponent className="w-6 h-6 flex-shrink-0" />
                })()}
                <span className="text-sm font-medium opacity-90 truncate">{statsCards[currentStatsIndex].title}</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevStats}
                  className="text-white hover:bg-white/20 p-1 h-8 w-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextStats}
                  className="text-white hover:bg-white/20 p-1 h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-3xl font-bold mb-2">{statsCards[currentStatsIndex].value}</div>
          </div>

          <div className="flex justify-center mt-4 gap-2">
            {statsCards.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStatsIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Stats Cards */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-8 h-8 ${stat.color} rounded-full flex items-center justify-center`}>
                  {(() => {
                    const IconComponent = stat.icon
                    return <IconComponent className="w-4 h-4 text-white" />
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="mx-1 md:mx-0">
        <CardContent className="p-3 md:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Display */}
      <Card className="mx-1 md:mx-0">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-sm md:text-base">Categories ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          {/* Mobile View */}
          <div className="md:hidden">
            {filteredCategories.map((category) => (
              <div key={category.id} className="border-b p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm truncate">{category.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{category.description}</p>
                    <p className="text-xs font-mono text-gray-500 mt-1">{category.slug}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="rounded-full flex-shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Products
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1">
                    {getStatusBadge(category.status)}
                    <Badge variant="outline" className="text-xs">
                      {category.productCount} products
                    </Badge>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">{new Date(category.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {category.subcategories.slice(0, 2).map((sub, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {sub}
                    </Badge>
                  ))}
                  {category.subcategories.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{category.subcategories.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-gray-400" />
                        {category.productCount}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(category.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories.slice(0, 2).map((sub, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {sub}
                          </Badge>
                        ))}
                        {category.subcategories.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.subcategories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Products
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AddCategoryForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="categoryName">Category Name</Label>
          <Input id="categoryName" placeholder="Enter category name" className="rounded-xl" />
        </div>
        <div>
          <Label htmlFor="categorySlug">Slug</Label>
          <Input id="categorySlug" placeholder="category-slug" className="rounded-xl" />
        </div>
      </div>

      <div>
        <Label htmlFor="categoryDescription">Description</Label>
        <Textarea id="categoryDescription" placeholder="Enter category description" rows={3} className="rounded-xl" />
      </div>

      <div>
        <Label htmlFor="subcategories">Subcategories</Label>
        <Input id="subcategories" placeholder="Enter subcategories separated by commas" className="rounded-xl" />
        <p className="text-sm text-gray-500 mt-1">Example: T-Shirts, Blouses, Tank Tops</p>
      </div>

      <div>
        <Label>Category Image</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <Tag className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Drop image here or click to upload</p>
          <Button variant="outline" size="sm" className="mt-2 rounded-xl bg-transparent">
            Choose File
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="active" defaultChecked />
        <Label htmlFor="active">Category is active</Label>
      </div>

      <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose} className="w-full md:w-auto rounded-xl bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="w-full md:w-auto rounded-xl bg-primary-600 hover:bg-primary-700">
          Add Category
        </Button>
      </div>
    </form>
  )
}
