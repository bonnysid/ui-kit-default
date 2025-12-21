import { Meta, StoryFn } from '@storybook/react';
import { Plug } from './Plug';

export default {
  title: 'UI Kit/Plug',
  component: Plug,
} as Meta;

const Template: StoryFn = (args) => <Plug {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'Plug Title',
  text: 'Plug Text',
};
