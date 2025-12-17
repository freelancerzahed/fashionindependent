import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQsPage() {
  return (
    <main className="flex-1">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
            <h1 className="text-2xl font-bold mb-8">Backers FAQs</h1>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is The Fashion Independent?</AccordionTrigger>
                <AccordionContent>
                  The Fashion Independent is a crowdfunding platform designed specifically for independent fashion
                  designers. We help talented designers bring their creative visions to life by connecting them with
                  backers who appreciate unique, finely crafted fashion.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How does the crowdfunding process work?</AccordionTrigger>
                <AccordionContent>
                  Designers launch campaigns with a funding goal and timeline (typically 30 days). Backers pledge money
                  to support campaigns they love. If a campaign reaches its minimum pledge requirement (10 backers),
                  it's successful and the designer receives the funds to produce the items.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What happens if a campaign doesn't reach its goal?</AccordionTrigger>
                <AccordionContent>
                  If a campaign doesn't receive at least 10 pledges (excluding luxury/handmade items), backers are not
                  charged and the campaign is not funded. This ensures designers only move forward when there's
                  sufficient interest.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How long does delivery take?</AccordionTrigger>
                <AccordionContent>
                  Standard campaigns have 60 days to deliver after successful funding. Designers using our manufacturing
                  services typically deliver within 7-30 days. Luxury/handmade items have up to 90 days for delivery.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>What is the ShapeMe Body Modeler?</AccordionTrigger>
                <AccordionContent>
                  ShapeMe Body Modeler is our beta feature that creates a 3D representation of your body shape for
                  automatic sizing. This helps ensure better-fitting garments and reduces returns. It's completely
                  optional and your data is kept private.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Can I cancel my pledge?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can cancel your pledge at any time before the campaign ends. Once a campaign successfully
                  ends and payment processing begins, pledges cannot be cancelled.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>What are the fees for designers?</AccordionTrigger>
                <AccordionContent>
                  We charge a service fee on successfully funded campaigns. This covers payment processing, platform
                  maintenance, and designer support. Detailed fee information is available in our Partnership Agreement.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>Is the platform sustainable?</AccordionTrigger>
                <AccordionContent>
                  Yes! We're committed to sustainable fashion. Our manufacturing facility uses eco-friendly fabrics,
                  minimizes waste, and operates efficiently. Unlike fast fashion, we focus on quality, well-constructed
                  items made to last.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <h1 className="text-2xl font-bold mb-8 mt-6">Creators FAQs</h1>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is The Fashion Independent?</AccordionTrigger>
                <AccordionContent>
                  The Fashion Independent is a crowdfunding platform designed specifically for independent fashion
                  designers. We help talented designers bring their creative visions to life by connecting them with
                  backers who appreciate unique, finely crafted fashion.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How does the crowdfunding process work?</AccordionTrigger>
                <AccordionContent>
                  Designers launch campaigns with a funding goal and timeline (typically 30 days). Backers pledge money
                  to support campaigns they love. If a campaign reaches its minimum pledge requirement (10 backers),
                  it's successful and the designer receives the funds to produce the items.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What happens if a campaign doesn't reach its goal?</AccordionTrigger>
                <AccordionContent>
                  If a campaign doesn't receive at least 10 pledges (excluding luxury/handmade items), backers are not
                  charged and the campaign is not funded. This ensures designers only move forward when there's
                  sufficient interest.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How long does delivery take?</AccordionTrigger>
                <AccordionContent>
                  Standard campaigns have 60 days to deliver after successful funding. Designers using our manufacturing
                  services typically deliver within 7-30 days. Luxury/handmade items have up to 90 days for delivery.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>What is the ShapeMe Body Modeler?</AccordionTrigger>
                <AccordionContent>
                  ShapeMe Body Modeler is our beta feature that creates a 3D representation of your body shape for
                  automatic sizing. This helps ensure better-fitting garments and reduces returns. It's completely
                  optional and your data is kept private.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Can I cancel my pledge?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can cancel your pledge at any time before the campaign ends. Once a campaign successfully
                  ends and payment processing begins, pledges cannot be cancelled.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>What are the fees for designers?</AccordionTrigger>
                <AccordionContent>
                  We charge a service fee on successfully funded campaigns. This covers payment processing, platform
                  maintenance, and designer support. Detailed fee information is available in our Partnership Agreement.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>Is the platform sustainable?</AccordionTrigger>
                <AccordionContent>
                  Yes! We're committed to sustainable fashion. Our manufacturing facility uses eco-friendly fabrics,
                  minimizes waste, and operates efficiently. Unlike fast fashion, we focus on quality, well-constructed
                  items made to last.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  )
}
