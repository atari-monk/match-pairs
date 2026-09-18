## docs/task/game-srs.md

```markdown
## Task

- Given:
  - Srs draft
  - Srs template
- Generate full srs document
```

## docs/srs/game-draft.md

```markdown
## Game `Match Pairs`

- Project done to show i can focus and organize for 4h to produce mvp, after not done so for long time
- Project used atom-engine (mine custom library) project generator to generate `match-pairs` repo
- Project must use or extend this library depending on its needs
- Game machanic:
  - Grid of custom size
  - Each point on gird is a card with number
  - Flipable for custom time
  - Player needs to remember number positions to find pairs
  - After all pairs are found game resets
  - Count time and provide best 5 scores
- Project mobile goals:
  - Extend atom-engine to support mobile as this is mobile first project
  - Introduce input helpers needed to support mobile touch and consume it in game
  - Make sure resolution/screen fits mobile needs, extend engine for that if needed
```

## docs/srs/srs-template.md

```markdown
---
title: 'Template for Software Requirements Specification Document'
slug: 'srs-template'
description: 'Format of SRS doc. SRS content: minimal amount of information to define a feature/function, without any duplication or repetition. Path in project: docs/srs/your-name.md'
date: 2026-09-16
draft: false
author: 'atari-monk'
tags:
  - srs
  - template
categories:
  - template
---

## Name

Description (optional)

### Topic

- Requirement

...

### Topic

- Requirement

...

### Commits

- message
```
