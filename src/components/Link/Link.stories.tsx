import { Meta, StoryFn } from '@storybook/react';
import { Link } from './Link';

export default {
  title: 'UI Kit/Link',
  component: Link,
} as Meta;

const Template: StoryFn = (args) => <Link {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Link',
  to: 'https://google.com/',
};
