import React from 'react';
import { Copy } from 'lucide-react';
import type { IconProps } from './types';

export const CopyIcon: React.FC<IconProps> = (props) => {
  return <Copy {...props} />;
};

export default CopyIcon;
