# Farmhand

### A farming game by [Jeremy Kahn](https://github.com/jeremyckahn)

**[Play Farmhand in your browser!](https://jeremyckahn.github.io/farmhand/)**

- Discord link: [![Discord](https://img.shields.io/discord/714539345050075176?label=farmhand)](https://discord.gg/6cHEZ9H)
- Reddit link: [![r/FarmhandGame](https://img.shields.io/reddit/subreddit-subscribers/FarmhandGame?style=social)](https://www.reddit.com/r/FarmhandGame/)
- `master`: [![Deploy](https://github.com/jeremyckahn/farmhand/workflows/Deploy/badge.svg?branch=master)](https://github.com/jeremyckahn/farmhand/actions?query=workflow%3ADeploy)
- `develop`: [![CI](https://github.com/jeremyckahn/farmhand/workflows/CI/badge.svg)](https://github.com/jeremyckahn/farmhand/actions?query=workflow%3ACI)

Farmhand is a resource management game that puts a farm in your hand. It is designed to be both desktop and mobile-friendly and fun for 30 seconds or 30 minutes at a time. Can you build a thriving farming business? Give it a try and find out!

This is an open source project built with web technologies. It is implemented as a [Progressive Web App](https://web.dev/what-are-pwas/), which means it can be played in your web browser or installed onto your device for offline play.

I am working on this entirely solo in my free time and am building it strictly with open source development tools (aside from hardware and operating systems). Farmhand is designed such that it would be fun for anyone that is into resource management and farming games, but ultimately my goal to make the game that I wish existed, the way I wish it existed. And I want to have fun doing it! 🙂

## Current Progress

At this point, the game is completely playable and stable (and worth playing, I think!). However, I would not consider the game at all finished. I don't really plan to "complete" this game, as I intend to develop and add to it for years to come. This is a fun hobby and creative outlet for me, and I don't feel a need to hold myself to inflexible goals for it at this point. It's an open source project that grows and improves organically over time. All that said, it's my goal as a designer and developer to ensure that this game is always stable and playable. It'll only ever get better and have more content over time!

Progress was initially tracked via [`docs/milestones.md`](docs/milestones.md), but I've since switched to using [this GitHub project](https://github.com/jeremyckahn/farmhand/projects/1) for organizing tasks. If you'd like to suggest a feature or ask a question, please [open a GitHub issue](https://github.com/jeremyckahn/farmhand/issues).

## Branch structure

- Active development takes place in `develop`.
- `master` is updated when `develop` is stable.
- `gh-pages` contains the built assets and is updated automatically when `master` is updated.

There is no versioning system yet.

## Project overview

This project is built with [Create React App](https://create-react-app.dev/), so please refer to the documentation of that project to learn about the development toolchain.

Farmhand requires [Node.js](https://nodejs.org/). At present it **does not support development with a major version higher than 14** due to some unresolved dependency incompatibilities.

Farmhand uses [Piskel](https://www.piskelapp.com/) for the art assets.

### CI/CD

Automation is done with [GitHub Actions](.github/workflows). All changes are tested and built upon Git push. Merges to `master` automatically deploy to Production (the `gh-pages` branch) upon a successful test run and build.

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).
