# Farmhand

[![Current Farmhand version](https://badgen.net/npm/v/@jeremyckahn/farmhand)](https://www.npmjs.com/package/@jeremyckahn/farmhand) [![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/jeremyckahn/farmhand)

### A farming game by [Jeremy Kahn](https://github.com/jeremyckahn)

**[Play Farmhand in your browser!](https://jeremyckahn.github.io/farmhand/)**

- **[Support this project on Patreon!](https://www.patreon.com/jeremyckahn)**
- Discord link: [![Discord](https://img.shields.io/discord/714539345050075176?label=farmhand)](https://discord.gg/6cHEZ9H)
- Twitter link: [![@farmhandgame](https://badgen.net/twitter/follow/farmhandgame)](https://twitter.com/farmhandgame)
- Reddit link: [![r/FarmhandGame](https://img.shields.io/reddit/subreddit-subscribers/FarmhandGame?style=social)](https://www.reddit.com/r/FarmhandGame/)
- `master`: [![Deploy](https://github.com/jeremyckahn/farmhand/workflows/Deploy/badge.svg?branch=master)](https://github.com/jeremyckahn/farmhand/actions?query=workflow%3ADeploy)
- `develop`: [![CI](https://github.com/jeremyckahn/farmhand/workflows/CI/badge.svg)](https://github.com/jeremyckahn/farmhand/actions?query=workflow%3ACI)
- All versioned releases available at [unpkg](https://unpkg.com/browse/@jeremyckahn/farmhand/build/)
- [Data model documentation](https://jeremyckahn.github.io/farmhand/docs/index.html)
- [API deployment logs](https://farmhand.vercel.app/_logs)

Storefront links:

- https://jeremyckahn.itch.io/farmhand
- https://plaza.dsolver.ca/games/farmhand

Farmhand is a resource management game that puts a farm in your hand. It is designed to be both desktop and mobile-friendly and fun for 30 seconds or 30 minutes at a time. Can you build a thriving farming business? Give it a try and find out!

This is an open source project built with web technologies. It is implemented as a [Progressive Web App](https://web.dev/what-are-pwas/), which means it can be played in your web browser or installed onto your device for offline play.

I am working on this entirely solo in my free time and am building it strictly with open source development tools (aside from hardware and operating systems). Farmhand is designed such that it would be fun for anyone that is into resource management and farming games, but ultimately my goal to make the game that I wish existed, the way I wish it existed. And I want to have fun doing it! 🙂

## Current Progress

At this point, the game is completely playable and stable (and worth playing, I think!). However, I would not consider the game "finished," inasmuch as it will never be finished. I plan to work Farmhand as I can for many years to come. Being an open source project, I hope that it will grow and improve organically over time. All that said, it's my goal as a designer and developer to ensure that this game is always stable and playable. It'll only ever get better and have more content over time!

[This GitHub project](https://github.com/jeremyckahn/farmhand/projects/1) is used for tracking and organizing work. If you'd like to suggest a feature or ask a question, please [open a GitHub issue](https://github.com/jeremyckahn/farmhand/issues).

## Versioning system

Farmhand uses a [SemVer](https://semver.org/)-like versioning system. It differs from SemVer because Farmhand is a game and doesn't expose a public API. Rather than the game version being based on an API, it reflects the internal data structure, [`farmhand.state`](https://jeremyckahn.github.io/farmhand/docs/farmhand.html#.state).

- `major`: Is incremented when `farmhand.state` has been changed in a backwards-incompatible way.
  - When these releases are made, automatic migration functionality will keep this transparent to the player.
- `minor`: Is incremented when `farmhand.state` has been changed in a backwards-compatible way.
- `patch`: Is incremented when `farmhand.state` has been not been changed. This also includes gameplay features and bug fixes that do not result in changes to `farmhand.state`.
  - This implies that significant game changes may only result in `patch`-level releases.

## Branch structure

- Active development takes place in `develop`.
- `master` is updated when `develop` is stable.
- `gh-pages` contains the built assets and is updated automatically when `master` is updated.

## Project overview

- This project is built with [Create React App](https://create-react-app.dev/), so please refer to the documentation of that project to learn about the development toolchain.
- Farmhand uses [Piskel](https://www.piskelapp.com/) for the art assets.

## Running locally

Requires Node/NPM and Docker.

In one shell run:

```sh
npm ci
```

```sh
npm run dev
```

Farmhand will be accessible from http://localhost:3000/.

### CI/CD

Automation is done with [GitHub Actions](.github/workflows). All changes are tested and built upon Git push. Merges to `master` automatically deploy to Production (the `gh-pages` branch) upon a successful test run and build.

### Releasing updates

This GitHub Action will deploy a new version of Farmhand: [![Release New Version](https://github.com/jeremyckahn/farmhand/actions/workflows/run-release.yml/badge.svg)](https://github.com/jeremyckahn/farmhand/actions/workflows/run-release.yml)

As an authenticated repo owner, click "Run workflow" and enter the argument to be passed to [`npm version`](https://docs.npmjs.com/cli/v7/commands/npm-version) and submit your selection. This will deploy Farmhand to:

- https://jeremyckahn.github.io/farmhand/
- https://jeremyckahn.itch.io/farmhand
- https://www.npmjs.com/package/@jeremyckahn/farmhand
  - Playable from https://unpkg.com/browse/@jeremyckahn/farmhand/build/

It will also notify the Discord server about the update.

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).
