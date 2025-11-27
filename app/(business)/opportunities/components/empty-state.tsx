export function EmptyState() {
  return (
    <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center py-12">
      <p className="text-[15px] font-medium text-gray-600 mb-1.5">
        No opportunities found
      </p>
      <p className="text-[13px] text-gray-500">
        Try adjusting your filters or search query
      </p>
    </div>
  );
}
