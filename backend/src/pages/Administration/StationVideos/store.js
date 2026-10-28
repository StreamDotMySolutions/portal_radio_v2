import { create } from 'zustand'

const useStationVideosStore = create((set) => ({
    refreshKey: 0,
    setRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),

    paginatorUrl: null,
    setPaginatorUrl: (url) => set({ paginatorUrl: url }),

    search: '',
    setSearch: (search) => set({ search, paginatorUrl: null }),

    stationFilter: '',
    setStationFilter: (stationFilter) => set({ stationFilter, paginatorUrl: null }),

    // All stations, for the filter and the create form
    stations: [],
    setStations: (stations) => set({ stations }),
}))

export default useStationVideosStore
