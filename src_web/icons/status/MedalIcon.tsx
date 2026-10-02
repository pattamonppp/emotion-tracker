import React from 'react';
import { Medal } from 'lucide-react';
import type { IconProps } from '../types';

export const MedalIcon: React.FC<IconProps> = (props) => {
  return <Medal {...props} />;
};

export default MedalIcon;
