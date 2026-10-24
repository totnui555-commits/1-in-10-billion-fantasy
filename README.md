# 1 in 10 Billion: Fantasy

เกมจำลองชีวิตแฟนตาซีภาษาไทย ตั้งแต่ถือกำเนิดจนถึงวันสุดท้าย พร้อมภาพพิกเซลเคลื่อนไหว เผ่าพันธุ์72แบบ อาณาจักร16แห่ง และเส้นทางชีวิตที่เกิดจากทางเลือกของผู้เล่น

**เล่นเกม:** https://one-in-10-billion-fantasy.traisorn-th.chatgpt.site

## Run locally

Requires Python3.8+; Node.js is optional for JavaScript syntax checks.

```sh
python3 scripts/build-client.py
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. No npm install, database, or API key is needed. Player saves stay in the browser; export/import JSON to move a life between domains or devices.

## Deploy

Publish `dist/` with any static web host. For Cloudflare Pages, connect this repository, use `python3 scripts/build-client.py` as the build command and `dist` as the output directory. See [CLOUDFLARE.md](CLOUDFLARE.md) for Direct Upload and Wrangler alternatives.

## Source layout

- `dist/`: editable game modules, styles, pixel renderer, world data and a ready-to-serve build.
- `client-manifest.json`: script and stylesheet order used by the bundler.
- `scripts/build-client.py`: rebuilds the fingerprinted browser assets.
- `scripts/package-pages.py`: packages a Cloudflare Direct Upload ZIP.

This repository starts from the published v19 game. Hosting account configuration and historical build bundles are excluded.

Original Thai-language fantasy life simulator. Vanilla HTML/CSS/JavaScript with runtime pixel animation and no gameplay API. Run `python scripts/build-client.py` after source changes, then serve `dist/` on a static web server or CDN. No external game assets or API keys are required.

## Current gameplay (v20)
72 playable races, 16 kingdoms, 8 social origins, 123 professions, 15 businesses, 36 companion species, 45 purchasable props, 12 long-term projects, 957 canonical choice events and 768 pixel scene configurations. Named households, species-specific growth, annual focus, local social standing, cross-species relations, death/rebirth and a searchable illustrated diary persist in browser-local saves. Content is authored and finite; rare contexts and long lives can still repeat.

## Saves
Autosave uses IndexedDB, with the current life backed up in localStorage. JSON export/import supports device migration and backup. Saves are validated; event definitions are restored from trusted bundled data. No cloud save, user accounts, shared world, online memorial, server-authoritative scoreboard, or analytics. Users control their own saves; this is a single-player game, not an anticheat architecture.

## Hosting and scale
Publish `dist/` on a static CDN. Each player simulates their own life locally, with zero server calls per turn. This avoids a shared simulation bottleneck. No tested concurrency guarantee; production capacity depends on hosting limits, traffic, cache behavior and plan. External fonts can be self-hosted later. `_headers` contains CSP and browser security headers for hosts supporting the Cloudflare/Netlify convention; confirm actual response headers when moving hosts.

## Validation
The v4 baseline had seeded lifetime, save and DOM checks. The v5 changes received JavaScript syntax checks only; real-browser visual and functional QA remains to be done.

## Originality
Inspired by the random-birth and whole-life format of the two supplied references. All game code, world, text, and canvas art are original. No anime characters or downloaded reference assets are used.

## Automatic life (v2)
Life progresses automatically by default, with an independent decision policy and clock. Pause/resume, 1–16x speeds, 5/30/60/90-minute target pacing excluding reading time, 4 policies, highlighted 5–14 second decision countdowns, automatic outcome reading, per-year progression between events, and manual override. Turning automatic choices off pauses only at decisions. Dialogs, hidden tabs, and encyclopedia/archive pause the simulation. First careers and budgeted pet care are managed automatically; an explicitly chosen focus is respected. Journey fractions and playback preferences are saved. No offline catching up and no automatic rebirth. See `dist/autoplay-notes.html` for source-backed analysis and differences from the reference.

## Continuous life stories (v3)
Narrative pages now continue between decisions. Original authored content covers all life stages, 24 race experiences, 8 kingdom atmospheres, 72 career tasks, household meals and housing, ongoing everyday arcs, focus practice, and callbacks to actual decisions. Stable named NPCs have persistent trust and once-per-chapter interactions. Partner and adopted children join the social roster. A rolling 360-page diary and integrated chronicle persist on the device. IndexedDB stores larger life histories, with the current life backed up in localStorage; old saves migrate. Narration uses its own deterministic selection, never the event RNG. Narrative stat gains are limited by biological year. Reading cadence is configurable and fresh pages receive a reading hold independent of simulation speed. These are representative moments within a life, not a minute-by-minute or AI-generated unlimited simulation.

## Calendar and birth redesign (v4)
The opening now gates gameplay: welcome → animated birth roll → readable identity certificate → explicit accept or reroll. No simulation or full character dashboard appears before acceptance; unaccepted candidates persist across reloads. Existing accepted saves return through a resume screen.

A quarter-year calendar replaces the chapter-skip loop. Months 1/4/7/10 emit automatic everyday moments, work, family, minor setbacks and rewards into a dated feed. Only eligible major events interrupt the calendar for decisions; those are manual by default, with optional autoplay. A birth animation respects reduced motion. The reading UI is organized around the dated life feed, a focused decision panel, and a compact character sidebar (below the feed on mobile).

Names now compose 24 race-specific phonetic profiles with 8 kingdom-specific regional and house dictionaries. 100,000 generated identities in the validation sample had 100,000 distinct full names; this is not a global uniqueness guarantee or a claim of 100,000 separately authored names.

Validation: 250 complete calendar lives, 169,082 automatic events and 3,779 major decisions; birth acceptance gate, multiple events within a year, major-choice time freeze, save roundtrips, reduced-motion roll, reroll, persisted unaccepted candidates, initial no-dashboard UX, and complete automatic UI life. Browser visual QA remains unavailable in this environment; DOM validation does not verify rendering on real devices.

## Family, agency, atlas, and scene art (v5)
Every origin now builds a named household of 2–7 people with family roles, occupations, traits, and persistent trust. The ten household histories include mixed-race adoptive parents, siblings, caretakers, travelers, and extended relatives; even a temple upbringing has a chosen family around the newborn. These people appear on the birth certificate, in the life feed, and in the pixel scenes.

The autoplay calendar holds more frequent major decisions, adds 192 race-and-kingdom origin events, eight social-class crises, and ten household events, and records each answer in the diary. Players can also choose one optional action per quarter: spend time with family, explore the neighborhood, practice a skill, or rest. This action does not stop ordinary calendar progression. Career changes, migration, family trust and children become part of the same record.

An illustrated eight-realm atlas marks the birthplace, current home, and traveled route. Each kingdom has named local places and landmarks. Canvas pixel art now changes its terrain, palette, buildings, weather, season, work props, household figures, and event motif with the current story. The world and all illustrations are authored in the bundled JavaScript/SVG; the game still runs as a static site with no gameplay API.

IndexedDB stores the life diary and archive, with the current life backed up in localStorage. JSON export/import remains available. Older saves receive a household and a starting map point when loaded.

The current calendar includes 293 stateful choice events (the prior 83 plus 192 origin intersections, 8 social-class stories, and 10 household stories), in addition to automatic authored routine scenes. Content remains finite and hand-authored. Validation in this revision: JavaScript syntax checks only. No browser-based visual or functional run was available for the v5 changes.


## Classic pixel presentation v7
Flat, restrained UI with one primary reading column, concise birth flow, collapsible playback settings and map, and quick family access. The world atlas uses deterministic SVG tiles; runtime pixel scenes retain race, family, weather and event variations. No generated raster artwork is loaded or shipped. Map zoom, labels and keyboard realm selection remain available.

Validation: JavaScript syntax and DOM interaction checks for welcome, birth acceptance, family dialog, settings, scene presence and map controls. DOM checks stub canvas rendering and do not verify browser visuals.

## Pixel animation v8
Canvas scene redraws at 8 fps using pixel primitives. Animated characters, blinking, clouds, leaves, water, bubbles, embers and flags vary by kingdom. The same RAF loop drives rendering; no additional timers. Motion pauses offscreen, with the game paused, in dialogs and in hidden tabs. Reduced-motion preference defaults to a still scene, with an explicit per-device toggle. A new renderer filename and versioned scripts prevent reuse of the earlier raster renderer.

## Life progression v9
- 44 careers, persistent proficiency and five professional levels; age, education and reputation gates.
- 12 businesses with capital, seasonal/location demand, operating costs, staff, cash reserves and closure. Household costs and paid work scale to race lifespan; older characters can reduce work hours.
- Seven visible growth stages, childhood skill development, education choices, aging relatives and distinct adopted children.
- 12 new persistent three-part story arcs, 48 age-specific daily scenes, dialogue by age/role/trust, and remembered major choices. Recent content and stored cast identities preserve continuity; departed family members cannot continue speaking in new events.
- Existing v8 saves migrate optional modules; original career indexes remain stable. Canvas art is procedural and animated.

Checks include full lifetimes and save round-trips, business accounting/action locks, age gates, DOM flows and pixel-frame differences. DOM checks stub the canvas; no browser visual QA was available. Narrative is authored procedural content and can repeat in long lives; it is not generated by a live language model.

## Timing and age correction v10
Every automatic delay uses the selected speed: quarter progression, automatic choice reading and results. Fractional time is preserved and catch-up stops at manual choices. Fast speeds no longer hit an unscaled reading floor.

Short-lived races retain at least18 chronological years of childhood; later aging still reflects lifespan. Event eligibility shares this developmental calculation, and family/portrait ages use the same conversion. Rent, legal and civic choices are adult-gated. Eight childhood choices and supervised daily scenes cover younger ages. Diary entries record the actual quarter month.

Pending wrong-age questions in existing saves migrate to eligible questions. Previous completed records remain in the full diary with a legacy age-context label, but are excluded from the current feed and future memory callbacks.

Validation: speed ratio and calibrated timing, manual pause and blocked states, fractional progress,2,112 age/rank cases across24 races, reproduction of the four-year-old goblin rent question, migration, UI checks, and complete24-race lifetimes. Canvas/DOM checks do not replace browser visual QA.

## 1 in 10 Billion: Fantasy — v11
Public title and in-game branding are renamed; the existing origin, IndexedDB and legacy import/save keys stay intact. The title is a game name; no live player counter or measured rarity is implied.

Content:36 races,64 professions,372 authored major events, including60 new age-gated race/work/shared scenarios. New name roots, daily cultural details, demon-kind checks and pixel silhouettes accompany the12 appended races. Existing indexes stay stable for saved lives.

Geography: connected mainland and offshore reef, mountain drainage/lakes,13 smaller settlements, roads/passes and maritime routes. The atlas uses one static authored SVG plus91 live overlay nodes. Terrain is no longer rebuilt as thousands of DOM nodes during life updates.

Delivery: scripts/build-client.py creates one content-addressed JS bundle and one CSS bundle from client-manifest.json. Versioned assets use1-year immutable caching; HTML revalidates. Simulation runs locally, with no server request per life event. IndexedDB coalesces rapid updates and correctly tracks archive mutations. Synchronous emergency backups are throttled during ordinary play and forced on pagehide. No concurrent live-user capacity claim has been measured.

Validation:36 full lifetimes/save round-trips,all20 new career scenarios,new race age/kind gates,7,680 unique generated name samples,atlas interaction/structure,clock regression and storage burst/abort/retry checks. DOM/canvas checks are not browser visual QA or a production load test.

## Lived world and annual plans — v13

- 256 contextual pixel scene configurations: 32 distinct location layouts in eight kingdom architectural treatments. Interiors, workplaces, hobbies, mountains, sea travel and border crossings use different layouts and props. Weather, time, species, companions and purchased items add variations. This is runtime canvas animation, not 256 video files.
- 48 playable peoples. Twelve appended forms include a quadruped dragon, phoenix, crystal slime, centaur, arachne, river merfolk, living armor, myconid, lantern spirit, ink demon, giant and rabbitkin. Existing race/job indices stay stable. Seven inherited family backgrounds include hero and demon ruler houses; existing save households are preserved.
- 85 new authored major events, 457 in total. Childhood, race, family, class, career and goblin-policy branches have gated consequences and followups. Adult decisions occur more frequently; younger characters remain age gated. Pending choices are protected from context-changing purchases, plans and relocation.
- 23 annual focus definitions and six dispositions; available options depend on age, race, occupation and companion. Plans continue until changed and never grant stats on click. Quarterly effects are idempotent. Automatic choices also account for temperament. Social standing, trust, human relations, renown and class mobility are visible.
- 36 companion species and 36 purchasable props. Adoption, upkeep, health, training, aging, rehoming, hobby selection and resale have real costs and saved effects. Props appear in relevant scenes; related species share some sprite families.
- Choice results display actual numeric changes, including social metrics. Losing all health ends the life and records it. Save validation accepts the previous format while validating new modules.

Validation: 256 distinct rendered scene frames, all 36 prop visual changes, 48 race previews, previous-version save migration, complete seeded lifetimes across all 48 races, pet/item cost and save checks, quarterly locks, child age rules, clock regression, and browser flows at 320/390/768/1366 pixels. These are functional/render checks, not a production concurrency load test. Authored content remains finite and may repeat after eligible pools are exhausted.

Use `scripts/package-pages.py` and `CLOUDFLARE.md` for the Cloudflare Direct Upload package. An authenticated Cloudflare account is required to publish it.

## Long-term projects and remembered scenes — v14

Twelve optional projects turn annual interests into linked stories with a named participant, three stages and a recorded ending. They include learning to read, family recipes, a community performance, professional work, a shared library, goblin diplomacy, a dragon refuge, demon agreements, a hero family's legacy, a sustainable business, recovery routines and a map made from traveled routes. Availability depends on age, race, family, equipment, work and business requirements. Their 36 new decisions contain 108 choices, bringing the canonical event catalog to 493 entries.

Only one project progresses at a time. Progress comes from elapsed biological time while the annual focus supports it and required resources remain available. Starting or resuming gives no immediate reward. A player can pause a project and later resume its saved stage, progress and earlier choices; paused time creates no progress, fees or rewards. Costs apply to productive periods, and an unfunded project waits without creating debt. Ready stages offer major decisions, with bounded retries after failure. Earlier choices are carried into later-stage prose and the final record. If a family participant dies, the story records the loss and introduces a new helper rather than continuing their dialogue.

Four projects remain tied to their original kingdom: the community library, dragon refuge, sustainable business and demon charter. Moving away pauses work on those projects until the player returns. Other projects can travel with the character when their requirements still hold.

The journal now supports keyword search, age and story-type filters, oldest/newest ordering and 30-page pagination. Each individual page has chronological previous/next navigation and a pixel scene. Viewing or filtering the journal does not change the simulation, choices or random stream; the existing dialog pause holds life while reading.

New journal pages can preserve the character's age, appearance, job, family members, active pet and owned items as they were when recorded. Up to 120 visual snapshots are retained among the 360 stored diary pages, favoring recent pages and major milestones. Pages without a retained snapshot, including older saves, show a location-only illustration with an explicit caption; they do not reconstruct past people or possessions from the current character.

Validation for the journal UI: DOM checks for pagination, combined category filters, keyword/age/order filters, escaped stored text, chronological navigation, visual-memory calls, legacy labels and unchanged state/random stream. These checks use a stubbed canvas and do not replace the integration and browser checks for the complete v14 build.


## Connected peoples and concise narration — v15

- Removed automatic quarterly/yearly focus summaries and instructional adulthood prose from narration. Focus rewards, costs, household trust and companion care still run each quarter. Concrete raids, funding problems and companion losses still receive records. Prose selection favors less-used passages, trims repeated background paragraphs, and removes duplicate routine pages. Baby conversations now rotate through concrete family moments.
- Thirteen connected population groups cover all 48 playable races. Thirteen shared pair states track affinity and tension across human/demon borders, dragon/goblin hunting grounds, human/goblin grain raids, forest/mining disputes, orc migration, sea routes, construct labor, celestial accusations, undead recognition and other regional ties. These states belong to one local playthrough; there is no multiplayer shared world.
- 52 new adult decisions (156 choices) present pressure and cooperation from both sides. Choices, goblin annual policies and completed diplomacy/refuge projects change shared relations; peaceful and hostile events have different eligibility. Age-specific news affects the household, workplace, class context and relevant pixel scene. A new World tab shows current relationships and actual changes. News and pair/history arrays are bounded and validated.
- Each race has an explicit maturity age: humans 18, goblins 12, true dragons 120, with profiles for all 48 races. Developmental age gates apply to events, work, family, growth labels and pixel figures. Legacy biological clocks migrate without resetting project progress, identities or family ties. Old redundant focus pages are pruned; substantive decisions remain.

Validation: all 48 complete lifetimes, 2,288 choices, 35,128 quarter ticks and 144 save roundtrips; all 52 new events and 156 choices; foreign NPC race persistence, shared conflict/peace gates, child restrictions, diplomacy effects, malformed saves, v14 project-clock migration, 256 unique rendered scene frames, clock and project regressions. Real Chromium checks pass at 320/390/768/1366 pixels for cross-species decisions, world/history UI, journal snapshots and race-specific adulthood. In one fixed 80-quarter human/family scenario, repeated exact paragraphs decreased from 169/317 (53.3%) to 28/187 (15%); this is a bounded comparison, not a guarantee for every life.


## Spending, decision popups and brief moments — v16

- The main life feed shows one short excerpt of up to 110 characters per moment; results use up to 180 characters. Longer prose, choices and pixel snapshots remain available in journal pages. Losses and critical events use red styling and text labels; important milestones use a red title and a distinct label. Family/pet loss, business closure and the final death record are covered, including legacy loss keys.
- Eligible major decisions open in a native dialog with costs, affordability, brief context and direct choices. Manual mode waits indefinitely. Automatic mode continues its existing scaled countdown inside the decision dialog; ordinary dialogs still pause all time. A question can be folded, reopened, closed with Escape or the close button, without discarding the pending choice. Dialog lifecycle guards prevent queued close events from corrupting a newly opened modal.
- Twelve discretionary expenses cover family meals/gifts, medical care, study, hobbies, gardening, excursions, community aid, professional tools, renovations, housing and heritage. Prices, actual effects, annual purchase locks, age and context gates are shown before payment. Housing ownership and up to three improvements reduce actual living costs; house resale is explicit and confirmed.
- Four saving strategies hold funds separately from spendable coins. Deposits and withdrawals conserve principal. Fractional-year returns accrue only as biological time passes, with deterministic market variation, bounded balances, and no repeated settlement per quarter. An open decision may draw existing invested funds back into cash. Optional recurring meals/health/hobby expenses share a 20% cash / 40-coin yearly ceiling and skip unaffordable items.
- Twelve new canonical money decisions / 36 choices include roof repair, family medicine, tools, invitations, a winter coat, tuition, pet care, festivals, fire damage, housing, bridge repairs and magical research. Straight purchases settle deterministically; they do not randomly fail after deducting their price. Prior saves migrate with zero invested funds and no enabled recurring expenses.

Validation: all 48 complete lifetimes, 2,635 choices, 35,104 quarter ticks, 148 save roundtrips, 256 distinct rendered scenes; all 36 money-event choices; spending balances, purchase locks, compounding rate bounds, time-only interest, recurring budgets, housing costs, malformed imports and v15 migration. Real Chromium QA covers manual/automatic modal timing, funding a pending choice, fold/reopen/Escape/close behavior, short vs full journal prose, red loss markers, all spending controls, and no overflow at 320/390/768/1366 pixels. Existing world, birth, annual-focus, pet, shop, project, snapshot, journal and clock regressions pass.


## People, aspirations and the eastern continent — v17

24 append-only peoples bring the catalog to72, with distinct names, maturity, culture, pixel silhouettes and two age-gated origin decisions each. They include kobolds, harpies, selkies, kelpies, gargoyles, cyclopes, sphinxes, kirin, thunderbirds, leviathans, mimics, porcelain people, liches, dullahan, banshees, djinn, candle/smoke/hunger/clock demons, snow spirits, coral people, myrmidons and pangolin kin. Existing indexes retain their meaning.

40 appended occupations bring the total to104. Each has requirements, pay, daily tasks and a specific dilemma. Examples include dragon couriers, airship repair, interspecies field medicine, memory repair, living books, cloud turbines and mail for the dead. Eight new realms add their own settlements, naming traditions, local troubles and architecture: fjords, rain-shadow oases, cliff ports, fungal wetlands, brass canals, salt basins, steppe routes and volcanic islands. The atlas preserves the original eight realm coordinates and adds connected roads and sea routes,16 accessible region selectors, zoom and a whole-world view. All businesses have demand values for all16 realms.32 location layouts support16 architectural treatments:512 runtime pixel configurations, not video files.

A bounded relationship cast links family members with named foreign friends, a mentor and a rival. Other relatives, partners and children join as life proceeds. Each person has preferences, an aspiration, individual trust, stored memories and a race-based age. Dead people cannot speak in new relationship events or receive actions; their recorded ages stop advancing. Older saves retain known identities where available.

Eight linked three-stage stories add24 major decisions and72 choices. Previous answers appear in later stages, change trust and can create promises with actual deadlines. Keeping a promise requires a matching player action; elapsed time settles kept or broken commitments. Actions have real coin costs, pending-choice protection and one global action per biological quarter. Eight aspirations have three milestones each; actual help and gifts create support, and milestones require further elapsed time. Completing an aspiration is recorded and can improve happiness and trust. Opening a view gives no reward. Authored content is finite and can repeat.

The people album shows actual portraits, preferences, aspirations, promises and shared moments. End-of-life remembrance uses recorded memories of actual surviving people. The main feed stays brief; full diary pages retain the longer record. World catalog search and72 race previews make the larger catalog easier to browse; profession search remains available.

Optional new state migrates into existing v16 saves. Simulation and animation remain browser-local with no server request each turn, no multiplayer shared world and no measured production concurrency claim.

Validation:72 complete seeded lifetimes and legacy-save regressions;512 distinct rendered scene frames and72 race previews;all360 added race/job/realm choices plus72 relationship-story choices;kept and broken promises, loss locks, age clocks, read-only views and RNG preservation;all24 aspiration milestones with actual action costs and elapsed-time settlement;256 connected realm pairs,1,152 race/realm naming contexts and finite business demand in all16 realms. A real v16 save migrates while preserving name, money and household identity. Real Chromium checks cover named portraits, action costs and locks, decision/commitment flows, catalog and career search, map markers/zoom/details, save reload and no overflow at320/390/768/1366 pixels. Spending and project regressions pass. These checks do not establish production concurrency capacity.


## Human origins, chosen lives and a personal farewell — v18

New birth rolls choose human with probability0.40. The remaining0.60 is divided equally among the other71 playable races. This uses one seeded draw and applies only to new candidates; loading an existing life never rerolls it. In a100,000-seed sample there were39,925 human births (39.925%), consistent with the configured40% probability rather than a quota for every100 rolls.

Humans receive one of16 fictional cultural backgrounds, sometimes a second household culture. Languages, recipes, naming roots and traditions vary; culture and cosmetic complexion do not grant innate skill, morality or intelligence bonuses.40 named houses span ten categories: ruling dynasties, cadet royal houses, sovereign-scale houses, nobles, knights, mages, merchants, craftspeople/artists, agricultural households and ordinary families. Four ruling dynasties are bound to their actual realm; branches of other houses can be born abroad. House assets describe family resources separately from personal coins. Social origin, household occupations, name, starting funds, network influence and family favor are coherent with the new origin. Some houses can provide one modest lifetime grant with a real favor cost. Existing lives preserve names, races, household identities and money; old human profiles are marked as inferred and receive no birth grants.

Ten optional paths let humans pursue adventure, farms/gardens, craft, commerce, music, magic, protection, scholarship, healing or household/community life. At developmental age12, a pending major choice presents these paths; the selection can later change between decisions. Clicking a path gives no stats or money. Training needs elapsed time, first-career selection favors eligible work within the chosen path, and manual career selection remains open. Ten entry occupations bring the full catalog to114.103 new canonical events contain316 choices:40 house dilemmas,32 cultural scenes,30 linked path stages and the ten-option initial path decision.804 canonical events are now bundled.

A bounded64-entry lifetime ledger records selected actual milestones beyond the rolling360-page diary. The farewell card combines a labeled historical pixel scene, the character's name and occupation, places lived, real choices, and remembered people. It preserves an honest distinction between recorded memories and surviving household relationships. Old lives derive cards from retained records. The card appears at death and in archived lives; players can download a1080×1740PNG locally. The numerical score remains in legacy saves for compatibility and is no longer the focus of the farewell.

Validation:100,000 weighted birth rolls; all40 houses observed, all16 cultures, all316 new choice branches with save roundtrips; age/path/pending locks, time-only training without reducing high stats, route-aware first careers, one-time grant accounting, malformed-state rejection and actual v17 human/deceased save migration.72 complete seeded lifetimes,4,911 choices,60,256 quarter ticks and287 save roundtrips passed in the integration sweep;512 scene records produced512 different frames. Existing spending, project and clock regressions pass. Real Chromium covers the birth certificate,10-option popup, path and40-house search,114-job filtering, death/archive cards, actualPNG export and no overflow at320/390/768/1366 pixels. No production concurrency benchmark is claimed.

An additional complete-life sweep covers all ten human paths through all three stages (630 choices /3,050 quarter ticks in the initial sweep), with path-appropriate first careers and save validation. When no eligible career fits a selected path yet, automatic assignment waits for eligibility rather than assigning unrelated work.


## Species ecology and native ways of life — v19

All72 races now have explicit ecology profiles: preferred habitat, body form, birth/formation type, sensory cues, early development, native learning and daily practice. The human birth probability remains40%. Nonhuman births select a compatible realm using the same single RNG draw; saved identities and locations do not reroll.16 natural habitats join the human town: canopy settlements, caves, reed marshes, freshwater sanctuaries, reefs, open ocean, cliff roosts, dunes, steppe camps, frost dens, ember nests, spirit groves, core niches, webs, root hollows and moss glades.

Native learning and age milestones use the existing species-specific maturity ages. Kelpie foals learn currents and stable banks with their herd; aquatic young learn in water; egg, spore, seed and awakened-core origins have their own formation prose and newborn sprites. Mermaid tails, gel bodies, rooted/coral forms, seals, sea serpents and drifting spirits also replace the previous generic clothed biped sprites. Natural pixel scenes contain water, stone, roots, reeds and nesting material rather than classroom furniture.16 new animated layouts bring the catalog to48 layouts ×16 regional variants =768 configurations; these are runtime drawings, not video files.

142 race-specific learning/habitat decisions and a native adoption decision add429 choice branches.64 authored habitat incidents combine with species skills, named companions and native work. Physical requirements now gate incompatible human jobs, props and travel. Nine native occupations, three cooperative services and nine native props retain actual costs, elapsed-time benefits and saved consequences. Native residents forage/share local resources instead of automatically paying human city rent; an explicit adult choice can join an exchange community, opening compatible voice/magic/scouting/diplomacy occupations with recurring living costs. Aquatic births and new companions respect water-compatible kin/pet forms. Existing jobs, pets, possessions and family identities remain in imported saves.

Relationship arcs retain their effects and promises, with native situations for nonhuman bodies. Recovery and route-mapping projects use native sensing and communication. Historical v18 prose stays readable; incompatible old pages are labeled and excluded from the current feed and callbacks. Their old images are not presented as an accurate species scene.

Validation:72 full seeded lives,4,468 decisions,60,156 quarterly ticks and255 save roundtrips;768 different raster frames and72 race previews;497 nonhuman developmental milestones;100,000 birth rolls with39,925 humans;429 ecology choice branches;648 native relationship decisions and162 native project decisions across nine body profiles;25 native purchases and real spending; malformed ecology rejection; eight real v18 save migrations preserving identity, funds, career, named family and projects. Human-origin, spending, project and relationship regressions pass. Browser checks cover native birth/kelpie scenes, habitat details and minor/adult locks, saved modes, props/projects and320/390/768/1366 layouts. Content remains finite. No production concurrency benchmark is claimed.


## USD-scale economy and a common world calendar — v20

Money now uses **1 gold =1 USD**. This is a deliberately approximate American price/wage model for gameplay, not live cost-of-living data or an exact tax calculator. All123 jobs have annual base wages of32,000–180,000 gold, with experience/workload multipliers. Irregular work varies by quarter; war affects contracts, disrupted shifts and emergency bills. Healers, military crafts and adventurers can receive extra demand/hazard compensation, while trade can lose income. Business revenue, staff costs, start-up capital and owner draws are denominated at the new scale. Income and essential costs settle once per three calendar months for every race; species lifespan still governs maturation and skill development.

The ledger separates personal cash, family reserves, family shortfalls, personal debt, simulated payroll/income taxes, interest and principal payments. Shared housing, independent rent, food, utilities, health, transport and necessities vary by realm. Example baseline monthly rent is1,450 gold; a shared housing contribution is450. A family meal is85, a short course1,200 and a small home300,000. Native habitats retain their own lower-cash subsistence costs rather than human city rent. A lean plan reduces living costs20%; comfort adds35%. Shortfalls create debt at18% annual interest and reduce well-being. Side work has quarterly locks and consumes health/leisure; repayment transfers actual principal, and limited community aid pays essential arrears rather than generating recurring free cash. Household help comes out of family reserves. Holding a full-time job and a business also consumes well-being.

Legacy saves migrate once: old monetary balances, portfolios and business ledger values are multiplied by100; home valuations and catalog prices move to the new model. Identity, age, race, career, kin, projects and historical prose remain intact. Past currency sentences are historical and are not rewritten as if they had used today's prices. The `economy` marker prevents repeated conversion.

Every local world has a stored deterministic weather seed and a shared calendar beginning at year1000. All races and all16 realms see the same calendar events within that world. Twelve annual event families cover drought, monsoons, harvests, arcane illness, trade routes, migrations and magical phenomena. Four major arcs are scheduled independently of the player's race:

| First invasion year | Arc | Main regional exposure |
| --- | --- | --- |
|1012|Demon army invades the human frontier|Human capital, ash frontier, demon lands and nearby mountain/forest realms|
|1020|Lich siege|Salt memorial cities, frontier and neighboring settlements|
|1029|War of the stellar grail|Lantern city, brass canals, sky ports and rival magic centers|
|1039|Merfolk sovereign's invasion|Reef realm, ports, volcanic islands and connected wetlands|

Each arc warns one year before its first strike, lasts two or three years, and returns in a new48-year era so long-lived species also experience later wars. NPC rulers attack on schedule by default. Player offices are earned through age, reputation, bonds and martial/magical ability; ancestry alone does not give command. A demon sovereign, sea sovereign or lich ruler can choose invasion, negotiation or postponement during mobilization. Those orders persist and change the following year's world impact. Dwarven leadership can deploy a giant magical construct, a human leader can petition for a sacred sword, and dragon leadership can call an ancestral dragon; these require personal contributions and change defenses rather than simply changing a story label. Ordinary players can seek shelter, help defend or maintain local subsistence. Children experience crises through their carers and family budgets.

World effects change regional prices, work, supply shocks and danger, including different exposure for aquatic, undead/construct and demon races. News, threats, past-year records and actual policy decisions are saved. The world calendar is a browser-local simulation; this update does not introduce a networked multiplayer world.

Run the dependency-free economic/world regressions with `node scripts/check-world-economy.cjs`, and the72-race lifetime/save stress sweep with `node scripts/check-lifetimes.cjs`. The focused suite checks288 race/crisis combinations, all nine invasion-policy branches across three offices, distinct defensive powers, money conservation, quarterly locks, long-lived wages, migrations and malformed saves. Chromium QA covers the ledger, budgets, spending links, debt/side work,16 regional reports, ruler policy changes, reloads and320/390/768/1366 layouts. These checks do not establish production concurrency capacity.
