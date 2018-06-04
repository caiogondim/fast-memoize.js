import memoize, { Options, Cache, Serializer } from "../..";

function add(a: number, b: number): number {
  return a + b;
}

const storage = new Map<string, number>();

const cache: Cache<string, number> = {
  get(k: string) {
    const val = storage.get(k);
    if (!val) {
      // This is not expected to happen but since `Map<K, V>.get` returns
      // `V | undefined`, we have to cover the undefined case
      throw new Error('failed to retrieve memoized value');
    }

    return val;
  },
  set(k: string, value: number) {
    return storage.set(k, value);
  },
  has(k: string) {
    return storage.has(k);
  }
};

const serializer: Serializer = (args: any[]) => args.join("-");

const options: Options<typeof add> = {
  cache,
  serializer,
  strategy: memoize.strategies.variadic
};

const mAdd = memoize(add, options);

mAdd(1, 2);
