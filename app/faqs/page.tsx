import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQsPage() {
  return (
    <main className="flex-1">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
            <h1 className="text-2xl font-bold mb-8">Members' FAQs</h1>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is The Fashion Independent?</AccordionTrigger>
                <AccordionContent>
                  The Fashion Independent is a crowdsourcing platform (not to be confused with crowdfunding) connecting you with 
                  independent designers. Browse, vote (+give feedback to), support, and shop exclusive fashion from emerging independent 
                  designers.  
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How do I shop your store?</AccordionTrigger>
                <AccordionContent>
                  The Fashion Independent is not a traditional online store. Items featured as Limited Drops are available for purchase. 
                  Products in Active Campaigns are open for voting and feedback only. Be sure to vote for the items you love. Successful 
                  campaigns are the ones that make it into our store as Limited Drops. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What is a Limited Drop? </AccordionTrigger> 
                <AccordionContent>
                  A Limited Drop is a product that successfully met its vote goal and earned its place in our store. These items are 
                  available at a steep discount for a limited time, usually 30 to 60 days, before they’re gone. Check Days Remaining 
                  to see how much time is left before the product is no longer available in our store. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Can I donate to an Active Campaign?</AccordionTrigger>
                <AccordionContent>
                  Yes! Your support helps designers bring their ideas to life. Just keep in mind that donations are separate from 
                  purchases and do not count toward owning the item. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>When will I receive the item I bought?</AccordionTrigger>
                <AccordionContent>
                  Designers with existing inventory typically ship items within 1–5 days. Final delivery time varies depending on 
                  your location. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>What happens if a campaign does not reach its goal?</AccordionTrigger>
                <AccordionContent>
                  If a campaign does not reach its goal within the initial timeframe, it will be extended for an additional 5 days 
                  until it reaches 30 days. The product will not be sold in our store if the campaign is still unsuccessful after 
                  30 days. Designers may choose to sell the item elsewhere. You may check the designer’s profile for external links 
                  to purchase the item.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>Is the platform sustainable?</AccordionTrigger>
                <AccordionContent>
                  The Fashion Independent is committed to sustainability by promoting quality, well-constructed pieces designed to 
                  last. For this reason, we strictly prohibit the sale of fast fashion on our platform. As we continue to grow, we 
                  plan to introduce more eco-friendly options. In the meantime, we invite you to be part of the movement by upcycling 
                  and recycling your unwanted fashion. 
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <h1 className="text-2xl font-bold mb-8 mt-6">Designers' FAQs</h1>               
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is The Fashion Independent?</AccordionTrigger>
                <AccordionContent>
                  The Fashion Independent is a crowdsourcing platform (not to be confused with crowdfunding) connecting independent 
                  designers with fashion shoppers. Our browse, vote (+give feedback to), support, and shop system allows you to engage 
                  with our members, get their votes and feedback, and then sell to them as a Limited Drop.  
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>What is a campaign?</AccordionTrigger>
                <AccordionContent>
                  A campaign is a voting system that allows members to Vote Up (like) and provide feedback on a product over a set period, 
                  typically 7–30 days. The insights gathered during this time can help you build support and refine your design. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How do I start a campaign? </AccordionTrigger>
                <AccordionContent>
                  Click the Launch a Campaign button from the topmost section of thefashionindependent.com and follow the instructions.  
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>What is a Limited Drop?  </AccordionTrigger>
                <AccordionContent>
                  A Limited Drop is a product that has successfully met its vote goal and earned its place in our store. To encourage 
                  strong member participation, you will be required to offer these products at a discounted price. Each Limited Drop 
                  runs for a limited time, usually 30 to 60 days. After this period, the product will no longer be available on our 
                  site but we will provide a link to your external store. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Do I need a tech pack to launch a campaign?  </AccordionTrigger>
                <AccordionContent>
                  Designers with existing inventory and an established manufacturer are not required to submit a tech pack. Designers 
                  who need manufacturing services must purchase a tech pack from us if they do not already have one. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Can I run multiple campaigns at once?  </AccordionTrigger>
                <AccordionContent>
                  Yes. You can run up to three campaigns at once. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>When can I withdraw funds?</AccordionTrigger>
                <AccordionContent>
                  Once your campaign closes and is verified, it moves to Limited Drop store where it becomes available for immediate sale. 
                  Payments are released every Monday at 8:00 AM EST. Orders placed after 11:59 AM are paid out the following week. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>How are funds distributed?  </AccordionTrigger>
                <AccordionContent>
                  Funds are transferred to the bank account provided by you within your account settings. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger>How long does verification take? </AccordionTrigger>
                <AccordionContent>
                  Verification takes 5–10 business days following the close of a successful campaign. To help expedite the process, 
                  please ensure that all required documentation is uploaded as outlined in your dashboard. The Fashion Independent 
                  verifies the identity and readiness of each creative to protect our members from fraud. You will be required to submit 
                  personal identification and business information to sell on our site.  
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger>What forms of ID are accepted? </AccordionTrigger>
                <AccordionContent>
                  Acceptable forms of identification include government-issued photo IDs such as a valid passport, driver’s license, 
                  or state identification card. All IDs must be current, clearly legible, and display the individual’s full name, 
                  photograph, and date of birth. Expired, altered, or unofficial forms of identification are not accepted. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-11">
                <AccordionTrigger>Do I need a business license or EIN?</AccordionTrigger>
                <AccordionContent>
                  You do not need an EIN or business registration number to Launch a Campaign. However, designers without a registered 
                  business must provide their Social Security number and a government-issued photo ID for verification and tax reporting 
                  purposes. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-12">
                <AccordionTrigger>Are there fees for using the platform?</AccordionTrigger>
                <AccordionContent>
                  Yes. The Fashion Independent collects a fee for service as outlined in the Collaboration Agreement. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-13">
                <AccordionTrigger>Can international creatives use the platform?  </AccordionTrigger>
                <AccordionContent>
                  Yes. International fashion designers are welcome. 
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  )
}
