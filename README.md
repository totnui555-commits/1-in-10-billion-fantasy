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

## Current gameplay (v30)
72 playable races, 16 kingdoms, 40 human clans, 26 nonhuman society models, 123 professions, 15 businesses, 36 companion species, 45 purchasable props, 12 long-term projects, 1,247 canonical choice events and 768 pixel scene configurations. Named households, species-specific growth, annual focus, local social standing, cross-species relations, death/rebirth and a searchable illustrated diary persist in browser-local saves. Content is authored and finite; rare contexts and long lives can still repeat.

## Lifetime slideshow and visible aging (v30)
Death opens an automatic, replayable life slideshow. It uses actual birth/growth records, recorded choices, important people and the actual death cause. Previous/next, a reading pause, the retained decision list and return-to-card controls are available. Autoplay waits nine seconds per slide, stops on the final page and respects reduced-motion preferences. The slideshow never starts a new life or changes gameplay. It is also available from archived farewell cards.

A bounded optional `lifeReel` ledger retains up to 20 whitelisted visual snapshots separately from the rolling diary, preserving birth and distinct recorded growth stages. Playback selects up to 16 chronological highlights plus people and farewell pages. Older saves use remaining diary/legacy records and clearly label scenery-only illustrations when no historical appearance exists. Short lives never gain invented adult or elderly chapters. Retained decision records include recurring events at different times; older rolled-off choices cannot be recreated.

Pixel growth now changes size progressively through childhood and adolescence, then posture, pace, hair and surface detail with age. Native bodies receive scale, core-repair, root/spore or other surface marks rather than human clothing. Existing species-specific chronological maturity remains authoritative. Aquatic, plant and nonorganic farewell scenes use suitable light, seed or core motifs. Existing identity, profession clothing and historical snapshot ages remain consistent. No generated background images were added.

Validation: `node scripts/check-life-reel.cjs` checks diary rollover, six recorded growth stages, actual choices/cause, read-only playback, short lives, old saves and malformed snapshots. The wardrobe suite still covers all 72 species at seven ages, identity and historical consistency. Chromium verified automatic death playback, timed advance, pause, navigation, decision-list replay, dismissal, reload and 320/390/768/1366 layouts. A visual atlas of eight representative bodies at eight ages was inspected. Full-life regression passed 72 races, 6,101 choices, 45,823 quarters and 305 save round-trips.

## Annual economy, housing and adventuring (v29)
Newborn personal wallets start at zero for all 72 species. Family/group capital remains separate. Named caregiver gifts deduct from the actual family fund; adult members of privileged houses or well-supported local groups can request a yearly capital share, with trust/obligation consequences. Ordinary households without reserves cannot provide the same help. Unplayed legacy newborn purses move into the family fund once; established older lives keep their cash and assets. Legacy pre-USD migration remains one-time only.

The money panel and account book show calendar-year income, tax, support, purchases, bills, interest and unmet costs. Living costs accrue in four real calendar quarters; yearly estimates are not charged four times. Ordinary wages, household sharing and unsecured credit are tighter. Unaffordable services above the credit line are deferred rather than creating unlimited new borrowing. Existing debts still accrue interest. Full-time adventurer roles have no fixed salary: successful contracts produce income after provisions and tax, with no reward for merely accepting work. Owner business draws are also taxed. Pet upkeep uses actual calendar quarters; native companions consume suitable local resources instead of requiring human currency.

Five housing levels range from a 180,000-gold small home to an 8.5-million-gold estate, with 7,200–340,000 gold in annual upkeep before local adjustments. Upgrades can use net proceeds from the old property, and resale includes a real loss. Purchased homes include compatible pixel-scene furnishings. Native habitats use local names, resource costs and access rights; they cannot be sold to mint human currency. Older owned homes remain recognized.

The adventurer registry accepts all 72 species from their equivalent training age. Its F–SS rank is independent of race/origin tiers. Twenty-six repeatable authored contracts cover land, water, living-root/mycelial and spirit routes, each with three staged decisions. A journey has an actual quarter of travel and multiple choices within it. Route, negotiation, reconnaissance, gear condition and rank affect danger, reward and experience. Defeats can trigger the existing curse, trap, dungeon or other fatal-danger system. Supplies can be advanced but must be repaid even after withdrawal. Gear has three upgrade tracks and loses condition. Full-time adventurers receive explicit work offers; novice shared lodging and light guild work provide recovery routes. Expedition choices do not postpone ordinary family/life decisions. Regular employment pays less during a concurrent expedition.

The current world year is prominent in the heading and playback controls. The calendar shows elapsed history and currently revealed crises. Future invasion schedules are no longer listed; faction leaders can still receive current preparation news relevant to their own decisions. Constructed/nonorganic bodies receive appropriate core/anchor care instead of eating or human-medicine requirements.

Validation: `node scripts/check-economy-adventures.cjs` covers zero-money births, real family transfers, annual accrual/debt, all five housing levels, 104 contract branches, advance repayment, native costs, replay guards and long-lived adventurer saves above 1,000 decisions. `node scripts/check-story-context.cjs` audits 432 age/species contexts and 26,603 eligible choice contexts. Chromium checks all birth cards, current-year reveal timing, an actual credited expedition with mid-contract reload, annual accounts, five housing levels, dynasty support, nonorganic care and 320/390/768/1366 layouts. See [v29 player-flow notes](docs/playtest-v29.md) for natural-play observations and validation limits. Final full-life validation passed all 72 races, 6,101 choices, 45,823 quarters and 305 save round-trips.

## Tiers and player-flow audit (v28)
All 72 races have a lore assessment from F, E, D, C, B, A, S to SS, including distinct strengths, habitat dependencies and vulnerabilities. This is mature potential in a suitable habitat, not current combat power or an automatic stat bonus. Human birth probability remains 40%.

Birth opportunity and current standing are separate. Human birth tiers use the 10 clan types: ordinary F, agrarian E, artisan D, merchant C, knight/mage B, noble A, royal/sovereign S, ruling crown SS. Old human saves use the surviving birth rank. Nonhuman opportunity uses the existing society model's resources (30%), access (35%) and voice (35%); no human-rank or personal-wallet multiplier is applied. The current tier uses evolving local metrics. Starting values are reconstructed from the original deterministic society recipe, including its original caretaker support; no new save field or story RNG is used. Old-save estimates are labeled. Thresholds: 20 E, 35 D, 50 C, 62 B, 74 A, 85 S, 94 SS. Birth tier is fixed; current standing can rise or fall.

Birth and live-life badges open an explanation and a complete 72-race handbook. The birth page folds the full household/map section while retaining the existing sticky start/reroll actions. Native lives lead with their own resource rather than a zero-gold spending shortcut; decision popups show the same resource. An explicit result acknowledgement returns to the current quarter without repeating rewards or consuming time. Kin trust is rounded for display, and nonhuman member counts use a neutral unit. Incompatible native and awakened bodies no longer receive the human lunchbox childhood choice; pending old questions reconcile without charging money or advancing age.

Validation: `node scripts/check-tiers.cjs` covers all 72 races, 10 human origin types, threshold boundaries, 1,000 read-only/save projections, fixed origin vs changing standing, independence from human rank/gold, old pending-question repair and habitat/body eligibility. Chromium checks all 72 birth cards, 320/390/768/1366 layouts, guide/social-dialog navigation, resource shortcuts and reload. Five seeded lives were played using actual UI controls from birth into adulthood; a separate human run exercised 14 result acknowledgements, an actual meal purchase, its yearly lock, pet adoption, save export and reload. See [playtest notes](docs/playtest-v28.md) for observations and limits. The final full-lifetime regression covered all 72 races, 5,184 choices, 46,407 quarters and 305 save round-trips; society (639 branches), hazard (640 branches) and economy/world checks also pass.

## Character wardrobes (v22)
Deterministic pixel wardrobes combine 24 palettes, 12 garment cuts, 16 hairstyles, 12 hair colors, 8 textile patterns, 8 accessory variants and 8 headwear selectors. Profession groups select practical clothes (aprons, armor, robes and travel layers), children retain age-appropriate options, and high status adds small trim details. Horns, ears and species silhouettes remain visible. Non-clothed bodies vary through small scale/wing/root/core markings rather than human outfits. Selection is derived from existing identity data; it consumes no story RNG and adds no save fields. Family, guest and diary portraits use the same identity recipe. Existing saves receive the expanded rendering automatically.

Validation: 10,000 sampled human appearance combinations were distinct, as were 512 rendered human samples; this is a sample result, not a global uniqueness guarantee. All 72 bodies render at seven ages; player and family historical snapshots retain their identity. Real Chromium checked all 72 portraits and 320/390/768/1366 layouts. Run `node scripts/check-wardrobe.cjs` for deterministic rendering and save checks.

## Expanded clothing layers (v23)
The wardrobe now has 36 garment cuts, 48 palettes, 32 hairstyles, 20 hair colors, 20 textile patterns, 24 accessory selectors, 18 headwear selectors, 12 lower-body styles, 8 footwear styles, 8 sleeve styles, 12 mantle selectors and 16 natural marking variants. Twelve profession groups each choose among five practical garment cuts. Children use a soft-clothing subset. Rear mantles draw behind the body; facial and racial features remain in front. Birth-realm motifs persist after migration, with additional elf, forge, goblin, demon and celestial textile details. Species without clothes retain natural body markings. These are component counts; geometry, profession and age constraints limit valid combinations, and some selectors deliberately leave a slot empty.

Checks cover every component selector, all profession pools, 72 species at seven ages, historical image stability and no changes to save data or story randomness. Chromium checked all 72 portraits and mobile/desktop layouts. No external art assets or additional network requests were introduced.

## Profession clothing (v24)
All 123 professions now have explicit workwear assignments. Smiths, tailors, healers, alchemists, farmers, musicians, guards, teachers, couriers, cartographers and other work families have practical overlays, headwear and compact tools. Changing careers updates clothing immediately while retaining the character's derived palette and hair. A vacant or unknown NPC occupation no longer inherits the player's profession. Equipment is visual only and grants no inventory, combat or financial benefits. Native bodies without suitable hands retain their anatomy and do not receive human handheld equipment.

Historical player outfits use the recorded job; family outfits use recorded occupations. Known guest portraits now retain a bounded optional occupation field, compatible with older snapshots. Checks cover all 123 mappings, outfit changes, unchanged appearance identity, historical images, and real career-menu changes through reload in Chromium.

## Profession dyes (v25)
Clothing is no longer locked to the character's birth palette. Twelve profession color families now supply bounded, coordinated dye choices, keyed to both character identity and the exact recorded job/occupation. Shirt, trim, shadow, cape, lower fabric, leather, accent, metal and linen have separate channels. Mage, performer, gardener, healer and other work families read as different outfits even on the same character. Hair, skin and body identity remain unchanged. Native body markings keep their original biological colors.

Validation: the 123 careers produced 123 distinct dye combinations for the reference character; seven sampled work families each produced at least 48 shirt colors across 64 identities. Real Chromium career-menu changes verified 12 distinct dye combinations and unchanged hair/face identity. Diary scenes reconstruct the dyes of the saved career, including after a subsequent career change. These are sample results, not a global uniqueness claim.

## Contextual mortality (v26)
Sixteen danger families (poison, curse, epidemic, war, monsters, interspecies persecution, class violence, relics, traps, dungeons, duels, excessive quests, accidents, predators, habitat collapse and rifts) add 32 encounter/treatment definitions. Exposure depends on calendar time, species lifespan, body, habitat, profession, world invasions, interspecies tensions, deprivation, health focus and shelters. Biological age gates voluntary adventures. Non-organic bodies do not receive ordinary poison/plague encounters; large bodies receive limited protection against physical attacks. Metabolic native bodies have anatomy-specific disease and habitat prose.

A critical encounter stops at a decision, with fatal-risk and cost hints. Death can occur despite remaining health. Survivors can develop a condition that requires a next-quarter decision; depleted health during an active condition retains its specific cause. All hazards offer free approaches. Qualified care uses real personal money, family reserves for dependent children when available, or native habitat reserves. Insufficient native reserves do not grant specialist care for free. Safer and riskier responses, money, stats and follow-up care affect survival. Selected dangerous choices in existing authored stories can create a warned follow-up encounter. The same seed and state replay the same danger result without consuming the general story RNG.

Causes appear in the diary, bounded hazard history, death ledger and farewell card. Old saves receive four quarters of grace without removing identity, funds, family or historic death causes. No offline mortality or shared-server simulation is introduced. Authored danger content is finite and can recur; it is not a unique new story at each exposure.

Validation: 640 encounter/treatment branches, anatomy and age exclusions, explicit cause/farewell records, free/native/child-family payment paths, authored-choice follow-ups, replay prevention and malformed-save rejection (`node scripts/check-hazards.cjs`). Full 72-species lifetime checks completed 47,059 quarters, 5,206 choices and 308 save round trips. Chromium verified the critical modal, saved pending choice, next-quarter complications, actual treatment payment, dungeon death and 320/390/768/1366 layouts. Sixteen real v25 save migrations preserved all previous data.

Balance comparison: for the same 40 human seeds using balanced automatic decisions, 39/40 reached the age cap in v25 versus 24/40 with v26 danger rules; mean lifespan was 85.75 versus 72.25 years. This is a small human-only simulation sample, not a target fatality quota or a guarantee for other races, choices and saves.

## Species societies and birth contexts (v27)
Human family/caste origins remain separate from nonhuman societies. All 71 nonhuman races map to 26 cultural/ecological society models, with 208 named origin contexts and a distinct race-specific tradition for each people. Cyclopes use stone-forge circles and construction oaths, slimes use clean pools and budding lines, myconids use mycelium and founder cultures, coral people use currents and attachment space, dragons use nesting lines and flight territories, and constructs use core upkeep and consent to inherited commands. Several related races share a model; the models are authored, finite content rather than a fully simulated anthropology.

Supply security, local access, chosen obligations and voice have their own contextual labels. Their numbers describe conditions within that society and are not a cross-species wealth ladder. Birth supplies, caregiver roles/backgrounds, education defaults, civic family funds/income/allowances and selected living needs no longer derive from the human caste ordinal. Ordinary biological nonhuman siblings now share a race unless the household is explicitly adoptive. Personal exchange money does not buy ancestry or automatically raise voice/access. Native cashless lives retain their habitat economy. Old personal careers, balances, identities, household members and diary entries are preserved.

Seventy-eight society decision definitions let players divide actual supplies, negotiate shared access and accept or refuse obligations. Recognition can change one's community role without promoting the human caste number, and is recorded in the lifetime ledger. Nonhuman disputes use the relevant forge, territory, pact, core or habitat context. Incompatible pending human class questions in older saves are reconciled to a valid local decision. Visual memories retain bounded access/voice projections so later status changes do not redraw earlier regalia.

Validation: all 71 nonhuman birth cards and their local axes in Chromium, 639 society-choice branches, independence from human caste and personal gold, biological kin checks, role/ledger updates, saved visual projections, old pending-choice recovery and malformed-state rejection (`node scripts/check-societies.cjs`). Real v26 migration checks covered 144 alive/dead states across 72 races and confirmed 100 unchanged human births. Full lifetime checks covered 72 races, 46,373 quarters, 5,193 choices and 304 save round trips. Existing hazards, faiths, ecology, wardrobes and world-economy checks passed; 320/390/768/1366 layouts and choice persistence were checked in Chromium.

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


## Species drives and embodied faith — v21

All72 races now have an authored ambition, an inherited tension, and three optional interpretations: follow the inherited path, seek coexistence, or choose an independent direction. These are pressures rather than a moral alignment assigned at birth. A kelpie can defend a hunting pool or protect crossings; a dragon can expand territory, negotiate with goblins, or leave the ancestral hoard. Spores, roots, shadows, constructs and predatory bodies receive different desires, kin terms, sensations and native narrative pages. Choosing a direction gives no money/stats and may change once per world year. An annual-focus shortcut connects these aspirations to existing practical plans. NPC native dreams also draw from their own race's three paths instead of sharing the same domestic dream.

Nine fictional faiths have named, physically present deities or founders:

| Faith | Divine actor | Central conflict |
| --- | --- | --- |
|Dawn goddess|Aurelia|Sanctuary for all races versus exclusive protection|
|First demon / black oath|Azrakel|Free captive demon souls versus dismantling a human city's defenses|
|Ascended human god|Kael|Human security versus the rights of existing forest inhabitants|
|Root mother|Verantha|Restore root water versus the people depending on a dam|
|Ocean memory|Neria|Protect spawning grounds versus shipments of medicine|
|First forge / free cores|Urdum|Military defense versus a newly awakened construct's consent|
|Ancestral wing|Archeion|Restore dragon nesting territory versus goblin livelihoods|
|Hunter moon|Raum|Feed predators versus hunting beyond necessity|
|Unowned memory|Ishra|Break lich control versus spirits' choice to stay or leave|

Every race can follow any faith or remain unaffiliated. Cultural affinities are descriptive, never a conversion gate. Adoption starts at developmental age6; missions start at18. Devotion advances only as time passes. A stored, deterministic chance can bring a divine manifestation and a three-stage quest. Four actual quarters separate stages. The player may obey, reinterpret or refuse at every stage, or leave between decisions. Completed/abandoned quests do not reset on conversion, so switching faiths cannot farm the same rewards. All nine faiths have one authored lifetime quest chain; content is finite.

Following a quest through its final decision changes a named realm's danger and trade for six world years. Some literal commands benefit one realm while harming another; alternative interpretations change those trade-offs. Selected rites also change the existing human/demon or dragon/goblin relation. World effects remain after leaving the faith and expire by calendar year. Independently of personal belief, periodic divine manifestations leave witnessed physical evidence in their own realms. Pixel seals appear in deity cards and relevant scenes. Final divine choices receive weight in the lifetime/farewell ledger.

The nonhuman audit also separates new wild/native lives from human payroll and rent. They use habitat resources, food/energy and anchors; paid work opens only after choosing exchange. They may forage, claim territory or share supplies, with actual resource, health and relationship costs and quarterly locks. Native recovery/mapping projects use habitat effort instead of city currency. Nonbiological kin are described as sources, caretakers, linked cores or related spores; native death passages describe the body's own ending. Old saves keep money, debt, jobs, kin identities/roles and world policies. Existing financial contracts are grandfathered; no faith or ambition is assigned retroactively. Incompatible legacy narrative remains in the journal with the existing ecology-history label. Choosing an exchange life remains available.

Validation: `node scripts/check-faith-drives.cjs` checks216 initial ambition branches,135 divine quest branch decisions,36 actual time/chance-driven encounters,18 native project stages, canonical save roundtrips, lasting cross-realm effects, expiration, native resource/economy rules and malformed-state rejection. All72 seeded lifetimes completed with4,842 choices,57,032 calendar quarters and354 save roundtrips. Twenty real v20 migrations preserve wallets, debts, careers, named kin and policies. The v20 economic/world regressions pass. Chromium QA covers all nine faith cards and seals, annual conversion limits, all three quest stages, reinterpretation/leave/reload, native territory actions, explicit exchange, annual-focus navigation and320/390/768/1366 layouts. No new hosted gameplay API or multiplayer world is introduced.


### v31 — readable history and annual discretionary budgets

The main life feed starts with 30 records and loads 30 older entries in place, up to the retained diary limit of 360. Automatic renders preserve the visible record position. Spending packages now price annual extras separately from basic living costs, display cash committed and reserve coverage before purchase, and show actual clamped stat changes and cash after purchase. Health plans cost 2,400, family meals 1,560, courses 4,800 and hobby budgets 1,800 gold per year. Purchases use calendar-year guards across species; full stats yield no hidden excess benefit. Legacy wallets and historical receipts are preserved.


### v32 — Thai / English language selection

The header language selector switches the full displayed experience between Thai and English without rerolling or translating saved simulation data. The choice persists on the device; `?lang=en` and `?lang=th` are shareable entry points. With no preference, the browser language supplies the initial choice. A local catalogue contains over 12,000 authored phrases, including UI, species, professions, decisions, retained journals, world news, money, relationships and the farewell slideshow. English names use a stable local romanization lexicon. Canvas labels, shared life summaries and exported life cards use the selected language. Career and journal searches support English.

Localization is presentation-only: IDs, probabilities, eligibility rules, names stored in saves, wallet values, outcomes and RNG are unchanged. Existing saves remain compatible. No player text, save or translation request is sent to an external service during play. The initial English draft was machine-assisted, with 454 editorial overrides and manually standardized names for 72 species, 16 realms and 40 human clans; prose assembled from fragments can still need editorial refinement. User-entered text outside the catalogue may retain its original language.

Translation sources live in `locales/en-source.json`, editorial corrections in `locales/en-overrides.json`, and stable name spellings in `locales/name-romanization.json`. Run `python scripts/build-locale.py` followed by `python scripts/build-client.py` after edits; both builds work without a translation service.

Validation: `node scripts/check-language.cjs` checks source phrase coverage, all 72 species’ birth stories and generated names, Thai restoration, save invariance and English search. `scripts/check-language-browser.cjs` exercises actual English/Thai welcome and birth flows, 12 contextual species, money receipts, career/journal search, reload, four viewport widths and the death slideshow. Existing economy, adventure, story-context and life-reel checks also pass.


### v33 — 52 realms and 200 human houses

Expands the original 16 realms to 52 and the original 40 human clans to 200, keeping their existing IDs. Each new realm has bilingual descriptions of its government, terrain, resource economy, customs and local tensions, four local human houses, and a separate ecological pressure for native creatures. Human cultures now cover all 52 realms. Birthplaces follow species habitats; human birth probability remains 40%.

There are 376 additional contextual decision events with 1,128 branches. Eligibility checks age, location, clan and native/civic context. Choices spend or earn actual money, consume native resources or change relationships and stats; they do not grant passive income. Regional cost indices, occupational advantages, business demand and world-crisis exposure differ. Travel quotes use connected map routes. The expanded atlas adds two continental regions and an archipelago with country borders, rivers and ferry connections. Its 48 existing scene layouts support 52 realm styles (2,496 configurations, not separately drawn scenes).

Source content lives in `content/realms-expansion.json`. Rebuild map/data with `python scripts/build-realms.py` (build-only dependencies in `scripts/requirements-atlas.txt`), then run the locale and client builders. Gameplay remains static and browser-local. No shared-world server or concurrency benchmark is added.

Validation: `node scripts/check-realms.cjs` samples 5,000 births, verifies all 52 birth destinations, habitat compatibility, zero newborn wallets, connected routes and all 1,128 new choice branches with actual financial/resource effects and save roundtrips. Chromium checks new realm dossiers, local decisions, 200-house catalogue, 52 travel destinations, English localization and four viewport widths. Existing language, economy/adventure, story-context and life-reel regressions pass.
