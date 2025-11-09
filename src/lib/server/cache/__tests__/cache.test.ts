import type { cacheClear, cacheGet, cacheSet, getCacheMetrics, withUnstableCache } from '../index';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

type UnstableCacheMock = <TArgs extends unknown[], TResult>(
  callback: (...args: TArgs) => Promise<TResult>,
  keyParts?: string[],
  options?: {
    revalidate?: number | false;
    tags?: string[];
  },
) => (...args: TArgs) => Promise<TResult>;

const createUnstableCache: UnstableCacheMock = (callback) => callback;
const unstableCacheMock = vi.fn(createUnstableCache);

const { unstubAllEnvs } = vi;

vi.mock('next/cache', () => ({
  unstable_cache: unstableCacheMock,
}));

type CacheModule = {
  cacheClear: typeof cacheClear;
  cacheGet: typeof cacheGet;
  cacheSet: typeof cacheSet;
  getCacheMetrics: typeof getCacheMetrics;
  withUnstableCache: typeof withUnstableCache;
};

const importCacheModule = () => import('../index') as Promise<CacheModule>;

const envOverrides = {
  CACHE_MAX_ENTRIES: '3',
  CACHE_TTL_MS: '60000',
  CACHE_MEMORY_THRESHOLD_MB: '4096',
  CACHE_MEMORY_CHECK_INTERVAL_MS: '60000',
  CACHE_MEMORY_CLEAR_STRATEGY: 'trim',
  CACHE_ENABLE_MONITORING: 'false',
} as const satisfies Record<string, string>;

let mut_cacheModule!: CacheModule;

beforeAll(async () => {
  Object.entries(envOverrides).forEach(([key, value]) => {
    vi.stubEnv(key, value);
  });
  mut_cacheModule = await importCacheModule();
});

afterAll(() => {
  unstubAllEnvs();
});

beforeEach(() => {
  unstableCacheMock.mockClear();
  mut_cacheModule.cacheClear();
});

afterEach(() => {
  mut_cacheModule.cacheClear();
});

describe('サーバーキャッシュ', () => {
  it('キャッシュ操作でヒットとミスが計測される', () => {
    // Given: 空のメトリクスと未キャッシュ状態
    const before = mut_cacheModule.getCacheMetrics();

    // When: 値を保存し、成功パスと失敗パスで取得する
    mut_cacheModule.cacheSet('metrics', { ready: true });
    const cached = mut_cacheModule.cacheGet<{ ready: boolean }>(
      'metrics',
      (v): v is { ready: boolean } => typeof v === 'object' && v !== null && 'ready' in v,
    );
    const miss = mut_cacheModule.cacheGet('missing');

    // Then: ヒット・ミス・セット数がそれぞれ 1 ずつ増える
    expect(cached).toEqual({ ready: true });
    expect(miss).toBeUndefined();

    const after = mut_cacheModule.getCacheMetrics();
    expect(after.hits - before.hits).toBe(1);
    expect(after.misses - before.misses).toBe(1);
    expect(after.sets - before.sets).toBe(1);
  });

  it('上限超過時に LRU エントリが退避される', () => {
    // Given: 3 件のエントリを登録し a を最新にアクセスした状態
    mut_cacheModule.cacheSet('a', 1);
    mut_cacheModule.cacheSet('b', 2);
    mut_cacheModule.cacheSet('c', 3);
    mut_cacheModule.cacheGet('a');

    // When: 4つ目のエントリを追加する
    mut_cacheModule.cacheSet('d', 4);

    // Then: 最も古い b が削除され、他は保持される
    expect(mut_cacheModule.cacheGet('b')).toBeUndefined();
    expect(mut_cacheModule.cacheGet('a')).toBe(1);
    expect(mut_cacheModule.cacheGet('d')).toBe(4);
  });

  it('エントリ個別の TTL を尊重する', async () => {
    // Given: 短い TTL を指定して値を保存
    mut_cacheModule.cacheSet('ttl', 'value', { ttl: 10 });

    // When: TTL 経過後まで待機する
    expect(mut_cacheModule.cacheGet('ttl')).toBe('value');
    await new Promise((resolve) => setTimeout(resolve, 15));

    // Then: TTL を過ぎた値は取得できない
    expect(mut_cacheModule.cacheGet('ttl')).toBeUndefined();
  });

  it('接頭辞を指定したクリアが可能', () => {
    // Given: user と post のキーを混在登録
    mut_cacheModule.cacheSet('user:1', { id: 1 });
    mut_cacheModule.cacheSet('user:2', { id: 2 });
    mut_cacheModule.cacheSet('post:1', { id: 3 });

    // When: user 接頭辞でクリアする
    const removed = mut_cacheModule.cacheClear('user:');

    // Then: user のみ削除され post は残る
    expect(removed).toBe(2);
    expect(mut_cacheModule.cacheGet('user:1')).toBeUndefined();
    expect(mut_cacheModule.cacheGet('post:1')).toEqual({ id: 3 });
  });

  it('Next.js unstable_cache と統合して重複計算を避ける', async () => {
    // Given: 高コスト計算を模した関数を unstable_cache でラップ
    const expensive = vi.fn((value: number) => Promise.resolve(value * 2));
    const cachedFn = mut_cacheModule.withUnstableCache(['expensive-test'], expensive, {
      revalidate: 60,
    });

    // When: 同じ入力で 2 回呼び出す
    const first = await cachedFn(2);
    const second = await cachedFn(2);

    // Then: 関数は 1 回だけ実行され、メモ化結果が返る
    expect(first).toBe(4);
    expect(second).toBe(4);
    expect(expensive).toHaveBeenCalledTimes(1);
    expect(unstableCacheMock).toHaveBeenCalledTimes(1);
  });

  it('不正フォーマットのキャッシュを破棄して再計算する', async () => {
    // Given: withUnstableCache が使用するストレージキーを偽装して異なる marker の値を保存
    const namespace = 'expensive-guard';
    const args = 5;
    const storageKey = `${namespace}::${JSON.stringify([args])}`;
    const expensive = vi.fn((value: number) => Promise.resolve(value * 2));
    const cachedFn = mut_cacheModule.withUnstableCache([namespace], expensive);
    mut_cacheModule.cacheSet(storageKey, { marker: Symbol('spoofed'), value: 999 });

    // When: 同じ引数で cachedFn を呼び出すと、偽装データを削除して再計算する
    const result = await cachedFn(args);

    // Then: 元関数が実行され、正しい値が namespaced entry として保存される
    expect(result).toBe(10);
    expect(expensive).toHaveBeenCalledTimes(1);
    const storedEntry = mut_cacheModule.cacheGet(
      storageKey,
      (entry): entry is { value: number } =>
        typeof entry === 'object' &&
        entry !== null &&
        'value' in entry &&
        typeof (entry as { value: unknown }).value === 'number',
    );
    expect(storedEntry?.value).toBe(10);
  });
});
