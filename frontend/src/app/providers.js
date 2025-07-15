'use client'
import * as React from "react";
import { HeroUIProvider } from '@heroui/react'
import { UserProvider } from '@/contexts/UserContext';

export function Providers({ children }) {
  return (
    <HeroUIProvider locale="pt-BR">
      <UserProvider>
        {children}
      </UserProvider>
    </HeroUIProvider>
  )
}