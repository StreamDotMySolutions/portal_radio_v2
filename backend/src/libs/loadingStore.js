import { create } from 'zustand'

const useLoadingStore = create((set) => ({
    count: 0,
    start: () => set((s) => ({ count: s.count + 1 })),
    done:  () => set((s) => ({ count: Math.max(0, s.count - 1) })),
}))

export default useLoadingStore
