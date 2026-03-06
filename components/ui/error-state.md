# ErrorState Component

A reusable error state component for displaying errors with optional retry functionality throughout the application.

## Features

- 3 variants: `error`, `warning`, `info`
- Optional retry button with callback
- Customizable icon
- Consistent styling with your design system
- Responsive design
- TypeScript support

## Basic Usage

### Simple Error

```tsx
import { ErrorState } from "@/components/ui/error-state";

<ErrorState message="Failed to load data" />;
```

### Error with Retry

```tsx
<ErrorState
  title="Error loading opportunities"
  message="Failed to fetch opportunities"
  onRetry={() => refetch()}
/>
```

### Custom Retry Text

```tsx
<ErrorState
  message="Connection failed"
  onRetry={() => reconnect()}
  retryText="Try Again"
/>
```

## Variants

### Error (Default)

Red theme for critical errors

```tsx
<ErrorState
  variant="error"
  title="Error loading data"
  message="Something went wrong"
/>
```

### Warning

Yellow theme for warnings

```tsx
<ErrorState
  variant="warning"
  title="No results found"
  message="Try adjusting your filters"
/>
```

### Info

Blue theme for informational messages

```tsx
<ErrorState
  variant="info"
  title="No data available"
  message="There are no items to display"
/>
```

## Full Page Error

Use `ErrorStateFullPage` wrapper for full-page errors:

```tsx
import { ErrorStateFullPage } from "@/components/ui/error-state";

<ErrorStateFullPage
  title="Error loading page"
  message="Failed to fetch data"
  onRetry={() => window.location.reload()}
/>;
```

## Custom Icon

```tsx
<ErrorState
  message="Custom error"
  icon={
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      {/* Your custom icon */}
    </svg>
  }
/>
```

## Hide Icon

```tsx
<ErrorState message="Error without icon" showIcon={false} />
```

## Props

| Prop        | Type                             | Default                  | Description               |
| ----------- | -------------------------------- | ------------------------ | ------------------------- |
| `title`     | `string`                         | `"Something went wrong"` | Error title/heading       |
| `message`   | `string`                         | **Required**             | Error message/description |
| `onRetry`   | `() => void`                     | `undefined`              | Optional retry callback   |
| `retryText` | `string`                         | `"Retry"`                | Custom retry button text  |
| `showIcon`  | `boolean`                        | `true`                   | Show/hide icon            |
| `icon`      | `React.ReactNode`                | Default variant icon     | Custom icon element       |
| `variant`   | `"error" \| "warning" \| "info"` | `"error"`                | Visual variant            |
| `className` | `string`                         | `""`                     | Additional CSS classes    |

## Common Use Cases

### API Fetch Error

```tsx
const { data, error, refetch } = useQuery();

if (error) {
  return (
    <ErrorState
      title="Failed to load data"
      message={error.message}
      onRetry={refetch}
    />
  );
}
```

### Page Load Error

```tsx
if (loadError) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <ErrorState
        title="Error loading page"
        message={loadError}
        onRetry={() => window.location.reload()}
      />
    </div>
  );
}
```

### Empty State (Warning Variant)

```tsx
if (items.length === 0) {
  return (
    <ErrorState
      variant="warning"
      title="No items found"
      message="Try adjusting your search or filters"
      showIcon={false}
    />
  );
}
```

### Network Error

```tsx
<ErrorState
  title="Connection Error"
  message="Unable to connect to the server. Please check your internet connection."
  onRetry={retryConnection}
  retryText="Reconnect"
/>
```

## Migration Examples

### Before (Inline Error)

```tsx
{
  error && (
    <div className="text-center">
      <p className="text-lg font-semibold text-gray-900">
        Error loading opportunities
      </p>
      <p className="text-gray-600">{error}</p>
    </div>
  );
}
```

### After (ErrorState Component)

```tsx
{
  error && (
    <ErrorState
      title="Error loading opportunities"
      message={error}
      onRetry={() => refetch()}
    />
  );
}
```

## Styling

The component uses Tailwind CSS and follows your design system:

- Font: Inter Tight
- Colors: Red (error), Yellow (warning), Blue (info)
- Consistent spacing and sizing
- Responsive design

## Accessibility

- Semantic HTML structure
- Clear visual hierarchy
- Keyboard accessible retry button
- Screen reader friendly
