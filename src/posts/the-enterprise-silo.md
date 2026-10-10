---
title: The enterprise silo
description: LDAP, warehouses, Confluence, and the other things nobody teaches before you join a bank.
date: 2025-07-15
category: Work
readingTime: 8
related:
  - title: The outpost pattern
    url: /posts/outpost-pattern/
  - title: Vibe coding an old blog into something I would actually use
    url: /posts/vibe-coding/
---

A practical look at large organisations: slow processes, scattered docs, and how to get anything done inside the black box.

Working in a large enterprise can be overwhelming. Beyond technical skills there are organisational practices that are crucial and almost never taught. Enterprises are slow. There are more processes than in a smaller shop. It can feel like working in a black box, where you do not see the bigger picture or how the pieces fit. Patience is not a personality trait here. It is a requirement.

## LDAP and RBAC

LDAP is how user accounts get managed across an organisation. RBAC means you get permissions based on your job role, not because someone likes you. In reality there are too many systems, and not all of them sync. You will request the same access in three places and still wait.

Why it matters: you will spend real time asking why you cannot see a resource. Expect to wait, follow up, and be persistent. Knowing the basics just helps you write a better ticket.

## Operational systems versus the warehouse

Operational databases run the day: sales, inventory, customer records. They are optimised for fast reads and writes. They are not designed for heavy analytics. Many queries are blocked, too slow, or would disrupt the business.

Data warehouses exist for reporting. They hold historical data, often loaded through ETL. Do not run heavy reports on production. Use the warehouse. Then wait for the ETL job, the access request, and the approval. Plan for delays.

## How teams get siloed

Dev, QA, ops, security. Different priorities, different tools, documentation that never leaves the team that wrote it. You will need to find the right person, understand their queue, and follow up without being a pest. Building relationships across silos is how work actually moves.

## Confluence is where things go to die

Information lives on wikis, SharePoint, Confluence, and ticketing systems, and it is not always up to date. Confluence in particular is a maze of duplicated pages. Search first. Then ask. Then raise a ticket. Then wait. Then ask again.

> Getting things done in an enterprise often means submitting tickets, waiting for approvals, and remaining polite about it.

Write clear requests. Follow up professionally. Keep a list of people who actually answer. Everyone else is dealing with the same fog. The people who adapt, communicate, and keep moving are the ones who get anything shipped.
