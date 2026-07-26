# Qwen Wu Xing Ju Assessment

The full response is preserved at
`docs/research/imported/qwen-wu-xing-ju-review.txt`.

## Useful Outcome

Qwen focused attention on the transformed `yl` and `pl` parameters passed to
the public calculator's `timcuc` function. Direct source tracing then showed:

```text
al = wrapped Mệnh cell offset
yl = checkcan(checkcan(2 * yearStem + 1) + al - 1)
pl = check(al + 2)
cuc = timcuc(yl, pl)
```

This led to discovery of an engine bug: the Five Tiger Escape stem offset
from Dần used modulo ten without first wrapping the branch displacement
through twelve branches. The error affected Mệnh at Tý and Sửu.

After fixing that offset, all sixteen captured public-calculator cases match
the engine on Mệnh, Thân, Cục, and all fourteen major stars.

## Incorrect Or Unsupported Claims

Qwen's report must not be treated as a verified source:

- Its primary-source quotation has no page or scan and is explicitly marked
  `unverified citation`.
- It calls `timcuc` a bug before resolving the actual `yl` and `pl` inputs.
- It misstates the `timcuc` stem group for Mậu and contains inconsistent
  arithmetic in its worked examples.
- It calculates the 1984 case as Mệnh Tỵ/Ất Tỵ, while the verified engine and
  public capture both place Mệnh at Dần/Bính Dần.
- It labels the engine rule `verified` despite its own citations being
  unverified.

The accepted result is therefore the locally reproduced source trace and the
sixteen-case conformance evidence, not Qwen's historical verdict.
