import React from 'react';
import { CFile } from 'models/CFile';
import {
  editorCurrentBuffer,
  editorCurrentBufferChanged,
} from 'modules/editor';
import { useRecoilValue } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faFile } from '@fortawesome/free-solid-svg-icons';
import { basename } from 'path';
import classNames from 'classnames';

export const BufferInfo = React.memo(
  ({ buffer, changed }: { buffer: CFile; changed: boolean }) => {
    return (
      <div className="border-b-2 flex justify-between p-1 text-gray-700">
        <div className="flex items-baseline">
          <div className="mr-2">
            <FontAwesomeIcon
              icon={faFile}
              className={classNames('fa-fw', { ['text-gray-500']: changed })}
            ></FontAwesomeIcon>
          </div>
          <div>{basename(buffer.path)}</div>
          {changed && (
            <div className="ml-2 text-sm text-gray-500">(changed)</div>
          )}
        </div>
        <div className="cursor-pointer">
          <FontAwesomeIcon
            icon={faEllipsisV}
            className="fa-fw"
          ></FontAwesomeIcon>
        </div>
      </div>
    );
  },
  (a, b) => a.buffer.path === b.buffer.path && a.changed === b.changed,
);

export function BufferInfoWC() {
  const props = useProps();
  if (props.buffer == null) {
    return null;
  }

  return (
    <BufferInfo buffer={props.buffer} changed={props.changed}></BufferInfo>
  );
}

function useProps() {
  const buffer = useRecoilValue(editorCurrentBuffer);
  const changed = useRecoilValue(editorCurrentBufferChanged);

  return { buffer, changed };
}
