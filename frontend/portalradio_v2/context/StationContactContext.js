'use client'

import { createContext, useContext, useState } from 'react'

const StationContactContext = createContext(null)

export function StationContactProvider({ children }) {
  const [stationContact, setStationContact] = useState(null)
  return (
    <StationContactContext.Provider value={{ stationContact, setStationContact }}>
      {children}
    </StationContactContext.Provider>
  )
}

export function useStationContact() {
  return useContext(StationContactContext)
}
