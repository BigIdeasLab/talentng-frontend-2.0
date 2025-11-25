"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserNav() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const userInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "...";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-black font-geist">
              {userInitial}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-25 border border-gray-50 rounded-full flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_user_nav)">
                <rect width="16" height="16" rx="8" fill="#FCFCFD" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.64333 6.86197C5.76835 6.73699 5.93789 6.66678 6.11467 6.66678C6.29144 6.66678 6.46098 6.73699 6.586 6.86197L8 8.27597L9.414 6.86197C9.539 6.73688 9.70858 6.66657 9.88543 6.6665C10.0623 6.66644 10.2319 6.73663 10.357 6.86164C10.4821 6.98664 10.5524 7.15622 10.5525 7.33307C10.5525 7.50992 10.4823 7.67954 10.3573 7.80464L8.47133 9.69064C8.34631 9.81562 8.17677 9.88583 8 9.88583C7.82322 9.88583 7.65368 9.81562 7.52867 9.69064L5.64333 7.80464C5.51835 7.67962 5.44814 7.51008 5.44814 7.33331C5.44814 7.15653 5.51835 6.98699 5.64333 6.86197Z"
                  fill="#09244B"
                />
              </g>
              <rect
                x="0.5"
                y="0.5"
                width="15"
                height="15"
                rx="7.5"
                stroke="#F9FAFB"
              />
              <defs>
                <clipPath id="clip0_user_nav">
                  <rect width="16" height="16" rx="8" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/my-profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
