import React from 'react';
import { CFile } from 'models/CFile';
import { FileMenu } from './components/FileMenu';
import { FileName } from './components/FileName';
import { Body } from './components/Body';
import { FileState } from 'modules/fileView';
import { SelectedFile } from './components/SelectedFile';
import { UnselectedFile } from './components/UnselectedFile';

type OwnProps = CFile;

export type FileProps = {
  selected: boolean;
  state: FileState;
} & OwnProps;

export const Saved = React.memo(
  (props: FileProps) => {
    const Wrapper = props.selected ? SelectedFile : UnselectedFile;

    return (
      <Wrapper path={props.path}>
        <div className="flex justify-between">
          <FileName filename={props.path}></FileName>
          <FileMenu path={props.path}></FileMenu>
        </div>
        <Body body={props.body}></Body>
      </Wrapper>
    );
  },
  (a, b) => a.selected === b.selected && a.body === b.body && a.path === b.path,
);
