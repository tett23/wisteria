import { useRecoilCallback } from 'recoil';
import {
  editorCurrentBuffer,
  editorCurrentBufferChanged,
} from 'modules/editor';
import { WisteriaConfig } from 'messages';

export function useConfig(): () => Promise<WisteriaConfig> {
  return useRecoilCallback(
    ({ snapshot: { getPromise } }) => async (): Promise<WisteriaConfig> => {
      const buf = await getPromise(editorCurrentBuffer);
      const bufChanged = await getPromise(editorCurrentBufferChanged);

      return {
        window: {
          x: window.screenX,
          y: window.screenY,
          width: window.innerWidth,
          height: window.innerHeight,
        },
        buffers: {
          current: {
            buffer: buf,
            changed: bufChanged,
          },
        },
      };
    },
  );
}
