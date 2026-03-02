import { create } from 'zustand'

const useVideosStore = create((set) => ({
    refreshKey: 0,
    setRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
    paginatorUrl: null,
    setPaginatorUrl: (url) => set({ paginatorUrl: url }),
}))

export default useVideosStore
