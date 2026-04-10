import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExampleUsage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-primary-900">Custom Primary Colors Demo</h1>

      {/* Background colors */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-primary-50 p-4 rounded-lg text-center">
          <p className="text-primary-900 font-medium">primary-50</p>
        </div>
        <div className="bg-primary-100 p-4 rounded-lg text-center">
          <p className="text-primary-900 font-medium">primary-100</p>
        </div>
        <div className="bg-primary-200 p-4 rounded-lg text-center">
          <p className="text-primary-900 font-medium">primary-200</p>
        </div>
        <div className="bg-primary-300 p-4 rounded-lg text-center">
          <p className="text-white font-medium">primary-300</p>
        </div>
        <div className="bg-primary-400 p-4 rounded-lg text-center">
          <p className="text-white font-medium">primary-400</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="bg-primary-500 p-4 rounded-lg text-center">
          <p className="text-white font-medium">primary-500</p>
        </div>
        <div className="bg-primary-600 p-4 rounded-lg text-center">
          <p className="text-white font-medium">primary-600</p>
        </div>
        <div className="bg-primary-700 p-4 rounded-lg text-center">
          <p className="text-white font-medium">primary-700</p>
        </div>
        <div className="bg-primary-800 p-4 rounded-lg text-center">
          <p className="text-white font-medium">primary-800</p>
        </div>
        <div className="bg-primary-900 p-4 rounded-lg text-center">
          <p className="text-white font-medium">primary-900</p>
        </div>
      </div>

      {/* Buttons with custom primary colors */}
      <div className="flex flex-wrap gap-4">
        <Button className="bg-primary-500 hover:bg-primary-600 text-white">Primary 500 Button</Button>
        <Button className="bg-primary-700 hover:bg-primary-800 text-white">Primary 700 Button</Button>
        <Button className="bg-primary-900 hover:bg-primary-800 text-white">Primary 900 Button</Button>
        <Button variant="outline" className="border-primary-500 text-primary-700 hover:bg-primary-50 bg-transparent">
          Outline Primary
        </Button>
      </div>

      {/* Cards with primary colors */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary-200">
          <CardHeader className="bg-primary-50">
            <CardTitle className="text-primary-800">Light Primary Card</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-primary-600">This card uses light primary colors for a subtle appearance.</p>
          </CardContent>
        </Card>

        <Card className="border-primary-600 bg-primary-900">
          <CardHeader>
            <CardTitle className="text-primary-50">Dark Primary Card</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-primary-100">This card uses dark primary colors for a bold appearance.</p>
          </CardContent>
        </Card>
      </div>

      {/* Text colors */}
      <div className="space-y-2">
        <p className="text-primary-500 text-lg">Text in primary-500</p>
        <p className="text-primary-700 text-lg">Text in primary-700</p>
        <p className="text-primary-900 text-lg font-bold">Bold text in primary-900</p>
      </div>

      {/* Border examples */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border-2 border-primary-300 p-4 rounded-lg">
          <p className="text-primary-700">Border primary-300</p>
        </div>
        <div className="border-2 border-primary-600 p-4 rounded-lg">
          <p className="text-primary-800">Border primary-600</p>
        </div>
        <div className="border-2 border-primary-900 p-4 rounded-lg">
          <p className="text-primary-900">Border primary-900</p>
        </div>
      </div>

      {/* Existing Tailwind colors still work */}
      <div className="mt-8 p-4 bg-blue-100 border border-blue-300 rounded-lg">
        <h3 className="text-blue-800 font-bold mb-2">Existing Colors Still Work</h3>
        <p className="text-blue-700">
          All existing Tailwind colors like <span className="text-red-600 font-semibold">red</span>,
          <span className="text-blue-600 font-semibold"> blue</span>,
          <span className="text-green-600 font-semibold"> green</span>, etc. remain unchanged.
        </p>
        <div className="flex gap-2 mt-3">
          <Button className="bg-blue-500 hover:bg-blue-600">Blue Button</Button>
          <Button className="bg-green-500 hover:bg-green-600">Green Button</Button>
          <Button className="bg-red-500 hover:bg-red-600">Red Button</Button>
        </div>
      </div>
    </div>
  )
}
