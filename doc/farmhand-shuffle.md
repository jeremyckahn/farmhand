# Farmhand Shuffle in Farmhand

Farmhand Shuffle is a card game that is embedded in Farmhand as a minigame. Players unlock it at level 19, wager money on a match against a bot, and win double their wager back if they win.

The game itself lives in its own repository, [`farmhand-shuffle`](https://github.com/jeremyckahn/farmhand-shuffle), and is published to npm as `@jeremyckahn/farmhand-shuffle`. This document explains how the two projects fit together and how to work on and ship changes to either of them.

- [How the pieces fit together](#how-the-pieces-fit-together)
- [Local setup](#local-setup)
- [Making changes](#making-changes)
- [Testing](#testing)
- [Deployment](#deployment)
- [Gotchas](#gotchas)

## How the pieces fit together

**`farmhand-shuffle` owns the game:** the rules, the bot, the `Match` React component and its pixel art UI. It knows nothing about money, wagers, saving or achievements.

**Farmhand owns everything around the game:**

| Concern                                                                                      | Where it lives                                                                                                                                                     |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The level 19 unlock and the view list                                                        | `src/data/levels.ts`, `src/utils/getViewList.ts`, `src/utils/getValidatedStageFocusFromHash.ts`, `stageFocusType.FARMHAND_SHUFFLE` in `src/enums.ts`               |
| The wager screen, running a match, resuming a saved one                                      | `src/components/FarmhandShuffleView/`                                                                                                                              |
| The context pane (stats, wager and prize, Forfeit button)                                    | `src/components/FarmhandShuffleContextMenu/`, wired up in `src/components/ContextPane/ContextPane.tsx`                                                             |
| Wagers, payouts and saved matches (persisted as the `farmhandShuffle` key of Farmhand state) | `src/game-logic/reducers/*FarmhandShuffle*.ts`, their stubs in `src/components/Farmhand/FarmhandReducers.tsx`, and the handlers in `src/handlers/ui-events.tsx`    |
| Achievements                                                                                 | `src/data/achievements.ts` (the `farmhand-shuffle-*` entries)                                                                                                      |
| The stage background and layout                                                              | `src/components/Stage/Stage.tsx`, `src/img/ui/hay-bg.png`                                                                                                          |
| End-to-end tests and their save-game fixtures                                                | `e2e/tests/farmhand-shuffle/`, `e2e/fixtures/farmhand-shuffle-*.json`, [`e2e/fixtures/FARMHAND_SHUFFLE_FIXTURES.md`](../e2e/fixtures/FARMHAND_SHUFFLE_FIXTURES.md) |

### The boundary between the two

Farmhand drives a `Match` through its props (see `MatchProps` in `farmhand-shuffle`'s `src/ui/components/Match/types.ts`). The ones Farmhand relies on are `playerSeeds`, `userPlayerId`, `initialMatch` (resume a saved match), `onCheckpoint` (save), `onMatchEnd` (settle the wager), `renderGameOverContent`, `hideDefaultGameOverActions`, `useGenericPlayerLabels` ("You" and "Opponent" instead of generated names), `hideScrollbar` and `sx`.

Layout and look are tuned from the outside through CSS custom properties set on `Match` through its `sx` prop. This keeps host-specific numbers out of the library. The variable names are exported from the library (for example `contentPaddingVar`), and `FarmhandShuffleView.tsx` sets them:

| Variable                                          | What it controls                                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `--farmhand-shuffle-content-padding`              | The spacing between the game and the edge of the Stage. Glows fade out into it.      |
| `--farmhand-shuffle-bottom-inset`                 | Space at the bottom that Farmhand's fixed nav buttons cover. The Hand sits above it. |
| `--farmhand-shuffle-hand-toggle-bottom` / `-left` | Position of the hide/show Hand button, so it lines up with Farmhand's nav buttons.   |
| `--farmhand-shuffle-placeholder-outline-color`    | Color of the empty plot and discard pile outlines.                                   |

If Farmhand needs the game to look or lay out differently, prefer a new variable like these over a Farmhand-specific prop or special case in the library.

### Saving and resuming

Farmhand checkpoints the match whenever the game waits for the player (`onCheckpoint`) and saves it with `serializeMatch`. On reload, `FarmhandShuffleView` resumes it with `deserializeMatch` and `initialMatch`. Each checkpoint is tagged with the library's `package.json` version; a checkpoint that can't be resumed is refunded (`refundUnresumableFarmhandShuffleMatch`).

## Local setup

You need both repositories, ideally side by side:

```sh
git clone git@github.com:jeremyckahn/farmhand.git
git clone git@github.com:jeremyckahn/farmhand-shuffle.git
```

Set up Farmhand as described in the main [README](../README.md#running-locally). Set up `farmhand-shuffle` with `npm ci` (it uses the Node version in its `.nvmrc`).

### How Farmhand gets the library

Farmhand depends on `@jeremyckahn/farmhand-shuffle` like any other npm package (a semver range in `package.json`, pinned by the lockfile). To pick up a new release, see [Releasing Farmhand](#releasing-farmhand).

### Working on the game itself

Run `farmhand-shuffle` on its own, without Farmhand:

```sh
cd farmhand-shuffle
npm start             # the standalone game, with Vite's dev server
npm run start:storybook
npm run check         # tests with coverage, lint and type-check
```

### Seeing library changes inside Farmhand

There is no watch mode across the two repositories. To try a local change in Farmhand:

```sh
# in farmhand-shuffle
npm run build:lib

# in farmhand: replace the installed build with yours and clear Vite's cache
rm -rf node_modules/@jeremyckahn/farmhand-shuffle/dist-lib
cp -r ../farmhand-shuffle/dist-lib node_modules/@jeremyckahn/farmhand-shuffle/
rm -rf node_modules/.vite
npm start             # restart the dev server
```

Repeat that after every library change. Running `npm ci` in Farmhand replaces your copy with the published build again.

To try an unmerged library change in a Farmhand PR without publishing, you can temporarily point the dependency at a build you host somewhere (such as a tarball produced with `npm pack`). Don't merge a Farmhand change that does.

Avoid `npm link` for this. It makes the library resolve its own copy of React, which breaks hooks ("Cannot read properties of null (reading 'useContext')"). If you do use it, point the library's `node_modules/react` and `react-dom` at Farmhand's copies.

### Getting to the game in Farmhand

The game unlocks at level 19. In the browser console:

```js
window.farmhand.setState({ experience: 32400 }) // level 19
```

Or load a ready-made save: Settings, then "Import Game Data", with `e2e/fixtures/farmhand-shuffle-unlocked.json`. Then pick "Farmhand Shuffle" from the view selector.

## Making changes

**Does the change affect how the game plays or looks on its own?** It belongs in `farmhand-shuffle`: rules, cards, the bot, `Match` and its components. Standalone Shuffle and the embedded one share this code, so a change there affects both.

**Is it about money, saving, unlocking, achievements, or how the game sits inside Farmhand's screen?** It belongs in Farmhand.

**Does Farmhand need the game to behave differently?** Add an opt-in prop or CSS variable to the library (the default must keep standalone behavior unchanged), export it from `src/public/index.ts`, and set it in `FarmhandShuffleView.tsx`.

A typical change that touches both:

1. Change and test the library (`npm run check`).
2. Rebuild it into Farmhand's `node_modules` (see above) and check the result in Farmhand, at phone width too. The embedded layout differs from the standalone one.
3. Open the library PR first. Farmhand picks up the change once the library is published.
4. Open the Farmhand PR with the matching changes.

Whenever you change something that gets saved, such as the shape of a serialized match, see the saved matches note under [Gotchas](#gotchas).

## Testing

Farmhand's unit tests mock the library (see `FarmhandShuffleView.test.tsx`), so they check Farmhand's wiring, not the game. If a library export Farmhand uses changes, update that mock. Run them with `npm test`.

Browser-level coverage is in `e2e/tests/farmhand-shuffle/` (unlock gating, wagering, resuming, forfeiting, finishing a match). Run it as described in the main README's [E2E section](../README.md#end-to-end-e2e-testing). CI runs it for every PR.

Some of these tests start from a save that is one turn away from the game ending. Those fixtures contain a serialized match, so regenerate them after a library change that alters that shape. See [`FARMHAND_SHUFFLE_FIXTURES.md`](../e2e/fixtures/FARMHAND_SHUFFLE_FIXTURES.md):

```sh
node e2e/fixtures/generate-farmhand-shuffle-completion-fixtures.mjs
```

## Deployment

Shipping a change to the game takes two releases, in this order: the library to npm, then Farmhand.

### Releasing the library

1. Merge the `farmhand-shuffle` PR into its `main` branch.
2. In the `farmhand-shuffle` repository, go to **Actions**, then **Publish Library**, then **Run workflow**. Run it from `main` with `patch`, `minor`, `major`, or an exact version. It runs the checks, bumps and tags the version, builds the library, and publishes it to npm with trusted publishing, so there's no token to manage.

The one-time npm trusted-publisher setup for this package is described in the `farmhand-shuffle` README under "Releasing a new version".

### Releasing Farmhand

1. Point Farmhand at the new library version:

   ```sh
   npm install @jeremyckahn/farmhand-shuffle@<version>
   ```

   Review the lockfile diff and make sure `npm ci` still installs cleanly. Run the tests, E2E included.

2. Merge the Farmhand PR into `develop`.
3. Release Farmhand with the **Release New Version** workflow, as described in the main README's [Releasing updates](../README.md#releasing-updates). Use `patch` unless the release changes `farmhand.state`. The `farmhandShuffle` key was added to the state when the minigame first shipped, and old saves pick up its defaults automatically.

## Gotchas

- **Saved matches and library versions.** Resuming checks the library's `package.json` version against the one in the checkpoint, and refunds the wager on a mismatch. That only protects players when the version changes whenever the saved shape does. If you change what `serializeMatch` produces, bump the library version in the same release, and regenerate the E2E fixtures.
- **The End Day button is hidden during a match.** The `shift + c` hotkey is blocked too (`src/components/Farmhand/useFarmhand.ts`). Anything else that should not happen mid-match needs the same treatment.
- **The Stage does not scroll for this view.** `Stage.tsx` hides its overflow and padding for Shuffle, and `Match` scrolls itself. The wager screen scrolls its own root.
- **The wager is spent when the match starts.** `placeFarmhandShuffleWager` deducts it immediately and `settleFarmhandShuffleMatch` pays out. Both are guarded against running twice, and both are persisted right away. Keep that in mind for any new path that ends a match.
- **React 18.** Farmhand runs React 18 (the library supports 17 and 18). Avoid `defaultProps` on function components and passing `key` through a spread, since React 18.3 warns about both.
