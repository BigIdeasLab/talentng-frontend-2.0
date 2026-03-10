import React, { useState, useCallback } from 'react';
import { 
  VirtualScrollList, 
  VirtualApplicantList, 
  VirtualOpportunityList,
  VirtualNotificationList,
  type ApplicantListItem,
  type OpportunityListItem,
  type NotificationListItem
} from './VirtualScrollList';

export default function VirtualScrollListExample() {
  // Generate sample data
  const generateApplicants = (count: number): ApplicantListItem[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `applicant-${i}`,
      name: `Applicant ${i + 1}`,
      email: `applicant${i + 1}@example.com`,
      status: ['pending', 'approved', 'rejected'][i % 3] as any,
      appliedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      avatar: i % 3 === 0 ? `https://picsum.photos/40/40?random=${i}` : undefined,
    }));
  };

  const generateOpportunities = (count: number): OpportunityListItem[] => {
    const titles = ['Software Engineer', 'Product Manager', 'Designer', 'Data Scientist', 'DevOps Engineer'];
    const companies = ['Tech Corp', 'Startup Inc', 'Big Company', 'Innovation Labs', 'Digital Agency'];
    const locations = ['Remote', 'New York', 'San Francisco', 'London', 'Berlin'];
    const types = ['Full-time', 'Part-time', 'Contract', 'Internship'];

    return Array.from({ length: count }, (_, i) => ({
      id: `opportunity-${i}`,
      title: titles[i % titles.length],
      company: companies[i % companies.length],
      location: locations[i % locations.length],
      type: types[i % types.length],
      postedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      salary: i % 2 === 0 ? `$${60000 + i * 1000} - $${80000 + i * 1000}` : undefined,
    }));
  };

  const generateNotifications = (count: number): NotificationListItem[] => {
    const types: ('info' | 'success' | 'warning' | 'error')[] = ['info', 'success', 'warning', 'error'];
    const titles = ['New Application', 'Interview Scheduled', 'Profile Updated', 'Payment Processed', 'System Alert'];
    const messages = [
      'You have a new application for the Software Engineer position',
      'Your interview has been scheduled for tomorrow at 2 PM',
      'Your profile information has been successfully updated',
      'Your payment of $99 has been processed successfully',
      'System maintenance is scheduled for tonight',
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: `notification-${i}`,
      title: titles[i % titles.length],
      message: messages[i % messages.length],
      type: types[i % types.length],
      createdAt: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      read: i % 3 !== 0,
    }));
  };

  const [applicants] = useState(() => generateApplicants(1000));
  const [opportunities] = useState(() => generateOpportunities(500));
  const [notifications] = useState(() => generateNotifications(200));

  const handleApplicantClick = useCallback((applicant: ApplicantListItem) => {
    console.log('Clicked applicant:', applicant);
  }, []);

  const handleOpportunityClick = useCallback((opportunity: OpportunityListItem) => {
    console.log('Clicked opportunity:', opportunity);
  }, []);

  const handleNotificationClick = useCallback((notification: NotificationListItem) => {
    console.log('Clicked notification:', notification);
  }, []);

  // Custom render function for basic virtual list
  const renderCustomItem = useCallback(
    ({ index, style, data }: { index: number; style: React.CSSProperties; data: any[] }) => (
      <div
        style={style}
        className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50"
      >
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {index + 1}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            Custom Item {index + 1}
          </p>
          <p className="text-sm text-gray-500">
            This is a custom rendered item with index {index}
          </p>
        </div>
      </div>
    ),
    []
  );

  const customItems = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }));

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Virtual Scroll List Examples
        </h1>
        <p className="text-gray-600 mb-8">
          These examples demonstrate virtual scrolling for improved performance with large lists on mobile devices.
          Only visible items are rendered, significantly reducing memory usage and improving scroll performance.
        </p>
      </div>

      {/* Basic Virtual List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Virtual List (100 items)
        </h2>
        <div className="border border-gray-200 rounded-lg">
          <VirtualScrollList
            items={customItems}
            height={300}
            itemHeight={72}
            renderItem={renderCustomItem}
            className="w-full"
          />
        </div>
      </div>

      {/* Virtual Applicant List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Virtual Applicant List (1,000 applicants)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Click on any applicant to see the interaction. Notice how smooth the scrolling is even with 1,000 items.
        </p>
        <VirtualApplicantList
          applicants={applicants}
          height={400}
          onApplicantClick={handleApplicantClick}
        />
      </div>

      {/* Virtual Opportunity List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Virtual Opportunity List (500 opportunities)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Each opportunity shows different information including salary when available.
        </p>
        <VirtualOpportunityList
          opportunities={opportunities}
          height={400}
          onOpportunityClick={handleOpportunityClick}
        />
      </div>

      {/* Virtual Notification List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Virtual Notification List (200 notifications)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Notifications show different types and read/unread states. Unread notifications have a blue background.
        </p>
        <VirtualNotificationList
          notifications={notifications}
          height={400}
          onNotificationClick={handleNotificationClick}
        />
      </div>

      {/* Performance Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          Performance Benefits
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Only visible items are rendered in the DOM</li>
          <li>• Smooth scrolling performance regardless of list size</li>
          <li>• Reduced memory usage on mobile devices</li>
          <li>• Optimized overscan count for mobile (3 items vs 5 on desktop)</li>
          <li>• Support for infinite loading with react-window-infinite-loader</li>
        </ul>
      </div>

      {/* Mobile Optimizations */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-green-900 mb-2">
          Mobile Optimizations
        </h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Reduced overscan count on mobile devices to save memory</li>
          <li>• Touch-friendly item heights (minimum 44px tap targets)</li>
          <li>• Optimized for touch scrolling and interactions</li>
          <li>• Responsive design that adapts to screen size</li>
          <li>• Efficient rendering for low-end mobile devices</li>
        </ul>
      </div>
    </div>
  );
}