import React from 'react';
import { Story, Meta } from '@storybook/react';
import {
  ProjectItem,
  ProjectItemProps,
} from 'components/ProjectView/ProjectItem';

export default {
  title: 'Example/ProjectView/ProjectItem',
  component: ProjectItem,
  argTypes: {},
} as Meta;

const Template: Story<ProjectItemProps> = (props) => <ProjectItem {...props} />;

export const Closed = Template.bind({});
const closedArgs: ProjectItemProps = {
  project: {
    path: '/dir/foo',
  },
  opened: false,
  setOpened: () => {},
};
Closed.args = closedArgs;

export const Opened = Template.bind({});
const openedArgs: ProjectItemProps = {
  project: {
    path: '/dir/foo',
  },
  opened: true,
  setOpened: () => {},
};
Opened.args = openedArgs;
