# Meaning Engine — Documentation

Цель: единая, расширяемая структура документации проекта.

## Как пользоваться

- Навигация: заходите через разделы ниже.
- Любой документ начинается с фронтматтера (YAML) и далее — содержимое.

## Разделы

[overview](overview%20eabe7dfaf19944d98ec512ac6f4d1ed4.md)

[architecture](./architecture.md)

[specs](specs%204e6f9c420cb848eeaee3bcc49c34bb51.md)

[guides](guides%20fa2f7a9e097646aa8cb3edcc6420143b.md)

[theory](theory%20cb82eaa7ada14b03a083521007fe06e1.md)

[reference](reference%20d2a763b8098f46ee8fea2efe811dc02d.md)

[development](./development.md)

[adr](adr%2080a35e685f784ced920b55b1ce051a11.md)

[definitions](./definitions.md)

[engineering](./engineering.md)

[atomic](./atomic.md)

[appendix](appendix%209f7e5621ba6f4f2d942d0f281ccd597c.md)

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

[inbox](inbox%20b87fb09deb5e4857bd1ff61f37d62507.md)

[INDEX](./INDEX.md)