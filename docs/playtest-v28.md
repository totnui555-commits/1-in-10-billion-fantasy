# v28 player-flow audit

QA date: 2026-10-25. Actual headless Chromium at 390 × 844, through visible UI buttons. Only the initial reproducible birth seed was injected; ages, money and outcomes were not assigned during play. Game time was paused and advanced using the existing next-event button, then choices were selected manually by automation. This checks interaction paths, not natural reading time or human enjoyment.

| Life | Seed | Final chronological age | Major choices | Menus opened |
| --- | ---: | ---: | ---: | ---: |
| poor | 15 | 32 | 29 | 10 |
| crown | 1104 | 32 | 31 | 10 |
| slime | 10 | 41 | 29 | 10 |
| golem | 287 | 92 | 32 | 10 |
| dragon | 291 | 179 | 32 | 10 |

All five reached biological age 32. Chronological ages differ by species maturity. First affordable choices were used, including an adventurer path for the ordinary-born human; wealth outcomes are not a poverty benchmark. No deaths in this small, deliberately limited sample should be interpreted as a mortality-rate estimate.

## Problems found and resolved

- Birth details pushed extensive repeated social context into the first decision. Family/map details now fold under a summary, with the full content retained.
- A result offered no explicit way to return to planning the same quarter while paused. The acknowledgement button now clears only the result; a separate UI test confirms unchanged time, health, wallet, choice count and diary length.
- Native life shortcuts and decision wallets foregrounded gold despite subsistence being a different resource. Both now use local resources, with exchange options still available through the habitat controls.
- A human lunchbox childhood event could appear for dragons and awakened constructs. The eligibility rule now rejects it for strict native or awakened/crystalline origins; existing pending choices reconcile to an eligible context.
- Trust percentages exposed fractional simulation values; rendered kin trust now rounds without changing simulation state.
- Nonhuman quick family counts used the human counting unit; the UI now uses members.

## Tier checks

Race tier is an authored comparison of mature potential, with habitat/physical limits. Human and nonhuman birth tiers follow separate social meanings. Tiers add no power, mortality protection, eligibility gate or RNG use. Money alone does not raise a nonhuman society tier. Fixed birth opportunity and evolving current standing are displayed separately.

The tier guide has been opened from birth, life and society views. Its full 72-race catalogue, all eight tier boundaries, mobile/desktop overflow and reload were checked. A separate human run progressed naturally to age 18, bought a meal, observed the yearly purchase lock, adopted a tea dragon, exported a save and resumed with the same wallet, pet and tier values.

## Remaining development opportunities

- Broader nonhuman authored childhood scenes would improve variation beyond filtering unsuitable human events. This update adds classification and fixes an observed mismatch; it does not rewrite every species narrative.
- The five runs cover selected paths, not every profession, pet or authored event. Content remains finite and long lives can repeat.
- These are browser-local simulation checks. Production concurrency, shared worlds and human playtest enjoyment have not been measured.

Final full-lifetime regression: 72 races, 5,184 choices, 46,407 quarters, 305 save round-trips, all passed. Separate society, hazard and world/economy regression suites passed.
