"use client";

import React from 'react';

interface AdPlaceholderProps {
  toolName: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ toolName }) => {
  return (
    <div style={{
      minHeight: '100px',
      border: '1px solid #ccc',
      textAlign: 'center',
      padding: '20px',
      margin: '20px 0'
    }}>
      Ad Placeholder - {toolName}
    </div>
  );
};

export default AdPlaceholder;
