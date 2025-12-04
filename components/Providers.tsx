"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours in cache
    },
  },
});

// Only create persister on client side
let localStoragePersister: any;
if (typeof window !== "undefined") {
  localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Only use persister if it was created on client
  const persistOptions = localStoragePersister
    ? {
        persister: localStoragePersister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      }
    : undefined;

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
    >
      {children}
      <Toaster position="top-right" richColors />
    </PersistQueryClientProvider>
  );
}
