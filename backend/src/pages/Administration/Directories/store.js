import { create } from 'zustand'
const useStore  = create((set) => ({

    url: process.env.REACT_APP_BACKEND_URL,
    server: process.env.REACT_APP_SERVER_URL,
    
    refresh: false,
    errors: null,
    latestId: null,
    data: {},
    
    setValue: (fieldName, value) => {
      set((state) => ({
        data: {
          ...state.data,
          [fieldName]: { value },
        },
      }));
    },

    setError: (fieldName, error) => {
        set((state) => ({
          data: {
            ...state.data,
            [fieldName]: { error },
          },
        }));
    },
      
    emptyData: () => {
        set({ data: {} });
        set({ errors: {} });
    },

    getValue: (fieldName) => {
        const field = useStore.getState().data[fieldName];
        return field ? field.value : null;
    },

}));

export default useStore
//hello