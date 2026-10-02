import React from 'react';
import { Heart } from 'lucide-react';
import type { IconProps } from './types';

export const HeartIcon: React.FC<IconProps> = (props) => {
  return <Heart {...props} />;
};

export default HeartIcon;
