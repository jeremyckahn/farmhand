# 3. No Default Exports

Date: 2022-05-15

## Status

Accepted

## Context

JavaScript module syntax supports [default exports](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export#using_the_default_export) and [named exports](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export#using_named_exports). Historically, Farmhand has used an informal mix of both. As was discussed in [this PR thread](https://github.com/jeremyckahn/farmhand/pull/280#discussion_r873091538), default exports have a variety of drawbacks. Chief among these drawbacks is the maintenance challenges they can invite.

## Decision

Going forward, Farmhand will use exclusively named exports. Pre-existing default exports should be converted to named on an ongoing basis. Once the conversion is complete, the [`import/no-default-export`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-default-export.md) ESLint rule should be enabled.

## Consequences

- Exports will eventually become consistent across the codebase.
- Legacy default exports will remain present in the codebase for some time, thus obscuring the preference for named exports.
- Import naming errors will be prevented by failing loudly.
