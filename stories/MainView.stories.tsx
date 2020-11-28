import React from 'react';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { Story, Meta } from '@storybook/react';
import { fileViewFiles } from 'modules/fileView';
import { MainViewProps, MainView } from 'components/MainView';

export default {
  title: 'Example/MainView',
  component: MainView,
} as Meta;

const Template: Story<MainViewProps> = () => (
  <RecoilRoot initializeState={initializeState}>
    <MainView />
  </RecoilRoot>
);

const InitialStates = [
  [
    fileViewFiles,
    Array.from({ length: 10 }).map(() => ({
      filename: 'TestFile1.txt',
      body:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    })),
  ] as const,
];

function initializeState(snapshot: MutableSnapshot) {
  InitialStates.forEach(([k, v]) => snapshot.set(k, v));
}

export const Index = Template.bind({});
Index.args = {};
