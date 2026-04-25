# WORLD_AS_INTERFACE

---

title: WORLD_AS_INTERFACE

kind: architecture

project: Meaning Engine

status: active

scope: v1

maturity: draft

source: repo-ingest (WORLD_AS_[INTERFACE.md](http://INTERFACE.md))

---

Ключевая формулировка (совместима с текущим каноном): authored world — это shell/interface поверх meaning-engine, а не application.

## Соответствие ролей

- Meaning Engine = kernel
- Ontologies = packages/filesystem
- World = shell/interface (canonical shell: «Вова и Петрова»)
- Renderer = visual realization / window manager
- Services = applications (future)

## Следствие

World не определяет законы движка (они в architecture/specs); world лишь собирает конфигурацию (онтологии + примитивы мира + mappings).