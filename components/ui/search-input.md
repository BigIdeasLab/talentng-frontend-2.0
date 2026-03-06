# SearchInput Component

A unified, reusable search input component with consistent design, debouncing, loading states, clear button, keyboard shortcuts, and full accessibility compliance.

## Features

- Consistent visual design across all instances
- Debounced search execution (300ms default)
- Loading state with spinner
- Clear button functionality
- Keyboard shortcuts (Escape to clear)
- Full accessibility compliance (WCAG)
- Controlled and uncontrolled modes
- Error state support
- TypeScript support

## Basic Usage

### Simple Search (Uncontrolled)
```tsx
import { SearchInput } from "@/components/ui/search-input";

<SearchInput
  onSearch={(query) => console.log("Searching:", query)}
  placeholder="Search..."
/>
```

### Controlled Search
```tsx
const [searchQuery, setSearchQuery] = useState("");

<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  placeholder="Search opportunities..."
/>
```

### Search with Loading State
```tsx
const [isLoading, setIsLoading] = useState(false);

<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={async (query) => {
    setIsLoading(true);
    await fetchResults(query);
    setIsLoading(false);
  }}
  isLoading={isLoading}
  placeholder="Search..."
/>
```

## Modes

### Controlled Mode
Parent component manages the search value:
```tsx
const [searchQuery, setSearchQuery] = useState("");

<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
/>
```

### Uncontrolled Mode
Component manages its own internal state:
```tsx
<SearchInput
  onSearch={handleSearch}
  defaultValue=""
/>
```

## Debouncing

The component automatically debounces search execution to prevent excessive API calls:

```tsx
// Default 300ms debounce
<SearchInput onSearch={handleSearch} />

// Custom debounce delay
<SearchInput
  onSearch={handleSearch}
  debounceDelay={500}
/>

// No debounce (0ms)
<SearchInput
  onSearch={handleSearch}
  debounceDelay={0}
/>
```

## Loading States

Show loading spinner during search operations:

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
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  isLoading={isLoading}
/>
```

## Clear Button

The clear button appears automatically when input has text:

```tsx
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  onClear={() => {
    // Optional: Additional clear logic
    console.log("Search cleared");
  }}
/>
```

## Keyboard Shortcuts

Built-in keyboard support:
- **Escape**: Clears the search input
- **Tab**: Navigate to clear button
- **Enter**: Standard input behavior

```tsx
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  placeholder="Press Escape to clear"
/>
```

## Error Handling

Display error states and handle search errors:

```tsx
const [error, setError] = useState("");

<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  error={error}
  onError={(err) => {
    setError(err.message);
    console.error("Search error:", err);
  }}
/>
```

## Accessibility

Full WCAG compliance with proper ARIA attributes:

```tsx
<SearchInput
  onSearch={handleSearch}
  ariaLabel="Search opportunities"
  ariaDescribedBy="search-help-text"
  placeholder="Search..."
/>

<p id="search-help-text" className="text-xs text-gray-600">
  Search by title, skills, or location
</p>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSearch` | `(query: string) => void` | **Required** | Callback invoked after debounce delay |
| `placeholder` | `string` | `"Search..."` | Placeholder text |
| `debounceDelay` | `number` | `300` | Debounce delay in milliseconds |
| `value` | `string` | `undefined` | Current value (controlled mode) |
| `onChange` | `(value: string) => void` | `undefined` | Immediate change callback |
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

## Common Use Cases

### Page Search with Filters
```tsx
function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      await fetchOpportunities({ search: query });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 max-w-[585px]">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          isLoading={isLoading}
          placeholder="Search opportunities..."
        />
      </div>
      <button onClick={openFilters}>Filters</button>
    </div>
  );
}
```

### Search with URL Sync
```tsx
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
      placeholder="Search..."
    />
  );
}
```

### Search with Character Limit
```tsx
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  maxLength={100}
  placeholder="Search talents, skills, or services"
/>
```

### Simple Local Search
```tsx
function TalentList({ talents }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTalents = talents.filter((talent) =>
    talent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={setSearchQuery}
        placeholder="Search talents..."
      />
      <TalentGrid talents={filteredTalents} />
    </>
  );
}
```

## Migration Examples

### Before: Manual Debounce Implementation
```tsx
const [localSearchQuery, setLocalSearchQuery] = useState("");
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
    value={localSearchQuery}
    onChange={(e) => handleSearchChange(e.target.value)}
  />
);
```

### After: SearchInput Component
```tsx
<SearchInput
  onSearch={onSearchChange}
  debounceDelay={300}
/>
```

### Before: Dual State Pattern
```tsx
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

### After: SearchInput Component
```tsx
const [searchQuery, setSearchQuery] = useState("");

<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={setSearchQuery}
  debounceDelay={500}
/>

// Use searchQuery directly for filtering
```

### Before: Custom Search Input Markup
```tsx
<div className="flex items-center gap-[6px] border border-[#E1E4EA] rounded-lg px-3 py-[7px]">
  <Search className="w-[15px] h-[15px] text-[#B2B2B2]" />
  <input
    type="text"
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="flex-1 text-[13px] font-inter-tight"
  />
  {searchQuery && (
    <button onClick={() => setSearchQuery("")}>
      <X className="w-[15px] h-[15px]" />
    </button>
  )}
</div>
```

### After: SearchInput Component
```tsx
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  placeholder="Search..."
/>
```

## Visual Design

The component follows consistent design specifications:

- **Height**: 38px
- **Padding**: 12px horizontal, 7px vertical
- **Border**: 1px solid #E1E4EA
- **Border Radius**: 8px
- **Font**: 13px Inter Tight
- **Icon Size**: 15px × 15px
- **Colors**:
  - Text: #000000
  - Placeholder: rgba(0, 0, 0, 0.3)
  - Icon: #B2B2B2
  - Border (error): #FF0000
  - Background (error): #FEF2F2

## Best Practices

1. **Use controlled mode** when syncing search with URL params or external state
2. **Use uncontrolled mode** for simple local search
3. **Set appropriate debounce delay** based on search cost (API calls = longer delay)
4. **Provide descriptive placeholders** that indicate what can be searched
5. **Use `ariaLabel`** to provide context for screen readers
6. **Handle errors** with `onError` callback for API search failures
7. **Show loading state** with `isLoading` prop during async searches
8. **Limit input length** with `maxLength` for validation requirements

## Troubleshooting

### Search fires too frequently
**Solution:** Increase `debounceDelay` prop (default is 300ms)

### Need immediate onChange callback
**Solution:** Use both `onChange` (immediate) and `onSearch` (debounced)

### Need to control value externally
**Solution:** Use controlled mode with `value` and `onChange` props

### Clear button not appearing
**Solution:** Ensure `isLoading` is false and input has value

### Styling doesn't match
**Solution:** Use `className` prop to add additional styles to container

## Related Documentation

- [Migration Guide](../../../docs/SEARCH_INPUT_MIGRATION_GUIDE.md)
- [Audit Document](../../../docs/SEARCH_INPUT_AUDIT.md)
- [Requirements](.kiro/specs/consistent-search-input/requirements.md)
- [Design Document](.kiro/specs/consistent-search-input/design.md)

## Support

For questions or issues:
- Component source: `components/ui/search-input.tsx`
- Spec location: `.kiro/specs/consistent-search-input/`
