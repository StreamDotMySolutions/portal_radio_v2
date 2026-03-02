import { create } from 'zustand'

const useBannersStore = create((set) => ({
    refreshKey: 0,
    setRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),

    paginatorUrl: null,
    setPaginatorUrl: (url) => set({ paginatorUrl: url }),

    search: '',
    setSearch: (search) => set({ search, paginatorUrl: null }),

    activeFilter: '',
    setActiveFilter: (activeFilter) => set({ activeFilter, paginatorUrl: null }),
}))

export default useBannersStore
