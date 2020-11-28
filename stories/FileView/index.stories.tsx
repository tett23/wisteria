import React from 'react';
import { Story, Meta } from '@storybook/react';
import { FileView, FileViewProps } from 'components/FileView';

export default {
  title: 'Example/FileView/FileView',
  component: FileView,
} as Meta;

const Template: Story<FileViewProps> = (props) => <FileView {...props} />;

export const FullWidth = Template.bind({});
FullWidth.args = {
  files: Array.from({ length: 100 }).map(() => ({
    filename: 'TestFile1.txt',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  })),
};
