type PropType<F extends (...args: any) => any> = Parameters<
  F
>[0] extends undefined
  ? {}
  : Parameters<F>[0];
