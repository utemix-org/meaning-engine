# TRACK_MODEL

---

title: TRACK_MODEL

kind: overview

project: Meaning Engine

status: active

scope: now

maturity: draft

---

Модель треков разработки: переход от линейных фаз к параллельным Tracks.

Это организационная модель планирования, не изменение архитектуры движка.

## Причина

На текущем этапе разработка системы не является линейной.

Модель Phase→Phase→Phase дополняется моделью Tracks.

## Основные треки

- Engine — ядро системы
- World — Authored World
- Epistemic — модель знания/лог/операторы
- Documentation — архитектурная память
- Interface — surfaces и UI

## Принцип работы

Треки развиваются параллельно и синхронизируются в ключевых точках.

Примеры синхронизации:

- Grounding = Engine + World
- Surface model = Epistemic + Interface

## Преимущества

- предотвращает архитектурные блокировки
- позволяет двигаться параллельно
- разделяет уровни разработки

## Текущее состояние (примерно)

- Engine — стабилен
- World — grounding
- Epistemic — подтверждён
- Documentation — консолидация
- Interface — концептуальная стадия

## Следующий фокус

Interface track = surface model clarification (без разработки UI).