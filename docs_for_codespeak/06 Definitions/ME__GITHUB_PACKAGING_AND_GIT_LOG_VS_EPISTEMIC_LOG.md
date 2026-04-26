# ME__GITHUB_PACKAGING_AND_GIT_LOG_VS_EPISTEMIC_LOG

---

title: ME__GITHUB_PACKAGING_AND_GIT_LOG_VS_EPISTEMIC_LOG

kind: definitions

project: Meaning Engine

status: active

scope: now

maturity: draft

source: chat-fragment

---

## Purpose

Зафиксировать:

- как упаковать Meaning Engine для первой публичной витрины (GitHub)
- как соотносится история коммитов (Git) и эпистемический лог (ME)

## GitHub as a “showcase” (why GitHub)

GitHub — не только хостинг, а социальная инфраструктура, где проект становится:

- обнаруживаемым
- проверяемым (trust)
- вовлекающим (issues/PR/discussions)

## Minimal public release (what must exist)

Минимальный публичный релиз =

- репозиторий с воспроизводимым демо
- короткий architecture paper (внутри repo или отдельным PDF)
- 1–2 proof demos (doc-world и/или spec→code traceability)

## Repository structure (recommended)

Репозиторий должен явно разделять kernel / operators / worlds / demos.

Ориентировочный каркас:

- [README.md](http://README.md)
- [ARCHITECTURE.md](http://ARCHITECTURE.md)
- [MANIFESTO.md](http://MANIFESTO.md) (опционально; если нужен “почему”)
- /engine
 - kernel (log/evaluate/buildGraph)
 - projection
 - navigation
- /operators
 - inspect
 - trace
 - compare
- /worlds
 - documentation-world
 - code-artifact-world (или расширение doc-world)
- /examples
 - doc-world-demo
 - traceability-demo
- /papers
 - [meaning-engine-paper.md](http://meaning-engine-paper.md) (или.pdf)

## README requirements (3 questions)

README должен отвечать коротко и без философии на:

1) Problem

- почему чистый LLM reasoning недостаточен (context window, hallucination, no reproducible reasoning)

2) Idea

- epistemic log + computed graph + operators

3) Demonstration

- как запустить демо и увидеть “reasoning artifacts” (gaps/rival traces/compare)

## Git commit history vs Epistemic log

### Definition

- Git commit history = история эволюции *кода*.
- Epistemic log = история эволюции *знания/мышления* в мире.

Коротко:

- Git = versioning of software
- Epistemic log = versioning of reasoning

### Similarities

- оба поддерживают:
 - линейную историю
 - ветвление
 - возвраты
 - сравнение альтернатив

### Differences (critical)

- Git commits фиксируют изменения артефакта (репозитория).
- Epistemic log фиксирует изменения утверждений/гипотез/доказательств внутри world.
- Git не знает семантики “истина/гипотеза/канон”.
- Epistemic log обязан различать:
 - hypothesis vs canonical
 - evidence/provenance
 - governance actions

## Interaction model (how they coexist)

Рекомендуемая модель слоёв:

- Git хранит код ME и код/данные миров (как артефакты)
- ME хранит эпистемические логи миров (как содержание reasoning)

Визуально:

Git (software version)

└── meaning-engine runtime

└── world epistemic logs (reasoning version)

## Operational rule

- Не пытаться “заменить Git” эпистемическим логом.
- Не пытаться “заменить эпистемический лог” commit history.

Это разные слои с разной семантикой.

## Open question (for later)

Как публиковать эпистемические логи:

- как файлы в repo
- как отдельный артефакт (release asset)
- как экспорт из ME

Решение зависит от privacy/объёма/воспроизводимости демо.