import toolsData from "@/lib/data/tools.json";

export interface Tool {
  id: string;
  name: string;
  category: string;
  logo: string;
}

// Default tool icon SVG as fallback
const DEFAULT_TOOL_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'%3E%3C/path%3E%3C/svg%3E";

/**
 * Get tool information by name
 * If tool is not found in the database, return tool info with default icon
 */
export function getToolInfo(toolName: string): Tool {
  const toolId = toolName.toLowerCase().replace(/\s+/g, "-");
  const tool = toolsData.find(
    (t) => t.id === toolId || t.name.toLowerCase() === toolName.toLowerCase()
  );

  if (tool) {
    return tool;
  }

  // Return custom tool with default icon
  return {
    id: toolId,
    name: toolName,
    category: "Custom",
    logo: DEFAULT_TOOL_ICON,
  };
}

/**
 * Get all available tools
 */
export function getAllTools(): Tool[] {
  return toolsData;
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): Tool[] {
  return toolsData.filter((tool) => tool.category === category);
}

/**
 * Search tools by name or category
 */
export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return toolsData.filter(
    (tool) =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery) ||
      tool.id.includes(lowerQuery)
  );
}

/**
 * Get distinct categories from tools
 */
export function getToolCategories(): string[] {
  const categories = new Set(toolsData.map((tool) => tool.category));
  return Array.from(categories).sort();
}
