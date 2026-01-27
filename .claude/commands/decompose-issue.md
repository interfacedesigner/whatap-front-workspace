---
description: Analyze and decompose issues into sub-problems and tasks
allowed-tools: Glob(*), Grep(*), Read(*)
argument-hint: [Issue description or issue number]
---

# Feature Decomposition Request

## Input Issue
$ARGUMENTS

---

## Analysis Instructions

Analyze the above issue and perform the following steps:

### Step 1: Understand the Problem
- Identify the core objective of the issue
- Explore related files/components in the current codebase
- Review existing structure and patterns

### Step 2: Decompose into Sub-problems
Break the issue into independent sub-problems:
- Each problem should have a clear scope
- Identify dependencies between problems
- Flag areas with high technical uncertainty

### Step 3: Break Down into Tasks
Decompose each sub-problem into concrete task units:
- Size that can be handled in a single PR/commit
- Independently testable units
- Include clear completion criteria

---

## Output Format

Please write the results in the following format:

```markdown
# [Issue Title]

## Summary
[Core objective of the issue in 1-2 sentences]

## Impact Scope
- Related files: [file list]
- Affected features: [feature list]

## Sub-problem Decomposition

### Problem 1: [Problem Name]
- **Description**: [What needs to be solved]
- **Uncertainty**: [Low/Medium/High]
- **Prerequisites**: [Dependencies on other problems]

### Problem 2: [Problem Name]
...

## Task List

### Tasks for [Problem 1]

#### Task 1.1: [Task Name]
- **Goal**: [What to achieve]
- **Completion Criteria**: [How to verify]
- **Expected Changed Files**: [file list]
- **Prerequisites**: [Dependent tasks]

#### Task 1.2: [Task Name]
...

### Tasks for [Problem 2]
...

## Recommended Execution Order
1. [First task] - Reason: ...
2. [Second task] - Reason: ...
...

## Risks and Considerations
- [Identified risk 1]
- [Identified risk 2]

## Verification Checklist
- [ ] All requirements are covered by tasks
- [ ] No duplication between tasks
- [ ] Each task is independently testable
- [ ] Dependency order is clear
```

---

## Additional Requirements
- If a task is too large, decompose it further
- Separate uncertain areas into spike (investigation) tasks
- Include test tasks together with or separately from implementation tasks
