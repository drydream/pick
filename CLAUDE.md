# PICK — Project Instructions

## Stack
Next.js 14 App Router · Tailwind CSS · Framer Motion · Lucide React · html2canvas  
Deploy target: Vercel (auto-deploy from `main`)

## Language Rule
All user-facing strings, labels, and UI text **must be in Thai**.  
Code, comments, and git messages are written in English.

## Code Update Workflow

For **every** feature update, follow this exact workflow:

### 1. Complete Code
Provide the full updated file contents for every file that changed.  
Never provide partial diffs only — always give the complete file so it can be copy-pasted.

### 2. Version Summary (รายละเอียดการแก้ไข)
After the code, include a bulleted list **in Thai** describing what changed:

```
## รายละเอียดการแก้ไข — vX.Y.Z

- [ชื่อไฟล์] — สิ่งที่เปลี่ยนแปลง
- ...
```

### 3. Git Commands
Provide this exact command sequence (copy-paste ready):

```bash
# 1. Create and switch to version branch
git checkout -b vX.Y.Z

# 2. Stage changed files
git add <files>

# 3. Commit
git commit -m "feat/fix/chore: short description (vX.Y.Z)"

# 4. Push version branch
git push -u origin vX.Y.Z

# 5. Merge to main and deploy
git checkout main
git merge vX.Y.Z
git push origin main
```

## Version Naming
- `v1.0.0` — Initial release
- `v1.1.x` — New features on top of initial release
- `v1.x.0` — Minor version bump when a full screen/flow is added
- `v2.0.0` — Breaking redesign or major architecture change

## Branch Strategy
- `main` — Production branch (Vercel deploys from this)
- `vX.Y.Z` — Feature/fix branches, merged to main after verification

## Current Version History
| Version | Branch | Description |
|---------|--------|-------------|
| v1.0.0 | main | Initial release — home, sidebar, mode select, normal game, camera game, result, add category |
| v1.1.0 | v1.1.0 | Round selection (5 or 10 rounds), multi-round game loop, progress bar, winner summary |
