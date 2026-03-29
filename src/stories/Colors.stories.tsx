import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { COLOR_METADATA } from './design-system.metadata';

const ColorBox = ({ name, color }: { name: string; color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
    <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '4px',
        backgroundColor: color,
        border: '1px solid #ddd',
      }}
    />
    <div>
      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{name}</div>
      <div style={{ fontSize: '12px', color: '#666' }}>{color}</div>
    </div>
  </div>
);

const ColorGroup = ({ title, vars }: { title: string; vars: string[] }) => (
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '16px' }}>{title}</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
      {vars.map((v) => (
        <ColorBox key={v} name={v} color={`var(${v})`} />
      ))}
    </div>
  </div>
);

const ColorsGallery = () => {
  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', minHeight: '100vh' }}>
      <h1>Colors</h1>
      <p>Эти цвета автоматически адаптируются под текущую тему (light/dark) и подтягиваются из переменных проекта.</p>
      
      {Object.entries(COLOR_METADATA).map(([group, vars]) => (
        <ColorGroup key={group} title={group} vars={vars} />
      ))}
    </div>
  );
};

const meta = {
  title: 'Design System/Colors',
  component: ColorsGallery,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ColorsGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
