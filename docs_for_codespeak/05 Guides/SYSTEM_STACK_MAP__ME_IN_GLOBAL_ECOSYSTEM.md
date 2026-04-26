# SYSTEM_STACK_MAP__ME_IN_GLOBAL_ECOSYSTEM

---

title: SYSTEM_STACK_MAP__ME_IN_GLOBAL_ECOSYSTEM

kind: guide

project: Meaning Engine

status: active

scope: horizon

maturity: draft

source: synthesis

---

Non-canonical positioning note: эта страница про размещение ME в общем стеке. Она не задаёт контрактов kernel/operators. Канон: SYSTEM_OVERVIEW + SPECS + WORLD_CAPABILITIES_AND_OPERATOR_SUPPORTS.

## Назначение

Эта страница фиксирует, где Meaning Engine (ME) находится в мировом технологическом стеке и как он соотносится с окружающими слоями.

Цель: не сравнение «кто лучше», а корректное размещение ME в слоях и определение границ интеграции.

## Stack (слои)

Слой 4 — Applications

- вертикальные продукты, ассистенты, enterprise workflows

Слой 3 — Knowledge surfaces / workbenches

- IDE-like workbenches, knowledge explorers, documentation surfaces

Слой 2 — Knowledge runtimes

- ME Runtime (kernel + worlds + operators)

Слой 1 — Graph / semantic infrastructure

- property graphs, RDF stores, graph DB, vector search / indexes

Слой 0 — Storage / compute

- databases, object stores, filesystems, distributed compute

## Где находится Meaning Engine

ME находится между graph/semantic infrastructure и applications:

- ниже surfaces (ME не обязан быть UI)
- выше storage/graph DB (ME не обязан быть хранилищем)

ME — runtime, который понимает:

- canonical knowledge
- observation (projection)
- navigation
- reasoning operators

## Стратегический разворот (из нарратива): automation of cognition → structured understanding

Контекст эпохи LLM:

- Мейнстрим-стек строится как `Human → task → AI → solution` (automation of cognition).
- Побочный эффект масштаба: растёт боль “мы перестаём понимать системы” (код/исследования/архитектура выглядят правдоподобно, но reasoning/assumptions не проверяемы).

Ниша ME:

- Не `AI that thinks`, а `tools that help humans think around AI`.
- Формула разделения ролей:
 - AI produces content
 - Meaning Engine produces structure
 - Human produces understanding

Граница со смежными слоями:

- GraphRAG помогает **искать знания** (retrieval/ingestion).
- Meaning Engine помогает **понимать знания** (структура объяснений: paths / rivals / gaps / suggestions).

## Принцип интерфейса

ME не «заменяет» нижние слои.

ME использует их через адаптеры и контракты, сохраняя границы:

- kernel не делает extraction
- kernel не делает canonicalization
- kernel не зависит от UI

## Delivery forms (привязка к стеку)

- Endpoint (API/MCP): ME как сервис между sources и consumers
- Embedded engine: ME как библиотека внутри surface/application
- Native workbench: возможная форма позже, но не обязательная

## Связанные документы

- SYSTEM_OVERVIEW
- SYSTEM_POSITIONING__OPEN_QUESTIONS_AND_FORMAT_HYPOTHESES