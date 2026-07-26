# DeepSeek Wu Xing Ju Assessment

The full response is preserved in
`docs/research/imported/deepseek-wu-xing-ju-review.json`.

## What Is Useful

DeepSeek clearly separates Na Yin, natal element, Life Palace element, and
the Wu Xing Ju number. Its candidate rule

> Cục = Na Yin of the Life Palace stem-branch, then Water 2, Wood 3,
> Metal 4, Earth 5, Fire 6

is consistent with the current engine's `jiazi-nayin-2` implementation for
several observed cases:

| Case | Engine Mệnh Can-Chi | Na Yin element | Engine Cục | Public calculator |
| --- | --- | --- | --- | --- |
| 1990-05-17 14:30 female | Bính Tuất | Thổ | Thổ Ngũ Cục | Thổ Ngũ Cục |
| 1984-02-02 00:15 male | Bính Dần | Hỏa | Hỏa Lục Cục | Hỏa Lục Cục |
| 1976-11-03 19:20 female | Canh Tý | Thổ | Thổ Ngũ Cục | Thổ Ngũ Cục |

The 1976 case initially diverged because the engine failed to wrap the
twelve-branch offset before reducing the palace stem modulo ten.

## Correction To The Follow-up Explanation

The later explanation that the engine uses a "forward" Mệnh count and gets
Mệnh `Thân` for the 1976 case is incorrect. The engine source uses:

```text
Mệnh = Dần + (lunarMonth - 1) - hourBranch
```

For `1976-11-03 19:20` this produces Mệnh `Tý`. A direct public calculator
capture shows `C. Tý`, i.e. Canh Tý, and Thổ Ngũ Cục. The original engine
audit incorrectly produced Mậu Tý because its stem offset used ten rather
than twelve when wrapping from Dần back to Tý/Sửu. The corrected engine now
produces Canh Tý and matches the calculator.

## What Is Not Yet Proven

The response labels several Ming-dynasty works as primary sources but gives no
page, edition, quotation, scan, or stable bibliographic locator. The claim
that all classical lineages unanimously use the rule therefore remains
`unverified-primary-source`, not `primary-source`.

The proposed Zi Wei placement formula

```text
index = (dayStemIndex + 2 * ju - 3) mod 12
```

must not be adopted. It uses the day stem rather than the lunar birth day and
does not provide a source citation. It also conflicts with the engine's
versioned lunar-day/Cục placement rule and with the separate candidate rule
already recorded in `unresolved-rules.json`.

The birth-year Na Yin simplification remains a calculator-observed
possibility, not a documented Trung Châu rule.

## Required Kimi Follow-up

Ask Kimi to verify only these claims:

1. Locate a page-level citation for the Life Palace Na Yin derivation.
2. Locate the exact original text or table for the Wu Xing Ju mapping.
3. Verify whether the classical Zi Wei formula uses lunar birth day, day
   stem, or another index.
4. Explain the 1976 conflict by identifying the calculator's Cục rule.
5. Return separate profiles for San He, Khâm Thiên Môn/Tứ Hóa, and the public
   calculator if their tables differ.

Until those checks are complete, the implementation policy is:

- keep the versioned Vietnamese baseline unchanged without new evidence;
- keep `trung-chau` as a fallback with warning;
- keep the Na Yin Life Palace rule versioned as baseline evidence;
- do not claim Trung Châu conformance.
