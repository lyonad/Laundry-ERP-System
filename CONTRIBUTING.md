# Contributing to Sistem ERP Laundry

Thank you for your interest in contributing! 🎉

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** - Search to see if the bug has already been reported
2. **Create detailed issue** - Include:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment (OS, browser, Node version)

### Suggesting Features

1. **Check roadmap** - See CHANGELOG.md for planned features
2. **Open feature request** - Explain:
   - Use case and benefits
   - Proposed implementation
   - Alternative solutions considered

### Pull Requests

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear message**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open Pull Request**

## 📝 Coding Standards

### Frontend (React/TypeScript)

```typescript
// ✅ Good
interface Service {
  id: string;
  name: string;
  price: number;
}

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  return <div>{service.name}</div>;
};

// ❌ Bad
const ServiceCard = (props) => {
  return <div>{props.service.name}</div>;
};
```

### Backend (Node.js)

```javascript
// ✅ Good
app.get('/api/services', async (req, res) => {
  try {
    const services = await getServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❌ Bad
app.get('/api/services', (req, res) => {
  const services = getServices();
  res.send(services);
});
```

## 🧪 Testing

Before submitting PR:

```bash
# Run frontend
npm run dev

# Test API endpoints
curl http://localhost:3002/api/health

# Manual testing checklist:
- [ ] Dashboard loads correctly
- [ ] POS checkout works
- [ ] Inventory updates
- [ ] Orders create/update
- [ ] Members CRUD operations
```

## 📋 Commit Message Convention

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

Examples:
```
feat: add WhatsApp notification
fix: resolve inventory stock calculation
docs: update API documentation
```

## 🎨 UI/UX Guidelines

- Follow existing design system (Orange theme)
- Maintain responsive design
- Use Shadcn UI components
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test on mobile devices

## 🔐 Security

- Never commit sensitive data (API keys, passwords)
- Use environment variables
- Validate all inputs
- Sanitize database queries
- Follow OWASP guidelines

## 📚 Documentation

When adding features:

1. Update README.md
2. Add API documentation
3. Include code comments
4. Update CHANGELOG.md
5. Add examples if needed

## ✅ PR Checklist

Before submitting:

- [ ] Code follows project style
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design works
- [ ] API endpoints documented
- [ ] Database schema updated (if applicable)

## 🙏 Questions?

Feel free to:
- Open an issue for discussion
- Join our Discord community
- Email: contribute@laundry-erp.com

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making Sistem ERP Laundry better! 💪**
