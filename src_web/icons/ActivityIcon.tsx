import React from 'react';
import { Activity } from 'lucide-react';
import type { IconProps } from './types';

export const ActivityIcon: React.FC<IconProps> = (props) => {
  return <Activity {...props} />;
};

export default ActivityIcon;
