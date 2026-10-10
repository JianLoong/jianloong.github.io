---
title: The outpost pattern
description: A quieter architectural idea for keeping external APIs out of your business logic.
date: 2025-06-27
category: Architecture
readingTime: 8
related:
  - title: The enterprise silo
    url: /posts/the-enterprise-silo/
  - title: A REST API with no database
    url: /posts/malaysia-api/
---

A dedicated layer between your core application and the outside world. Less famous than MVC. More useful once you have three payment providers.

We always talk about the same design patterns. MVC, Repository, Observer. They show up in interviews and textbooks. There are others we reach for in real systems that rarely get a name. The outpost is one of those.

It shows up when you are dealing with several external services and you are tired of seeing HTTP clients inside the domain. The outpost is a guard post. It stands between core logic and everything that can time out, change shape, or bill you by the request.

## What it actually does

All talk with the outside world goes through one place. That place owns retries, mapping, logging, and fallbacks. Business code asks for a result. It does not know which vendor answered.

- Isolation: external dependencies stay out of the domain
- Abstraction: messy APIs hide behind a small interface
- Resilience: retries and fallbacks live in one module
- Monitoring: logs and metrics have a single door
- Caching: you can be strategic without sprinkling caches everywhere

Without an outpost, calls scatter through the codebase. Error handling becomes a personality trait of whoever wrote the file. Tests need the network, or a pile of mocks that look like the network.

## Outpost versus outbox

They sound related. They are not the same job.

An *outpost* handles live, synchronous talk with an API. You want an answer now. You can survive a temporary failure if the retry and circuit breaker are honest.

An *outbox* is about guaranteed delivery. You write an event next to the business transaction and a worker ships it later. Use it when eventual consistency is acceptable and losing the message is not.

> Choose outpost when you need a response. Choose outbox when you need the event to arrive, eventually.

## When it is worth it

Multiple external APIs. Awkward error handling. Rate limits. A test suite that should not hit Stripe at 2am. If you only have one well-behaved client, a function is enough. The pattern earns its keep when the outside world starts to look like a second product.

API Gateways and circuit breakers still matter. They complement an outpost; they do not replace the habit of keeping vendor talk in one room.
