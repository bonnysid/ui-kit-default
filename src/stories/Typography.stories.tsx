import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { TYPOGRAPHY_METADATA } from './design-system.metadata';

const TypographyRow = ({ name, fontVar }: { name: string; fontVar: string }) => (
  <div style={{ marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
    <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
      {name} ({fontVar})
    </div>
    <div style={{ font: `var(${fontVar})`, color: 'var(--color-text-primary)' }}>
      The quick brown fox jumps over the lazy dog. 1234567890
    </div>
  </div>
);

const TypographyGroup = ({ title, vars }: { title: string; vars: { name: string; var: string }[] }) => (
  <div style={{ marginBottom: '40px' }}>
    <h2 style={{ marginBottom: '20px', color: 'var(--color-text-primary)' }}>{title}</h2>
    {vars.map((v) => (
      <TypographyRow key={v.var} name={v.name} fontVar={v.var} />
    ))}
  </div>
);

const TypographyGallery = () => {
  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <h1 style={{ color: 'var(--color-text-primary)' }}>Typography</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
        Используемые стили текста и шрифты. Подтягиваются автоматически из переменных.
      </p>
      
      {Object.entries(TYPOGRAPHY_METADATA).map(([group, vars]) => (
        <TypographyGroup key={group} title={group} vars={vars} />
      ))}
    </div>
  );
};

const meta = {
  title: 'Design System/Typography',
  component: TypographyGallery,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TypographyGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
