import React from 'react';
import { Story, Meta } from '@storybook/react';
import { FileListHeader } from 'components/FileView/FileListHeader';
import { RecoilRoot } from 'recoil';

export default {
  title: 'Example/FileView/FileListHeader',
  component: FileListHeader,
} as Meta;

const Template: Story<PropType<typeof FileListHeader>> = (props) => (
  <RecoilRoot>
    <FileListHeader {...props} />
  </RecoilRoot>
);

export const List = Template.bind({});
List.args = {};
