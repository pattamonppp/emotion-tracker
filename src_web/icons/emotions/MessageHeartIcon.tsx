import React from 'react';
import { MessageSquareHeart } from 'lucide-react';
import type { IconProps } from '../types';

export const MessageHeartIcon: React.FC<IconProps> = (props) => {
  return <MessageSquareHeart {...props} />;
};

export default MessageHeartIcon;
