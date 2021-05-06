import React from 'react';
import { Story, Meta } from '@storybook/react';
import { FileView } from 'components/FileView';
import { RecoilRoot } from 'recoil';
import { fileViewFiles } from 'modules/fileView';

export default {
  title: 'Example/FileView/index',
  component: FileView,
} as Meta;

const Template: Story<{}> = (props) => (
  <RecoilRoot
    initializeState={({ set }) => {
      set(
        fileViewFiles,
        Array.from({ length: 100 }).map((_, idx) => ({
          path: `/TestFile${idx}.txt`,
          body:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        })),
      );
    }}
  >
    <FileView {...props} />
  </RecoilRoot>
);

export const List = Template.bind({});
List.args = {};
