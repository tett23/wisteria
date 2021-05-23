import { useRecoilValue } from 'recoil';
import { previewPages } from './index';

export function usePreviewPage(page: number) {
  const pages = useRecoilValue(previewPages);

  return pages[page - 1] ?? { blockIndex: { start: 0, end: 0 }, offset: 0 };
}
