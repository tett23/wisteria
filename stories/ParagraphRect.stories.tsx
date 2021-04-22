import React from 'react';
import { Story, Meta } from '@storybook/react';
import css from '../renderer/components/Preview/Preview.module.css';
import { atom, RecoilRoot, useRecoilCallback } from 'recoil';

type DummyParaProps = {
  text: string;
  idx: number;
  setSize: (pair: [number, number]) => void;
};

function DummpyPara({ text, idx, setSize }: DummyParaProps) {
  const content = text === '' ? <br /> : <>{text}</>;

  return (
    <div
      ref={(el) => {
        if (el == null) {
          return;
        }

        setSize([idx, el.scrollWidth]);
      }}
      className={css.paragraph}
    >
      {content}
    </div>
  );
}

const ParagraphWidths = atom<Record<number, number>>({
  key: 'calcWidth',
  default: {},
});

function Sample({ content }: { content: string }) {
  // const paragraphWidths = useRecoilValue(ParagraphWidths);
  const updater = useRecoilCallback(
    ({ set }) => ([idx, width]: [number, number]) => {
      set(ParagraphWidths, (current) => ({ ...current, [idx]: width }));
    },
    [],
  );

  const components = content
    .split('\n')
    .map((text, idx) => (
      <DummpyPara key={idx + text} idx={idx} text={text} setSize={updater} />
    ));

  return (
    <>
      <div className={css.pageOuter}>
        <div className={css.page}>{components}</div>
      </div>
    </>
  );
}

export default {
  title: 'Example/ParagraphRect',
  component: Sample,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<PropType<typeof Sample>> = (args) => (
  <RecoilRoot>
    <Sample {...args} />
  </RecoilRoot>
);

export const Primary = Template.bind({});
Primary.args = {
  content: SampleText(),
};

function SampleText(): string {
  return `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;
}
