import React from 'react';
import { Flame } from 'lucide-react';
import type { IconProps } from '../types';

export const FlameIcon: React.FC<IconProps> = (props) => {
  return <Flame {...props} />;
};

export default FlameIcon;
