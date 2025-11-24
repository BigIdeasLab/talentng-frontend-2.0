import { Button } from "@/components/ui/button";

export default function HelpSupport() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium text-black mb-2">Help & Support</h2>
        <p className="text-gray-500">
          Get help with your account and platform usage
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-6 border border-gray-200 rounded-2xl">
          <h3 className="text-lg font-medium text-black mb-2">
            Contact Support
          </h3>
          <p className="text-gray-600 mb-4">
            Need help? Our support team is here to assist you with any questions
            or issues.
          </p>
          <Button className="rounded-xl bg-black text-white hover:bg-gray-800">
            Contact Support
          </Button>
        </div>

        <div className="p-6 border border-gray-200 rounded-2xl">
          <h3 className="text-lg font-medium text-black mb-2">Documentation</h3>
          <p className="text-gray-600 mb-4">
            Browse our comprehensive documentation to learn how to make the most
            of the platform.
          </p>
          <Button variant="outline" className="rounded-xl border-gray-200">
            View Documentation
          </Button>
        </div>
      </div>
    </div>
  );
}