# Responsive Component Examples

This document provides practical examples of how to implement responsive behavior using the application's responsive components and patterns.

## Table of Contents

1. [Navigation Examples](#navigation-examples)
2. [Data Display Examples](#data-display-examples)
3. [Form Examples](#form-examples)
4. [Modal Examples](#modal-examples)
5. [Layout Examples](#layout-examples)

## Navigation Examples

### Mobile-First Navigation

```typescript
// components/layouts/AppLayout.tsx
import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MobileDrawer } from "@/components/navigation/MobileDrawer";
import { HamburgerMenuButton } from "@/components/navigation/HamburgerMenuButton";
import { DesktopSidebar } from "@/components/layouts/sidebars/DesktopSidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between lg:hidden">
          <HamburgerMenuButton
            isOpen={mobileNavOpen}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          />
          <div className="flex items-center space-x-2">
            <NotificationBell />
            <ProfileAvatar />
          </div>
        </header>
      )}

      {/* Desktop Sidebar */}
      <DesktopSidebar className="hidden lg:flex" />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      >
        <NavigationItems onItemClick={() => setMobileNavOpen(false)} />
        <div className="mt-auto">
          <ProfileSwitcher />
        </div>
      </MobileDrawer>

      {/* Main Content */}
      <main className={`
        ${isMobile ? 'pt-0' : 'lg:ml-64'}
        min-h-screen
      `}>
        {children}
      </main>
    </div>
  );
}
```

### Responsive Navigation Items

```typescript
// components/navigation/NavigationItems.tsx
import { useRouter } from "next/router";
import { useIsMobile } from "@/hooks/useIsMobile";

interface NavigationItemsProps {
  onItemClick?: () => void;
}

export function NavigationItems({ onItemClick }: NavigationItemsProps) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleNavigation = (href: string) => {
    router.push(href);
    onItemClick?.(); // Close mobile drawer
  };

  return (
    <nav className="space-y-1">
      <NavItem
        href="/dashboard"
        icon={HomeIcon}
        active={router.pathname === "/dashboard"}
        onClick={() => handleNavigation("/dashboard")}
        className={isMobile ? "min-h-[44px]" : ""}
      >
        Dashboard
      </NavItem>

      <NavItem
        href="/opportunities"
        icon={BriefcaseIcon}
        active={router.pathname.startsWith("/opportunities")}
        onClick={() => handleNavigation("/opportunities")}
        className={isMobile ? "min-h-[44px]" : ""}
      >
        Opportunities
        {/* Show badge on mobile */}
        {isMobile && <Badge count={5} />}
      </NavItem>

      <NavItem
        href="/applicants"
        icon={UsersIcon}
        active={router.pathname.startsWith("/applicants")}
        onClick={() => handleNavigation("/applicants")}
        className={isMobile ? "min-h-[44px]" : ""}
      >
        Applicants
      </NavItem>
    </nav>
  );
}
```

## Data Display Examples

### Responsive Data Table

```typescript
// components/opportunities/OpportunitiesTable.tsx
import { ResponsiveTable, ColumnDef } from "@/components/ui/ResponsiveTable";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  budget: string;
  applicants: number;
  status: "active" | "closed" | "draft";
  createdAt: Date;
}

export function OpportunitiesTable() {
  const isMobile = useIsMobile();

  const columns: ColumnDef<Opportunity>[] = [
    {
      key: "title",
      label: "Title",
      essential: true,
      render: (opportunity) => (
        <div>
          <h3 className="font-medium">{opportunity.title}</h3>
          <p className="text-sm text-gray-500">{opportunity.company}</p>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      essential: true,
      accessor: (opportunity) => opportunity.location,
    },
    {
      key: "budget",
      label: "Budget",
      essential: false, // Hidden on tablet
      accessor: (opportunity) => opportunity.budget,
    },
    {
      key: "applicants",
      label: "Applicants",
      essential: true,
      render: (opportunity) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {opportunity.applicants} applicants
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      essential: true,
      render: (opportunity) => (
        <StatusBadge status={opportunity.status} />
      ),
    },
  ];

  const actions = [
    {
      key: "view",
      label: "View Details",
      onClick: (opportunity: Opportunity) => handleView(opportunity.id),
    },
    {
      key: "edit",
      label: "Edit",
      onClick: (opportunity: Opportunity) => handleEdit(opportunity.id),
    },
    {
      key: "delete",
      label: "Delete",
      onClick: (opportunity: Opportunity) => handleDelete(opportunity.id),
      className: "text-red-600",
    },
  ];

  // Custom mobile card renderer
  const mobileCardRenderer = (opportunity: Opportunity) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
          <p className="text-sm text-gray-500">{opportunity.company}</p>
        </div>
        <StatusBadge status={opportunity.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Location:</span>
          <span className="ml-1 text-gray-900">{opportunity.location}</span>
        </div>
        <div>
          <span className="text-gray-500">Budget:</span>
          <span className="ml-1 text-gray-900">{opportunity.budget}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {opportunity.applicants} applicants
        </span>
        <span className="text-sm text-gray-500">
          {formatDate(opportunity.createdAt)}
        </span>
      </div>
    </div>
  );

  return (
    <ResponsiveTable
      data={opportunities}
      columns={columns}
      actions={actions}
      mobileCardRenderer={mobileCardRenderer}
      emptyMessage="No opportunities found"
      loading={isLoading}
    />
  );
}
```

### Responsive Grid Layout

```typescript
// components/talent/TalentGrid.tsx
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export function TalentGrid({ talents }: { talents: Talent[] }) {
  const breakpoint = useBreakpoint();

  // Adjust columns based on content density
  const getColumns = () => {
    switch (breakpoint) {
      case "xs":
      case "sm":
        return 1;
      case "md":
        return 2;
      case "lg":
        return 3;
      case "xl":
      case "2xl":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <ResponsiveGrid columns={getColumns()} gap={6}>
      {talents.map((talent) => (
        <TalentCard
          key={talent.id}
          talent={talent}
          compact={breakpoint === "md"} // Compact view on tablet
        />
      ))}
    </ResponsiveGrid>
  );
}
```

## Form Examples

### Responsive Contact Form

```typescript
// components/forms/ContactForm.tsx
import { ResponsiveFormField } from "@/components/forms/ResponsiveFormField";
import { ResponsiveFormButtons } from "@/components/forms/ResponsiveFormButtons";
import { useIsMobile } from "@/hooks/useIsMobile";

export function ContactForm() {
  const isMobile = useIsMobile();
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Single column on mobile, two columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResponsiveFormField
          label="First Name"
          required
          error={errors.firstName}
        >
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md min-h-[44px] focus:ring-2 focus:ring-blue-500"
            {...register("firstName", { required: "First name is required" })}
          />
        </ResponsiveFormField>

        <ResponsiveFormField
          label="Last Name"
          required
          error={errors.lastName}
        >
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md min-h-[44px] focus:ring-2 focus:ring-blue-500"
            {...register("lastName", { required: "Last name is required" })}
          />
        </ResponsiveFormField>
      </div>

      {/* Full width fields */}
      <ResponsiveFormField
        label="Email Address"
        required
        error={errors.email}
      >
        <input
          type="email"
          className="w-full px-3 py-2 border rounded-md min-h-[44px] focus:ring-2 focus:ring-blue-500"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address"
            }
          })}
        />
      </ResponsiveFormField>

      <ResponsiveFormField
        label="Message"
        required
        error={errors.message}
      >
        <textarea
          rows={isMobile ? 4 : 6}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 resize-vertical"
          {...register("message", { required: "Message is required" })}
        />
      </ResponsiveFormField>

      {/* Responsive button group */}
      <ResponsiveFormButtons>
        <button
          type="button"
          className="btn-secondary min-h-[44px]"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary min-h-[44px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </ResponsiveFormButtons>
    </form>
  );
}
```

### Multi-Step Form

```typescript
// components/forms/MultiStepForm.tsx
import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const isMobile = useIsMobile();
  const totalSteps = 3;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form content */}
      <div className="bg-white rounded-lg border p-6">
        {currentStep === 1 && <BasicInfoStep />}
        {currentStep === 2 && <ExperienceStep />}
        {currentStep === 3 && <ReviewStep />}
      </div>

      {/* Navigation */}
      <div className={`
        mt-6 flex items-center justify-between
        ${isMobile ? 'flex-col space-y-3' : 'flex-row'}
      `}>
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className={`
            btn-secondary min-h-[44px]
            ${isMobile ? 'w-full order-2' : ''}
          `}
        >
          Previous
        </button>

        <div className={`
          flex space-x-2
          ${isMobile ? 'order-1' : ''}
        `}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i + 1)}
              className={`
                w-3 h-3 rounded-full transition-colors
                ${currentStep === i + 1
                  ? 'bg-blue-600'
                  : currentStep > i + 1
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }
              `}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
          disabled={currentStep === totalSteps}
          className={`
            btn-primary min-h-[44px]
            ${isMobile ? 'w-full order-3' : ''}
          `}
        >
          {currentStep === totalSteps ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
}
```

## Modal Examples

### Responsive Filter Modal

```typescript
// components/modals/FilterModal.tsx
import { ResponsiveModal } from "@/components/ui/ResponsiveModal";
import { ResponsiveFormField } from "@/components/forms/ResponsiveFormField";
import { ResponsiveFormButtons } from "@/components/forms/ResponsiveFormButtons";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

export function FilterModal({ isOpen, onClose, onApply, initialFilters }: FilterModalProps) {
  const [filters, setFilters] = useState(initialFilters || {});

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Opportunities"
      description="Narrow down opportunities based on your preferences"
      size="md"
      swipeEnabled={true}
    >
      <div className="space-y-6">
        {/* Location Filter */}
        <ResponsiveFormField label="Location">
          <select
            value={filters.location || ""}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full px-3 py-2 border rounded-md min-h-[44px]"
          >
            <option value="">Any location</option>
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </ResponsiveFormField>

        {/* Budget Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResponsiveFormField label="Min Budget">
            <input
              type="number"
              value={filters.minBudget || ""}
              onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
              className="w-full px-3 py-2 border rounded-md min-h-[44px]"
              placeholder="$0"
            />
          </ResponsiveFormField>

          <ResponsiveFormField label="Max Budget">
            <input
              type="number"
              value={filters.maxBudget || ""}
              onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
              className="w-full px-3 py-2 border rounded-md min-h-[44px]"
              placeholder="No limit"
            />
          </ResponsiveFormField>
        </div>

        {/* Skills */}
        <ResponsiveFormField label="Required Skills">
          <div className="space-y-2">
            {skillOptions.map((skill) => (
              <label key={skill} className="flex items-center min-h-[44px]">
                <input
                  type="checkbox"
                  checked={filters.skills?.includes(skill) || false}
                  onChange={(e) => {
                    const currentSkills = filters.skills || [];
                    const newSkills = e.target.checked
                      ? [...currentSkills, skill]
                      : currentSkills.filter(s => s !== skill);
                    setFilters({ ...filters, skills: newSkills });
                  }}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-sm">{skill}</span>
              </label>
            ))}
          </div>
        </ResponsiveFormField>
      </div>

      {/* Modal Actions */}
      <div className="mt-8">
        <ResponsiveFormButtons>
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary min-h-[44px]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="btn-primary min-h-[44px]"
          >
            Apply Filters
          </button>
        </ResponsiveFormButtons>
      </div>
    </ResponsiveModal>
  );
}
```

## Layout Examples

### Responsive Dashboard Layout

```typescript
// components/dashboard/DashboardLayout.tsx
import { useIsMobile, useIsTablet } from "@/hooks";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            {isMobile ? "Overview" : "Welcome back! Here's what's happening."}
          </p>
        </div>

        {!isMobile && (
          <div className="flex space-x-3">
            <button className="btn-secondary">
              Export Data
            </button>
            <button className="btn-primary">
              New Opportunity
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <ResponsiveGrid columns={4} gap={4}>
        <StatCard
          title="Total Applications"
          value="1,234"
          change="+12%"
          trend="up"
          icon={TrendingUpIcon}
          showDescription={!isMobile}
        />
        <StatCard
          title="Active Opportunities"
          value="56"
          change="+5%"
          trend="up"
          icon={BriefcaseIcon}
          showDescription={!isMobile}
        />
        <StatCard
          title="Interviews Scheduled"
          value="23"
          change="+18%"
          trend="up"
          icon={CalendarIcon}
          showDescription={!isMobile}
        />
        <StatCard
          title="Hires This Month"
          value="8"
          change="+3%"
          trend="up"
          icon={UsersIcon}
          showDescription={!isMobile}
        />
      </ResponsiveGrid>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Application Trends"
          subtitle={isMobile ? undefined : "Applications received over time"}
        >
          <ApplicationTrendsChart
            height={isMobile ? 250 : 300}
            showLegend={!isMobile}
            simplified={isMobile}
          />
        </ChartCard>

        <ChartCard
          title="Hiring Pipeline"
          subtitle={isMobile ? undefined : "Candidates by stage"}
        >
          <HiringPipelineChart
            height={isMobile ? 250 : 300}
            showLegend={!isMobile}
            layout={isMobile ? "vertical" : "horizontal"}
          />
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 md:p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            {!isMobile && (
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </button>
            )}
          </div>
        </div>

        <div className="divide-y">
          {recentActivity.slice(0, isMobile ? 3 : 5).map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              compact={isMobile}
            />
          ))}
        </div>

        {isMobile && (
          <div className="p-4 border-t">
            <button className="w-full btn-secondary min-h-[44px]">
              View All Activity
            </button>
          </div>
        )}
      </div>

      {/* Mobile Action Buttons */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 space-y-3">
          <button className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center">
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
```

This comprehensive examples document provides practical, copy-paste ready code that developers can use to implement responsive behavior consistently across the application.
