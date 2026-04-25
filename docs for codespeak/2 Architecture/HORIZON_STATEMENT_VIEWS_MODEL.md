# HORIZON_STATEMENT_VIEWS_MODEL

---

title: HORIZON_STATEMENT_VIEWS_MODEL

kind: engineering

project: Meaning Engine

status: active

scope: horizon

maturity: draft

source: chatgpt-vision 2026-03-12

---

Горизонт/архитектурная возможность: модель Statement + Views как способ связать Statement, Surfaces и Service и упростить Render.

## Идея

Statement остаётся атомом знания (subject/predicate/object/status/evidence/author), но получает набор представлений (views).

Surfaces не создают новые сущности, а выбирают view одного statement.

## Примеры views одного statement

Для statement `Serum instance_of Synth`:

- graph_view (Scope): `Serum → instance_of → Synth`
- system_view (System): `instance_of(Serum, Synth)`
- story_view (Story): объяснение/нарратив
- slate_view (Slate): новость/событие
- service_view (Service): полезный output (guide/toolkit)
- raw view (Statement surface candidate): raw statement + history

## Принцип рендера

Render может быть простым:

1) choose statement

2) choose view

3) render

UI знает только: statement / view / surface.

## Pipeline (horizon)

Statement → Evaluation → Approved → Views → Surfaces.

Views потенциально могут генерироваться (LLM/templates/synthesis), но это не задача текущей фазы.

## Связь с surface-моделью

- Scope = graph_view
- System = system_view
- Story = story_view
- Slate = slate_view
- Service = service_view
- Statement (candidate) = raw + all views + history

## Статус

Не реализовывать сейчас.

Фиксируем как возможность для будущего упрощения Render и для связывания production/exploration/consumption через единый атом knowledge.