# 📚 DataMa Icons - External Documentation

This folder contains **targeted integration guides** for specific use cases and platforms.

## 📖 Available Guides

### 🌟 [Vue.js CDN Usage Guide](./vue-cdn-usage.md)
**For:** Vue.js projects using DataMa Icons via CDN

**Covers:**
- Quick start with CDN integration
- Vue 2 and Vue 3 component examples
- Advanced usage patterns
- Performance optimization
- Troubleshooting

**Use when:** You're building a Vue.js application and want to use DataMa Icons via CDN without bundling.

---

### 🔧 [Light Project Integration Guide](./light-integration.md)
**For:** Dataviz extensions (Looker Studio, Power BI, Tableau, Qlik) and the `light/` project

**Covers:**
- Self-hosted integration without external dependencies
- Parallel usage with import aliases for gradual migration
- Platform-specific compatibility
- Advanced styling and customization
- Performance optimization strategies

**Use when:** You're building dataviz extensions or working in the `light/` project that requires self-hosted solutions.

---

## 🎯 When to Use Each Guide

| Use Case | Recommended Guide | Why |
|----------|------------------|-----|
| **Vue.js web app** | [Vue.js CDN](./vue-cdn-usage.md) | CDN approach for simplicity |
| **Dataviz extensions** | [Light Integration](./light-integration.md) | Self-hosted for platform compatibility |
| **Gradual migration** | [Light Integration](./light-integration.md) | Parallel usage with aliases |
| **Production deployment** | [Vue.js CDN](./vue-cdn-usage.md) | Optimized CDN delivery |

## 📞 Additional Resources

- **Main documentation** : [../README.md](../README.md)
- **Migration guide** : [../MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md)
- **Examples** : [../example.html](../example.html)
- **Interactive tests** : [../test-complex-icons.html](../test-complex-icons.html)

---

*External Documentation v1.0.1* 