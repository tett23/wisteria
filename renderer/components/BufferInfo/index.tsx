import React from 'react';
import { CFile } from 'models/CFile';
import { editorCurrentBuffer } from 'modules/editor';
import { useRecoilValue } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faFile } from '@fortawesome/free-solid-svg-icons';
import { basename } from 'path';

export const BufferInfo = React.memo(
  ({ buffer }: { buffer: CFile }) => {
    return (
      <div className="border-b-2 flex justify-between p-1 text-gray-700">
        <div className="flex">
          <div className="mr-2">
            <FontAwesomeIcon icon={faFile} className="fa-fw"></FontAwesomeIcon>
          </div>
          <div>{basename(buffer.path)}</div>
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
  (a, b) => a.buffer.path === b.buffer.path,
);

export function BufferInfoWC() {
  const props = useProps();
  if (props.buffer == null) {
    return null;
  }

  return <BufferInfo buffer={props.buffer}></BufferInfo>;
}

function useProps() {
  const buffer = useRecoilValue(editorCurrentBuffer);

  return { buffer };
}
