---
title: Setting up Pi-hole as an ad blocker
description: Under thirty minutes from a blank SD card to a network-wide ad blocker on a Raspberry Pi, with the screenshots from my own setup.
date: 2022-10-20
category: Tools
readingTime: 4
---

Wikipedia describes it as:

> Pi-hole is a Linux network-level advertisement and Internet tracker blocking application which acts as a DNS sinkhole and optionally a DHCP server, intended for use on a private network. Pi-hole has the ability to block traditional website advertisements as well as advertisements in unconventional places, such as smart TVs and mobile operating system advertisements.

That last part is the reason to bother. An ad blocker in the browser is one thing; a DNS sinkhole in the house blocks the adverts that arrive from a smart TV, a phone app, or anything else you cannot install an extension into.

This is how I set mine up. It took under thirty minutes, most of which was the SD card. The [Raspberry Pi Imager](https://www.raspberrypi.com/news/raspberry-pi-imager-imaging-utility/) is what made that part easy: it configures the card so the Pi comes up on the network ready for SSH.

<figure>
<img src="/assets/posts/pihole-kit.png" alt="A photograph on a grey carpet of the parts: a sheet of Core Electronics stickers, a USB cable in a plastic bag, a red Raspberry Pi 4 Model B box, a black Argon NEO case box and a small microSD card adapter." width="816" height="1013" loading="lazy" decoding="async">
<figcaption>Everything, laid out before assembly.</figcaption>
</figure>

## What you need

I bought it all from [Core Electronics](https://core-electronics.com.au/), whose delivery was quick enough that I have bought from them since. They also included stickers.

- Raspberry Pi 4 Model B, 1 GB
- MicroSD card
- Raspberry Pi 4 power supply

And two things that turned out to be optional:

- Argon NEO Raspberry Pi 4 case (used, and worth it)
- Micro-HDMI to HDMI adapter cable (never taken out of the packet)

## The steps

**1. Flash the card.** Mine arrived with NOOBS on it; I flashed Raspberry Pi OS instead. The Imager makes this a matter of picking the OS and the card.

<figure>
<img src="/assets/posts/pihole-imager.png" alt="The Raspberry Pi Imager window: version 1.7.3 under the Raspberry Pi logo, Choose OS set to Raspberry Pi OS (32-bit), Choose Storage set to SDHC Card, and a Write button." width="693" height="461" loading="lazy" decoding="async">
<figcaption>The Imager, with the OS and the card chosen.</figcaption>
</figure>

Before writing, open the **Advanced options** (the gear icon) and set four things:

- Enable SSH
- A username and password
- Wireless LAN details
- Locale settings

Enable SSH is the one that matters. It means the Pi comes up on the network ready to be logged into, with no monitor and no keyboard anywhere near it.

<figure>
<img src="/assets/posts/pihole-advanced-options.png" alt="The Advanced options dialog: image customization for this session only, an unchecked Set hostname field reading raspberrypi.local, Enable SSH checked, Use password authentication selected, and a Save button." width="513" height="410" loading="lazy" decoding="async">
<figcaption>Advanced options: SSH on, credentials set, wireless configured before the card is written.</figcaption>
</figure>

**2. Find it on the network.** Once the Pi boots you need its address, and there are two ways. Ask the network (`arp -a` from a shell, or a phone app that scans the LAN, which is what I used):

<figure>
<img src="/assets/posts/pihole-netscan.jpg" alt="An Android network scanner app showing a list of devices, with one row highlighted: hostname pihole, address 192.168.0.188, MAC e4:5f:01:ba:3a:b7, vendor Raspberry Pi Trading Ltd, response 17 ms." width="438" height="813" loading="lazy" decoding="async">
<figcaption>The Network Scanner app, finding the Pi by its vendor name: "Raspberry Pi Trading Ltd" gives it away.</figcaption>
</figure>

Or skip the address entirely and use the hostname. The hostname is `raspberrypi.local` by default, and the mDNS resolver will find it.

**3. Connect with PuTTY.** Either the address or the hostname works.

<figure>
<img src="/assets/posts/pihole-putty-ip.png" alt="The PuTTY configuration dialog, Session page, with Host Name set to 192.168.0.189, port 22, connection type SSH, and Close window on exit set to Only on clean exit." width="464" height="463" loading="lazy" decoding="async">
<figcaption>PuTTY, pointed at the address the scanner gave me.</figcaption>
</figure>

<figure>
<img src="/assets/posts/pihole-putty-hostname.png" alt="The same PuTTY dialog with Host Name set to pi.hole instead of an address, port 22 and connection type SSH." width="459" height="392" loading="lazy" decoding="async">
<figcaption>And the same dialog pointed at the hostname instead.</figcaption>
</figure>

Worth noticing, since these two screenshots do not agree: the scanner found the Pi at `.188` and the saved PuTTY session was `.189`. DHCP had handed out a different address by the time I got here. Using the hostname avoids the problem; giving the Pi a static address solves it, which is step 6.

**4. Log in.** The username and password from the advanced options.

<figure>
<img src="/assets/posts/pihole-ssh-session.png" alt="A PuTTY terminal: login as pi, a password prompt, the Raspberry Pi OS banner for Linux pihole 5.15.61-v71+, the last login time, and a pi@pihole:~ $ prompt." width="640" height="356" loading="lazy" decoding="async">
<figcaption>In. The prompt is the only thing that matters here.</figcaption>
</figure>

**5. Install Pi-hole.** The [one-step automated install](https://github.com/pi-hole/pi-hole/#one-step-automated-install) is genuinely one step. The only thing it asks that needs a decision is the static address.

**6. Give it a static address** if you were asked for one: [this guide covers it](https://www.makeuseof.com/raspberry-pi-set-static-ip/). It matters more than it sounds: a DNS server whose address moves is a DNS server your house stops using.

**7. Point your devices at it.** Either each device, or the router. I changed my own devices only: setting it on the router would have pushed my network choices onto my housemates, who did not ask for them.

<figure>
<img src="/assets/posts/pihole-running.jpg" alt="A photograph of the Raspberry Pi in its black case on a desk, powered up with a blue status light, beside a tangle of cables and a white plug." width="1920" height="864" loading="lazy" decoding="async">
<figcaption>Running. That blue light is the whole interface.</figcaption>
</figure>

**8. Look at the dashboard.** Mine, after a day:

<figure>
<img src="/assets/posts/pihole-dashboard.png" alt="The Pi-hole admin dashboard: 13,175 domains on the adlists, 1,709 queries blocked, 13% blocked, 205,767 total queries, with 24-hour query and client activity charts and two donut charts for query types and upstream servers." width="1026" height="771" loading="lazy" decoding="async">
<figcaption>One day of a small network: 205,767 queries, 13% of them blocked.</figcaption>
</figure>

**9. Add more lists**, under Settings → Adlists:

- `https://raw.githubusercontent.com/kboghdady/youTube_ads_4_pi-hole/master/youtubelist.txt` for YouTube adverts
- `https://blocklistproject.github.io/Lists/tracking.txt` for trackers

Then go to **Tools → Update Gravity** to pull them in. Adding a list without updating gravity adds nothing at all.

## Was it worth it

Setting up a Raspberry Pi has become easy, and most of the credit goes to the Imager. The step that used to be the barrier (enabling SSH, configuring wireless, setting a locale) used to need a monitor, a keyboard and a mouse plugged into the Pi for the first boot. Now it is four checkboxes before you write the card.

Two honest caveats. Under thirty minutes is the setup, not the maintenance: a Pi that serves DNS for the whole house is a machine that has to keep running. And Pi-hole is not a substitute for the ad blocker in your browser: extension blockers see the page and can act on it; a DNS sinkhole sees only the request. Run both.
