# GLM 5.2 Wu Xing Ju Assessment

The supplied response is preserved verbatim at
`docs/research/imported/glm-5.2-wu-xing-ju-review.txt`. It is classified as
model analysis, not as a primary source or an oracle fixture.

## Current Verdict

No executable rule should change based on this response. GLM describes the
engine state before the Five Tiger Escape fix and then marks an unlocated
classical quotation as verified. The current `jiazi-nayin-2` implementation
already produces:

| Case | Lunar date | Mệnh Can-Chi | Cục |
| --- | --- | --- | --- |
| 1976-11-03 19:20 female | 1976-09-12 | Canh Tý | Thổ Ngũ Cục |
| 1984-02-02 00:15 male | 1984-01-01 | Bính Dần | Hỏa Lục Cục |
| 1990-05-17 14:30 female | 1990-04-23 | Bính Tuất | Thổ Ngũ Cục |

The 1976 result is protected by a dedicated regression test. Across all
captured sets, 36 of 36 public-calculator cases match Mệnh, Thân, Cục, and
all fourteen major-star positions.

## Useful Parts

- The response identifies the candidate classical rule as deriving Cục from
  the Na Yin element of the Life Palace stem-branch.
- It recognizes the historical engine failure as a palace-stem indexing
  problem near the Tý/Sửu wrap.
- It keeps the calculator implementation and the proposed classical rule
  conceptually separate.

These observations agree with the existing DeepSeek/Qwen assessment only at
the level of research direction. They do not supply new primary evidence.

## Incorrect Or Stale Claims

1. **The engine no longer returns Mậu Tý / Hỏa Lục Cục for 1976.**
   `menhStem` first wraps the displacement from Dần through twelve branches,
   then reduces the heavenly stem modulo ten. It returns Canh Tý / Thổ Ngũ
   Cục.

2. **The report mixes zero-based and one-based Five Tiger Escape indices.**
   For a Bính year, the Dần palace stem is Canh. Applying
   `(2 * yearStem + 1)` directly to a zero-based Bính index is not a valid
   conversion of the traditional one-based mnemonic.

3. **Several Can-Chi and Na Yin labels are wrong.**
   Canh Tý is Bích Thượng Thổ, not "Tích Lịch Thổ." Mậu Tý is Tích Lịch Hỏa.
   The 1990 chart is Bính Tuất, not Đinh Tuất; Đinh Tuất also violates
   sexagenary stem-branch parity. Bính Tuất belongs to Ốc Thượng Thổ, not
   "Đốc Bảng Thổ."

4. **The 1984 case is not unresolved in this engine.**
   The Vietnamese astronomical calendar converts 1984-02-02 to lunar
   1984-01-01 and the chart to Bính Dần / Hỏa Lục Cục. The captured public
   calculator agrees.

5. **The calculator-bug verdict is unsupported.**
   The response gives no preserved calculator source, runtime trace, or
   reproducible mapping for its claimed 20 combinations. It interprets
   transformed `yl`/`pl` indices as a literal Can-Mệnh/Chi-Thân pair without
   establishing that coordinate convention. The 36-case agreement, including
   all five Cục values and Tý/Sửu boundaries, contradicts the claim that the
   observed calculator result is merely an accidental 1976 match.

## Citation Assessment

The claimed quotation from `紫微斗數全書` has:

- no verified page;
- no scan or stable digital locator;
- no edition-specific image;
- a `page` field that explicitly says `unverified citation`;
- a contradictory `verified: true` flag.

It therefore remains `unverified-primary-source`. It must not be promoted to
the methodology manifest or used to claim Trung Châu conformance.

## Research Policy

- Keep `jiazi-nayin-2` unchanged.
- Keep the public calculator classified as `comparison-oracle`.
- Keep `trung-chau` as a Vietnamese fallback with a warning.
- Require a page-level source or expert-approved fixture before changing the
  school profile.
- Treat GLM's `timcuc` table and source quotation as hypotheses requiring
  reproduction, not evidence.
