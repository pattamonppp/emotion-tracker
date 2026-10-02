import React from 'react';
import { Compass } from 'lucide-react';
import type { IconProps } from './types';

export const CompassIcon: React.FC<IconProps> = (props) => {
  return <Compass {...props} />;
};

export default CompassIcon;
