/**
 * Virtual scrolling component optimized for mobile performance.
 * Uses react-window to render only visible items, improving performance for large lists.
 */

import React, { useMemo, useCallback } from 'react';
// @ts-ignore - react-window types may not be fully compatible
import { FixedSizeList, VariableSizeList } from 'react-window';
// @ts-ignore
import InfiniteLoader from 'react-window-infinite-loader';
import { useIsMobile } from '@/hooks/useIsMobile';

interface VirtualScrollListProps<T> {
  /**
   * Array of items to render
   */
  items: T[];
  /**
   * Height of each item in pixels (for fixed size list)
   */
  itemHeight?: number;
  /**
   * Function to get height of each item (for variable size list)
   */
  getItemHeight?: (index: number) => number;
  /**
   * Total height of the list container
   */
  height: number;
  /**
   * Width of the list container
   */
  width?: number | string;
  /**
   * Render function for each item
   */
  renderItem: (props: { index: number; style: React.CSSProperties; data: T[] }) => React.ReactElement;
  /**
   * Function to load more items (for infinite scrolling)
   */
  loadMoreItems?: (startIndex: number, stopIndex: number) => Promise<void>;
  /**
   * Whether there are more items to load
   */
  hasNextPage?: boolean;
  /**
   * Whether items are currently being loaded
   */
  isNextPageLoading?: boolean;
  /**
   * Number of items to render outside of the visible area
   */
  overscanCount?: number;
  /**
   * CSS class name for the list container
   */
  className?: string;
  /**
   * Whether to use variable size list (default: false)
   */
  variableSize?: boolean;
}

/**
 * Virtual scrolling list component with mobile optimizations
 */
export function VirtualScrollList<T>({
  items,
  itemHeight = 60,
  getItemHeight,
  height,
  width = '100%',
  renderItem,
  loadMoreItems,
  hasNextPage = false,
  isNextPageLoading = false,
  overscanCount,
  className,
  variableSize = false,
}: VirtualScrollListProps<T>) {
  const isMobile = useIsMobile();
  
  // Optimize overscan count for mobile devices
  const optimizedOverscanCount = useMemo(() => {
    if (overscanCount !== undefined) return overscanCount;
    return isMobile ? 3 : 5; // Fewer items on mobile to save memory
  }, [overscanCount, isMobile]);

  // Memoize the item count for infinite loading
  const itemCount = useMemo(() => {
    return hasNextPage ? items.length + 1 : items.length;
  }, [items.length, hasNextPage]);

  // Check if an item is loaded
  const isItemLoaded = useCallback((index: number) => {
    return !!items[index];
  }, [items]);

  // Render item with loading state
  const renderItemWithLoading = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      if (index >= items.length) {
        // Loading item
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
            <span className="ml-2 text-sm text-gray-600">Loading...</span>
          </div>
        );
      }

      return renderItem({ index, style, data: items });
    },
    [items, renderItem]
  );

  // For infinite scrolling
  if (loadMoreItems) {
    const InfiniteList = variableSize ? VariableSizeList : FixedSizeList;
    
    return (
      <div className={className}>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }: { onItemsRendered: any; ref: any }) => (
            <InfiniteList
              ref={ref}
              height={height}
              width={width}
              itemCount={itemCount}
              itemSize={variableSize ? getItemHeight! : itemHeight}
              itemData={items}
              onItemsRendered={onItemsRendered}
              overscanCount={optimizedOverscanCount}
            >
              {renderItemWithLoading}
            </InfiniteList>
          )}
        </InfiniteLoader>
      </div>
    );
  }

  // Regular virtual list
  const ListComponent = variableSize ? VariableSizeList : FixedSizeList;
  
  return (
    <div className={className}>
      <ListComponent
        height={height}
        width={width}
        itemCount={items.length}
        itemSize={variableSize ? getItemHeight! : itemHeight}
        itemData={items}
        overscanCount={optimizedOverscanCount}
      >
        {renderItem}
      </ListComponent>
    </div>
  );
}

/**
 * Mobile-optimized virtual list for applicants
 */
export interface ApplicantListItem {
  id: string;
  name: string;
  email: string;
  status: string;
  appliedAt: string;
  avatar?: string;
}

interface VirtualApplicantListProps {
  applicants: ApplicantListItem[];
  height: number;
  onApplicantClick: (applicant: ApplicantListItem) => void;
  loadMoreApplicants?: (startIndex: number, stopIndex: number) => Promise<void>;
  hasNextPage?: boolean;
  isLoading?: boolean;
}

export const VirtualApplicantList: React.FC<VirtualApplicantListProps> = ({
  applicants,
  height,
  onApplicantClick,
  loadMoreApplicants,
  hasNextPage,
  isLoading,
}) => {
  const renderApplicant = useCallback(
    ({ index, style, data }: { index: number; style: React.CSSProperties; data: ApplicantListItem[] }) => {
      const applicant = data[index];
      
      return (
        <div
          style={style}
          className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
          onClick={() => onApplicantClick(applicant)}
        >
          <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {applicant.avatar ? (
              <img
                src={applicant.avatar}
                alt={applicant.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {applicant.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {applicant.name}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {applicant.email}
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              applicant.status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800'
                : applicant.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {applicant.status}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(applicant.appliedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      );
    },
    [onApplicantClick]
  );

  return (
    <VirtualScrollList
      items={applicants}
      itemHeight={80}
      height={height}
      renderItem={renderApplicant}
      loadMoreItems={loadMoreApplicants}
      hasNextPage={hasNextPage}
      isNextPageLoading={isLoading}
      className="border border-gray-200 rounded-lg"
    />
  );
};

/**
 * Mobile-optimized virtual list for opportunities
 */
export interface OpportunityListItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
  salary?: string;
}

interface VirtualOpportunityListProps {
  opportunities: OpportunityListItem[];
  height: number;
  onOpportunityClick: (opportunity: OpportunityListItem) => void;
  loadMoreOpportunities?: (startIndex: number, stopIndex: number) => Promise<void>;
  hasNextPage?: boolean;
  isLoading?: boolean;
}

export const VirtualOpportunityList: React.FC<VirtualOpportunityListProps> = ({
  opportunities,
  height,
  onOpportunityClick,
  loadMoreOpportunities,
  hasNextPage,
  isLoading,
}) => {
  const renderOpportunity = useCallback(
    ({ index, style, data }: { index: number; style: React.CSSProperties; data: OpportunityListItem[] }) => {
      const opportunity = data[index];
      
      return (
        <div
          style={style}
          className="flex flex-col p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
          onClick={() => onOpportunityClick(opportunity)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {opportunity.title}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {opportunity.company}
              </p>
            </div>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {opportunity.type}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>{opportunity.location}</span>
            <span>{new Date(opportunity.postedAt).toLocaleDateString()}</span>
          </div>
          {opportunity.salary && (
            <div className="mt-1 text-sm font-medium text-green-600">
              {opportunity.salary}
            </div>
          )}
        </div>
      );
    },
    [onOpportunityClick]
  );

  return (
    <VirtualScrollList
      items={opportunities}
      itemHeight={100}
      height={height}
      renderItem={renderOpportunity}
      loadMoreItems={loadMoreOpportunities}
      hasNextPage={hasNextPage}
      isNextPageLoading={isLoading}
      className="border border-gray-200 rounded-lg"
    />
  );
};

/**
 * Mobile-optimized virtual list for notifications
 */
export interface NotificationListItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

interface VirtualNotificationListProps {
  notifications: NotificationListItem[];
  height: number;
  onNotificationClick: (notification: NotificationListItem) => void;
  loadMoreNotifications?: (startIndex: number, stopIndex: number) => Promise<void>;
  hasNextPage?: boolean;
  isLoading?: boolean;
}

export const VirtualNotificationList: React.FC<VirtualNotificationListProps> = ({
  notifications,
  height,
  onNotificationClick,
  loadMoreNotifications,
  hasNextPage,
  isLoading,
}) => {
  const renderNotification = useCallback(
    ({ index, style, data }: { index: number; style: React.CSSProperties; data: NotificationListItem[] }) => {
      const notification = data[index];
      
      const typeColors = {
        info: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
      };
      
      return (
        <div
          style={style}
          className={`flex items-start p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
            !notification.read ? 'bg-blue-50' : ''
          }`}
          onClick={() => onNotificationClick(notification)}
        >
          <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
            !notification.read ? 'bg-blue-500' : 'bg-gray-300'
          }`} />
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {notification.title}
              </h4>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                typeColors[notification.type]
              }`}>
                {notification.type}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {notification.message}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      );
    },
    [onNotificationClick]
  );

  return (
    <VirtualScrollList
      items={notifications}
      itemHeight={90}
      height={height}
      renderItem={renderNotification}
      loadMoreItems={loadMoreNotifications}
      hasNextPage={hasNextPage}
      isNextPageLoading={isLoading}
      className="border border-gray-200 rounded-lg"
    />
  );
};