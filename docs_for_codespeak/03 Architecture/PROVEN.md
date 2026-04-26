# PROVEN

---

title: PROVEN

kind: architecture

project: Meaning Engine

status: active

source: canonized

---

Что считается доказанным тестами (короткая каноническая выжимка; детали — в репозитории/локальных исходниках).

## Последовательность доказанных формул (контуры)

1. Валидность графа: `G ∈ ValidGraphs`
2. Проекция: `V = P(G, F)`
3. Навигация: `F' = T(F, a, G)`
4. Семантическая линза (domain): `P(G, F, D)`
5. Композиция (workbench): `P_wb(G, F, Wb)`
6. Организация контекста (character): контекст-меню, не фильтр.

## Инварианты (ядро)

- Schema conformance
- Identity stability
- Projection determinism + purity + totality
- Navigation validity + determinism + history integrity
- Domain orthogonality
- Workbench composability
- Character context validity