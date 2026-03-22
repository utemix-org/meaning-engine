# How to Give Feedback — Meaning Engine

We actively seek structured feedback from engineers who read, watch, or interact with Meaning Engine materials. This page explains what feedback is most useful and how to submit it.

---

## What kind of feedback we want

We are looking for **concrete observations**, not general impressions.

### Most useful

- "I didn't understand what 'computational substrate' means until I read the demo output"
- "The gap detection demo was the most convincing part"
- "I would object that 21 nodes is too small to prove anything"
- "The Q&A section doesn't address [specific question]"
- "This claim in the narrative feels too strong: [exact quote]"

### Less useful

- "Looks good"
- "Interesting project"
- "Maybe add more features"

### Specifically, we want to know

1. **Where were you confused?** Which part of the materials was unclear or required re-reading?
2. **Where did we overclaim?** Where did the materials promise more than what was demonstrated?
3. **Where did we underclaim?** Where did we undersell something genuinely strong?
4. **What objection would you raise?** If you were reviewing this in an engineering meeting, what would you challenge?
5. **What's missing?** What question did you have that wasn't answered?

---

## How to submit feedback

### Option 1: GitHub Issue (preferred)

Open a new issue using the **Presentation / Dry-Run Feedback** template:

[**Open feedback issue**](https://github.com/utemix-org/meaning-engine/issues/new?template=presentation_feedback.md)

The template includes a short structured questionnaire (9 prompts). Fill in what's relevant — you don't need to answer every question.

### Option 2: Informal

If you prefer not to open a GitHub issue, you can share observations in any format with the project maintainer. We'll capture and attribute the feedback appropriately.

---

## What happens with your feedback

- Feedback is reviewed and categorized (content / delivery / demo / objection).
- Concrete observations may lead to narrow improvements in the presentation materials.
- We will not invent feedback that wasn't given.
- We will not claim community endorsement based on individual feedback.

---

## What we are NOT asking for

- We are not soliciting feature requests through this channel (use the feature proposal template for that).
- We are not asking for approval or endorsement.
- We are not promising response SLAs.
- We do not have an existing community — this is a pre-production project seeking early engineering feedback.

---

## Materials available for review

| Material | Location | What it covers |
|----------|----------|---------------|
| Project overview | [README.md](../README.md) | What ME is, what it isn't, quick start |
| Presentation narrative | [docs/presentation/PRESENTATION_NARRATIVE.md](./presentation/PRESENTATION_NARRATIVE.md) | Full engineering story |
| Claims and non-claims | [docs/presentation/CLAIMS_AND_NONCLAIMS.md](./presentation/CLAIMS_AND_NONCLAIMS.md) | What we claim, what we don't |
| Live demo | `node --experimental-vm-modules worlds/traceability-world/demo.js` | 5 scenarios on a 21-node graph |
| Test suite | `npm test` | 930+ tests, 41 files |
| Benchmark data | [docs/OPERATIONAL_LIMITS.md](./OPERATIONAL_LIMITS.md) | Measured performance + sharp edges |
