---
title: Generating anime art with Waifu Diffusion
description: Four prompts, four outputs, and how hard it was to tell them apart from a person's work.
date: 2022-10-21
category: AI
readingTime: 2
---

Generating images with AI had just got everyone's attention, so I spent a weekend pointing it at something and seeing what came back.

Getting it running was the easy part. There is a web interface fork of Stable Diffusion on GitHub — [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) — which works out of the box with almost no configuration. Rather than the model it suggests, I pointed it at [Waifu Diffusion](https://huggingface.co/hakurei/waifu-diffusion), which describes itself as "a latent text-to-image diffusion model that has been conditioned on high-quality anime images through fine-tuning". Read that as: take a diffusion model, point it at a lot of good anime art, and it gets better at anime art.

Here are four of the results, with the prompt that produced each. Most of the prompts started as a search result and were edited from there. Every image is the model's first pass, at 512×512, with nothing cleaned up afterwards.

> 1girl, brown eyes, beanie cap, black hair, closed mouth, earrings, hat, hoop earrings, jewelry, looking at viewer, shirt, short hair, simple background, solo, upper body, blue shirt

<figure>
<img src="/assets/posts/ai-art1.png" alt="An anime-style portrait of a young woman with long dark hair, large brown eyes, a blue knit beanie and a big gold hoop earring, wearing an open blue jacket over a white top against a soft green background." width="512" height="512" loading="lazy" decoding="async">
</figure>

> 1girl, brown eyes, beanie cap, black hair, closed mouth, earrings, hat, hoop earrings, jewelry, looking at viewer, shirt, short hair, simple background, solo, upper body, yellow shirt

<figure>
<img src="/assets/posts/ai-art2.png" alt="An anime-style portrait of a young woman with long blonde hair and green eyes, in a cream ribbed beanie and a green earring, wearing a dark green jacket over a white top, with a warm sunset behind her." width="512" height="512" loading="lazy" decoding="async">
</figure>

> 1 girl, sitting on a chair, wearing school uniform, beanie cap, blue jacket in a classroom wearing glasses, black hair, brown eyes, head shot, high resolution, hyper detailed, portrait, soft lips

<figure>
<img src="/assets/posts/ai-art3.png" alt="An anime-style portrait of a young woman with black hair, round glasses and a blue knit beanie, in a dark blue jacket and a collared shirt, with a classroom window behind her." width="512" height="512" loading="lazy" decoding="async">
</figure>

> gorgeous young Japanese girl sitting by window with headphones on, wearing blue jacket, soft lips, beach blonde hair, octane render, unreal engine, photograph, realistic skin texture, photorealistic, hyper realism, highly detailed, 85mm portrait photography, award winning, hard rim lighting photography

<figure>
<img src="/assets/posts/ai-art4.png" alt="A photorealistic portrait, not in the anime style of the others: a young woman with long ash-blonde hair wearing large purple and blue over-ear headphones, one hand against her cheek, sitting by a window with a blurred seascape outside." width="512" height="512" loading="lazy" decoding="async">
</figure>

The last two prompts are where it gets interesting. Asking for a "photograph" instead of an illustration changes not just the style but the whole register of the image — the fourth is the same model, and nothing like the first three.

What surprised me is how hard it is to tell these apart from work a person made. All four took seconds.

## References

1. [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) — the web interface used here.
2. [Waifu Diffusion](https://huggingface.co/hakurei/waifu-diffusion) — the fine-tuned model.
3. [Best 100 Stable Diffusion prompts](https://mpost.io/best-100-stable-diffusion-prompts-the-most-beautiful-ai-text-to-image-prompts/) — where several of the prompts above started.

## Bye.

<p class="colophon">Written in 2022, ported from the old Hugo site and lightly edited. The four images are the originals, at the 512×512 these models produced then.</p>
