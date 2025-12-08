# Tools System Documentation

## Overview

The tools system provides a centralized way to manage tools with their logos and metadata. It's used across the application to display tool information with consistent branding.

## Files

- **`lib/data/tools.json`** - Central database of tools with logos, names, categories
- **`lib/utils/tools.ts`** - Utility functions for working with tools
- **`components/employer/opportunities/post-steps/DescriptionStep.tsx`** - Example usage in the tools dropdown

## Tool Structure

Each tool in `tools.json` has the following structure:

```json
{
  "id": "figma",
  "name": "Figma",
  "category": "Design",
  "logo": "https://cdn.jsdelivr.net/..."
}
```

### Fields:
- **id**: Unique identifier (lowercase, hyphenated)
- **name**: Display name of the tool
- **category**: Category for grouping (e.g., "Design", "Framework", "Database")
- **logo**: URL to the tool's logo/icon

## Using the Tools System

### 1. Get Tool Information

```typescript
import { getToolInfo } from "@/lib/utils/tools";

// By exact name
const toolInfo = getToolInfo("Figma");
// Returns: { id: "figma", name: "Figma", category: "Design", logo: "..." }

// For custom/unknown tools, returns default icon
const customTool = getToolInfo("CustomTool");
// Returns: { id: "customtool", name: "CustomTool", category: "Custom", logo: "..." }
```

### 2. Get All Tools

```typescript
import { getAllTools } from "@/lib/utils/tools";

const allTools = getAllTools();
// Returns array of all tools
```

### 3. Search Tools

```typescript
import { searchTools } from "@/lib/utils/tools";

const results = searchTools("figma");
// Returns tools matching "figma" in name, id, or category
```

### 4. Get Tools by Category

```typescript
import { getToolsByCategory } from "@/lib/utils/tools";

const designTools = getToolsByCategory("Design");
// Returns all tools in the Design category
```

### 5. Get Available Categories

```typescript
import { getToolCategories } from "@/lib/utils/tools";

const categories = getToolCategories();
// Returns: ["Animation", "Cloud", "Communication", ...]
```

## Using in Components

### Displaying Tool Logo and Info

```tsx
import { getToolInfo } from "@/lib/utils/tools";

export function ToolDisplay({ toolName }: { toolName: string }) {
  const toolInfo = getToolInfo(toolName);
  
  return (
    <div className="flex items-center gap-2">
      <img 
        src={toolInfo.logo} 
        alt={toolName}
        className="w-5 h-5 object-contain"
      />
      <span>{toolInfo.name}</span>
      <span className="text-xs text-gray-500">{toolInfo.category}</span>
    </div>
  );
}
```

### Display Tool with Error Handling

```tsx
<img 
  src={toolInfo.logo}
  alt={tool}
  className="w-4 h-4 object-contain"
  onError={(e) => {
    (e.target as HTMLImageElement).style.display = "none";
  }}
/>
```

## Adding New Tools

To add a new tool:

1. Open `lib/data/tools.json`
2. Add a new object with required fields:
   ```json
   {
     "id": "toolname",
     "name": "Tool Name",
     "category": "Category",
     "logo": "url-to-logo"
   }
   ```

## Default Icon

Tools not found in the database will automatically use a default tool icon (SVG). No need to add custom icons manually - the system handles it.

## Categories

Current categories in the system:
- Design
- Video
- CMS
- E-commerce
- Version Control
- Project Management
- Communication
- Animation
- Web Development
- Framework
- Language
- Runtime
- Database
- DevOps
- Cloud
- Custom (for user-defined tools)

## Example Usage in DescriptionStep

The DescriptionStep component demonstrates:
1. Loading tools from the JSON file
2. Displaying tool logos in dropdowns
3. Showing tool categories
4. Handling custom tools with default icons
5. Filtering and searching tools

```tsx
import toolsData from "@/lib/data/tools.json";
import { getToolInfo } from "@/lib/utils/tools";

// Get all tool names
const tools = toolsData.map((tool) => tool.name);

// Use tool info in dropdown
const toolInfo = getToolInfo(tool);
<img src={toolInfo.logo} alt={tool} />
<span>{toolInfo.category}</span>
```

## Tips

- Always use `getToolInfo()` to get tool details - it handles missing tools gracefully
- Tools are case-insensitive in searches and lookups
- The system works offline - all data is stored locally
- Logos load from CDN (devicons and official sources)
- Use `onError` handlers on images to gracefully handle broken logo links

## Performance

- Tools are imported as static JSON, no runtime lookups needed
- Filtering is efficient even with large tool lists
- Logo loading is non-blocking with optional error handling
