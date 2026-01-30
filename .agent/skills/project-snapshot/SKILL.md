---
name: project-snapshot
description: Creates a local backup of the project source code.
---

# Project Snapshot Skill

This skill allows you to quickly create a local backup of the `src` directory.

## Usage

Run the following command to create a backup with a timestamp or label.

```bash
# Basic usage (default name src_backup_<timestamp>)
# Manually: cp -r src src_backup_$(date +%Y%m%d_%H%M%S)

# With label
# cp -r src src_backup_<label>
```

## Best Practices

- Use meaningful labels for backups (e.g., `feature_login_complete`).
- Periodically clean up old backups to save space.
