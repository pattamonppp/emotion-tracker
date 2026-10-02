import React from 'react';
import { BatteryCharging } from 'lucide-react';
import type { IconProps } from './types';

export const BatteryChargingIcon: React.FC<IconProps> = (props) => {
  return <BatteryCharging {...props} />;
};

export default BatteryChargingIcon;
