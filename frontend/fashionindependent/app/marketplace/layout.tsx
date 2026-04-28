"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Plus, HelpCircle, ArrowLeft } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function MarketplaceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Generate breadcrumbs
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs = [
    { label: 'marketplace', href: '/marketplace' },
    ...(pathSegments.length === 1 ? [{ label: 'home', href: '/marketplace' }] : pathSegments.slice(1).map((segment, index) => ({
      label: segment === 'hiring-and-jobs' ? 'hiring & jobs' : segment.replace('-', ' '),
      href: '/' + pathSegments.slice(0, index + 2).join('/')
    })))
  ]

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">The Fashion Independent</h1>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Marketplace</h1>
            <p className="text-xl text-neutral-700 mb-8">
              Classified listings for all things fashion. Buy, Sell, and Discover.
            </p>
            <Link href="/marketplace" className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-900">
              Shop the Fashion Marketplace
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto">
            <div className="flex gap-6">
              <div className="w-1/5 pr-6">
                {/* Section 1: Create a post link */}
                <div className="mb-6">
                  <Link href="/marketplace/create-post" className="flex items-center gap-2 text-black hover:text-blue-700">
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Create a post</span>
                  </Link>
                </div>

                {/* Section 2: Dropdowns with top border */}
                <div className="border-t pt-6 mb-6">
                  <h4 className="font-semibold mb-4">General</h4>
                  <div className="space-y-4">
                    {/* Clothing Dropdown */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Clothing</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select clothing type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="womens">Women's clothing</SelectItem>
                          <SelectItem value="mens">Men's clothing</SelectItem>
                          <SelectItem value="luxury">Luxury fashion</SelectItem>
                          <SelectItem value="activewear">Activewear / athleisure</SelectItem>
                          <SelectItem value="swimwear">Swimwear</SelectItem>
                          <SelectItem value="outerwear">Outerwear</SelectItem>
                          <SelectItem value="overwear">Overwear</SelectItem>
                          <SelectItem value="formalwear">Formalwear</SelectItem>
                          <SelectItem value="bridalwear">Bridalwear</SelectItem>
                          <SelectItem value="maternity">Maternity wear</SelectItem>
                          <SelectItem value="kidswear">Kidswear</SelectItem>
                          <SelectItem value="petwear">Petswear / pet fashion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Accessories Dropdown */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Accessories</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select accessory type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jewelry">Jewelry</SelectItem>
                          <SelectItem value="watches">Watches</SelectItem>
                          <SelectItem value="sunglasses">Sunglasses</SelectItem>
                          <SelectItem value="hats">Hats / caps</SelectItem>
                          <SelectItem value="scarves">Scarves</SelectItem>
                          <SelectItem value="belts">Belts</SelectItem>
                          <SelectItem value="gloves">Gloves</SelectItem>
                          <SelectItem value="hair">Hair accessories</SelectItem>
                          <SelectItem value="wallets">Wallets</SelectItem>
                          <SelectItem value="ties">Ties / pocket squares</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Bags & Carry Dropdown */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Bags & Carry</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select bag type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="handbags">Handbags</SelectItem>
                          <SelectItem value="tote">Tote bags</SelectItem>
                          <SelectItem value="crossbody">Crossbody bags</SelectItem>
                          <SelectItem value="clutches">Clutches</SelectItem>
                          <SelectItem value="purse">Purse wallets</SelectItem>
                          <SelectItem value="luggage">Luggage</SelectItem>
                          <SelectItem value="duffel">Duffel bags</SelectItem>
                          <SelectItem value="backpacks">Backpacks</SelectItem>
                          <SelectItem value="garment">Garment bags</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Footwear Dropdown */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Footwear</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select footwear type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sneakers">Sneakers</SelectItem>
                          <SelectItem value="boots">Boots</SelectItem>
                          <SelectItem value="heels">Heels</SelectItem>
                          <SelectItem value="flats">Flats</SelectItem>
                          <SelectItem value="sandals">Sandals</SelectItem>
                          <SelectItem value="slippers">Slippers</SelectItem>
                          <SelectItem value="luxury">Luxury shoes</SelectItem>
                          <SelectItem value="dress">Dress shoes</SelectItem>
                          <SelectItem value="performance">Performance footwear</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Vintage */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Vintage Fashion</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select vintage type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vintage-clothing">Clothing</SelectItem>
                          <SelectItem value="vintage-handbags">Handbags</SelectItem>
                          <SelectItem value="vintage-outerwear">Costs & Jackets</SelectItem>
                          <SelectItem value="vintage-shoes">Shoes</SelectItem>
                          <SelectItem value="vintage-artwork">Artwork</SelectItem>
                          <SelectItem value="vintage-furniture">Furniture</SelectItem>
                          <SelectItem value="collectibles">Collectibles</SelectItem>
                          <SelectItem value="vintage-luxury">Luxury/Designer</SelectItem>
                          <SelectItem value="vintage-toys">Vintage Toys</SelectItem>
                          <SelectItem value="vintage-accessories">Vintage Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Home Decor */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Home Décor</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select home décor item" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sofas-chairs">Sofas / Chairs</SelectItem>
                          <SelectItem value="tables-desks">Tables / Desks</SelectItem>
                          <SelectItem value="bookshelves-stands">Bookshelves / Stands</SelectItem>
                          <SelectItem value="dressers">Dressers</SelectItem>
                          <SelectItem value="lamps-lighting">Lamps / Lighting</SelectItem>
                          <SelectItem value="bed-sets">Bed sets</SelectItem>
                          <SelectItem value="wardrobes-armoires">Wardrobes / Armoires</SelectItem>
                          <SelectItem value="rugs-carpets">Rugs / Carpets</SelectItem>
                          <SelectItem value="outdoor-furniture">Outdoor Furniture</SelectItem>
                          <SelectItem value="artwork-decorative">Artwork / Decorative</SelectItem>
                          <SelectItem value="curtains">Curtains</SelectItem>
                          <SelectItem value="mirrors">Mirrors</SelectItem>
                          <SelectItem value="storage">Storage</SelectItem>
                          <SelectItem value="kitchenwear">Kitchenwear</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Beauty */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Beauty</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select beauty item" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cosmetics">Cosmetics</SelectItem>
                          <SelectItem value="skincare">Skincare</SelectItem>
                          <SelectItem value="fragrance">Fragrance</SelectItem>
                          <SelectItem value="hair-products">Hair products</SelectItem>
                          <SelectItem value="nail-products">Nail products</SelectItem>
                          <SelectItem value="grooming-kits">Grooming kits</SelectItem>
                          <SelectItem value="beauty-tools">Beauty tools</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Wearables */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Wearables/Fashion Tech</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select wearable type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wearable-watches">Watches</SelectItem>
                          <SelectItem value="wearable-bags">Bags</SelectItem>
                          <SelectItem value="wearable-clothes">Clothes</SelectItem>
                          <SelectItem value="wearable-sportswear">Sportswear</SelectItem>
                          <SelectItem value="wearable-shoes">Footwear</SelectItem>
                          <SelectItem value="wearable-other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={() => router.push('/marketplace/general')}
                        className="w-1/2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:underline hover:text-neutral-100"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>



                {/* Section 3: Equipment & Supplies */}
                <div className="border-t pt-6 mb-6">
                  <h4 className="font-semibold mb-4">Fashion Equipment</h4>
                  <div className="space-y-4">
                    {/* Equipment/Tools Dropdown */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Equipment/Tools</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select equipment/tools" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sewing-machines">Sewing machines</SelectItem>
                          <SelectItem value="dress-forms">Dress forms / mannequins</SelectItem>
                          <SelectItem value="fashion-tools">Fashion tools</SelectItem>
                          <SelectItem value="pattern-tools">Pattern-making tools</SelectItem>
                          <SelectItem value="tshirt-printing">T-shirt printing</SelectItem>
                          <SelectItem value="embroidery">Embroidery machines</SelectItem>
                          <SelectItem value="fabric-rolls">Fabric rolls</SelectItem>
                          <SelectItem value="sewing-supplies">Sewing supplies</SelectItem>
                          <SelectItem value="industrial">Industrial equipment</SelectItem>
                          <SelectItem value="photography">Photography</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Materials & Supplies Dropdown */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Materials & Supplies</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select materials/supplies" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fabrics">Fabrics</SelectItem>
                          <SelectItem value="leather">Leather</SelectItem>
                          <SelectItem value="denim">Denim</SelectItem>
                          <SelectItem value="sustainable">Sustainable textiles</SelectItem>
                          <SelectItem value="buttons">Buttons</SelectItem>
                          <SelectItem value="zippers">Zippers</SelectItem>
                          <SelectItem value="thread">Thread</SelectItem>
                          <SelectItem value="labels">Labels / tags</SelectItem>
                          <SelectItem value="packaging">Packaging supplies</SelectItem>
                          <SelectItem value="patterns">Patterns</SelectItem>
                          <SelectItem value="trims">Trims / embellishments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => router.push('/marketplace/fashion-equipment')}
                      className="w-1/2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:underline hover:text-neutral-100"
                    >
                      Submit
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6 mb-6">
                  <h4 className="font-semibold mb-6">Fashion Services</h4>
                  <div className="space-y-4">
                    {/* Fashion Services Dropdown */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Fashion Services</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a fashion service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alterations">Alterations</SelectItem>
                          <SelectItem value="custom-design">Custom design commissions</SelectItem>
                          <SelectItem value="styling">Fashion Styling</SelectItem>
                          <SelectItem value="personal-shopping">Personal shopping</SelectItem>
                          <SelectItem value="photography">Fashion Photography</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="pattern-making">Pattern Making</SelectItem>
                          <SelectItem value="tech-pack">Tech pack development</SelectItem>
                          <SelectItem value="brand-consulting">Brand consulting</SelectItem>
                          <SelectItem value="general-consulting">General consulting</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Repair Service Dropdown */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Repair Service</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a repair service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shoe-repair">Shoe repair</SelectItem>
                          <SelectItem value="tailoring">Tailoring</SelectItem>
                          <SelectItem value="dry-cleaning">Dry cleaning</SelectItem>
                          <SelectItem value="stain-removal">Stain removal</SelectItem>
                          <SelectItem value="watch-repair">Watch repair</SelectItem>
                          <SelectItem value="jewelry-repair">Jewelry repair</SelectItem>
                          <SelectItem value="garment-restoration">Luxury garment restoration</SelectItem>
                          <SelectItem value="zippers-closures">Zippers/Closures</SelectItem>
                          <SelectItem value="other-repair">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Education/Courses Dropdown */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Education/Courses</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patternmaking">Patternmaking & Pattern Cutting</SelectItem>
                          <SelectItem value="garment-construction">Garment Construction / Sewing</SelectItem>
                          <SelectItem value="textile-science">Textile Science & Fabric Selection</SelectItem>
                          <SelectItem value="illustration">Fashion Illustration</SelectItem>
                          <SelectItem value="technical-design">Technical Design & Tech Pack Development</SelectItem>
                          <SelectItem value="cad">CAD / Digital Fashion Design</SelectItem>
                          <SelectItem value="merchandising">Fashion Merchandising</SelectItem>
                          <SelectItem value="business-management">Fashion Business Management</SelectItem>
                          <SelectItem value="sustainable-fashion">Sustainable Fashion & Ethical Production</SelectItem>
                          <SelectItem value="fashion-styling">Fashion Styling</SelectItem>
                          <SelectItem value="personal-styling">Personal Styling & Image Consulting</SelectItem>
                          <SelectItem value="fashion-photography">Fashion Photography</SelectItem>
                          <SelectItem value="journalism">Fashion Journalism & Editorial</SelectItem>
                          <SelectItem value="costume-design">Costume Design</SelectItem>
                          <SelectItem value="accessory-design">Accessory Design</SelectItem>
                          <SelectItem value="footwear-design">Footwear Design</SelectItem>
                          <SelectItem value="jewelry-design">Jewelry Design</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 pt-3">
                      <button className="w-full rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-black transition hover:underline hover:decoration-black hover:underline-offset-2 hover:bg-neutral-100">
                        Rental Spaces
                      </button>
                      <button className="w-full rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-black transition hover:underline hover:decoration-black hover:underline-offset-2 hover:bg-neutral-100">
                        Flea Markets
                      </button>
                      <button className="w-full rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-black transition hover:underline hover:decoration-black hover:underline-offset-2 hover:bg-neutral-100">
                        Digital Creatives
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => router.push('/marketplace/fashion-services')}
                      className="w-1/2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:underline hover:text-neutral-100"
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <div className="border-t pt-6 mb-6">
                  <h4 className="font-semibold mb-4">Hiring & Jobs</h4>
                  <div className="space-y-3">
                    <Link href="/find-job" className="block w-full rounded-md border border-black bg-white px-4 py-2 text-center text-sm font-medium text-black transition hover:underline hover:decoration-black hover:underline-offset-2 hover:bg-neutral-100">
                      Find a Job
                    </Link>
                    <Link href="/hire-professional" className="block w-full rounded-md border border-black bg-white px-4 py-2 text-center text-sm font-medium text-black transition hover:underline hover:decoration-black hover:underline-offset-2 hover:bg-neutral-100">
                      Hire a Professional
                    </Link>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => router.push('/marketplace/hiring-and-jobs')}
                      className="w-1/2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:underline hover:text-neutral-100"
                    >
                      Submit
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6 mb-6">
                  <h4 className="font-semibold mb-4">Free Stuff</h4>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium mb-2">Free Stuff</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select free stuff category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="footwear">Footwear</SelectItem>
                        <SelectItem value="vintage">Vintage</SelectItem>
                        <SelectItem value="wearables">Wearables</SelectItem>
                        <SelectItem value="home-decor">Home Décor</SelectItem>
                        <SelectItem value="garden">Garden</SelectItem>
                        <SelectItem value="beauty">Beauty</SelectItem>
                        <SelectItem value="tech">Tech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => router.push('/marketplace/free-stuff')}
                      className="w-1/2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:underline hover:text-neutral-100"
                    >
                      Submit
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6 mb-6">
                  <h4 className="font-semibold mb-4">Community</h4>
                  <div className="space-y-3">
                    <button className="w-full rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-black transition hover:underline hover:decoration-black hover:underline-offset-2 hover:bg-neutral-100">
                      Events
                    </button>
                    <button className="w-full rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-black transition hover:underline hover:decoration-black hover:underline-offset-2 hover:bg-neutral-100">
                      Virtual Events
                    </button>
                    <button className="w-full rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-black transition hover:underline hover:decoration-black hover:underline-offset-2 hover:bg-neutral-100">
                      Free Courses
                    </button>
                    <button className="w-full rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-black transition hover:underline hover:decoration-black hover:underline-offset-2 hover:bg-neutral-100">
                      Resumes
                    </button>
                    <button className="w-full rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-black transition hover:underline hover:decoration-black hover:underline-offset-2 hover:bg-neutral-100">
                      Business Cards
                    </button>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => router.push('/marketplace/community')}
                      className="w-1/2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:underline hover:text-neutral-100"
                    >
                      Submit
                    </button>
                  </div>
                </div>

                {/* Section 8: Need Help link */}
                <div className="border-t pt-6 text-right">
                  <Link href="/marketplace/help" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                    <HelpCircle className="h-5 w-5" />
                    <span>Need Help?</span>
                  </Link>
                </div>
              </div>

              <div className="w-4/5 space-y-6">
                <div className="sticky top-0 z-20 bg-white border-b border-neutral-200 pb-4 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <nav className="flex items-center space-x-2 text-sm">
                      {breadcrumbs.map((crumb, index) => (
                        <span key={crumb.href} className="flex items-center">
                          {index > 0 && <span className="mx-2 text-gray-400">&gt;</span>}
                          <Link href={crumb.href} className="text-blue-600 hover:text-blue-800 capitalize">
                            {crumb.label}
                          </Link>
                        </span>
                      ))}
                    </nav>
                    <button
                      onClick={() => router.back()}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  </div>
                  <div className="mx-auto w-full py-6 flex gap-8">
                    <div className="w-1/2 flex items-center gap-2">
                      <label className="text-base font-semibold whitespace-nowrap">Choose your city</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new-york">New York</SelectItem>
                          <SelectItem value="los-angeles">Los Angeles</SelectItem>
                          <SelectItem value="chicago">Chicago</SelectItem>
                          <SelectItem value="houston">Houston</SelectItem>
                          <SelectItem value="phoenix">Phoenix</SelectItem>
                          <SelectItem value="philadelphia">Philadelphia</SelectItem>
                          <SelectItem value="san-antonio">San Antonio</SelectItem>
                          <SelectItem value="san-diego">San Diego</SelectItem>
                          <SelectItem value="dallas">Dallas</SelectItem>
                          <SelectItem value="san-jose">San Jose</SelectItem>
                          <SelectItem value="austin">Austin</SelectItem>
                          <SelectItem value="jacksonville">Jacksonville</SelectItem>
                          <SelectItem value="fort-worth">Fort Worth</SelectItem>
                          <SelectItem value="columbus">Columbus</SelectItem>
                          <SelectItem value="charlotte">Charlotte</SelectItem>
                          <SelectItem value="san-francisco">San Francisco</SelectItem>
                          <SelectItem value="indianapolis">Indianapolis</SelectItem>
                          <SelectItem value="seattle">Seattle</SelectItem>
                          <SelectItem value="denver">Denver</SelectItem>
                          <SelectItem value="washington-dc">Washington D.C.</SelectItem>
                          <SelectItem value="boston">Boston</SelectItem>
                          <SelectItem value="nashville">Nashville</SelectItem>
                          <SelectItem value="el-paso">El Paso</SelectItem>
                          <SelectItem value="detroit">Detroit</SelectItem>
                          <SelectItem value="oklahoma-city">Oklahoma City</SelectItem>
                          <SelectItem value="portland">Portland</SelectItem>
                          <SelectItem value="las-vegas">Las Vegas</SelectItem>
                          <SelectItem value="memphis">Memphis</SelectItem>
                          <SelectItem value="louisville">Louisville</SelectItem>
                          <SelectItem value="baltimore">Baltimore</SelectItem>
                          <SelectItem value="milwaukee">Milwaukee</SelectItem>
                          <SelectItem value="albuquerque">Albuquerque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-1/2 flex items-center gap-2">
                      <label className="text-base font-semibold whitespace-nowrap">Choose your neighborhood</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select neighborhood" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bronx">Bronx</SelectItem>
                          <SelectItem value="brooklyn">Brooklyn</SelectItem>
                          <SelectItem value="manhattan">Manhattan</SelectItem>
                          <SelectItem value="nassau">Nassau</SelectItem>
                          <SelectItem value="queens">Queens</SelectItem>
                          <SelectItem value="staten-island">Staten Island</SelectItem>
                          <SelectItem value="suffolk">Suffolk</SelectItem>
                          <SelectItem value="westchester">Westchester</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>{children}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
