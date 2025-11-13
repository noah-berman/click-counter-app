# Contributing Guide

Thank you for your interest in contributing to the Click Counter Application!

## Development Setup

Please follow the [Setup Guide](./SETUP.md) to get your development environment ready.

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer `interface` over `type` for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript for all components

### Backend

- Follow RESTful API conventions
- Use async/await for asynchronous operations
- Handle errors appropriately
- Validate all inputs

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add user profile page
fix: Resolve click counter race condition
docs: Update API documentation
refactor: Extract authentication logic to service
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Write or update tests
4. Ensure all tests pass
5. Update documentation if needed
6. Submit pull request with clear description

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Writing Tests

- Write tests for new features
- Maintain or improve test coverage
- Test edge cases and error scenarios
- Use descriptive test names

## Code Review Guidelines

### For Authors

- Keep PRs focused and small
- Provide context in PR description
- Respond to feedback promptly
- Update PR based on feedback

### For Reviewers

- Be constructive and respectful
- Focus on code quality and correctness
- Check for security issues
- Verify tests are included

## Project Structure

### Backend

- `src/` - Source code
  - `routes/` - API route handlers
  - `services/` - Business logic
  - `middleware/` - Express middleware
- `prisma/` - Database schema and migrations
- `tests/` - Test files

### Frontend

- `src/` - Source code
  - `components/` - Reusable components
  - `pages/` - Page components
  - `contexts/` - React contexts
  - `services/` - API service functions
- `public/` - Static assets

## Documentation

- Update README files when adding features
- Document API changes in API.md
- Add code comments for complex logic
- Update setup guide if dependencies change

## Security

- Never commit secrets or credentials
- Validate all user inputs
- Use parameterized queries (Prisma handles this)
- Follow authentication best practices
- Report security issues privately

## Questions?

If you have questions or need clarification:

1. Check existing documentation
2. Review existing code for patterns
3. Open an issue for discussion
4. Ask in pull request comments

Thank you for contributing!

