import { create } from 'zustand'
import type { PanelState } from '@/types'

interface DashboardState {
  panels: Record<string, PanelState>
  globalRefreshing: boolean
  selectedMapLayer: string
  showDataSources: boolean
  
  // Actions
  setPanelState: (panelId: string, state: Partial<PanelState>) => void
  setGlobalRefreshing: (refreshing: boolean) => void
  setSelectedMapLayer: (layer: string) => void
  toggleDataSources: () => void
  expandPanel: (panelId: string) => void
  collapseAllPanels: () => void
}

const initialPanelState: PanelState = {
  expanded: false,
  refreshing: false,
  lastUpdated: null,
  error: null,
}

export const useDashboardStore = create<DashboardState>((set) => ({
  panels: {},
  globalRefreshing: false,
  selectedMapLayer: 'all',
  showDataSources: false,

  setPanelState: (panelId, state) =>
    set((s) => ({
      panels: {
        ...s.panels,
        [panelId]: { ...(s.panels[panelId] || initialPanelState), ...state },
      },
    })),

  setGlobalRefreshing: (refreshing) => set({ globalRefreshing: refreshing }),
  
  setSelectedMapLayer: (layer) => set({ selectedMapLayer: layer }),
  
  toggleDataSources: () => set((s) => ({ showDataSources: !s.showDataSources })),
  
  expandPanel: (panelId) =>
    set((s) => ({
      panels: {
        ...s.panels,
        [panelId]: { ...(s.panels[panelId] || initialPanelState), expanded: true },
      },
    })),

  collapseAllPanels: () =>
    set((s) => ({
      panels: Object.fromEntries(
        Object.entries(s.panels).map(([id, state]) => [id, { ...state, expanded: false }])
      ),
    })),
}))
