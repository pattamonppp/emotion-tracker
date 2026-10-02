import React from 'react';
import { MapPin } from 'lucide-react';
import type { IconProps } from './types';

export const MapPinIcon: React.FC<IconProps> = (props) => {
  return <MapPin {...props} />;
};

export default MapPinIcon;
