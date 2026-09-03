# Farmhand Shuffle completion fixtures

`farmhand-shuffle-one-turn-from-win.json` and
`farmhand-shuffle-one-turn-from-loss.json` are save-data fixtures (loaded
the same way as any other via `loadFixture`) for testing what happens when
a Farmhand Shuffle match _completes_ - payout, achievements,
notifications - without playing an entire match through the UI turn by
turn.

## What's actually in them

Both fixtures start from `farmhand-shuffle-unlocked.json` (already at a
level/money that satisfies the feature's own unlock gate) and add an
in-progress match that's exactly **one real turn away** from ending:

- `farmhand-shuffle-one-turn-from-win.json`: the **bot's** funds are one
  tax payment from zero. Clicking "End turn" ends the match immediately -
  the session owner wins.
- `farmhand-shuffle-one-turn-from-loss.json`: the **session owner's**
  funds are one tax payment from zero instead. Clicking "End turn" hands
  play to the bot, whose turn resolves normally, and the match ends when
  the tax charge opening the session owner's _next_ turn lands - same one
  click, just resolved a beat later (see `match-completion.test.ts`,
  which uses `page.clock.fastForward()` to skip past that wait rather than
  the test actually waiting for it in real time).

The underlying mechanic (every turn, whoever's turn is starting pays a tax
that clamps to their balance, and hitting exactly `0` ends the match) is
`@jeremyckahn/farmhand-shuffle`'s own - see that package's
`src/game/config/MATCH_FIXTURES.md` for the full explanation. This
directory doesn't reimplement any of that; it only assembles Farmhand's
own save-data shape around a match `buildLowFundsMatch` already built.

## Regenerating them

Run this after a `@jeremyckahn/farmhand-shuffle` version bump that changes
the serialized match shape (the same drift
`FarmhandShuffleView.tsx`'s own `libraryVersion` tagging guards against at
runtime), or after editing `farmhand-shuffle-unlocked.json` (these two
fixtures are derived from it, not independent of it):

```bash
node e2e/fixtures/generate-farmhand-shuffle-completion-fixtures.mjs
```

This calls `buildLowFundsMatch` from
`@jeremyckahn/farmhand-shuffle/testing` (not the package's main entry -
see that package's own docs on why) and writes both JSON files in place.
Review the diff before committing - a real shape change upstream should
show up as more than a version-string bump.

## Using them in a test

```ts
import { loadFixture } from '../../test-utils/load-fixture.js'

await loadFixture(page, 'farmhand-shuffle-one-turn-from-win')
// Navigate to the Farmhand Shuffle view, then:
await page.getByRole('button', { name: 'End turn' }).click()
```

See `match-completion.test.ts` for the full working example, including
the achievement and payout/no-payout assertions.
