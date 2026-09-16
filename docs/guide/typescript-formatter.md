# Setting Up a TypeScript Formatter with Prettier

Consistent formatting makes TypeScript code easier to read and keeps code reviews focused on actual changes. **Prettier** can automatically format your project.

## 1. Install Prettier

Install Prettier as a development dependency using pnpm:

```bash
pnpm add -D prettier
```

## 2. Add a Prettier configuration

Create a `.prettierrc` file in the project root:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all"
}
```

## 3. Add formatting scripts

Update `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

Format the project with:

```bash
pnpm format
```

Or check formatting without changing files:

```bash
pnpm format:check
```

## 4. Ignore generated files

Create a `.prettierignore` file:

```text
node_modules
dist
build
coverage
```

## 5. Enable format on save

If you're using VS Code, install the **Prettier - Code formatter** extension.

Then create `.vscode/settings.json`:

```json
{
  "[typescript]": {
    "editor.formatOnSave": true
  }
}
```

Now TypeScript files will be formatted automatically whenever you save them.
