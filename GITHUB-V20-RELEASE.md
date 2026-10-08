# GitHub V20 release checklist

Repository: `https://github.com/kaustubhdua/JYC-Website.git`

1. Extract this release.
2. Copy source into the existing Git clone while excluding `.git`, `node_modules`, `dist`, and all `.env*` files.
3. Run:

```powershell
npm ci
npm run qa
npm run build
npm run qa:browser
```

4. Inspect 390x844, 400x580, 768x1024 and desktop screenshots.
5. Check `git diff --check`.
6. Check `git status --short` for secrets.
7. Commit:

```powershell
git add -A
git commit -m "Release V20.0.0 complete JYC platform"
git pull --rebase origin main
git push origin main
```

8. Verify:

```powershell
git log -1 --oneline
git status
```
