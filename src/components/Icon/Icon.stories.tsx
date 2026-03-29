import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { ICON_TYPE_NAMES } from './types';

const meta = {
  title: 'UI-Kit/Icon',
  component: Icon,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      options: ICON_TYPE_NAMES,
      control: { type: 'select' },
    },
  },
  args: {
    type: 'edit',
    size: 60,
    style: { color: 'var(--color-icon-primary)' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  parameters: {
    layout: 'centered',
  },
};
export const AllIcons: Story = {
  render: (args) => {
    const handleDownload = (iconType: string, event: React.MouseEvent<HTMLDivElement>) => {
      const iconContainer = event.currentTarget;
      const svg = iconContainer.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = `${iconType}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '20px',
          width: '100%',
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        {ICON_TYPE_NAMES.map((iconType) => (
          <div
            key={iconType}
            onClick={(e) => handleDownload(iconType, e)}
            title="Нажмите, чтобы скачать SVG"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '16px',
              border: '1px solid #eee',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Icon {...args} type={iconType} />
            <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>{iconType}</span>
          </div>
        ))}
      </div>
    );
  },
  args: {
    size: 32,
  },
};
