import { Breadcrumbs } from "@/components/Breadcrumbs/Breadcrumbs";
import { DFDABreadcrumbs } from "@/components/Breadcrumbs/DFDABreadcrumbs";

export default function BlueprintHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DFDABreadcrumbs dynamicValues={{}}/>
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            A Blueprint for a World Without Disease
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-12">
            From Vision to Action: Creating Incentives to Cure and Prevent, Not Prolong Illness
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg">
            <p className="text-gray-700 mb-8">
              Current healthcare systems treat diseases instead of eradicating them. We spend billions on drugs 
              that mask symptoms. We wait decades for effective treatments. We rely on outdated approval processes. 
              It doesn't have to be this way.
            </p>

            {/* Steps */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-6">Our Simple Plan:</h2>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold mr-4">1</span>
                  <span>Define what a disease-free world looks like</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold mr-4">2</span>
                  <span>Create a roadmap to achieve it</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold mr-4">3</span>
                  <span>Let the world vote</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold mr-4">4</span>
                  <span>Pass a law that rewards prevention and cures</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold mr-4">5</span>
                  <span>Implement a system that ends unnecessary suffering</span>
                </li>
              </ol>
            </div>

            {/* Call to Action */}
            <div className="bg-blue-50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Take Action Now</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Learn the Plan
                </button>
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                  Get Involved
                </button>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  Push for Change
                </button>
              </div>
              <p className="mt-4 text-gray-600 text-center">
                Help push the world toward a future without preventable disease
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
