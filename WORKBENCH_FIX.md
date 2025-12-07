# Workbench Display Fix

## Issue
When entering a prompt to generate an application, the workbench was showing "Start a chat to enable the workbench" instead of displaying the generated code files.

## Root Cause
The workbench availability was only checking if `chatStarted` was `true`:

```tsx
const isWorkbenchAvailable = chatStarted;
```

This caused the workbench to remain empty even after files were generated, because the `chatStarted` flag might not update immediately.

## Solution
Changed the logic to check for generated files in addition to chat started status:

```tsx
// Show workbench when either chat has started OR when there are files generated
const hasFiles = Object.keys(files).length > 0;
const isWorkbenchAvailable = chatStarted || hasFiles;
```

## File Modified
- `/bolt.diy/app/components/workbench/Workbench.client.tsx` (line 381-383)

## Result
Now the workbench will:
✅ Show generated files **immediately** when code is created
✅ Display content even if `chatStarted` flag hasn't updated yet
✅ Work correctly when you enter your first prompt
✅ No more "Start a chat to enable the workbench" message when files exist

## Testing
1. Open Bolt/WORKSPACE
2. Enter a prompt like "create a simple todo app"
3. Watch the workbench automatically appear with generated files
4. Files should be visible in the code editor immediately

---

**Status**: ✅ Fixed and ready for testing!
