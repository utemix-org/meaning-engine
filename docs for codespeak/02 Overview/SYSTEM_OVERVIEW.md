# SYSTEM_OVERVIEW

---

title: SYSTEM_OVERVIEW

kind: overview

project: Meaning Engine

status: active

scope: v1

maturity: canon

---

## Что это

Meaning Engine — движок и практика работы со знаниями, где источник истины — эпистемический лог, граф вычисляется, а интерфейс строится через детерминированную проекцию.

## Ядро в одной цепочке

`Log -> Evaluate -> Canonical Statements -> BuildGraph -> Projection -> ViewModel -> Render`

## Мастер-формула

`UI = R(P(BuildGraph(Evaluate(Log)), F, C, S, Pr))`

## Ключевые принципы

- Log-first: граф не источник истины.
- Canonical-only: в граф попадает только канонизированное.
- Focus — операционный центр наблюдения.
- Projection purity: проекция чистая, детерминированная, тотальная.
- Navigation algebra: `F' = T(F, a, G)`.
- Context = наблюдение, не мутация: `C = {domain?, workbench?, character?}`.

См. также: AXIOMS (3 базовых инварианта).

### Граница: structure vs content

- Content живёт внутри узлов (тексты/код/формулы/ссылки) и интерпретируется на уровне surfaces.
- Structure живёт в графе (nodes/edges/types) и вычисляется/исследуется через проекцию, навигацию и operators.
- Epistemic status живёт в логе (история решений).

Meaning Engine не "вычисляет смысл текста" — он вычисляет и дисциплинирует эпистемическую структуру вокруг содержания.

## Protocol types (defined-not-enforced)

`src/core/types/protocol.ts` определяет type-level vocabulary для Focus Node Protocol и Attachment Protocol (`FocusRole`, `SceneVisibility`, `AttachmentPolicy`, `ProtocolAttributes` и др.). Эти типы экспортируются из пакета движка и могут присутствовать в данных мира, но **runtime их не валидирует**.

Status: `defined-not-enforced`. См. DRIFT_LOG.

## Границы слоёв (примечание)

- Render может применять world-defined policies (WorkbenchPolicy), не влияя на вычисление графа/проекции.
- В репозитории `utemix-org/meaning-engine` render/UI слой не является частью поставки; Render‑спеки остаются как контракт поверх `ViewModel` и используются для нормирования интерфейса в потребителях.

## Reference workflow (documentation reasoning, exploration-only)

`Node → Trace → (Path | GAP) → Compare → rival explanatory paths → BridgeCandidates → candidate structural bridges`

All steps remain in exploration mode. No operator result modifies canonical knowledge (см. [INVARIANTS](../03%20Architecture/INVARIANTS.md): Exploration ≠ Acceptance).

Evidence: [OPUS_TASK__DOC_WORLD__REFERENCE_WORKFLOW__TRACE_COMPARE_BRIDGE__EXPLORATION_ONLY](OPUS_TASK__DOC_WORLD__REFERENCE_WORKFLOW__TRACE_CO%2016a5005d0c164b22b03c6fa5d29c2686.md).

## Ближайший фокус

Заземление authored world: контент + 2+ полноценных workbench (см. development/WORLD_GROUNDING).