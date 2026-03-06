# SearchInput Component Migration Guide

## Overview

This guide helps you migrate existing search input implementations to the new unified `SearchInput` component. The component provides consistent styling, debouncing, loading states, clear buttons, keyboard shortcuts, and full accessibility compliance.

## Component Location

```typescript
import { SearchInput } from "@/components/ui/search-input";
```

## Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSearch` | `(query: string) => void` | **Required** | Callback invoked after debounce delay |
| `placeholder` | `string` | `"Search..."` | Placeholder text |
| `debounceDelay` | `number` | `300` | Debounce delay in milliseconds |
| `value` | `string` | `undefined` | Current value (controlled mode) |
| `onChange` | `(value: string) => void` | `undefined` | Immediate change callback (controlled mode) |
| `defaultValue` | `string` | `""` | Initial value (uncontrolled mode) |
| `isLoading` | `boolean` | `false` | Shows loading spinner |
| `error` | `string` | `undefined` | Error message |
| `ariaLabel` | `string` | `"Search"` | Accessible label |
| `ariaDescribedBy` | `string` | `undefined` | ID of describing element |
| `maxLength` | `number` | `undefined` | Maximum input length |
| `disabled` | `boolean` | `false` | Disables the input |
| `className` | `string` | `""` | Additional CSS classes |
| `onClear` | `() => void` | `undefined` | Clear button callback |
| `onError` | `(error: Error) => void` | `undefined` | Error handler callback |
| `onFocus` | `() => void` | `undefined` | Focus callback |
| `onBlur` | `() => void` | `undefined` | Blur callback |

### Controlled vs Uncontrolled Mode

**Controlled Mode**: Provide `value` and `onChange` props
```typescript
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
/>
```

**Uncontrolled Mode**: Omit `value` prop, optionally provide `defaultValue`
```typescript
<SearchInput
  onSearch={handleSearch}
  defaultValue=""
/>
```

## Migration Patterns

### Pattern 1: Simple Search (search-bar.tsx style)

**Before:**
```typescript
<div className="flex items-center gap-[6px] border border-[#E1E4EA] rounded-lg px-3 py-[7px]">
  <Search className="w-[15px] h-[15px] text-[#B2B2B2]" />
  <input
    type="text"
    placeholder="Search opportunities, skills..."
    value={searchQuery}
    onChange={(e) => onSearchChange(e.target.value)}
    className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
  />
  {searchQuery && (
    <button onClick={() => onSearchChange("")}>
      <X className="w-[15px] h-[15px] text-[#B2B2B2]" />
    </button>
  )}
</div>
```

**After:**
```typescript
<SearchInput
  value={searchQuery}
  onChange={onSearchChange}
  onSearch={onSearchChange}
  placeholder="Search opportunities, skills..."
/>
```

### Pattern 2: Debounced Search (DiscoverTalentHeader.tsx style)

**Before:**
```typescript
const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
const debounceTimer = useRef<NodeJS.Timeout>();

const handleSearchChange = (value: string) => {
  setLocalSearchQuery(value);
  if (debounceTimer.current) {
    clearTimeout(debounceTimer.current);
  }
  debounceTimer.current = setTimeout(() => {
    onSearchChange(value);
  }, 300);
};

useEffect(() => {
  return () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  };
}, []);

return (
  <input
    type="text"
    placeholder="Search talents, skills, or services"
    value={localSearchQuery}
    onChange={(e) => handleSearchChange(e.target.value)}
    maxLength={100}
  />
);
```

**After:**
```typescript
<SearchInput
  onSearch={onSearchChange}
  placeholder="Search talents, skills, or services"
  debounceDelay={300}
  maxLength={100}
/>
```

### Pattern 3: Search with Loading State

**Before:**
```typescript
<div className="flex items-center gap-[6px]">
  {isLoading ? (
    <div className="w-[15px] h-[15px] border-2 border-[#B2B2B2] border-t-transparent rounded-full animate-spin" />
  ) : (
    <Search className="w-[15px] h-[15px] text-[#B2B2B2]" />
  )}
  <input
    type="text"
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
```

**After:**
```typescript
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  isLoading={isLoading}
  placeholder="Search..."
/>
```

### Pattern 4: Search with Debounced State

**Before:**
```typescript
const [searchQuery, setSearchQuery] = useState("");
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchQuery(searchQuery);
  }, 500);
  return () => clearTimeout(timer);
}, [searchQuery]);

// Use debouncedSearchQuery for filtering
```

**After:**
```typescript
const [searchQuery, setSearchQuery] = useState("");

<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={setSearchQuery} // Or use a separate handler
  debounceDelay={500}
/>

// Use searchQuery directly for filtering
```

### Pattern 5: Search with Clear Button

**Before:**
```typescript
<div className="flex items-center">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  {searchQuery && (
    <button
      onClick={() => setSearchQuery("")}
      className="text-[#B2B2B2] hover:text-black"
    >
      <X className="w-[15px] h-[15px]" />
    </button>
  )}
</div>
```

**After:**
```typescript
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  onClear={() => {
    // Optional: Additional clear logic
  }}
/>
```

## Files to Migrate (21 Total)

### Priority 1: Low-Risk Pilot Migrations (3 files)

1. ✅ `components/talent/opportunities/search-bar.tsx` - Simple controlled search
2. ✅ `components/employer/opportunities/SearchAndFilters.tsx` - Search with Input component
3. ✅ `app/(business)/mentorship/page.tsx` - Debounced search

### Priority 2: Medium Complexity (10 files)

4. `components/talent/applications/TalentMyApplications.tsx` - Debounced with clear button
5. `components/DiscoverTalent/DiscoverTalentHeader.tsx` - Complex debouncing with validation
6. `components/employer/opportunities/ApplicantsView.tsx` - Search with sort integration
7. `components/employer/opportunities/ApplicantsHeader.tsx` - Inline search
8. `app/(business)/opportunities/[id]/applicants/page.tsx` - Search with filters
9. `components/employer/profile/tabs/PastHiresTab.tsx` - Search with filter modal
10. `components/employer/upcoming/RecruiterUpcoming.tsx` - Debounced with clear
11. `components/mentor/upcoming/MentorUpcoming.tsx` - Session search
12. `app/(business)/applications/page.tsx` - Mentorship applications search
13. `app/(business)/sessions/page.tsx` - Sessions search

### Priority 3: Remaining Implementations (8 files)

14. `app/(business)/calendar/page.tsx` - Calendar search
15. `app/(business)/applicants/page.tsx` - Applicants search
16. `app/(business)/applicants/hired-talents/page.tsx` - Hired talents search
17. `app/(business)/discover-talent/discover-talent-client.tsx` - Talent discovery
18. `app/(business)/opportunities/opportunities-client.tsx` - Opportunities search
19. `components/employer/opportunities/EmployerOpportunities.tsx` - Employer opportunities

### Filter Modal Search Inputs (Not migrating - different use case)

These are internal filter searches within modals, not primary page searches:
- `components/talent/opportunities/OpportunitiesFilterModal.tsx` (4 search inputs)
- `components/DiscoverTalent/FilterModal.tsx` (3 search inputs)
- `components/employer/applicants/ApplicantFilterModal.tsx` (1 search input)
- `components/employer/profile/tabs/HireFilterModal.tsx` (1 search input)
- `components/talent/mentorship/MentorFilterModal.tsx` (4 search inputs)

## Common Migration Steps

1. **Import the component:**
   ```typescript
   import { SearchInput } from "@/components/ui/search-input";
   ```

2. **Remove local debounce logic:**
   - Remove `debounceTimer` refs
   - Remove `useEffect` cleanup for timers
   - Remove manual debounce implementation

3. **Remove local search state (if using debounced pattern):**
   - Remove `debouncedSearchQuery` state
   - Remove `useEffect` that syncs search states

4. **Replace search input markup:**
   - Replace custom div/input structure with `<SearchInput />`
   - Map existing props to SearchInput props

5. **Test functionality:**
   - Verify search works as before
   - Verify debouncing works (300ms default)
   - Verify clear button appears and works
   - Verify loading state if applicable
   - Verify keyboard shortcuts (Escape to clear)

6. **Test accessibility:**
   - Verify screen reader announces search
   - Verify keyboard navigation works
   - Verify focus indicators are visible

## Troubleshooting

### Issue: Search fires too frequently
**Solution:** Increase `debounceDelay` prop (default is 300ms)

### Issue: Need immediate onChange callback
**Solution:** Use both `onChange` (immediate) and `onSearch` (debounced)

### Issue: Need to control value externally
**Solution:** Use controlled mode with `value` and `onChange` props

### Issue: Clear button not appearing
**Solution:** Ensure `isLoading` is false and input has value

### Issue: Styling doesn't match
**Solution:** Use `className` prop to add additional styles to container

## Best Practices

1. **Use controlled mode** when you need to sync search with URL params or other state
2. **Use uncontrolled mode** for simple local search that doesn't need external state
3. **Set appropriate debounce delay** based on search cost (API calls = longer delay)
4. **Provide descriptive placeholders** that indicate what can be searched
5. **Use `ariaLabel`** to provide context for screen readers
6. **Handle errors** with `onError` callback for API search failures
7. **Show loading state** with `isLoading` prop during async searches

## Examples

### Example 1: Simple Page Search
```typescript
function MyPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchInput
      value={searchQuery}
      onChange={setSearchQuery}
      onSearch={setSearchQuery}
      placeholder="Search items..."
    />
  );
}
```

### Example 2: API Search with Loading
```typescript
function MyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      await fetchResults(query);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SearchInput
      value={searchQuery}
      onChange={setSearchQuery}
      onSearch={handleSearch}
      isLoading={isLoading}
      placeholder="Search..."
    />
  );
}
```

### Example 3: Uncontrolled with Custom Debounce
```typescript
function MyPage() {
  const handleSearch = (query: string) => {
    // Perform search
    console.log("Searching for:", query);
  };

  return (
    <SearchInput
      onSearch={handleSearch}
      debounceDelay={500}
      placeholder="Search..."
      onClear={() => console.log("Cleared")}
    />
  );
}
```

## Support

For questions or issues with migration, please refer to:
- Component source: `components/ui/search-input.tsx`
- Requirements: `.kiro/specs/consistent-search-input/requirements.md`
- Design: `.kiro/specs/consistent-search-input/design.md`
