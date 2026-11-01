---
title: Hosting an agent is the hard part
description: "An agent needs a machine it can act on freely: a sandbox or a VM. A terminal is only how you aim it, and reaching everyone means moving the machine."
date: 2026-10-11
category: Tools
readingTime: 6
hero: /assets/hero/agents-off-the-laptop.jpg
heroAlt: A hand-drawn ink illustration on a dark ground. A small hooded figure with an empty face stands between a sketched laptop on the left and a server cabinet on the right, with a dotted arc rising from the laptop over the figure to the rack.
---

Ask an engineer to run an agent and you get a short list of commands. Ask anyone else and you get an afternoon of installing things.

> Imagine ChatGPT had arrived as a terminal command.

Almost nobody would have installed it.

So the question is this: **how do we make an agent reachable by someone who will never install a command-line tool?** A binary they download is one answer, and it is a nicer install, though the agent still ends up on their machine. A website is the other, and it means the agent runs on a machine you keep alive, not one they do. The rest of this post is about that one.

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
<text x="14" y="193" class="sm">a machine you can install on</text>
<text x="14" y="221" class="sm">a terminal, open</text>
<text x="14" y="249" class="sm">an API key from somewhere</text>
<text x="14" y="277" class="sm">a config file nobody sent you</text>
</g>
<rect x="370" y="30" width="330" height="126" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<g fill="currentColor" opacity="0.35">
<circle cx="390" cy="50" r="4"/>
<circle cx="406" cy="50" r="4"/>
<circle cx="422" cy="50" r="4"/>
</g>
<rect x="386" y="60" width="298" height="24" rx="6" fill="currentColor" opacity="0.12"/>
<text x="396" y="77" class="sm" fill="currentColor" opacity="0.7">agent.example.com</text>
<rect x="386" y="96" width="170" height="34" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<text x="471" y="118" fill="currentColor" text-anchor="middle" font-size="14" opacity="0.95">Open the agent</text>
<text x="406" y="182" class="sm" fill="currentColor" text-anchor="middle" opacity="0.4">or</text>
<rect x="370" y="196" width="72" height="72" rx="18" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="2"/>
<g fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="2">
<path d="M406 216 V242"/>
<path d="M398 234 L406 243 L414 234"/>
<path d="M394 252 H418"/>
</g>
<g fill="currentColor" font-size="14" opacity="0.5">
<text x="462" y="228" class="sm">Or a download, which</text>
<text x="462" y="250" class="sm">still runs on their machine.</text>
</g>
</svg>
<figcaption>The left side is a list of things you have to be able to do. The right side is a link. A download is a friendlier version of the left.</figcaption>
</figure>

<figure>
<img src="/assets/hero/in-transit.jpg" alt="" width="1376" height="768" loading="lazy" decoding="async">
</figure>

## What changes for the person

Hosting an agent is usually described from the inside: a machine, an image, a policy, a bill. What the person using it notices is smaller than that: two things people do on a laptop without thinking, and what each becomes when the agent is somewhere else.

**Getting in.** On a laptop this is an install: a CLI, a runtime, a version to keep current. Hosted, it is an account and a link, and nothing on their machine to maintain. That account is doing more work than the install ever did: it is how they are known, and how everything the agent does is attributed back to them.

<figure>
<img src="/assets/hero/getting-in.jpg" alt="A hand-drawn sketch of a small hooded figure standing beside a tall, unsteady stack of plain boxes, with a thin circular arrow looping around the stack." width="1376" height="768" loading="lazy" decoding="async">
<figcaption>One is a thing they install and then keep current. The other is a URL.</figcaption>
</figure>

**Handing it the work.** A laptop agent is useful because the machine is theirs. It reads the directory they are standing in and acts as them, with their keys. Its skills come off their own disk, its tools are whatever their `$PATH` holds, and the MCP servers it talks to are the ones their config file names, over their network, with their credentials. None of that belongs to the agent; all of it belongs to the machine.

Host it, and all of it goes at once. They choose what it may read, they authorise what it may do, and a skill or an MCP server stops being something on their disk and becomes something the platform has to host and let them add.

And the agent stops being them. On a laptop it holds their keys, so it can already do everything they can, and none of that is separately revocable. Hosted, it needs an identity of its own, scoped and expiring: the first time anyone asks what it may do, and the first time any of it can be taken back. That question does not go away once answered: which services it may reach, how much of each, and which actions wait for them. Reading a file and sending a message are not the same permission.

<figure>
<svg class="figure-art" width="700" height="256" viewBox="0 0 700 256" role="img" aria-label="On the left, three inherited things inside a dashed boundary, all bracketed into the agent. On the right, the agent inside a solid boundary beside a single mounted folder, with a skill arriving from outside.">
<text x="0" y="18" fill="currentColor" opacity="0.9">On the laptop</text>
<text x="380" y="18" fill="currentColor" opacity="0.9">Hosted</text>
<rect x="1" y="36" width="318" height="150" rx="14" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="2" stroke-dasharray="7 7"/>
<text x="160" y="58" class="sm" fill="currentColor" text-anchor="middle" opacity="0.5">their machine</text>
<g fill="currentColor" opacity="0.18">
<rect x="16" y="66" width="180" height="24" rx="6"/>
<rect x="16" y="96" width="180" height="24" rx="6"/>
</g>
<text x="28" y="82" class="sm" fill="currentColor" opacity="0.6">the working copy</text>
<text x="28" y="112" class="sm" fill="currentColor" opacity="0.6">their mcp config</text>
<rect x="16" y="126" width="180" height="24" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.75" stroke-width="2"/>
<text x="28" y="142" class="sm" fill="currentColor" opacity="0.85">skills/ and tools</text>
<path d="M198 78 H208 V138 H198" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-width="2"/>
<path d="M205 104 L213 108 L205 112" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-width="2"/>
<rect x="214" y="84" width="92" height="54" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<text x="260" y="118" fill="currentColor" text-anchor="middle" opacity="0.95">the agent</text>
<rect x="381" y="36" width="318" height="150" rx="14" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<text x="540" y="58" class="sm" fill="currentColor" text-anchor="middle" opacity="0.7">the image</text>
<rect x="396" y="84" width="158" height="54" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="5 5"/>
<text x="475" y="118" class="sm" fill="currentColor" text-anchor="middle" opacity="0.6">one folder they gave it</text>
<rect x="574" y="84" width="104" height="54" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<text x="626" y="118" fill="currentColor" text-anchor="middle" opacity="0.95">the agent</text>
<rect x="440" y="212" width="200" height="28" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.6" stroke-width="2" stroke-dasharray="5 5"/>
<text x="540" y="231" class="sm" fill="currentColor" text-anchor="middle" opacity="0.7">a skill or an MCP server</text>
<path d="M540 210 V194" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="2"/>
<path d="M534 200 L540 190 L546 200" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="2"/>
</svg>
<figcaption>On their machine the agent reads what they read, and a skill or an MCP server is something they point it at. In an image there is one mounted folder, and anything else has to be put in from outside.</figcaption>
</figure>

Neither is a hard job on its own. Together they are what *hosted* means from the outside, and they are only the visible half.

## The trade

A web service does what you wrote; an agent writes the program and then runs it. That is why everything behind those two steps is a system somebody has to build, own and keep running: a sandbox running code nobody reviewed, an identity that is not theirs, an egress policy, a machine thrown away when the run ends.

So it is worth asking: do agents need hosting at all? Anyone with a terminal is better served locally, for the price of a directory and a config file.

What hosting buys is usability for everyone who would never get past the setup. Nobody learns a tool they cannot install: worth an audience you do not otherwise have, and a poor trade for the one you already do.

<figure>
<img src="/assets/hero/arrival.jpg" alt="" width="1376" height="768" loading="lazy" decoding="async">
</figure>

## Bye.

<p class="colophon">Written with the help of an AI assistant, based on experience and research.</p>
