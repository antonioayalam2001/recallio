import React from 'react';
import { Toaster } from 'sonner';
import 'sonner/dist/styles.css';

export const GlobalToaster: React.FC = () => {
  return <Toaster richColors position="top-center" closeButton />;
};
