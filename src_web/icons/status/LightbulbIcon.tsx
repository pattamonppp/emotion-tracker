import React from 'react';
import { Lightbulb } from 'lucide-react';
import type { IconProps } from '../types';

export const LightbulbIcon: React.FC<IconProps> = (props) => {
  return <Lightbulb {...props} />;
};

export default LightbulbIcon;
