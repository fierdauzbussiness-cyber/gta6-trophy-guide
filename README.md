# Leonida Trophy Guide — GTA VI

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/fierdauzbussiness-cyber/gta6-trophy-guide/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/fierdauzbussiness-cyber/gta6-trophy-guide/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

A free, open-source, offline trophy guide and tracker for **Grand Theft Auto VI** on PlayStation 5 — built for the [make.fun gta6-trophy-guide-01 competition](https://make.fun/c/gta6-trophy-guide-01).

It covers **all 55 official trophies** (1 platinum, 2 gold, 6 silver, 46 bronze) with their names, descriptions and grades exactly as PlayStation publishes them, and a guide to each in our own words that cites its sources. It is a tracker too: a checklist saved in your browser (localStorage) with export and import, filters by kind (story, missable, side strands, collectibles, activities) and by grade, search, a spoiler setting that hides story trophies until earned, a 5-stage roadmap to the platinum, and a missables page built from the official descriptions.

## How to run it

```sh
node serve.ts
```

Then open http://localhost:8080 — the guide is plain static files under `app/` (no build step) and works with the network off; it loads nothing from outside its own folder.

To build the submission output:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Sources and honesty

- Trophy names, descriptions and grades: the official PlayStation 5 list, as listed by [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) — agreeing with [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi) on every name, description and grade.
- PSN progress counts (such as 42 Shooting Range challenges): PSNProfiles.
- Every guide method is our own advice drawn from the official description. The game released on 19 November 2026, so where a description does not pin a place or a step down, the guide says so plainly instead of inventing one. Four trophies (Challenging Tank, Personal Best, Bad Luck, I Guess, The Truth Is Out There) have triggers the official description does not spell out — their guides flag that uncertainty.

No Rockstar Games logo, artwork or game screenshots are used; the look is our own. Grand Theft Auto and GTA are trademarks of Take-Two Interactive.

## Referral

Made with make.fun — if you enter a competition yourself, my referral code is `kgyy9gkf` (https://make.fun/r/kgyy9gkf).

## License

MIT — see [LICENSE](LICENSE).
