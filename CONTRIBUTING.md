# Contributing to BurgerDrop

Thank you for your interest in contributing to BurgerDrop! This guide will help you understand our development workflow and ensure your contributions meet our quality standards.

## Table of Contents

- [Development Workflow](#development-workflow)
- [Test-Driven Development (TDD)](#test-driven-development-tdd)
- [Git Workflow](#git-workflow)
- [Pull Request Process](#pull-request-process)
- [Code Quality Standards](#code-quality-standards)
- [Setup Instructions](#setup-instructions)

## Development Workflow

We follow a strict Test-Driven Development (TDD) approach. **All functional code must have corresponding tests without exception.**

### Before You Start

1. Read [CLAUDE.md](./CLAUDE.md) for comprehensive development guidelines
2. Ensure you have Node.js 18.x or 20.x installed
3. Fork and clone the repository
4. Run `npm install` to install dependencies
5. Run `npm run test:run` to verify your setup

## Test-Driven Development (TDD)

### The TDD Cycle

1. **Write Tests First** 🔴
   - Write tests that define expected behavior
   - Tests should fail initially (Red phase)
   - Cover both happy paths and edge cases

2. **Make Tests Pass** 🟢
   - Write minimal code to pass tests
   - Don't add functionality not covered by tests
   - Focus on making tests green

3. **Refactor** 🔵
   - Improve code quality
   - Ensure tests still pass
   - Optimize performance if needed

### Example TDD Workflow

```bash
# 1. Create a new feature branch
git checkout -b feature/new-ingredient-type

# 2. Write your test first
# Edit: tests/entities.test.js

# 3. Run tests to see them fail
npm run test:watch

# 4. Implement the feature
# Edit: src/game/entities/Ingredient.js

# 5. Run tests until they pass
# Tests will auto-run in watch mode

# 6. Check coverage
npm run test:coverage

# 7. Run full checks before committing
npm run check:full
```

### Testing Requirements

- **Minimum Coverage**: 80% line coverage required
- **Test Types**: Write both unit and integration tests
- **No Mocks in Production**: Never commit dummy or mockup code
- **Test Documentation**: Tests serve as living documentation

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/component-name` - Code refactoring
- `docs/update-description` - Documentation updates

### Commit Messages

Follow these guidelines:
- Use present tense, imperative mood ("Add feature" not "Added feature")
- First line: 50 characters or less
- Reference issues: "Fix #123: Resolve score calculation bug"
- Be descriptive and specific

### Example Commit Messages

```
✅ Good:
- Add power-up collision tests
- Fix ingredient spawn rate scaling
- Refactor audio system for better performance
- Update README with new setup instructions

❌ Bad:
- Fixed stuff
- Update
- Changes
- WIP
```

## Pull Request Process

### Before Creating a PR

1. **Run Pre-commit Checks**
   ```bash
   npm run precommit
   ```

2. **Ensure All Tests Pass**
   ```bash
   npm run test:run
   ```

3. **Verify Coverage**
   ```bash
   npm run test:coverage
   ```

4. **Build Successfully**
   ```bash
   npm run build
   ```

### Creating a Pull Request

1. Push your branch to GitHub
2. Create a PR with a clear title and description
3. Include in your PR description:
   - Summary of changes
   - Related issue numbers
   - Testing instructions
   - Screenshots for UI changes
   - Breaking changes (if any)

### PR Template

```markdown
## Summary
Brief description of what this PR does

## Related Issues
Fixes #123
Related to #456

## Changes Made
- Added new power-up type: Shield
- Implemented collision detection for Shield
- Added comprehensive tests for Shield behavior

## Testing Instructions
1. Run `npm run dev`
2. Play the game until a Shield power-up appears
3. Collect it and verify immunity to ingredient collisions

## Screenshots
[If applicable]

## Checklist
- [ ] Tests written and passing
- [ ] Coverage ≥ 80%
- [ ] Documentation updated
- [ ] No console errors
- [ ] Follows code style guidelines
```

### PR Review Process

1. Automated checks must pass:
   - All tests passing
   - Coverage threshold met
   - Build successful
   - No security vulnerabilities

2. Code review required:
   - At least one approval needed
   - Address all feedback
   - Resolve all conversations

3. Keep PR updated:
   - Rebase on main if needed
   - Resolve merge conflicts
   - Update based on feedback

## Code Quality Standards

### JavaScript Style

- Use ES6+ features
- Consistent naming conventions
- Clear, self-documenting code
- Add JSDoc comments for complex functions

### Performance Guidelines

- Optimize canvas rendering
- Use object pooling for frequently created objects
- Minimize DOM manipulation
- Profile performance impacts

### Accessibility

- Ensure keyboard navigation works
- Provide audio toggle options
- Consider colorblind-friendly design

## Setup Instructions

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/BurgerDrop.git
cd BurgerDrop

# Install dependencies
npm install

# Run tests
npm run test:run

# Start development server
npm run dev

# Open http://localhost:8787
```

### Useful Commands

```bash
# Development
npm run dev              # Start local dev server
npm run build           # Build for production
npm run deploy          # Deploy to Cloudflare

# Testing
npm run test            # Run tests in watch mode
npm run test:run        # Run tests once
npm run test:coverage   # Generate coverage report
npm run test:watch      # Watch mode for TDD

# Checks
npm run check           # Run tests and build
npm run check:full      # Run coverage and build
npm run precommit       # Run pre-commit checks
```

### Environment Setup

For deployment, you'll need:
- Cloudflare account
- GitHub secrets configured:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`

## Getting Help

- Check existing issues for similar problems
- Read the documentation in [CLAUDE.md](./CLAUDE.md)
- Ask questions in PR comments
- Use @claude in issues for AI assistance

## Thank You!

Your contributions help make BurgerDrop better for everyone. By following these guidelines, you ensure high-quality code that's maintainable and reliable.

Happy coding! 🍔🎮