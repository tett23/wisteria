import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMessageRequester } from 'hooks/useMessageRequester';
import { projectDirectoryStates } from 'modules/projects';
import { useListDirectory } from 'modules/projects/useDirectory';
import { join, basename, dirname } from 'path';
import { useCallback, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSetRecoilState } from 'recoil';

export function Renaming({ path }: { path: string }) {
  const { value, ref, onChange, onEnter } = useProps(path);

  return (
    <div className="pl-2 flex justify-between items-center select-none">
      <FontAwesomeIcon icon={faFolder} className="fa-fw mr-1"></FontAwesomeIcon>
      <input
        ref={ref}
        type="text"
        className="border"
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onEnter}
      ></input>
    </div>
  );
}

function useProps(path: string) {
  const [name, setName] = useState(basename(path));
  const rename = useRenameDirectory();
  const onChange = useCallback((value: string) => {
    setName(value);
  }, []);
  const onEnter = useCallback(() => {
    rename(path, join(dirname(path), name));
  }, [name]);
  const ref = useHotkeys<HTMLInputElement>(
    'enter',
    () => {
      onEnter();
    },
    { enableOnTags: ['INPUT'] },
    [onEnter],
  );
  useEffect(() => {
    if (ref.current == null) {
      return;
    }

    ref.current.focus();
  }, [ref]);

  return {
    value: name,
    ref,
    onChange,
    onEnter,
  };
}

function useRenameDirectory() {
  const requester = useMessageRequester();
  const listDirectory = useListDirectory();
  const setDirStates = useSetRecoilState(projectDirectoryStates);

  return useCallback(async (src: string, dst: string) => {
    if (dirname(src) === dst || src === dst) {
      setDirStates(({ [src]: _, ...rest }) => rest);
      return;
    }

    const result = await requester('renameDirectory', { src, dst });
    if (result instanceof Error) {
      return;
    }

    setDirStates(({ [src]: _, ...rest }) => rest);
    await listDirectory(dirname(dst));
  }, []);
}
