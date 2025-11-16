export async function backoff(fn: () => Promise<any>, opts: { retries?: number, delay?: number } = {}) {
  const retries = opts.retries ?? 3;
  const base = opts.delay ?? 500;
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const wait = base * Math.pow(2, attempt - 1);
      await new Promise(r => setTimeout(r, wait));
    }
  }
}
