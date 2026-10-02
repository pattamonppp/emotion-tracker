import React from 'react';
import { Smile } from 'lucide-react';
import type { IconProps } from '../types';

export const SmileIcon: React.FC<IconProps> = (props) => {
  return <Smile {...props} />;
};

export default SmileIcon;
