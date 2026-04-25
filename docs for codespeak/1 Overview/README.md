# README

---

title: README

kind: overview

project: Meaning Engine

status: active

source: canonized

---

## Одной строкой

«Вова и Петрова» — authored knowledge world поверх семантического движка проекции и навигации.

## Репозиторий (карта)

- `src/core/` — kernel (knowledge log/evaluate/buildGraph + projection + navigation)
- `src/engine/` — engine-layer (адаптеры мира, schema/validators, reader спеки)
- `operators/` — compute‑операторы (trace/compare/supports), без governance‑мутаций
- `worlds/` — reference worlds (documentation-world, test-world)
- Render/UI — в этом репозитории отсутствует (render-specs остаются как контракт поверх ViewModel)

## Примечание о границах

- Спеки Render (например RENDER_SURFACES_SPEC, WorkbenchPolicy) описывают слой представления и его контракт с ViewModel, но не гарантируют наличие реализации в `utemix-org/meaning-engine`.
- В spec→code и Documentation World следует использовать пути `src/*`, `operators/*`, `worlds/*` (а не `packages/*`).

## Быстрый старт

- `npm install`
- `npm run dev`
- `npm run test:engine`

См. также: ARCHITECTURE, PROJECTION_SPEC, NAVIGATION_SPEC.