import { useRecoilValue } from 'recoil';
import { fileViewFiles } from 'modules/fileView';

export function useFileList() {
  const files = useRecoilValue(fileViewFiles);

  return Object.values(files);
}
