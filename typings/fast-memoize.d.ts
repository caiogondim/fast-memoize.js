type Func = (...args: any[]) => any;

interface CacheCreateFunc<K, V> {
  (): {
    get(key: K): V;
    set(key: K, value: V): void;
    has(key: K): boolean;
   }
}

declare namespace memoize {
  interface Cache<K, V> {
    create: CacheCreateFunc<K, V>
  }

  type Serializer = (args: any[]) => string;

  interface Options<F extends Func> {
    cache?: Cache<string, ReturnType<F>>;
    serializer?: Serializer;
    strategy?: MemoizeFunc;
  }

  interface MemoizeFunc {
    <F extends Func>(fn: F, options?: Options<F>): F;
  }

  const strategies: {
    variadic: MemoizeFunc;
    monadic: MemoizeFunc;
  }
}

declare function memoize<F extends Func>(fn: F, options?: memoize.Options<F>): F;

export = memoize;
