import { TouchFriendlyTooltip } from "./TouchFriendlyTooltip";
import { Info, HelpCircle, Settings } from "lucide-react";

export default function TouchFriendlyTooltipExample() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Touch-Friendly Tooltip Examples</h2>
        <p className="text-gray-600 mb-6">
          These tooltips adapt to the device type:
        </p>
        <ul className="text-sm text-gray-600 mb-8 space-y-1">
          <li>• <strong>Desktop/Hover devices:</strong> Show on hover, hide on mouse leave</li>
          <li>• <strong>Touch devices:</strong> Show on tap, hide on tap again or after delay</li>
          <li>• <strong>Touch devices:</strong> Touch and hold shows tooltip, releases after 2 seconds</li>
        </ul>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Basic Tooltip</h3>
          <div className="flex items-center gap-4">
            <TouchFriendlyTooltip content="This is a helpful tooltip that explains the feature">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Info className="w-4 h-4" />
                Hover or tap for info
              </button>
            </TouchFriendlyTooltip>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Icon with Tooltip</h3>
          <div className="flex items-center gap-4">
            <TouchFriendlyTooltip content="Click to open settings panel">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </TouchFriendlyTooltip>

            <TouchFriendlyTooltip content="Get help with this feature">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
            </TouchFriendlyTooltip>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Text with Tooltip</h3>
          <div className="max-w-md">
            <p className="text-gray-700">
              This feature includes{" "}
              <TouchFriendlyTooltip content="Advanced analytics provide detailed insights into user behavior and performance metrics">
                <span className="text-blue-600 underline cursor-pointer">
                  advanced analytics
                </span>
              </TouchFriendlyTooltip>
              {" "}that help you understand your users better.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Form Field with Tooltip</h3>
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <TouchFriendlyTooltip content="We'll use this email to send you important updates and notifications">
                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
              </TouchFriendlyTooltip>
            </div>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Multiple Tooltips</h3>
          <div className="flex flex-wrap gap-3">
            {["Feature A", "Feature B", "Feature C", "Feature D"].map((feature, index) => (
              <TouchFriendlyTooltip
                key={feature}
                content={`${feature} provides powerful capabilities for your workflow`}
              >
                <div className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                  {feature}
                </div>
              </TouchFriendlyTooltip>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Implementation Notes</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Tooltips automatically detect touch vs hover devices</li>
          <li>• Touch targets are automatically sized to 44x44px minimum</li>
          <li>• Tooltips include proper ARIA labels for accessibility</li>
          <li>• Touch tooltips auto-hide after 2 seconds or on outside tap</li>
          <li>• Hover tooltips show/hide immediately for better UX</li>
        </ul>
      </div>
    </div>
  );
}