# BurgerDrop Development Guide

This document outlines the development workflow and best practices for the BurgerDrop project. It serves as a comprehensive guide for developers working on this HTML5 canvas game, covering test-driven development practices, Git/GitHub workflows, and Cloudflare deployment procedures. All team members should follow these guidelines to maintain code quality and ensure smooth collaboration.

## Test-Driven Development (TDD) Process

### Mandatory Testing Requirements

All functional code must have corresponding tests without exception. Every new feature, bug fix, or enhancement requires comprehensive test coverage before it can be merged into the main branch. This is a non-negotiable requirement that ensures code reliability and maintainability.

No mockups or dummy code should ever be committed to the repository. Only fully working, tested code that provides real functionality is allowed. All features must be developed through actual implementations guided by tests, not through placeholder or prototype code.

### TDD Workflow

The project follows a strict test-driven development workflow:

1. **Write Tests First**: Before implementing any new feature or fixing any bug, write comprehensive test cases that define the expected behavior. These tests should cover both the happy path and edge cases.

2. **Verify Test Failure**: Run the tests to ensure they fail initially. This confirms that the tests are actually testing something meaningful and not passing due to false positives.

3. **Implement Minimal Code**: Write the minimum amount of code necessary to make the tests pass. Avoid over-engineering or adding functionality that isn't covered by tests.

4. **Refactor**: Once tests are passing, refactor the code to improve quality, readability, and performance while ensuring tests continue to pass.

5. **Test Types**: Write both unit tests for individual components and integration tests for feature interactions. Tests should serve as living documentation of expected behavior.

## Git and GitHub Workflow

### Branching Strategy

Each new feature, enhancement, or bug fix must be developed in a separate feature branch. Branch names should be descriptive and follow the pattern `feature/feature-name` or `fix/bug-description`. This isolation ensures that work in progress doesn't affect the stable main branch and makes it easier to manage multiple concurrent development efforts.

### Commit Guidelines

Make frequent, atomic commits with clear and descriptive commit messages. Each commit should represent a logical unit of work that can be understood in isolation. Commit messages should follow this format:
- Present tense, imperative mood (e.g., "Add user authentication tests" not "Added tests")
- First line should be a concise summary (50 characters or less)
- Add detailed explanation in subsequent lines if needed
- Reference issue numbers when applicable (e.g., "Fix #123: Resolve score calculation bug")

### Remote Collaboration

Push changes to the remote GitHub repository regularly to ensure work is backed up and visible to the team. Before pushing, always pull the latest changes from the main branch and resolve any conflicts locally. This practice minimizes integration issues and keeps everyone synchronized.

### Pull Request Process

When a feature is ready for review:

1. **Create Pull Request**: Open a PR on GitHub with a clear title and comprehensive description
2. **PR Description**: Include:
   - Summary of changes made
   - Link to related issue or ticket
   - Testing instructions
   - Any deployment considerations
   - Screenshots for UI changes
3. **Review Assignment**: Request review from appropriate team members
4. **CI Checks**: Ensure all automated checks pass before requesting review

## Cloudflare Deployment and MCP Integration

### Cloudflare Project Setup

The project deploys to Cloudflare Workers using the following configuration:

1. **Initial Setup**: Ensure you have a Cloudflare account with appropriate permissions. The project requires two secrets in GitHub: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

2. **Build Process**: Before deployment, run `npm run build` to bundle the game and inject it into the worker. This step is critical as the game won't function in production without proper bundling.

3. **Local Development**: Use `npm run dev` to start a local development server with Wrangler. This allows testing the Cloudflare Worker environment locally at http://localhost:8787.

### Testing Deployments with MCP

Cloudflare's Model Context Protocol (MCP) integration enables sophisticated deployment testing:

1. **MCP Server Integration**: The project can leverage Cloudflare's MCP servers to simulate production environments during development. Use the Cloudflare CLI or SDK to validate application behavior in Cloudflare's infrastructure.

2. **Automated Testing**: Claude AI can assist in deployment validation through MCP integration. This includes checking worker configuration, testing edge cases, and ensuring proper asset delivery.

3. **Preview Deployments**: Each pull request triggers a preview deployment on Cloudflare, allowing reviewers to test changes in a production-like environment before merging.

### Deployment Gates in PRs

All pull requests must pass deployment tests on Cloudflare before merging:

1. **Automated Deployment Checks**: The CI/CD pipeline automatically deploys PR changes to a staging environment on Cloudflare Workers.

2. **Required Checks**: PRs cannot be merged unless:
   - All tests pass (unit and integration)
   - Build process completes successfully
   - Cloudflare deployment succeeds
   - No security vulnerabilities are detected

3. **Performance Validation**: Deployment checks include performance metrics to ensure changes don't degrade game performance.

## Updating Documentation

### Maintaining CLAUDE.md

This CLAUDE.md file is a living document that must be kept current as the project evolves. When workflows change, new tools are adopted, or best practices are updated, this file must be modified accordingly. Regular reviews should be conducted to ensure the documentation accurately reflects current development practices.

### Other Project Documentation

Keep all documentation up-to-date, including:
- Main README.md with setup instructions
- API documentation for game systems
- Architecture documentation for major components
- Inline code comments for complex logic
- Test documentation explaining test strategies

### Documentation in PRs

Documentation updates should be included in the same pull request as the code changes they describe. When submitting a PR:
1. Review if any documentation needs updating
2. Include documentation changes in the same PR
3. Ensure examples and code snippets remain accurate
4. Update version numbers and changelog if applicable

## Pull Request Review and Merging Process

### Passing Tests

All pull requests must pass the complete test suite before merging:
- Unit tests via `npm run test:run`
- Integration tests for feature interactions
- Coverage requirements (maintain or improve coverage)
- Linting and code quality checks

Any failing test blocks the PR from merging until resolved. The main branch must always remain in a deployable state.

### Code Review

The code review process ensures quality and knowledge sharing:

1. **Review Requirements**: At least one approval from a team member is required
2. **Review Focus**:
   - Code correctness and test coverage
   - Performance implications
   - Security considerations
   - Code style and maintainability
   - Documentation completeness

3. **Feedback Response**: Address all review comments before merging. Use the GitHub conversation features to discuss and resolve feedback.

### Merging Guidelines

Follow these guidelines when merging approved PRs:

1. **Update Branch**: Ensure the feature branch is up-to-date with main
2. **Merge Strategy**: Use squash and merge for feature branches to maintain clean history
3. **Merge Commit Message**: Ensure the merge commit has a clear, descriptive message
4. **Branch Cleanup**: Delete the feature branch after successful merge

### Post-Merge Checks

After merging:
1. Monitor the automatic deployment to production via GitHub Actions
2. Verify the deployment succeeded in Cloudflare dashboard
3. Perform smoke tests on the production site
4. Update project board or issue tracker to reflect completed work

## Conclusion

Following these development practices ensures high code quality, smooth deployments, and effective collaboration. The combination of test-driven development, structured Git workflows, and automated Cloudflare deployments creates a robust development environment. By maintaining comprehensive tests, clear documentation, and rigorous review processes, we ensure the BurgerDrop project remains maintainable and reliable.

### Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vitest Testing Framework](https://vitest.dev/)
- [Anthropic Claude Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)

Adhering to these guidelines helps maintain our high standards for code quality and ensures efficient development workflows. Thank you for following these best practices!