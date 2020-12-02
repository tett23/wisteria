import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ProjectView, ProjectViewWC } from 'components/ProjectView';
import { RecoilRoot } from 'recoil';
import { projectIsOpendStates, projectViewProjects } from 'modules/projects';
import { initializeState } from 'stories/utils/initializeStates';

const InitialStates = [
  [
    projectViewProjects,
    [
      {
        id: 'foo',
        name: 'foo',
      },
      {
        id: 'bar',
        name: 'bar',
      },
    ],
  ] as const,
  [projectIsOpendStates, { foo: true }] as const,
];

export default {
  title: 'Example/ProjectView/ProjectView',
  component: ProjectView,
} as Meta;

const Template: Story<PropType<typeof ProjectViewWC>> = () => (
  <RecoilRoot initializeState={initializeState(InitialStates as any)}>
    <ProjectViewWC />
  </RecoilRoot>
);

export const Index = Template.bind({});
const indexArgs: PropType<typeof ProjectViewWC> = {};
Index.args = indexArgs;
