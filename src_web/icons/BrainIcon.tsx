import React from 'react';
import { BrainCircuit } from 'lucide-react';
import type { IconProps } from './types';

export const BrainIcon: React.FC<IconProps> = (props) => {
  return <BrainCircuit {...props} />;
};

export default BrainIcon;
