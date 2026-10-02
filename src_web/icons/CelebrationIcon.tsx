import React from 'react';
import { PartyPopper } from 'lucide-react';
import type { IconProps } from './types';

export const CelebrationIcon: React.FC<IconProps> = (props) => {
  return <PartyPopper {...props} />;
};

export default CelebrationIcon;
