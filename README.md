![Kandi CLI Logo](kandi-icon.png)

# Kandi CLI

AI-assisted software development CLI with interactive chat and 26 built-in tools.

## Installation

```bash
npm install -g @kandiforge/kandi-cli
```

Or use with npx:

```bash
npx @kandiforge/kandi-cli --help
```

## Requirements

- macOS (Intel or Apple Silicon)
- Node.js 14.0.0 or higher

## Getting Started

### 1. Configure API Keys

```bash
kandi config set anthropic.api_key "your-api-key"
kandi config set openai.api_key "your-api-key"
kandi config set github.token "your-token"
```

### 2. Start Interactive Chat

```bash
kandi chat --allow-all
```

### 3. Execute Coding Tasks

```bash
kandi code "Create a Python script that prints hello world"
```

### 4. Run Spec Files

```bash
kandi exec-spec /path/to/spec.md
```

## Features

- **Interactive Chat Mode**: Engage with AI assistants in a conversational interface
- **26 Built-in Tools**: Comprehensive toolset for software development tasks
- **Multiple AI Providers**: Support for Anthropic, OpenAI, and other providers
- **GitHub Integration**: Seamless integration with GitHub repositories
- **Spec File Execution**: Run detailed specifications for complex tasks

## Documentation

For detailed documentation and updates, visit: https://github.com/KandiForge/kandi-cli-releases

## Support

Report issues at: https://github.com/KandiForge/kandi-cli-releases/issues

## License

This is proprietary software. See LICENSE for details.