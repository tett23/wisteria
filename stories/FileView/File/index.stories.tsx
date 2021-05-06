import React from 'react';
import { Story, Meta } from '@storybook/react';
import { File, FileProps } from 'components/FileView/File';
import { RecoilRoot } from 'recoil';

export default {
  title: 'Example/FileView/File',
  component: File,
  argTypes: {},
} as Meta;

const Template: Story<FileProps> = (props) => (
  <RecoilRoot>
    <File {...props} />
  </RecoilRoot>
);

export const LongText = Template.bind({});
LongText.args = {
  path: '/TestFile.txt',
  body:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
};

export const ShortText = Template.bind({});
ShortText.args = {
  path: '/TestFile.txt',
  body: 'Lorem ipsum',
};

export const EmptyText = Template.bind({});
EmptyText.args = {
  path: '/TestFile.txt',
  body: '',
};
