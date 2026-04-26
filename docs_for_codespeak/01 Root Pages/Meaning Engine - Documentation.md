# Meaning Engine — Documentation

Цель: единая, расширяемая структура документации проекта.

## Как пользоваться

- Навигация: заходите через разделы ниже.
- Любой документ начинается с фронтматтера (YAML) и далее — содержимое.

## Разделы

overview

[architecture](./architecture.md)

specs

guides

theory

reference

[development](./development.md)

adr

[definitions](./definitions.md)

[engineering](./engineering.md)

[atomic](./atomic.md)

appendix

---

## Фронтматтер (стандарт)

```yaml
title: <slug>
kind: overview|architecture|spec|guide|theory|reference|development|adr|appendix
project: <project>
status: draft|active|deprecated
owner: <name>
created: YYYY-MM-DD
updated: YYYY-MM-DD
source: <origin>
links:
 - <url-or-id>
tags:
 - <tag>
```

## Именование

- Название страницы: `SLUG` (без расширения `.md`), стабильное.
- При необходимости файл-имя для экспорта: `SLUG.md` (это хранится в фронтматтере как `title` или `slug`).

## Шаблоны документов (минимальные)

### SPEC (шаблон)

```markdown
---
title: <SPEC_NAME>
kind: spec
project: <project>
status: draft
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

## Контекст

## Термины

## Входы/выходы

## Инварианты

## Алгоритм

## Тесты/проверки
```

### ADR (шаблон)

```markdown
---
title: ADR-YYYYMMDD-<slug>
kind: adr
project: <project>
status: active
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

## Контекст

## Решение

## Альтернативы

## Последствия
```

inbox

[INDEX](./INDEX.md)