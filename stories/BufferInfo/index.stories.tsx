import React from 'react';
import { Story, Meta } from '@storybook/react';
import { BufferInfo } from 'components/BufferInfo';

export default {
  title: 'Example/BufferInfo/BufferInfo',
  component: BufferInfo,
} as Meta;

const Template: Story<PropType<typeof BufferInfo>> = (props) => (
  <BufferInfo {...props} />
);

export const UnchangedBufferInfo = Template.bind({});
UnchangedBufferInfo.args = {
  buffer: {
    path: '/foo/bar.md',
    body: 'test',
  },
};
