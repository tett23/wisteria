import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Memoized } from 'components/BufferInfo';

export default {
  title: 'Example/BufferInfo/BufferInfo',
  component: Memoized,
} as Meta;

const Template: Story<PropType<typeof Memoized>> = (props) => (
  <Memoized {...props} />
);

export const UnchangedBufferInfo = Template.bind({});
UnchangedBufferInfo.args = {
  path: '/foo/bar.md',
  changed: false,
};

export const ChangedBufferInfo = Template.bind({});
ChangedBufferInfo.args = {
  path: '/foo/bar.md',
  changed: true,
};
