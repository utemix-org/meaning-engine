# ADR-011-ENGINE_INDEPENDENT_FROM_UI

---

title: ADR-011-ENGINE_INDEPENDENT_FROM_UI

kind: adr

project: Meaning Engine

status: active

source: canonized-from-D13

---

## Problem

Если движок зависит от UI, система становится хрупкой.

## Decision

Engine не зависит от UI. Renderer читает только ViewModel.

## Consequences

- Можно менять UI без изменения законов.
- Engine тестируется независимо.