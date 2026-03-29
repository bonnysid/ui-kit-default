import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { COLOR_METADATA } from './design-system.metadata';

const ColorBox = ({ name, color }: { name: string; color: string }) => {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  const rgbToHex = (rgb: string) => {
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    if (!match) return rgb;

    const r = Number.parseInt(match[1]);
    const g = Number.parseInt(match[2]);
    const b = Number.parseInt(match[3]);

    const componentToHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    };

    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`.toUpperCase();
  };

  const handleCopy = () => {
    if (boxRef.current) {
      const computedColor = window.getComputedStyle(boxRef.current).backgroundColor;
      const hexColor = rgbToHex(computedColor);

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(hexColor).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      } else {
        // Fallback for non-secure contexts (e.g., HTTP or local IP)
        const textArea = document.createElement('textarea');
        textArea.value = hexColor;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  return (
    <div
      onClick={handleCopy}
      title="Нажмите, чтобы скопировать HEX"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px',
        padding: '8px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        position: 'relative',
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-hover-primary)')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <div
        ref={boxRef}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '4px',
          backgroundColor: color,
          border: '1px solid var(--color-border-primary)',
          flexShrink: 0,
        }}
      />
      <div style={{ flexGrow: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{name}</div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{color}</div>
      </div>
      {copied && (
        <div
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'var(--color-success-primary)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
          }}
        >
          Copied!
        </div>
      )}
    </div>
  );
};

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
