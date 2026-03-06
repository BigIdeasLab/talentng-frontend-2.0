# SearchInput Developer Guide

## Overview

This guide helps developers understand when and how to use the unified `SearchInput` component, how to extend it for special cases, and common pitfalls to avoid.

## Table of Contents

1. [When to Use SearchInput](#when-to-use-searchinput)
2. [When NOT to Use SearchInput](#when-not-to-use-searchinput)
3. [How to Extend SearchInput](#how-to-extend-searchinput)
4. [Common Pitfalls](#common-pitfalls)
5. [Performance Considerations](#performance-considerations)
6. [Testing Guidelines](#testing-guidelines)
7. [Accessibility Checklist](#accessibility-checklist)

---

## When to Use SearchInput

### ✅ Primary Page Search
Use SearchInput for main search functionality on pages:

```tsx
// ✅ Good: Page-level search
function OpportunitiesPage() {
  return (
    <SearchInput
      value={searchQuery}
      onChange={setSearchQuery}
      onSearch={handleSearch}
      placeholder="Search opportunities..."
    />
  );
}
```

**Examples:**
- Opportunities page search
- Talent discovery search
- Applications search
- Calendar event search
- Any primary search feature

### ✅ List/Grid Filtering
Use SearchInput for filtering lists or grids:

```tsx
// ✅ Good: List filtering
function TalentList({ talents }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filtered = talents.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={setSearchQuery}
        placeholder="Search talents..."
      />
      <TalentGrid talents={filtered} />
    </>
  );
}
```

### ✅ API Search with Debouncing
Use SearchInput when making API calls that benefit from debouncing:

```tsx
// ✅ Good: API search with debouncing
function SearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      await searchAPI(query);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SearchInput
      onSearch={handleSearch}
      isLoading={isLoading}
      debounceDelay={300}
    />
  );
}
```

### ✅ Search with URL Synchronization
Use SearchInput when syncing search with URL parameters:

```tsx
// ✅ Good: URL-synced search
function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );
  
  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`?${params.toString()}`);
  };
  
  return (
    <SearchInput
      value={searchQuery}
      onChange={setSearchQuery}
      onSearch={handleSearch}
    />
  );
}
```

---

## When NOT to Use SearchInput

### ❌ Filter Modal Internal Search
Do NOT use SearchInput for filtering dropdown options within modals:

```tsx
// ❌ Bad: Filter modal internal search
function FilterModal() {
  const [skillSearch, setSkillSearch] = useState("");
  
  return (
    <Modal>
      {/* This is for filtering dropdown options, not primary search */}
      <input
        type="text"
        value={skillSearch}
        onChange={(e) => setSkillSearch(e.target.value)}
        placeholder="Search skills"
      />
      <SkillsList filter={skillSearch} />
    </Modal>
  );
}
```

**Why?** Filter modal searches are for narrowing dropdown options, not primary search functionality. They don't need debouncing, loading states, or the full SearchInput feature set.

### ❌ Form Input Fields
Do NOT use SearchInput for regular form inputs:

```tsx
// ❌ Bad: Using SearchInput for form input
<SearchInput
  value={username}
  onChange={setUsername}
  onSearch={setUsername}
  placeholder="Enter username"
/>

// ✅ Good: Use regular input for forms
<input
  type="text"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  placeholder="Enter username"
/>
```

### ❌ Autocomplete/Typeahead
Do NOT use SearchInput for autocomplete or typeahead functionality:

```tsx
// ❌ Bad: SearchInput doesn't support autocomplete
<SearchInput
  onSearch={handleSearch}
  placeholder="Search..."
/>

// ✅ Good: Use a dedicated autocomplete component
<Autocomplete
  onSearch={handleSearch}
  suggestions={suggestions}
  placeholder="Search..."
/>
```

**Why?** SearchInput doesn't have built-in autocomplete/suggestion functionality. Use a dedicated autocomplete component instead.

### ❌ Instant Search (No Debounce Needed)
Do NOT use SearchInput when you need instant search without debouncing:

```tsx
// ❌ Bad: Using SearchInput with 0ms debounce
<SearchInput
  onSearch={handleInstantSearch}
  debounceDelay={0}
/>

// ✅ Good: Use regular input for instant search
<input
  type="text"
  onChange={(e) => handleInstantSearch(e.target.value)}
/>
```

**Why?** If you don't need debouncing, SearchInput adds unnecessary complexity.

---

## How to Extend SearchInput

### Creating a Wrapper Component

If you need to add functionality to SearchInput, create a wrapper component:

```tsx
// ✅ Good: Wrapper component with additional features
interface SearchWithFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  filterCount?: number;
}

export function SearchWithFilters({
  searchQuery,
  onSearchChange,
  onFilterClick,
  filterCount = 0,
}: SearchWithFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 max-w-[585px]">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          onSearch={onSearchChange}
          placeholder="Search..."
        />
      </div>
      <button
        onClick={onFilterClick}
        className="flex items-center gap-2"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {filterCount > 0 && (
          <span className="badge">{filterCount}</span>
        )}
      </button>
    </div>
  );
}
```

**Example:** `components/talent/opportunities/search-bar.tsx` is a wrapper that adds a filter button.

### Adding Custom Styling

Use the `className` prop to add custom styles:

```tsx
// ✅ Good: Custom styling via className
<SearchInput
  onSearch={handleSearch}
  className="shadow-lg border-2"
  placeholder="Search..."
/>
```

### Adding Custom Icons

If you need custom icons, create a wrapper or fork the component:

```tsx
// ✅ Good: Wrapper with custom icon
function CustomSearchInput(props: SearchInputProps) {
  return (
    <div className="relative">
      <SearchInput {...props} />
      {/* Add custom icon overlay if needed */}
    </div>
  );
}
```

### Handling Complex Search Logic

For complex search logic, use the `onSearch` callback:

```tsx
// ✅ Good: Complex search logic in callback
const handleSearch = async (query: string) => {
  // Validate query
  if (query.length < 3 && query.length > 0) {
    setError("Search query must be at least 3 characters");
    return;
  }
  
  // Clear error
  setError("");
  
  // Perform search with multiple filters
  setIsLoading(true);
  try {
    const results = await searchAPI({
      query,
      filters: appliedFilters,
      page: 1,
      limit: 20,
    });
    setResults(results);
  } catch (err) {
    setError("Search failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  isLoading={isLoading}
  error={error}
/>
```

---

## Common Pitfalls

### 1. Forgetting to Handle Loading State

❌ **Bad:**
```tsx
const handleSearch = async (query: string) => {
  await searchAPI(query); // No loading state
};

<SearchInput onSearch={handleSearch} />
```

✅ **Good:**
```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSearch = async (query: string) => {
  setIsLoading(true);
  try {
    await searchAPI(query);
  } finally {
    setIsLoading(false);
  }
};

<SearchInput
  onSearch={handleSearch}
  isLoading={isLoading}
/>
```

### 2. Using Both value and defaultValue

❌ **Bad:**
```tsx
<SearchInput
  value={searchQuery}
  defaultValue="initial"
  onSearch={handleSearch}
/>
```

✅ **Good:**
```tsx
// Controlled mode
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
/>

// OR uncontrolled mode
<SearchInput
  defaultValue="initial"
  onSearch={handleSearch}
/>
```

### 3. Not Cleaning Up on Unmount

The SearchInput component handles cleanup automatically, but if you're managing external state:

❌ **Bad:**
```tsx
const handleSearch = async (query: string) => {
  const results = await searchAPI(query);
  setResults(results); // Component might be unmounted
};
```

✅ **Good:**
```tsx
const handleSearch = async (query: string) => {
  try {
    const results = await searchAPI(query);
    if (mounted.current) {
      setResults(results);
    }
  } catch (err) {
    if (mounted.current) {
      setError(err.message);
    }
  }
};
```

### 4. Incorrect Debounce Delay

❌ **Bad:**
```tsx
// Too short for API calls
<SearchInput
  onSearch={expensiveAPICall}
  debounceDelay={100}
/>

// Too long for local filtering
<SearchInput
  onSearch={localFilter}
  debounceDelay={1000}
/>
```

✅ **Good:**
```tsx
// Appropriate for API calls
<SearchInput
  onSearch={expensiveAPICall}
  debounceDelay={300} // or 500ms
/>

// Appropriate for local filtering
<SearchInput
  onSearch={localFilter}
  debounceDelay={150} // or 200ms
/>
```

### 5. Not Providing Descriptive Placeholders

❌ **Bad:**
```tsx
<SearchInput
  onSearch={handleSearch}
  placeholder="Search..."
/>
```

✅ **Good:**
```tsx
<SearchInput
  onSearch={handleSearch}
  placeholder="Search opportunities, skills, or locations..."
/>
```

### 6. Missing Error Handling

❌ **Bad:**
```tsx
const handleSearch = async (query: string) => {
  await searchAPI(query); // Errors not handled
};
```

✅ **Good:**
```tsx
const [error, setError] = useState("");

const handleSearch = async (query: string) => {
  setError("");
  try {
    await searchAPI(query);
  } catch (err) {
    setError("Search failed. Please try again.");
  }
};

<SearchInput
  onSearch={handleSearch}
  error={error}
  onError={(err) => console.error("Search error:", err)}
/>
```

---

## Performance Considerations

### 1. Memoize Search Handlers

Use `useCallback` to prevent unnecessary re-renders:

```tsx
// ✅ Good: Memoized handler
const handleSearch = useCallback(async (query: string) => {
  setIsLoading(true);
  try {
    await searchAPI(query);
  } finally {
    setIsLoading(false);
  }
}, [/* dependencies */]);

<SearchInput onSearch={handleSearch} />
```

### 2. Optimize Filter Logic

For local filtering, optimize the filter function:

```tsx
// ✅ Good: Optimized filtering
const filteredItems = useMemo(() => {
  if (!searchQuery) return items;
  
  const lowerQuery = searchQuery.toLowerCase();
  return items.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery)
  );
}, [items, searchQuery]);
```

### 3. Debounce Expensive Operations

Use appropriate debounce delays for expensive operations:

```tsx
// ✅ Good: Longer debounce for expensive operations
<SearchInput
  onSearch={expensiveAPICall}
  debounceDelay={500} // Longer delay for API calls
/>

<SearchInput
  onSearch={cheapLocalFilter}
  debounceDelay={150} // Shorter delay for local operations
/>
```

### 4. Avoid Re-creating Callbacks

Don't create new callback functions on every render:

❌ **Bad:**
```tsx
<SearchInput
  onSearch={(query) => searchAPI(query)} // New function every render
/>
```

✅ **Good:**
```tsx
const handleSearch = useCallback((query: string) => {
  searchAPI(query);
}, []);

<SearchInput onSearch={handleSearch} />
```

---

## Testing Guidelines

### Unit Testing

Test SearchInput integration in your components:

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("SearchPage", () => {
  it("should call onSearch after debounce delay", async () => {
    const handleSearch = vi.fn();
    render(<SearchInput onSearch={handleSearch} debounceDelay={300} />);
    
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "test query");
    
    // Should not call immediately
    expect(handleSearch).not.toHaveBeenCalled();
    
    // Should call after debounce delay
    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith("test query");
    }, { timeout: 400 });
  });
  
  it("should clear search on Escape key", async () => {
    const handleSearch = vi.fn();
    render(
      <SearchInput
        value="test"
        onChange={vi.fn()}
        onSearch={handleSearch}
      />
    );
    
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "{Escape}");
    
    expect(handleSearch).toHaveBeenCalledWith("");
  });
  
  it("should show loading spinner when isLoading is true", () => {
    render(<SearchInput onSearch={vi.fn()} isLoading={true} />);
    
    // Check for spinner (aria-hidden div with animate-spin)
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});
```

### Integration Testing

Test SearchInput with your API calls:

```tsx
describe("SearchPage Integration", () => {
  it("should fetch results on search", async () => {
    const mockResults = [{ id: 1, name: "Result 1" }];
    vi.mocked(searchAPI).mockResolvedValue(mockResults);
    
    render(<SearchPage />);
    
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "test");
    
    await waitFor(() => {
      expect(searchAPI).toHaveBeenCalledWith("test");
    });
    
    expect(screen.getByText("Result 1")).toBeInTheDocument();
  });
});
```

---

## Accessibility Checklist

When using SearchInput, ensure:

- ✅ Provide descriptive `ariaLabel` prop
- ✅ Use `ariaDescribedBy` to link help text
- ✅ Handle loading states with `isLoading` prop
- ✅ Display error messages with `error` prop
- ✅ Test keyboard navigation (Tab, Escape, Enter)
- ✅ Test with screen readers
- ✅ Ensure sufficient color contrast
- ✅ Provide clear placeholder text

Example:

```tsx
<div>
  <SearchInput
    value={searchQuery}
    onChange={setSearchQuery}
    onSearch={handleSearch}
    isLoading={isLoading}
    error={error}
    ariaLabel="Search opportunities"
    ariaDescribedBy="search-help"
    placeholder="Search by title, skills, or location"
  />
  <p id="search-help" className="text-xs text-gray-600">
    Enter at least 3 characters to search
  </p>
</div>
```

---

## Decision Tree: Should I Use SearchInput?

```
Is this a primary search feature on a page?
├─ Yes → Use SearchInput ✅
└─ No
   ├─ Is this for filtering a list/grid?
   │  ├─ Yes → Use SearchInput ✅
   │  └─ No
   │     ├─ Is this for filtering dropdown options in a modal?
   │     │  ├─ Yes → Use regular input ❌
   │     │  └─ No
   │     │     ├─ Is this a form input field?
   │     │     │  ├─ Yes → Use regular input ❌
   │     │     │  └─ No
   │     │     │     ├─ Do you need autocomplete/typeahead?
   │     │     │     │  ├─ Yes → Use autocomplete component ❌
   │     │     │     │  └─ No
   │     │     │     │     ├─ Do you need debouncing?
   │     │     │     │     │  ├─ Yes → Use SearchInput ✅
   │     │     │     │     │  └─ No → Use regular input ❌
```

---

## Quick Reference

### Import
```tsx
import { SearchInput } from "@/components/ui/search-input";
```

### Basic Usage
```tsx
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  placeholder="Search..."
/>
```

### With Loading
```tsx
<SearchInput
  onSearch={handleSearch}
  isLoading={isLoading}
/>
```

### With Error
```tsx
<SearchInput
  onSearch={handleSearch}
  error={error}
  onError={handleError}
/>
```

### Custom Debounce
```tsx
<SearchInput
  onSearch={handleSearch}
  debounceDelay={500}
/>
```

---

## Related Documentation

- [Component Documentation](../components/ui/search-input.md)
- [Migration Guide](./SEARCH_INPUT_MIGRATION_GUIDE.md)
- [Audit Document](./SEARCH_INPUT_AUDIT.md)
- [Requirements](../.kiro/specs/consistent-search-input/requirements.md)
- [Design Document](../.kiro/specs/consistent-search-input/design.md)

---

## Support

For questions or issues:
- Component source: `components/ui/search-input.tsx`
- Spec location: `.kiro/specs/consistent-search-input/`
- Migration guide: `docs/SEARCH_INPUT_MIGRATION_GUIDE.md`

---

## Changelog

### v1.0.0 (Initial Release)
- Unified search input component
- Debounced search execution
- Loading states
- Clear button functionality
- Keyboard shortcuts
- Full accessibility compliance
- Controlled and uncontrolled modes
- Error state support
- 21 search implementations migrated
