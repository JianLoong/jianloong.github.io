---
title: Using a coding agent as an observability agent
description: A coding agent can be an observability agent, given one remote MCP server and a config change.
date: 2026-10-10
category: Tools
readingTime: 8
---

If you have not met MCP before: it is how you give a coding assistant extra abilities. You run a server that exposes tools — functions the model can call — and any client that speaks MCP can use them: Gemini CLI, Claude, whatever is already on the machine. The idea here is to point one of those at your systems instead of at your code, so that the coding agent becomes an observability agent — you ask in words, follow up without re-navigating a screen, and let the model join the answers together. The server exposes tools over an observability stack, with two jobs: make a health check fast, and make a historical query something an engineer would actually attempt. Both used to mean opening four dashboards and clicking through a time picker.

Timing matters here: MCP arrived before agent skills did — skills being folders of instructions and scripts an assistant can read and run. That is why the advice at the end does not come down to "build more tools".

<figure>
<svg class="figure-art" width="700" height="210" viewBox="0 0 700 210" role="img" aria-label="Four faint dashboard panels on the left, then an arrow pointing to a single bright panel on the right.">
<g fill="none" stroke="currentColor" stroke-opacity="0.3">
<rect x="0" y="20" width="150" height="75" rx="8"/>
<rect x="170" y="20" width="150" height="75" rx="8"/>
<rect x="0" y="115" width="150" height="75" rx="8"/>
<rect x="170" y="115" width="150" height="75" rx="8"/>
</g>
<g fill="currentColor" opacity="0.25">
<rect x="18" y="62" width="14" height="20" rx="3"/>
<rect x="42" y="50" width="14" height="32" rx="3"/>
<rect x="66" y="42" width="14" height="40" rx="3"/>
<rect x="188" y="62" width="14" height="20" rx="3"/>
<rect x="212" y="48" width="14" height="34" rx="3"/>
<rect x="236" y="56" width="14" height="26" rx="3"/>
<rect x="18" y="157" width="14" height="20" rx="3"/>
<rect x="42" y="147" width="14" height="30" rx="3"/>
<rect x="66" y="152" width="14" height="25" rx="3"/>
<rect x="188" y="157" width="14" height="20" rx="3"/>
<rect x="212" y="143" width="14" height="34" rx="3"/>
<rect x="236" y="150" width="14" height="27" rx="3"/>
</g>
<path d="M340 105 H404" fill="none" stroke="currentColor" stroke-opacity="0.45"/>
<path d="M396 96 L406 105 L396 114" fill="none" stroke="currentColor" stroke-opacity="0.45"/>
<rect x="424" y="68" width="276" height="74" rx="14" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<rect x="450" y="96" width="164" height="9" rx="4.5" fill="currentColor" opacity="0.9"/>
<rect x="450" y="115" width="96" height="7" rx="3.5" fill="currentColor" opacity="0.4"/>
</svg>
<figcaption>Four dashboards on the left. One prompt on the right.</figcaption>
</figure>

Tools like this become load-bearing well before anyone agrees they work. Some application teams come to depend on them. Others never care at all — including, often, the teams whose data they read.

<figure>
<svg class="figure-art" width="720" height="585" viewBox="0 0 720 585" role="img" aria-label="Clients and tool authors at the top; the MCP server and the Git tool definitions below them; and beneath those, the identity provider and three vendor APIs.">
<defs>
<marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0 0 L10 5 L0 10 Z" fill="currentColor" fill-opacity="0.45"/>
</marker>
</defs>
<g fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.13">
<rect x="0" y="0" width="720" height="120" rx="14"/>
<rect x="0" y="165" width="720" height="130" rx="14"/>
<rect x="0" y="320" width="340" height="115" rx="14"/>
<rect x="380" y="320" width="340" height="225" rx="14"/>
</g>
<g fill="currentColor" opacity="0.6" letter-spacing="2.5">
<text class="sm" x="18" y="27">APPLICATION TEAMS</text>
<text class="sm" x="18" y="189">TOOLING TEAM</text>
<text class="sm" x="18" y="347">IDENTITY</text>
<text class="sm" x="398" y="347">VENDOR TEAMS</text>
</g>
<rect x="40" y="212" width="240" height="66" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<g fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5">
<rect x="60" y="50" width="230" height="46" rx="10"/>
<rect x="415" y="50" width="270" height="46" rx="10"/>
<rect x="415" y="207" width="270" height="46" rx="10"/>
<rect x="40" y="357" width="280" height="46" rx="10"/>
<rect x="410" y="357" width="280" height="62" rx="10"/>
<rect x="410" y="431" width="280" height="46" rx="10"/>
<rect x="410" y="489" width="280" height="46" rx="10"/>
</g>
<g fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-width="1.5" marker-end="url(#arw)">
<path d="M175 96 L175 212"/>
<path d="M550 96 L550 207"/>
<path d="M415 230 L280 230"/>
<path d="M180 278 L180 357"/>
<path d="M280 225 L410 386"/>
<path d="M280 245 L410 452"/>
<path d="M280 265 L410 510"/>
</g>
<g fill="currentColor" text-anchor="middle">
<text x="175" y="79">Gemini CLI / Claude</text>
<text x="550" y="79">Their own tool definitions</text>
<text x="160" y="241">MCP server</text>
<text x="550" y="236">Tool definitions in Git</text>
<text x="180" y="386">Keycloak (federated to LDAP)</text>
<text x="550" y="384">New Relic API</text>
<text x="550" y="460">Dynatrace API</text>
<text x="550" y="518">MongoDB Ops Manager API</text>
</g>
<g fill="currentColor" opacity="0.65" text-anchor="middle">
<text class="sm" x="160" y="263">FastMCP · remote</text>
<text class="sm" x="550" y="406">from the Kubernetes API and Unix boxes</text>
</g>
<g fill="currentColor" opacity="0.7">
<text class="sm" x="192" y="150">HTTPS / MCP</text>
<text class="sm" x="578" y="150">opens a PR</text>
<text class="sm" x="347" y="220" text-anchor="middle">deploys on merge</text>
<text class="sm" x="198" y="305">validates token</text>
</g>
</svg>
<figcaption>The whole thing, and which team owns which part.</figcaption>
</figure>

## The design

The goal was simple: an engineer should be able to use the observability MCP with a config change, not an installation. No local server, no per-backend setup, nothing to keep up to date on their machine. So it is a remote service, hosted and owned by a tooling team, and the people who use it are application teams.

The whole client-side change, for an engineer using Gemini CLI:

```json
{
  "mcpServers": {
    "observability": {
      "httpUrl": "https://mcp.example.com/mcp"
    }
  }
}
```

Its tools live in a Git repo, so any team can add one by pull request, and a merge redeploys the MCP with the tool in place. They are also tagged: the config only exposes a tool to the teams its tags allow, so nobody ever sees another team's tools. The rest is in the diagram: the server is built on FastMCP, a Python library for writing MCP servers, and its auth sits behind Keycloak, which federates to the LDAP directory that already holds everyone's accounts. It wraps three vendor APIs: New Relic and Dynatrace, which monitor applications and infrastructure, and MongoDB's Ops Manager.

Adding one is a single file in that repo. It looks roughly like this:

```yaml
name: payments_latency
description: p95 request latency for a service over a window.
backend: newrelic
query: |
  SELECT percentile(duration, 95)
  FROM Transaction
  WHERE appName = :service
  SINCE :window ago
params:
  service: string
  window: string
tags:
  - team:payments
  - team:checkout
```

Simple to use, and that was the point.

## The layer under New Relic

The MCP talks to the New Relic API, but New Relic is not the source of the numbers. It is an aggregator: it pulls what it can from the Kubernetes clusters the applications run on, from a long tail of Unix boxes, and from whatever else has been instrumented over the years.

That makes a single query three steps deep. The MCP asks New Relic; New Relic reports what the agents it installed on each host last sent; those agents report on machines nobody has had reason to touch in months. Only the first step was ever under control. Whether the other two were current is what decided whether the answer was worth anything.

<figure>
<svg class="figure-art" width="700" height="132" viewBox="0 0 700 132" role="img" aria-label="Four hops from left to right, labelled MCP, New Relic, agents and hosts, drawn with progressively fainter outlines above a bar that fades the same way.">
<g fill="none" stroke="currentColor" stroke-width="2">
<rect x="1" y="18" width="145" height="58" rx="10" stroke-opacity="0.95"/>
<rect x="186" y="18" width="145" height="58" rx="10" stroke-opacity="0.6"/>
<rect x="371" y="18" width="145" height="58" rx="10" stroke-opacity="0.38"/>
<rect x="556" y="18" width="143" height="58" rx="10" stroke-opacity="0.22"/>
</g>
<g fill="currentColor" text-anchor="middle" font-size="15">
<text x="73" y="55" opacity="0.95">MCP</text>
<text x="258" y="55" opacity="0.6">New Relic</text>
<text x="443" y="55" opacity="0.38">agents</text>
<text x="627" y="55" opacity="0.22">hosts</text>
</g>
<rect x="1" y="104" width="145" height="10" rx="5" fill="currentColor" opacity="0.75"/>
<rect x="186" y="104" width="145" height="10" rx="5" fill="currentColor" opacity="0.45"/>
<rect x="371" y="104" width="145" height="10" rx="5" fill="currentColor" opacity="0.26"/>
<rect x="556" y="104" width="143" height="10" rx="5" fill="currentColor" opacity="0.12"/>
</svg>
<figcaption>Four hops, and only the first one is under your control. The data gets older as you move right.</figcaption>
</figure>

## The instructions file

Every team was asked to keep an `instructions.md` alongside their tool: how their health checks are actually performed, and the domain knowledge behind them — the parts of their application you would otherwise have to ask someone to explain.

The aim was consistency. If every team described its checks the same way, the reports the MCP generated would read the same way too.

Some teams took it seriously. Others copied the template, left the headings, and never filled them in. A copied template is still a file in the right place, so nothing in the process caught it — which is the lesson: an empty file and a filled-in one look identical from the outside.

<figure>
<svg class="figure-art" width="740" height="285" viewBox="0 -4 740 285" role="img" aria-label="Two versions of the same instructions file. On the left the headings are followed by filled-in content. On the right the same headings are there, but the content underneath is empty dashed outlines.">
<text x="0" y="18" font-size="15" fill="currentColor" opacity="0.9">Filled in</text>
<rect x="0" y="36" width="340" height="234" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.25"/>
<rect x="24" y="66" width="110" height="10" rx="4" fill="currentColor" opacity="0.85"/>
<rect x="24" y="90" width="270" height="6" rx="3" fill="currentColor" opacity="0.35"/>
<rect x="24" y="106" width="240" height="6" rx="3" fill="currentColor" opacity="0.35"/>
<rect x="24" y="122" width="195" height="6" rx="3" fill="currentColor" opacity="0.35"/>
<rect x="24" y="158" width="150" height="10" rx="4" fill="currentColor" opacity="0.85"/>
<rect x="24" y="182" width="270" height="6" rx="3" fill="currentColor" opacity="0.35"/>
<rect x="24" y="198" width="230" height="6" rx="3" fill="currentColor" opacity="0.35"/>
<rect x="24" y="214" width="170" height="6" rx="3" fill="currentColor" opacity="0.35"/>
<text x="400" y="18" font-size="15" fill="currentColor" opacity="0.9">Copied, left blank</text>
<rect x="400" y="36" width="340" height="234" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.25"/>
<rect x="424" y="66" width="110" height="10" rx="4" fill="currentColor" opacity="0.85"/>
<rect x="424" y="90" width="270" height="6" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
<rect x="424" y="106" width="240" height="6" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
<rect x="424" y="122" width="195" height="6" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
<rect x="424" y="158" width="150" height="10" rx="4" fill="currentColor" opacity="0.85"/>
<rect x="424" y="182" width="270" height="6" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
<rect x="424" y="198" width="230" height="6" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
<rect x="424" y="214" width="170" height="6" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
</svg>
<figcaption>The same headings in both cases. Only one of them has anything under them.</figcaption>
</figure>

## What went wrong

- **The data was only as good as whoever owned the dashboard.** Observability tooling is not where an application team spends its attention — those dashboards are wrappers over things like the Kubernetes API, and they go stale. The MCP answered from whatever reached New Relic, so lagging data read as an inaccurate tool. That was the feedback, and it was not unreasonable. The numbers were wrong; they just were not the server's to get right.
- **A wrapper inherited the mess.** The MCP is a wrapper over API calls, so every backend's configuration and quirks leaked straight into it. New Relic, Dynatrace and MongoDB all move, and never in step; when one shifted — usually with nobody hearing about it — a tool would quietly return nothing, and someone would trust the nothing. None of it was fixable from the MCP side.
- **Asking for too much produced invention instead.** A few tools returned thousands of rows where a summary would have done, and the model filled the gaps.
- **The tool surface grew without a shape.** Onboarding by pull request meant anyone could add a tool, and everyone did. That becomes a lot of tools, each with its own name, its own arguments, and its own idea of what "a service" is. At some point nobody can list them all from memory.
- **The tooling team ended up onboarding tools for everyone else.** Adding a tool meant caring about how the config is structured, and that was never going to be an application team's priority. So the work landed on the team that owned the server — and so did the blame when the result was not what they had in mind.
- **The client cached, and nothing said so.** Gemini CLI would serve a cached tool result, so a team could be reading an old answer with no way of knowing.

The caching and the invention are newer than the rest. The others are what happens to any shared internal service — particularly one that wraps systems nobody in the room owns.

<figure>
<svg class="figure-art" width="552" height="266" viewBox="0 0 552 266" role="img" aria-label="A grid of small tiles that is bright at the top and fades progressively toward the bottom.">
<defs>
<pattern id="toolgrid" width="46" height="46" patternUnits="userSpaceOnUse">
<rect width="36" height="36" rx="6" fill="currentColor"/>
</pattern>
</defs>
<rect width="552" height="36" fill="url(#toolgrid)" opacity="0.95"/>
<rect y="46" width="552" height="36" fill="url(#toolgrid)" opacity="0.72"/>
<rect y="92" width="552" height="36" fill="url(#toolgrid)" opacity="0.52"/>
<rect y="138" width="552" height="36" fill="url(#toolgrid)" opacity="0.36"/>
<rect y="184" width="552" height="36" fill="url(#toolgrid)" opacity="0.24"/>
<rect y="230" width="552" height="36" fill="url(#toolgrid)" opacity="0.15"/>
</svg>
<figcaption>Every tile is a tool that arrived by pull request, oldest at the top. Only the top row stayed familiar.</figcaption>
</figure>

## When a tool returns too much

Every tool result goes into the model's context — the text it can read when it answers — and nothing prunes it. A tool that fetches a day of metrics for every pod is not giving a bigger answer. It is handing over thousands of rows and calling that an answer.

<figure>
<svg class="figure-art" width="620" height="293" viewBox="0 -4 620 293" role="img" aria-label="Two outlines standing for the model's context. The left is packed with dense rows; the right holds the question and one short summary.">
<defs>
<pattern id="rows" width="238" height="11" patternUnits="userSpaceOnUse">
<rect width="238" height="6" rx="3" fill="currentColor"/>
</pattern>
</defs>
<text x="0" y="16" font-size="15" fill="currentColor" opacity="0.9">Ask for everything</text>
<rect x="0" y="30" width="275" height="250" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
<rect x="18" y="50" width="165" height="12" rx="6" fill="currentColor" opacity="0.9"/>
<rect x="18" y="78" width="238" height="182" fill="url(#rows)" opacity="0.28"/>
<text x="345" y="16" font-size="15" fill="currentColor" opacity="0.9">Ask for the summary</text>
<rect x="345" y="30" width="275" height="250" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
<rect x="363" y="50" width="165" height="12" rx="6" fill="currentColor" opacity="0.9"/>
<rect x="363" y="78" width="211" height="12" rx="6" fill="currentColor" opacity="0.9"/>
</svg>
<figcaption>Everything a tool returns lands in the model's context. On the left, the question at the top is a rounding error against the rows below it. On the right there is room to think.</figcaption>
</figure>

Past a certain volume the useful part stops standing out. The model is no longer reading your question and three numbers; it is skimming a wall of JSON, and where it cannot find the number it wants it supplies a plausible one. Nothing errors. The reply arrives as confidently as a correct one, which is what made this the hardest failure on the list to catch.

The fix is not to ask the model to be careful. It is to hand it less: move the aggregation into the tool, where you control the shape, and return the p95 and the window you used rather than every sample behind it. A tool result should read like the answer to a question, not the raw material for one. If you would not read the output yourself, neither will the model.

## One tool to find the others

The fix for the sprawl was to stop exposing everything. The tools stayed; a search tool went in front of them — a single FastMCP tool that lets the model ask what is available for the question it actually has, instead of being handed the full list every time.

Teams still onboard tools by pull request. What changed is what that costs: adding a tool no longer makes every other tool harder to find, and the model spends its attention on the two or three that matter rather than all of them.

<figure>
<svg class="figure-art" width="700" height="220" viewBox="0 0 700 220" role="img" aria-label="A stack of many small tools on the left, funnelled through a magnifying glass in the middle, with only three tools emerging on the right.">
<text x="69" y="26" font-size="15" fill="currentColor" opacity="0.9" text-anchor="middle">Every tool</text>
<g fill="currentColor" opacity="0.22">
<rect x="40" y="51" width="26" height="26" rx="6"/>
<rect x="72" y="51" width="26" height="26" rx="6"/>
<rect x="40" y="83" width="26" height="26" rx="6"/>
<rect x="72" y="83" width="26" height="26" rx="6"/>
<rect x="40" y="115" width="26" height="26" rx="6"/>
<rect x="72" y="115" width="26" height="26" rx="6"/>
<rect x="40" y="147" width="26" height="26" rx="6"/>
<rect x="72" y="147" width="26" height="26" rx="6"/>
<rect x="40" y="179" width="26" height="26" rx="6"/>
<rect x="72" y="179" width="26" height="26" rx="6"/>
</g>
<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.2">
<path d="M98 64 L265 128"/>
<path d="M98 96 L265 128"/>
<path d="M98 128 L265 128"/>
<path d="M98 160 L265 128"/>
<path d="M98 192 L265 128"/>
</g>
<text x="350" y="26" font-size="15" fill="currentColor" opacity="0.9" text-anchor="middle">Search tool</text>
<rect x="265" y="96" width="170" height="64" rx="14" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<circle cx="344" cy="122" r="15" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<path d="M355 133 L370 148" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.5">
<path d="M435 128 L618 98"/>
<path d="M435 128 L618 128"/>
<path d="M435 128 L618 158"/>
</g>
<text x="631" y="26" font-size="15" fill="currentColor" opacity="0.9" text-anchor="middle">What fits</text>
<g fill="currentColor" opacity="0.95">
<rect x="618" y="85" width="26" height="26" rx="6"/>
<rect x="618" y="115" width="26" height="26" rx="6"/>
<rect x="618" y="145" width="26" height="26" rx="6"/>
</g>
</svg>
<figcaption>The model no longer gets handed every tool. It asks a search tool, and only the few that fit the question come back.</figcaption>
</figure>

## What I would tell you

- **If I were starting today, I would use skills rather than MCP tools.** A skill can read and write files and run commands, so it can shape each API call to the question in front of it instead of going through a tool definition that has to cover every caller. The advice underneath is the same either way: go straight to the vendor API. Anything wrapped around a dashboard inherits that dashboard's state, then adds a layer of its own on top — and going direct removes that layer, not the staleness underneath it.
- **Assume nobody is maintaining the dashboards underneath.** Application teams rarely see enough value in observability tooling to keep it current. Configuration drifts, hosts get rebuilt and never re-registered, and a check that was right last year is quietly answering about a machine that no longer exists. Historical data gets the least attention of all — plenty of teams have simply never needed it, and in some cases the reason is indifference rather than shortage of time.
- **Treat an MCP server as a service the moment more than one person uses it.** Versioning, auth, ownership, monitoring. A deploy pipeline gives you none of those on its own.
- **If you let anyone onboard a tool, someone has to review the tools.** Self-service configuration is still a design decision you own. A generous one gets exactly the sprawl it invites.
- **Make the surface findable, not just small.** The count never came down, but the whole list did not have to be handed to the model at once. If you cannot control the count, control what gets loaded.
- **Assume the backends will change, and not in step.** Put the adapter between your tools and each backend so only one layer has to be rewritten.

<figure>
<svg class="figure-art" width="700" height="163" viewBox="0 -4 700 163" role="img" aria-label="Two bottom-aligned stacks of layers. The left stack has four layers, the right has two. In each, the top layer is outlined while the layers beneath it are faint fills.">
<text x="0" y="16" font-size="15" fill="currentColor" opacity="0.9">Wrapping a dashboard</text>
<rect x="0" y="120" width="300" height="30" rx="8" fill="currentColor" opacity="0.1"/>
<rect x="0" y="90" width="300" height="30" rx="8" fill="currentColor" opacity="0.18"/>
<rect x="0" y="60" width="300" height="30" rx="8" fill="currentColor" opacity="0.3"/>
<rect x="1" y="30" width="298" height="30" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<text x="400" y="16" font-size="15" fill="currentColor" opacity="0.9">Calling the API directly</text>
<rect x="400" y="120" width="300" height="30" rx="8" fill="currentColor" opacity="0.14"/>
<rect x="401" y="90" width="298" height="30" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
</svg>
<figcaption>Wrapping a dashboard means maintaining your own layer plus every layer beneath it. Going to the API means maintaining one.</figcaption>
</figure>

## Using an MCP server means maintaining one

The pitch for a pattern like this is that the client-side change is one line of JSON. That part is true, and it is also where the trouble hides: the work that makes that line possible does not stop when the line is written.

A server that wraps other people's APIs is not a tool anyone installs once. It is a small platform that happens to be queried through a chat window. It has dependencies that move on their own schedule, credentials that expire, and a surface that grows every time someone finds it useful. None of that is a design flaw. It is what it means to put a service in front of systems you do not control.

The questions it answered were ones nobody would have opened a dashboard for, and some teams came to depend on the answers. That part was worth having.

The trade is worth taking deliberately or not at all. If the value is a fast health check, the price is a standing backlog of small breakages — and the question worth answering before the first pull request is merged is who is on the hook for them, not what the server can do.

MCP does not remove work. It moves it into a layer of your own.

Thanks to [FastMCP](https://github.com/PrefectHQ/fastmcp), which carries most of this. The tool definitions, the transport and the auth are all theirs; choosing the tools — and eventually choosing to stop handing all of them over at once — is what is left to whoever runs the server.

## Bye.

<p class="colophon">Written with the help of an AI assistant, based on experience rather than research. The tokens cost $1.40.</p>
