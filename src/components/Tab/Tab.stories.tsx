import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { Tab, TabSize, TabType } from './Tab';
import { TabList } from './TabList';

export default {
  title: 'UI-Kit/Tab',
  component: Tab,
  argTypes: {
    size: {
      options: Object.values(TabSize),
      control: { type: 'select' },
    },
  },
} as Meta;

const tabs: TabType<string>[] = [
  {
    value: 'first_tab',
    label: 'First Tab',
  },
  {
    value: 'second_tab',
    label: 'Second Tab',
    count: 99,
  },
  {
    value: 'third_tab',
    label: 'Third Tab',
  },
  {
    value: 'fourth_tab',
    label: 'Fourth Tab',
    isLoading: true,
  },
  {
    value: 'fifth_tab',
    label: 'Fifth Tab',
    disabled: true,
  },
];

const Template: StoryFn = (args) => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <Tab value="tab_example" label="tab_example" {...args} />
    </div>
  );
};

const TabListTemplate: StoryFn = (args) => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  return (
    <TabList
      {...args}
      tabs={tabs}
      value={currentTab.value}
      onChange={(_, tab1) => setCurrentTab(tab1)}
    />
  );
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'Tab Example',
  value: 'tab_example',
  size: TabSize.LARGE,
};

export const TabListPrimary = TabListTemplate.bind({});
TabListPrimary.args = {};
