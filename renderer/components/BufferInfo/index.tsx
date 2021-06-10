import React from 'react';
import {
  editorCurrentBuffer,
  editorCurrentBufferChanged,
} from 'modules/editor';
import { useRecoilValue } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faFile } from '@fortawesome/free-solid-svg-icons';
import { basename } from 'path';
import classNames from 'classnames';

function BufferInfoView({
  path,
  changed,
}: {
  path: string | null;
  changed: boolean;
}) {
  if (path == null) {
    return null;
  }

  return (
    <div className="border-b-2 flex justify-between p-1 text-gray-700 select-none">
      <div className="flex items-baseline">
        <div className="mr-2">
          <FontAwesomeIcon
            icon={faFile}
            className={classNames('fa-fw', { ['text-gray-500']: changed })}
          ></FontAwesomeIcon>
        </div>
        <div>{basename(path)}</div>
        {changed && <div className="ml-2 text-sm text-gray-500">(changed)</div>}
      </div>
      <div className="cursor-pointer">
        <FontAwesomeIcon icon={faEllipsisV} className="fa-fw"></FontAwesomeIcon>
      </div>
    </div>
  );
}

export const Memoized = React.memo(
  BufferInfoView,
  (a, b) => a.path === b.path && a.changed === b.changed,
);

export function BufferInfo() {
  return <Memoized {...useProps()} />;
}

function useProps() {
  const path = useRecoilValue(editorCurrentBuffer)?.path ?? null;
  const changed = useRecoilValue(editorCurrentBufferChanged);

  return { path, changed };
}
