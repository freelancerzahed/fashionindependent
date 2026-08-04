import { BodyModeler } from "@/components/body-modeler"

export default function BodyModelPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">ShapeMe Body Modeler</h1>
            <p className="text-lg text-muted-foreground">
              Create your 3D body model to get accurate sizing recommendations for fashion items
            </p>
          </div>

          <BodyModeler />

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Accurate Sizing</h3>
              <p className="text-sm text-muted-foreground">
                Get personalized sizing recommendations based on your body measurements
              </p>
            </div>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Save Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Your measurements are saved to your profile for future reference
              </p>
            </div>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Better Fit</h3>
              <p className="text-sm text-muted-foreground">
                Designers can use your model to ensure their products fit perfectly
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
