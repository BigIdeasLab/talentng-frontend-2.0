"use client";

import { createContext, useContext } from "react";
import {
  ROLE_COLORS,
  getRoleColors,
  type RoleColorPalette,
} from "./role-colors";

const RoleColorContext = createContext<RoleColorPalette>(ROLE_COLORS.talent);

export function RoleColorProvider({
  role,
  children,
}: {
  role?: string | null;
  children: React.ReactNode;
}) {
  return (
    <RoleColorContext.Provider value={getRoleColors(role)}>
      {children}
    </RoleColorContext.Provider>
  );
}

export function useRoleColors() {
  return useContext(RoleColorContext);
}
