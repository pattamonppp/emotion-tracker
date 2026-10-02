import React from 'react';
import { Share2 } from 'lucide-react';
import type { IconProps } from './types';

export const ShareIcon: React.FC<IconProps> = (props) => {
  return <Share2 {...props} />;
};

export default ShareIcon;
