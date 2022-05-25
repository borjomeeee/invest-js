import { InputService, PromiseClient } from './types';

export function promisifyService<T extends InputService>(service: T): PromiseClient<T> {
  const dict: PromiseClient<T> = {} as any;

  for (const key in service) {
    const request = service[key];

    // @ts-ignore
    dict[key] = (req, metadata, options) =>
      new Promise((res, rej) => {
        request(req, metadata, options, (e: Error, v: any) => {
          if (e) {
            rej(e);
          } else if (v) {
            res(v);
          } else {
            rej(new Error('Undefined result'));
          }
        });
      }) as any;
  }

  return dict;
}
