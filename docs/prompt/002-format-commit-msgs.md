## Task

Given messages and convention, format them.

## Messages

````markdown
### Commits

* Generate the project using the `atom-engine` project generator.
* Implement the core Match Pairs game loop.
* Add configurable card grid and randomized pairs.
* Add card flipping and pair matching.
* Add elapsed-time tracking and best-five score tracking.
* Add game completion and board reset.
* Extend `atom-engine` with mobile touch input support.
* Extend `atom-engine` with mobile screen and resolution support where required.
* Integrate the mobile engine extensions into Match Pairs.
````

## convention/commit-message.md

````markdown
## Commit Message Convention

Structured format for commit messages.

### Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

* **feat**: new user-facing feature
* **fix**: bug fix
* **chore**: maintenance (no production code change)
* **docs**: documentation only
* **style**: formatting, missing semicolons, etc. (no logic change)
* **refactor**: code change without feature or bug impact
* **perf**: performance improvements
* **test**: adding or updating tests
* **build**: build system or dependency changes
* **ci**: CI configuration changes

### Scope

Optional; indicates affected area.

Examples:

* `auth` → authentication
* `api` → backend API
* `ui` → frontend components
* `db` → database layer

### Examples

```
feat(auth): add Google OAuth login
fix(api): resolve null pointer in user endpoint
chore(deps): update dependencies
refactor(ui): simplify button logic
docs(readme): update installation steps
```

### Guidelines

* Use imperative mood (“add”, not “added”)
* Keep subject line ≤ 72 characters
* Be specific but concise
* Split unrelated changes into separate commits
* Use body to explain *why*, not *what*
````
