import React, { useState } from 'react';

export interface RutinasContextType {
  rutinasSeguidasIds: number[];
  setRutinasSeguidasIds: React.Dispatch<React.SetStateAction<number[]>>;
  actualizarRutinas: boolean;
  setActualizarRutinas: React.Dispatch<React.SetStateAction<boolean>>
}

export const RutinasContext = React.createContext<RutinasContextType>({
  rutinasSeguidasIds: [],
  setRutinasSeguidasIds: () => {},
  actualizarRutinas: false,
  setActualizarRutinas: () => {},
});