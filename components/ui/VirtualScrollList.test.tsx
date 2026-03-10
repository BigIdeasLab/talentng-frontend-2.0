import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  VirtualScrollList, 
  VirtualApplicantList, 
  VirtualOpportunityList,
  VirtualNotificationList,
  type ApplicantListItem,
  type OpportunityListItem,
  type NotificationListItem
} from './VirtualScrollList';

// Mock react-window
vi.mock('react-window', () => ({
  FixedSizeList: ({ children, itemCount, itemData }: any) => (
    <div data-testid="virtual-list">
      {Array.from({ length: Math.min(itemCount, 5) }, (_, index) =>
        children({ index, style: {}, data: itemData })
      )}
    </div>
  ),
  VariableSizeList: ({ children, itemCount, itemData }: any) => (
    <div data-testid="virtual-list-variable">
      {Array.from({ length: Math.min(itemCount, 5) }, (_, index) =>
        children({ index, style: {}, data: itemData })
      )}
    </div>
  ),
}));

// Mock react-window-infinite-loader
vi.mock('react-window-infinite-loader', () => ({
  default: ({ children }: any) => children({ onItemsRendered: vi.fn(), ref: vi.fn() }),
}));

// Mock useIsMobile hook
vi.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => true,
}));

describe('VirtualScrollList', () => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
  ];

  const mockRenderItem = ({ index, data }: { index: number; data: any[] }) => (
    <div key={data[index].id} data-testid={`item-${index}`}>
      {data[index].name}
    </div>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders virtual list with items', () => {
    render(
      <VirtualScrollList
        items={mockItems}
        height={300}
        renderItem={mockRenderItem}
      />
    );

    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders with custom item height', () => {
    render(
      <VirtualScrollList
        items={mockItems}
        height={300}
        itemHeight={80}
        renderItem={mockRenderItem}
      />
    );

    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
  });

  it('renders with variable size list', () => {
    const getItemHeight = (index: number) => 60 + (index * 10);
    
    render(
      <VirtualScrollList
        items={mockItems}
        height={300}
        variableSize={true}
        getItemHeight={getItemHeight}
        renderItem={mockRenderItem}
      />
    );

    expect(screen.getByTestId('virtual-list-variable')).toBeInTheDocument();
  });

  it('handles infinite loading', () => {
    const loadMoreItems = vi.fn().mockResolvedValue(undefined);
    
    render(
      <VirtualScrollList
        items={mockItems}
        height={300}
        renderItem={mockRenderItem}
        loadMoreItems={loadMoreItems}
        hasNextPage={true}
      />
    );

    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
  });
});

describe('VirtualApplicantList', () => {
  const mockApplicants: ApplicantListItem[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'pending',
      appliedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'approved',
      appliedAt: '2024-01-02T00:00:00Z',
      avatar: 'https://example.com/avatar.jpg',
    },
  ];

  it('renders applicant list', () => {
    const onApplicantClick = vi.fn();
    
    render(
      <VirtualApplicantList
        applicants={mockApplicants}
        height={300}
        onApplicantClick={onApplicantClick}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('handles applicant click', () => {
    const onApplicantClick = vi.fn();
    
    render(
      <VirtualApplicantList
        applicants={mockApplicants}
        height={300}
        onApplicantClick={onApplicantClick}
      />
    );

    fireEvent.click(screen.getByText('John Doe'));
    expect(onApplicantClick).toHaveBeenCalledWith(mockApplicants[0]);
  });

  it('displays status badges correctly', () => {
    const onApplicantClick = vi.fn();
    
    render(
      <VirtualApplicantList
        applicants={mockApplicants}
        height={300}
        onApplicantClick={onApplicantClick}
      />
    );

    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('approved')).toBeInTheDocument();
  });
});

describe('VirtualOpportunityList', () => {
  const mockOpportunities: OpportunityListItem[] = [
    {
      id: '1',
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
      type: 'Full-time',
      postedAt: '2024-01-01T00:00:00Z',
      salary: '$80,000 - $120,000',
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'Startup Inc',
      location: 'New York',
      type: 'Contract',
      postedAt: '2024-01-02T00:00:00Z',
    },
  ];

  it('renders opportunity list', () => {
    const onOpportunityClick = vi.fn();
    
    render(
      <VirtualOpportunityList
        opportunities={mockOpportunities}
        height={300}
        onOpportunityClick={onOpportunityClick}
      />
    );

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('handles opportunity click', () => {
    const onOpportunityClick = vi.fn();
    
    render(
      <VirtualOpportunityList
        opportunities={mockOpportunities}
        height={300}
        onOpportunityClick={onOpportunityClick}
      />
    );

    fireEvent.click(screen.getByText('Software Engineer'));
    expect(onOpportunityClick).toHaveBeenCalledWith(mockOpportunities[0]);
  });

  it('displays salary when available', () => {
    const onOpportunityClick = vi.fn();
    
    render(
      <VirtualOpportunityList
        opportunities={mockOpportunities}
        height={300}
        onOpportunityClick={onOpportunityClick}
      />
    );

    expect(screen.getByText('$80,000 - $120,000')).toBeInTheDocument();
  });
});

describe('VirtualNotificationList', () => {
  const mockNotifications: NotificationListItem[] = [
    {
      id: '1',
      title: 'New Application',
      message: 'You have a new application for Software Engineer position',
      type: 'info',
      createdAt: '2024-01-01T00:00:00Z',
      read: false,
    },
    {
      id: '2',
      title: 'Interview Scheduled',
      message: 'Your interview has been scheduled for tomorrow',
      type: 'success',
      createdAt: '2024-01-02T00:00:00Z',
      read: true,
    },
  ];

  it('renders notification list', () => {
    const onNotificationClick = vi.fn();
    
    render(
      <VirtualNotificationList
        notifications={mockNotifications}
        height={300}
        onNotificationClick={onNotificationClick}
      />
    );

    expect(screen.getByText('New Application')).toBeInTheDocument();
    expect(screen.getByText('Interview Scheduled')).toBeInTheDocument();
  });

  it('handles notification click', () => {
    const onNotificationClick = vi.fn();
    
    render(
      <VirtualNotificationList
        notifications={mockNotifications}
        height={300}
        onNotificationClick={onNotificationClick}
      />
    );

    fireEvent.click(screen.getByText('New Application'));
    expect(onNotificationClick).toHaveBeenCalledWith(mockNotifications[0]);
  });

  it('displays notification types correctly', () => {
    const onNotificationClick = vi.fn();
    
    render(
      <VirtualNotificationList
        notifications={mockNotifications}
        height={300}
        onNotificationClick={onNotificationClick}
      />
    );

    expect(screen.getByText('info')).toBeInTheDocument();
    expect(screen.getByText('success')).toBeInTheDocument();
  });

  it('shows unread indicator for unread notifications', () => {
    const onNotificationClick = vi.fn();
    
    const { container } = render(
      <VirtualNotificationList
        notifications={mockNotifications}
        height={300}
        onNotificationClick={onNotificationClick}
      />
    );

    // Check for unread styling (blue background)
    const unreadNotification = container.querySelector('.bg-blue-50');
    expect(unreadNotification).toBeInTheDocument();
  });
});