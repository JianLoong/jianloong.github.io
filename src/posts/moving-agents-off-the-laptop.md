---
title: Moving agents off the laptop
description: An agent needs a terminal, an install and a config file. Reaching people who will not do that means it has to run somewhere else.
date: 2026-10-11
category: Tools
readingTime: 6
draft: true
hero: /assets/hero/agents-off-the-laptop.jpg
heroAlt: A dark star-chart field with a laptop drawn as a thin white outline, an amber point leaving it along a dotted arc toward a small cluster of pale blue points.
---

Ask an engineer to run an agent and you get a short list of commands. Ask anyone else and you get an afternoon of installing things.

> Imagine ChatGPT had arrived as a terminal command.

Almost nobody would have installed it.

So the question is this: **how do we make an agent reachable by someone who will never install a command-line tool?** A binary they download is one answer, and it is only a nicer install — the agent still ends up on their machine. A website is the other, and it means the agent runs on a machine you keep alive, not one they do.

That is the platform: a place the agent runs that the person using it never has to install, own or maintain.

<figure>
<svg class="figure-art" width="700" height="320" viewBox="0 0 700 320" role="img" aria-label="On the left, a terminal window holding three install commands above four faint rows of requirements. On the right, a bright browser window with an address bar and one button, and beneath it a faint download icon labelled as still running on the user's machine.">
<text x="0" y="14" fill="currentColor" font-size="15" opacity="0.9">Today: build it yourself first</text>
<text x="370" y="14" fill="currentColor" font-size="15" opacity="0.9">What we want</text>
<rect x="0" y="30" width="330" height="126" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<g fill="currentColor" opacity="0.35">
<circle cx="20" cy="50" r="4"/>
<circle cx="36" cy="50" r="4"/>
<circle cx="52" cy="50" r="4"/>
</g>
<g fill="currentColor" font-size="13" opacity="0.8">
<text x="18" y="80">$ npm i -g my-agent</text>
<text x="18" y="104">$ my-agent login</text>
<text x="18" y="128">$ my-agent run ./repo</text>
</g>
<g fill="currentColor" opacity="0.12">
<rect x="0" y="176" width="330" height="26" rx="8"/>
<rect x="0" y="204" width="330" height="26" rx="8"/>
<rect x="0" y="232" width="330" height="26" rx="8"/>
<rect x="0" y="260" width="330" height="26" rx="8"/>
</g>
<g fill="currentColor" font-size="14" opacity="0.75">
<text x="14" y="193">a machine you can install on</text>
<text x="14" y="221">a terminal, open</text>
<text x="14" y="249">an API key from somewhere</text>
<text x="14" y="277">a config file nobody sent you</text>
</g>
<rect x="370" y="30" width="330" height="126" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<g fill="currentColor" opacity="0.35">
<circle cx="390" cy="50" r="4"/>
<circle cx="406" cy="50" r="4"/>
<circle cx="422" cy="50" r="4"/>
</g>
<rect x="386" y="60" width="298" height="24" rx="6" fill="currentColor" opacity="0.12"/>
<text x="396" y="77" fill="currentColor" font-size="13" opacity="0.7">agent.example.com</text>
<rect x="386" y="96" width="170" height="34" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<text x="471" y="118" fill="currentColor" text-anchor="middle" font-size="14" opacity="0.95">Open the agent</text>
<text x="406" y="182" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.4">or</text>
<rect x="370" y="196" width="72" height="72" rx="18" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="2"/>
<g fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="2">
<path d="M406 216 V242"/>
<path d="M398 234 L406 243 L414 234"/>
<path d="M394 252 H418"/>
</g>
<g fill="currentColor" font-size="14" opacity="0.5">
<text x="462" y="228">Or a download, which</text>
<text x="462" y="250">still runs on their machine.</text>
</g>
</svg>
<figcaption>The left side is a list of things you have to be able to do. The right side is a link. A download is just a friendlier version of the left.</figcaption>
</figure>

<figure>
<img src="/assets/hero/in-transit.jpg" alt="" width="1376" height="768" loading="lazy" decoding="async">
</figure>

## What has to exist now

A laptop hides the shape of the problem. Everything the agent needs is already there: a process running under your login, a home directory to write into, keys sitting in the environment, a network that already works, and a lid that stops the whole thing when you are done. None of it was designed for the agent, so none of it has to be maintained.

Host it, and every one of those conveniences turns into a question with an owner.

**Where it runs.** A machine that stays awake, an image that rebuilds, a process that restarts. A laptop comes with a screen and a person in front of it; a server comes with neither.

<figure>
<svg class="figure-art" width="700" height="132" viewBox="0 0 700 132" role="img" aria-label="On the left, a laptop with an empty screen above its base. On the right, a server box with three slots, a lit indicator and a circular restart arrow.">
<text x="0" y="14" fill="currentColor" font-size="15" opacity="0.9">On the laptop</text>
<text x="400" y="14" fill="currentColor" font-size="15" opacity="0.9">Hosted</text>
<g fill="none" stroke="currentColor" stroke-width="2" stroke-opacity="0.3">
<rect x="60" y="30" width="180" height="58" rx="8"/>
<rect x="40" y="94" width="220" height="8" rx="4"/>
</g>
<text x="150" y="124" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.45">stops when the lid does</text>
<rect x="400" y="28" width="200" height="74" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<g fill="currentColor" opacity="0.5">
<rect x="416" y="42" width="150" height="8" rx="4"/>
<rect x="416" y="60" width="150" height="8" rx="4"/>
<rect x="416" y="78" width="100" height="8" rx="4"/>
</g>
<circle cx="584" cy="46" r="6" fill="currentColor" opacity="0.95"/>
<path d="M644 58 A 16 16 0 1 1 634 80" fill="none" stroke="currentColor" stroke-opacity="0.7" stroke-width="2"/>
<path d="M628 74 L634 81 L641 72" fill="none" stroke="currentColor" stroke-opacity="0.7" stroke-width="2"/>
<text x="500" y="124" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.6">kept awake, rebuilt, restarted</text>
</svg>
<figcaption>A laptop stops when the lid does. A host has to be kept awake, rebuilt and restarted.</figcaption>
</figure>

**Who it is.** It used to be you, holding your tokens. Hosted, it needs an identity of its own, or every run is your credentials loose on a network.

<figure>
<svg class="figure-art" width="700" height="132" viewBox="0 0 700 132" role="img" aria-label="On the left, a faint agent box holding a key. On the right, a bright agent box holding a scoped, expiring badge.">
<text x="0" y="14" fill="currentColor" font-size="15" opacity="0.9">On the laptop</text>
<text x="400" y="14" fill="currentColor" font-size="15" opacity="0.9">Hosted</text>
<rect x="30" y="28" width="220" height="70" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="2"/>
<text x="140" y="52" fill="currentColor" text-anchor="middle" font-size="14" opacity="0.5">the agent</text>
<g fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-width="2">
<circle cx="106" cy="80" r="7"/>
<path d="M113 80 H154"/>
<path d="M144 80 V88"/>
<path d="M152 80 V88"/>
</g>
<text x="140" y="124" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.45">holding your keys</text>
<rect x="400" y="28" width="220" height="70" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<text x="510" y="52" fill="currentColor" text-anchor="middle" font-size="14" opacity="0.95">the agent</text>
<rect x="452" y="64" width="116" height="24" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.75" stroke-width="2"/>
<text x="510" y="81" fill="currentColor" text-anchor="middle" font-size="12" opacity="0.75">scoped, expiring</text>
<text x="510" y="124" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.6">an identity of its own</text>
</svg>
<figcaption>The agent used whatever identity was lying around. Hosted, it needs one of its own, scoped and expiring.</figcaption>
</figure>

**Who can reach it.** On a laptop only you can knock. Reachable from the internet, it needs auth and an egress policy before anything else is safe.

<figure>
<svg class="figure-art" width="700" height="132" viewBox="0 0 700 132" role="img" aria-label="On the left, a single arrow arriving at an agent inside a dashed circle. On the right, three arrows crossing a dashed boundary into a bright agent box.">
<text x="0" y="14" fill="currentColor" font-size="15" opacity="0.9">On the laptop</text>
<text x="400" y="14" fill="currentColor" font-size="15" opacity="0.9">Hosted</text>
<circle cx="150" cy="68" r="42" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="7 7"/>
<text x="150" y="74" fill="currentColor" text-anchor="middle" font-size="14" opacity="0.5">the agent</text>
<path d="M24 68 H86" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="2"/>
<path d="M78 60 L88 68 L78 76" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="2"/>
<text x="150" y="128" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.45">only you can knock</text>
<path d="M400 20 V116" fill="none" stroke="currentColor" stroke-opacity="0.75" stroke-width="2" stroke-dasharray="7 7"/>
<rect x="470" y="32" width="180" height="80" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<text x="560" y="76" fill="currentColor" text-anchor="middle" font-size="14" opacity="0.95">the agent</text>
<g fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="2">
<path d="M340 46 H462"/>
<path d="M454 40 L463 46 L454 52"/>
<path d="M340 72 H462"/>
<path d="M454 66 L463 72 L454 78"/>
<path d="M340 98 H462"/>
<path d="M454 92 L463 98 L454 104"/>
</g>
<text x="560" y="128" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.6">anyone on the network</text>
</svg>
<figcaption>Behind a laptop keyboard there is one caller. Exposed, there are as many as can reach the network.</figcaption>
</figure>

**What it remembers.** Sessions, workspaces and half-finished work were files in your home directory. Now they need somewhere durable, and a rule for what carries from one run to the next.

<figure>
<svg class="figure-art" width="700" height="132" viewBox="0 0 700 132" role="img" aria-label="On the left, three state blocks sitting inside a dashed machine boundary. On the right, a rounded store connected to two run boxes.">
<text x="0" y="14" fill="currentColor" font-size="15" opacity="0.9">On the laptop</text>
<text x="400" y="14" fill="currentColor" font-size="15" opacity="0.9">Hosted</text>
<path d="M200 20 V112" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="7 7"/>
<g fill="currentColor" opacity="0.25">
<rect x="24" y="34" width="150" height="20" rx="6"/>
<rect x="24" y="62" width="150" height="20" rx="6"/>
<rect x="24" y="90" width="150" height="20" rx="6"/>
</g>
<text x="110" y="128" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.45">files under your home</text>
<rect x="410" y="34" width="44" height="76" rx="22" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<text x="432" y="128" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.6">stored</text>
<g fill="none" stroke="currentColor" stroke-opacity="0.6" stroke-width="2">
<rect x="530" y="34" width="140" height="30" rx="8"/>
<rect x="530" y="78" width="140" height="30" rx="8"/>
<path d="M454 62 H522"/>
</g>
<text x="600" y="54" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.75">run one</text>
<text x="600" y="98" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.75">run two</text>
</svg>
<figcaption>Session state lived in your home directory. Hosted, it has to outlive the run and be reachable from the next one.</figcaption>
</figure>

**What it touches.** Whatever it was pointed at — the repository, the ticket queue, the mailbox, the database. On a laptop the worst case was a file you could revert. Hosted and wired into live systems, it is making changes other people can see and depend on.

<figure>
<svg class="figure-art" width="700" height="132" viewBox="0 0 700 132" role="img" aria-label="On the left, a faint agent box sending one arrow to a single file. On the right, a bright agent box sending three arrows to mail, tickets and database boxes.">
<text x="0" y="14" fill="currentColor" font-size="15" opacity="0.9">On the laptop</text>
<text x="400" y="14" fill="currentColor" font-size="15" opacity="0.9">Hosted</text>
<rect x="24" y="34" width="120" height="56" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="2"/>
<text x="84" y="68" fill="currentColor" text-anchor="middle" font-size="14" opacity="0.5">the agent</text>
<g fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="2">
<path d="M152 62 H196"/>
<path d="M188 55 L197 62 L188 69"/>
<rect x="206" y="44" width="40" height="36" rx="6"/>
</g>
<text x="135" y="128" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.45">one file you can revert</text>
<rect x="400" y="34" width="120" height="56" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<text x="460" y="68" fill="currentColor" text-anchor="middle" font-size="14" opacity="0.95">the agent</text>
<g fill="none" stroke="currentColor" stroke-opacity="0.6" stroke-width="2">
<path d="M528 40 H580"/>
<path d="M572 34 L581 40 L572 46"/>
<path d="M528 64 H580"/>
<path d="M572 58 L581 64 L572 70"/>
<path d="M528 88 H580"/>
<path d="M572 82 L581 88 L572 94"/>
</g>
<g fill="none" stroke="currentColor" stroke-opacity="0.65" stroke-width="2">
<rect x="588" y="30" width="96" height="20" rx="6"/>
<rect x="588" y="54" width="96" height="20" rx="6"/>
<rect x="588" y="78" width="96" height="20" rx="6"/>
</g>
<g fill="currentColor" font-size="12" opacity="0.7" text-anchor="middle">
<text x="636" y="44">mail</text>
<text x="636" y="68">tickets</text>
<text x="636" y="92">database</text>
</g>
<text x="460" y="128" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.6">live systems</text>
</svg>
<figcaption>On one machine the worst case is a file you can revert. Wired into live systems, the changes are ones other people depend on.</figcaption>
</figure>

**What it costs.** Tokens per run, and a host billing whether or not the agent is busy.

<figure>
<svg class="figure-art" width="700" height="132" viewBox="0 0 700 132" role="img" aria-label="On the left, a faint agent box with no meter. On the right, a filled meter bar next to a clock.">
<text x="0" y="14" fill="currentColor" font-size="15" opacity="0.9">On the laptop</text>
<text x="400" y="14" fill="currentColor" font-size="15" opacity="0.9">Hosted</text>
<rect x="30" y="34" width="200" height="60" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="2"/>
<text x="130" y="70" fill="currentColor" text-anchor="middle" font-size="14" opacity="0.5">the agent</text>
<path d="M40 108 H220" fill="none" stroke="currentColor" stroke-opacity="0.25" stroke-width="2"/>
<text x="130" y="128" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.45">no meter running</text>
<rect x="400" y="42" width="200" height="20" rx="10" fill="currentColor" opacity="0.12"/>
<rect x="400" y="42" width="124" height="20" rx="10" fill="currentColor" opacity="0.6"/>
<circle cx="640" cy="52" r="18" fill="none" stroke="currentColor" stroke-opacity="0.75" stroke-width="2"/>
<path d="M640 52 V42" fill="none" stroke="currentColor" stroke-opacity="0.75" stroke-width="2"/>
<path d="M640 52 H650" fill="none" stroke="currentColor" stroke-opacity="0.75" stroke-width="2"/>
<text x="490" y="96" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.6">tokens, and a host that bills while idle</text>
</svg>
<figcaption>Nothing metered a laptop. A host bills whether the agent is busy or not.</figcaption>
</figure>

**Who reads the output.** On the laptop the transcript scrolled past. Hosted, a record is the only way to know what happened, and somebody has to own it.

<figure>
<svg class="figure-art" width="700" height="132" viewBox="0 0 700 132" role="img" aria-label="On the left, a faint terminal frame with one line escaping past its top edge. On the right, four kept lines beside a reader.">
<text x="0" y="14" fill="currentColor" font-size="15" opacity="0.9">On the laptop</text>
<text x="400" y="14" fill="currentColor" font-size="15" opacity="0.9">Hosted</text>
<rect x="60" y="18" width="120" height="10" rx="4" fill="currentColor" opacity="0.12"/>
<rect x="24" y="34" width="200" height="80" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="2"/>
<g fill="currentColor" opacity="0.25">
<rect x="40" y="50" width="168" height="10" rx="4"/>
<rect x="40" y="68" width="140" height="10" rx="4"/>
<rect x="40" y="86" width="120" height="10" rx="4"/>
</g>
<text x="124" y="128" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.45">scrolls out of the buffer</text>
<g fill="currentColor" opacity="0.6">
<rect x="410" y="30" width="160" height="10" rx="4"/>
<rect x="410" y="50" width="160" height="10" rx="4"/>
<rect x="410" y="70" width="160" height="10" rx="4"/>
<rect x="410" y="90" width="160" height="10" rx="4"/>
</g>
<circle cx="640" cy="60" r="12" fill="none" stroke="currentColor" stroke-opacity="0.75" stroke-width="2"/>
<path d="M620 104 A 22 22 0 0 1 660 104" fill="none" stroke="currentColor" stroke-opacity="0.75" stroke-width="2"/>
<text x="490" y="128" fill="currentColor" text-anchor="middle" font-size="13" opacity="0.6">a record somebody owns</text>
</svg>
<figcaption>The transcript scrolled past. A hosted run leaves a record, and somebody has to own it.</figcaption>
</figure>

None of these is hard on its own, and none of them care what the agent is for. What changes is the count: one machine becomes a machine, an identity, a store, a policy and a bill, and each one wants a name next to it.

## The part with no equivalent

A web service does what you wrote. An agent writes the program that answers the request, and then runs it — so the host has to execute code nobody reviewed, chosen at runtime, on behalf of whoever asked. That is the executor, and it is the piece ordinary hosting does not hand you. A skill is a folder of instructions and scripts: the instructions are cheap, the scripts need a machine. So the host has to provide one, per run.

<figure>
<svg class="figure-art" width="700" height="170" viewBox="0 0 700 170" role="img" aria-label="A dashed sandbox holding the agent and the code it runs, with an image and resource limits feeding in from the left, a network policy leaving on the right, and the whole thing discarded below.">
<rect x="180" y="36" width="320" height="104" rx="16" fill="currentColor" opacity="0.04"/>
<rect x="181" y="37" width="318" height="102" rx="16" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="7 7"/>
<rect x="200" y="56" width="120" height="44" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<text x="260" y="83" fill="currentColor" text-anchor="middle" font-size="14" opacity="0.95">the agent</text>
<rect x="352" y="56" width="128" height="44" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<text x="416" y="83" fill="currentColor" text-anchor="middle" font-size="14" opacity="0.95">the code</text>
<path d="M324 78 H344" fill="none" stroke="currentColor" stroke-opacity="0.7" stroke-width="2"/>
<path d="M338 72 L347 78 L338 84" fill="none" stroke="currentColor" stroke-opacity="0.7" stroke-width="2"/>
<text x="0" y="66" fill="currentColor" font-size="14" opacity="0.8">an image</text>
<path d="M64 76 H172" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="2"/>
<path d="M164 70 L173 76 L164 82" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="2"/>
<text x="0" y="122" fill="currentColor" font-size="14" opacity="0.8">time, memory, disk</text>
<path d="M126 132 H172" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="2"/>
<path d="M164 126 L173 132 L164 138" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="2"/>
<path d="M504 78 H548" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="2"/>
<path d="M540 72 L549 78 L540 84" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="2"/>
<text x="558" y="84" fill="currentColor" font-size="14" opacity="0.8">a network policy</text>
<path d="M340 146 V152" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="2"/>
<path d="M334 148 L340 155 L346 148" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="2"/>
<text x="340" y="168" fill="currentColor" text-anchor="middle" font-size="14" opacity="0.8">thrown away when the run ends</text>
</svg>
<figcaption>Everything the code needs has to be supplied or forbidden by the sandbox, and none of it survives the run.</figcaption>
</figure>

Every run needs an image with the runtime already in it, a filesystem with the working copy in reach, limits on time and memory and disk, and an egress policy, because the code will reach for things. Then it needs a lifecycle: start it, watch it, kill it, throw it away — and start the next one somewhere the last one cannot be seen from.

None of that is the interesting part. It is the part you cannot skip, because the alternative is running model-chosen code on a machine that also holds your credentials.

## Trading one -ility for another

These have names, and they have had them for a while. ISO/IEC 9126 — replaced by ISO/IEC 25010 — makes portability one of six characteristics, with installability inside it beside adaptability, co-existence and replaceability. Usability is a separate characteristic, with parts of its own: understandability, learnability, operability, attractiveness.

An agent scores well on both, for someone who lives in a terminal. It is understandable, learnable and operable if you already have a shell. For everyone else the failure happens earlier than usability even applies. You cannot learn a tool you cannot install.

That is what a link buys. It hands the whole usability set over at once — something to look at, something to click, nothing to learn first — and it does not make the cost disappear. Maintainability and reliability move to your side of the ledger, and you spend them running a service that used to be somebody's laptop.

<figure>
<img src="/assets/hero/arrival.jpg" alt="" width="1376" height="768" loading="lazy" decoding="async">
</figure>

## Bye.

<p class="colophon">Written with the help of an AI assistant, based on experience and research.</p>
