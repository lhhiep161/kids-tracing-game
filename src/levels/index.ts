import type { TracingLevel } from '../types/TracingTypes';
import { basicLevels } from './basic/basicLevels';
import { shapeLevels } from './shapes/shapeLevels';
import { numberLevels } from './numbers/numberLevels';
import { letterLevels } from './letters/letterLevels';
import { objectLevels } from './objects/objectLevels';

export type { TracingLevel };

export const allLevels: TracingLevel[] = [
  ...basicLevels,
  ...shapeLevels,
  ...numberLevels,
  ...letterLevels,
  ...objectLevels
];

export const levelsByCategory = {
  basic: basicLevels,
  shapes: shapeLevels,
  numbers: numberLevels,
  letters: letterLevels,
  objects: objectLevels
};

export const getLevelById = (id: string): TracingLevel | undefined => {
  return allLevels.find(level => level.id === id);
};

export const getLevelsByCategory = (category: string): TracingLevel[] => {
  return allLevels.filter(level => level.category === category);
};

export const getNextLevel = (currentId: string): TracingLevel | undefined => {
  const currentIndex = allLevels.findIndex(level => level.id === currentId);
  if (currentIndex === -1 || currentIndex === allLevels.length - 1) return undefined;
  return allLevels[currentIndex + 1];
};

export const getPrevLevel = (currentId: string): TracingLevel | undefined => {
  const currentIndex = allLevels.findIndex(level => level.id === currentId);
  if (currentIndex <= 0) return undefined;
  return allLevels[currentIndex - 1];
};