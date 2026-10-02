import React from 'react';
import { DEV_MODE } from '../config';
import { Button } from './Button';

interface DevActivityControlProps {
  onComplete: () => void;
}

export const DevActivityControl: React.FC<DevActivityControlProps> = ({ onComplete }) => {
  if (!DEV_MODE) return null;

  return (
    <Button
      variant="outline"
      colorTheme="blue"
      size="sm"
      fullWidth
      onClick={onComplete}
      label="DEV: Complete activity"
    />
  );
};
