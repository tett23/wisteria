import { useMessageRequester } from 'hooks/useMessageRequester';
import { fileViewFiles, fileViewFileStates } from 'modules/fileView';
import { basename, dirname, join } from 'path';
import { useCallback, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSetRecoilState } from 'recoil';
import { Body } from './components/Body';
import { SelectedFile } from './components/SelectedFile';

type RenameProps = {
  body: string;
  path: string;
};

export function Rename({ body, path }: RenameProps) {
  return (
    <SelectedFile path={path}>
      <div>
        <Form path={path}></Form>
      </div>
      <Body body={body}></Body>
    </SelectedFile>
  );
}

function Form({ path }: { path: string }) {
  const { ref, onChange, onBlur } = useFormProps(path);

  return (
    <input
      ref={ref}
      className="border"
      defaultValue={basename(path)}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    ></input>
  );
}

function useFormProps(path: string) {
  const [filename, setFilename] = useState(basename(path));
  const requester = useMessageRequester();
  const setFileStates = useSetRecoilState(fileViewFileStates);
  const setFiles = useSetRecoilState(fileViewFiles);
  const save = useCallback(async () => {
    const newPath = join(dirname(path), filename);
    if (filename.length === 0 || newPath === path) {
      return;
    }

    const result = await requester('renameFile', {
      src: path,
      dst: newPath,
    });
    if (result instanceof Error) {
      return;
    }

    setFileStates(({ [path]: _, ...rest }) => rest);
    setFiles(({ [path]: item, ...rest }) => ({
      ...rest,
      [newPath]: { ...item, body: item?.body ?? '', path: newPath },
    }));
  }, [filename]);
  const ref = useHotkeys<HTMLInputElement>(
    'enter',
    () => {
      save();
    },
    { enableOnTags: ['INPUT'] },
    [save],
  );
  useEffect(() => {
    if (ref.current == null) {
      return;
    }

    ref.current.focus();
  }, [ref]);

  return {
    ref,
    onChange: (value: string) => {
      setFilename(value);
    },
    onBlur: save,
  };
}
