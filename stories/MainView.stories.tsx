import React from 'react';
import { RecoilRoot } from 'recoil';
import { Story, Meta } from '@storybook/react';
import { fileViewFiles } from 'modules/fileView';
import { MainViewProps, MainView } from 'components/MainView';
import { projectIsOpendStates, projectViewProjects } from 'modules/projects';
import { initializeState } from './utils/initializeStates';

const InitialStates = [
  [
    fileViewFiles,
    Array.from({ length: 100 }).map(() => ({
      filename: 'TestFile1.txt',
      body:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    })),
  ] as const,
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
  title: 'Example/MainView',
  component: MainView,
} as Meta;

const Template: Story<MainViewProps> = () => (
  <RecoilRoot initializeState={initializeState(InitialStates as any)}>
    <MainView />
  </RecoilRoot>
);

export const Index = Template.bind({});
Index.args = {};
