# Farmhand

### A farming game

- Discord link: [![Discord](https://img.shields.io/discord/714539345050075176?label=farmhand)](https://discord.gg/6cHEZ9H)
- Reddit link: [![r/FarmhandGame](https://img.shields.io/reddit/subreddit-subscribers/FarmhandGame?style=social)](https://www.reddit.com/r/FarmhandGame/)
- Watch the game being live: [![Twitch](https://img.shields.io/twitch/status/jeremyckahn?color=blueviolet)](https://www.twitch.tv/jeremyckahn)

**[Play Farmhand in your browser!](https://jeremyckahn.github.io/farmhand/)**

- `master`: [![Build Status](https://travis-ci.org/jeremyckahn/farmhand.svg?branch=master)](https://travis-ci.org/jeremyckahn/farmhand)
- `develop`: [![Build Status](https://travis-ci.org/jeremyckahn/farmhand.svg?branch=develop)](https://travis-ci.org/jeremyckahn/farmhand)

Farmhand is a resource management game that puts a farm in your hand. It is designed to be both desktop and mobile-friendly and fun for 30 seconds or 30 minutes at a time. Can you build a thriving farming business? Give it a try and find out!

This is an open source project built with web technologies. It is implemented as a [Progressive Web App](https://web.dev/what-are-pwas/), which means it can be played in your web browser or installed onto your device for offline play.

I am working on this entirely solo in my free time and am building it strictly with open source development tools (aside from hardware and operating systems). Farmhand is designed such that it would be fun for anyone that is into resource management and farming games, but ultimately my goal to make the game that I wish existed, the way I wish it existed. And I want to have fun doing it! 🙂

## Branch structure

- Active development takes place in `develop`.
- `master` is updated when `develop` is stable.
- `gh-pages` contains the built assets and is updated automatically when `master` is updated.

There is no release or versioning system yet.

## Current Progress

Progress was initially tracked via [`docs/milestones.md`](docs/milestones.md), but I've since switched to using [this Github project](https://github.com/jeremyckahn/farmhand/projects/1) for organzing tasks. If you'd like to suggest a feature or ask a question, please [open a GitHub issue](https://github.com/jeremyckahn/farmhand/issues).

## Project overview

This project is built with [Create React App](https://facebook.github.io/create-react-app/)), so please refer to the documentation of that project to learn the development toolchain.

## Versioned releases

npm makes it super easy to make versioned releases! This project is set up to run tests before making a release, which helps prevent you from releasing new versions with bugs. This happens automatically thanks to the [npm version scripts](https://docs.npmjs.com/cli/version).

```
npm version patch # Or "minor," or "major"
```

This will also use the [gh-pages](https://github.com/tschaub/gh-pages) utility to deploy your versioned project with [GitHub Pages](https://pages.github.com/).

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).
