import React from 'react';
import { Award } from 'lucide-react';
import type { IconProps } from './types';

export const AwardIcon: React.FC<IconProps> = (props) => {
  return <Award {...props} />;
};

export default AwardIcon;
