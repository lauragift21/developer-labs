# Cloudflare Developer Labs

Interactive tutorials and hands-on labs to build production-ready applications on Cloudflare's developer platform.

## 🎯 What You'll Learn

**Cloudflare Workers**
- Build serverless applications at the edge
- Create HTTP APIs with routing
- Integrate with KV storage and D1 databases
- Add AI-powered features with Workers AI

**Model Context Protocol (MCP)**
- Build intelligent AI assistants
- Connect to external systems and APIs
- Create custom AI tools and workflows
- Deploy MCP servers globally

## 🚀 Quick Start

### Prerequisites

- **Node.js v18+** - [Download here](https://nodejs.org)
- **Cloudflare Account** - [Sign up free](https://dash.cloudflare.com/sign-up)
- **Wrangler CLI** - Install with `npm install -g wrangler`

### Development Setup

```bash
# Clone the repository
git clone https://github.com/lauragift21/developer-labs.git
cd developer-labs

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see the site locally.

### Deploy to Cloudflare

```bash
# Login to Cloudflare (first time only)
wrangler login

# Deploy to production
npm run deploy
```

## 📁 Project Structure

```text
developer-labs/
├── public/                    # Static assets
│   ├── assets/
│   │   ├── css/              # Stylesheets
│   │   ├── js/               # JavaScript files
│   │   └── og-image.png      # Social media image
│   └── favicon.svg           # Site favicon
├── src/
│   ├── components/           # Reusable Astro components
│   │   ├── Alert.astro
│   │   ├── Callout.astro
│   │   └── CodeBlock.astro
│   ├── content/              # Markdown content
│   │   ├── mcp-steps/        # MCP tutorial steps
│   │   └── workers-steps/    # Workers tutorial steps
│   ├── layouts/
│   │   └── Layout.astro      # Main layout template
│   └── pages/                # Site pages
│       ├── labs/
│       │   ├── index.astro   # Labs overview
│       │   ├── mcp/          # MCP tutorial
│       │   └── workers/      # Workers tutorial
│       └── index.astro       # Homepage (redirects to /labs)
├── astro.config.mjs          # Astro configuration
├── wrangler.jsonc            # Cloudflare Workers config
└── package.json
```

## 🛠️ Available Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally |
| `npm run deploy` | Build and deploy to Cloudflare Workers |
| `npm run astro ...` | Run Astro CLI commands |

## 🎨 Features

- **Interactive Tutorials**: Step-by-step labs with hands-on coding
- **Progressive Learning**: From basics to advanced concepts
- **Real Deployments**: Every lab results in a working application
- **Modern Stack**: Built with Astro, deployed on Cloudflare Workers
- **Responsive Design**: Works perfectly on desktop and mobile
- **SEO Optimized**: Complete meta tags and structured data

## 🧪 Lab Content

### Cloudflare Workers Labs
1. **Hello World** - Your first Worker
2. **HTTP APIs** - Building REST endpoints
3. **KV Storage** - Persistent data storage
4. **D1 Database** - SQL database integration
5. **Workers AI** - AI-powered applications
6. **Advanced Routing** - Complex request handling
7. **Production Deploy** - Going live globally

### MCP Labs
1. **MCP Basics** - Understanding the protocol
2. **First Server** - Building your first MCP server
3. **Custom Tools** - Creating AI assistant tools
4. **External APIs** - Connecting to third-party services
5. **Persistent State** - Using KV for data storage
6. **Advanced Features** - Complex workflows and patterns

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Adding New Labs

To add a new lab step:

1. Create a new markdown file in `src/content/workers-steps/` or `src/content/mcp-steps/`
2. Follow the existing frontmatter format:
   ```yaml
   ---
   stepNumber: 8
   title: "Your Lab Title"
   description: "Brief description of what students will learn"
   duration: "15 min"
   learningObjectives:
     - "Objective 1"
     - "Objective 2"
   ---
   ```
3. Write your tutorial content in markdown
4. Test locally with `npm run dev`

## 📚 Resources

- **[Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)**
- **[MCP Documentation](https://modelcontextprotocol.io/docs)**
- **[Astro Documentation](https://docs.astro.build)**
- **[Community Discord](https://discord.gg/cloudflaredev)**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built by the Cloudflare Developer Relations team
- Powered by [Astro](https://astro.build) and [Cloudflare Workers](https://workers.cloudflare.com)
- Community feedback and contributions

---

**Ready to start building?** Visit [developer-labs.examples.workers.dev](https://developer-labs.examples.workers.dev) and choose your first lab!
