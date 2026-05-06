import { create } from 'zustand'

const useStationsStore = create((set) => ({
    refreshKey: 0,
    setRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),

    paginatorUrl: null,
    setPaginatorUrl: (url) => set({ paginatorUrl: url }),

    search: '',
    setSearch: (search) => set({ search, paginatorUrl: null }),

    categoryFilter: '',
    setCategoryFilter: (categoryFilter) => set({ categoryFilter, paginatorUrl: null }),

    dateFrom: '',
    setDateFrom: (dateFrom) => set({ dateFrom, paginatorUrl: null }),

    dateTo: '',
    setDateTo: (dateTo) => set({ dateTo, paginatorUrl: null }),
}))

export default useStationsStore
