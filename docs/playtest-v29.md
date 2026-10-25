# v29 economy and adventurer playtest

QA date: 2026-10-25. Headless Chromium at 390 × 844. Five natural-play runs injected only the initial reproducible birth seed; money, ages, gear, quests and outcomes were not assigned during the run. Choices, annual-plan menus and next-event controls were operated through the page. First affordable choices were used, with a cap of 220 UI iterations; runs are snapshots into adulthood, not five completed lifetimes.

| Life | Seed | Chronological age at stop | Decisions | Wallet (gold) | Debt (gold) |
| --- | ---: | ---: | ---: | ---: | ---: |
| poor | 15 | 21 | 110 | 34397.05 | 0.00 |
| crown | 1104 | 21 | 110 | 54749.18 | 0.00 |
| slime | 10 | 31 | 21 | 100.00 | 0.00 |
| golem | 287 | 71 | 23 | 938282.73 | 0.00 |
| dragon | 291 | 170 | 29 | 0.00 | 0.00 |

Ages differ because each species grows at its own pace. The human runs selected the adventurer path; the construct followed an automatically available civic career. These are reproducible paths, not a balanced population sample, economy forecast or human enjoyment study. The small sample does not estimate death rates.

## Observations and repairs

- Starter purses previously came from social origin. Newborn private money is now zero, while household/group capital remains owned by that group. Actual caregiver gifts and dynasty shares have named sources and deduct from those funds.
- A fixed adventurer wage created money without a completed expedition. That wage is removed; income requires a successful report after supplies and tax.
- An early candidate let inactive adventurers accumulate debt without visible work offers. Full-time adventurers now receive explicit contract, recovery and regular-work choices. Shared guild lodging, bounded new credit, provisions advances and light work provide recovery routes.
- Expedition choices initially kept pushing ordinary life events into the future. Their stage choices now preserve the ordinary-life due date; a regression assertion prevents that starvation.
- Race-neutral human feeding/medicine copy appeared in nonorganic care. Core/anchor care and material costs now replace it where appropriate, and nonorganic bodies are excluded from biological poison/plague. Native pet upkeep uses local resources.
- A long-lived myrmidon reached 1,009 decisions and exposed an older 1,000-decision save validation limit. The actual failed state was restored after extending the bounded decision count. A regression covers a veteran save above that old limit.
- Future invasion years were listed in the calendar. The UI now shows current news and elapsed history; faction leaders can receive preparation news for their own current decisions.

## Focused browser checks

- All 72 birth cards have zero private starter money.
- The current year is prominent in the life heading and playback controls. Calendar views at years 1000, 1006 and 1011 contain no future invasion schedule; the current invasion appears at 1012.
- An isolated adult fixture with zero money accepted actual supply credit, followed a three-stage expedition, reloaded mid-contract and settled the mission once. Later stages did not charge extra calendar quarters.
- An isolated house-purchase fixture supplied 10 million gold to exercise the expensive purchase control, not to represent earned wealth. Buying the 8.5-million estate deducted its price; base annual upkeep was 340,000. All five levels have real costs and resale losses.
- An eligible dynasty fixture requested and accepted a 30,000-gold share. The same amount left the family fund.
- Nonorganic spending and recurring-care labels were checked, along with 320/390/768/1366 layouts and runtime errors.

## Rule and simulation coverage

`check-economy-adventures.cjs`: 72 zero-money births, actual family transfers, annual four-quarter accrual, debt pressure, five housing levels, 104 mission branches, native costs, salary removal, supply repayment, replay protection, ordinary-life scheduling, legacy newborn/account migration, malformed input and veteran saves.

`check-story-context.cjs`: 72 species × six developmental ages = 432 contexts, totaling 26,603 eligible choice contexts. Checks cover adult gates, native status, cashless livelihoods, nonorganic bodily needs and quest geography.

The audit validates rules and selected text, not an individual reading of every possible authored paragraph or content combination. Narrative is finite; the 26 contract archetypes can repeat with changing state, decisions and consequences. Production concurrency and a shared multiplayer world were not tested.

Final full-lifetime regression passed: 72 races, 6,101 choices, 45,823 calendar quarters and 305 save round-trips.
