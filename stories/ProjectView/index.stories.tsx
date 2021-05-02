import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ProjectView, ProjectViewContainer } from 'components/ProjectView';
import { RecoilRoot } from 'recoil';
import { projectIsOpendStates, projectViewProjects } from 'modules/projects';
import { initializeState } from 'stories/utils/initializeStates';

const InitialStates = [
  [
    projectViewProjects,
    Array.from({ length: 100 }).map((_, idx) => ({ path: '/dir/item' + idx })),
  ],
  [projectIsOpendStates, { foo: true }] as const,
];

export default {
  title: 'Example/ProjectView/ProjectView',
  component: ProjectView,
} as Meta;

const Template: Story<PropType<typeof ProjectViewContainer>> = () => (
  <RecoilRoot initializeState={initializeState(InitialStates as any)}>
    <ProjectViewContainer />
  </RecoilRoot>
);

export const Index = Template.bind({});
const indexArgs: PropType<typeof ProjectViewContainer> = {};
Index.args = indexArgs;
