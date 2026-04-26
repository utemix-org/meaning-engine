# Epistemic Review Workflow Spec

## Purpose

Define how knowledge transitions from proposal to canonical state.

## Accepts

- Proposed statements
- Review actions

## State

- pendingProposals: Statement[]
- approvedStatements: Statement[]
- rejectedStatements: Statement[]

## Behavior

- propose(statement) -> add to pending
- approve(statement) -> move to approved
- reject(statement) -> move to rejected

## Constraints

- Only approved statements enter canonical state.
- Rejected statements MUST NOT affect GraphModel.
- Approval MUST deterministically affect canonical state.

## Output

- updated canonical state via knowledge substrate

## Role in System

This layer separates:

- knowledge content
- validation and governance process

## Interpretation

The system models epistemic processes explicitly.

Knowledge is not only data, but a result of review and admission.
