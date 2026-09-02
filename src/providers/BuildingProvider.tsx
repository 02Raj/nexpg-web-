'use client';

import { fetchBuildings } from '@/api/nexpg';
import { keys } from '@/lib/query';
import { useAuth } from '@/providers/AuthProvider';
import type { Building } from '@/types/database';
import { useQuery } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'nexpg.selectedBuildingId';

type BuildingContextValue = {
  buildings: Building[];
  building: Building | null;
  loading: boolean;
  selectBuilding: (id: string) => void;
  showSwitcher: boolean;
};

const BuildingContext = createContext<BuildingContextValue | null>(null);

export function BuildingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: keys.buildings,
    queryFn: fetchBuildings,
    enabled: Boolean(user),
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSelectedId(saved);
  }, []);

  const buildings = query.data ?? [];
  const building = buildings.find((b) => b.id === selectedId) ?? buildings[0] ?? null;

  useEffect(() => {
    if (building && building.id !== selectedId) {
      setSelectedId(building.id);
    }
  }, [building, selectedId]);

  const selectBuilding = useCallback((id: string) => {
    setSelectedId(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const value = useMemo(
    () => ({
      buildings,
      building,
      loading: query.isLoading,
      selectBuilding,
      showSwitcher: buildings.length > 1,
    }),
    [buildings, building, query.isLoading, selectBuilding],
  );

  return <BuildingContext.Provider value={value}>{children}</BuildingContext.Provider>;
}

export function useBuilding() {
  const ctx = useContext(BuildingContext);
  if (!ctx) throw new Error('useBuilding must be used inside BuildingProvider');
  return ctx;
}
