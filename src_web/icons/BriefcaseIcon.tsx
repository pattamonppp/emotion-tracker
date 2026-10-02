import React from 'react';
import { Briefcase } from 'lucide-react';
import type { IconProps } from './types';

export const BriefcaseIcon: React.FC<IconProps> = (props) => {
  return <Briefcase {...props} />;
};

export default BriefcaseIcon;
