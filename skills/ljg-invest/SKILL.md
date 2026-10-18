---
name: ljg-invest
description: Investment analysis. Given a project (company name, business plan, founder conversation transcript), writes a deep investment analysis report. It does not follow conventional investment analysis — there is exactly one core judgment: is this project an "order-creating machine"? Use when user says 'investment report', 'investment analysis', 'analyze this project', 'write an investment memo', 'invest analysis', or provides entrepreneur conversation records wanting investment evaluation. Also trigger when user pastes or references meeting notes, pitch decks, or founder interviews and asks for analysis.
---

# ljg-invest: Investment Report

Given a project, write an investment analysis. The whole report answers one question: is this thing creating new order, or merely moving old order around?

## Foundation

One definition carries the entire report: wealth is not money, it is order lit up by desire, and money is only the unit in which order is counted. To invest is to trade the order you hold for a better generator of order.

Starting from that definition, this report asks different questions than the market does:

| The usual question | What this report asks |
|--------------------|-----------------------|
| What is this company worth | Does this machine actually turn |
| How big is the market | What outdated label is the market seeing it through |
| How much can it go up | What am I trading for what, and who is smarter afterwards |

## Input

A company name, a business plan, a written description, a conversation transcript — any material describing the project. For a well-known company the name alone is enough: use a research skill or a subagent to pull the latest filings and industry data instead of writing from stale impressions.

## Report structure

The five blocks are a skeleton, not a form to fill in. Write most about the block where this project has the most substance; cover a thin block in a line or two, or skip it. The report serves the judgment — completeness for its own sake is worthless.

### 1. What this is

One table, plus a category definition you write yourself.

| Dimension   | Content                                                  |
|-------------|----------------------------------------------------------|
| Project     |                                                          |
| Category    | In our own words; do not copy the market's label          |
| Stage       |                                                          |
| Funding     | Amount / valuation / terms (fill in if known, else mark)  |
| Data snapshot | Key operating metrics                                   |

The category definition must say what the company is really doing — the layer the market label cannot reach. Calling it "a search engine company" says nothing; calling it "the monopoly operator of humanity's cognitive infrastructure" tells you in one line how it makes money and what it fears.

### 2. Order-creating machine verdict

The weight of the whole report sits in this section. Do not score item by item; answering one question is enough: **does this machine turn?** Look from three angles.

**Is the flywheel turning?**
First find the loop in the system that gets better the more it is used: more users means more data, more data means a better product, a better product means more users. Once you find it, see how far it has gone — stalled, just started, already spinning. If it is spinning, for how long, and is it accelerating or flattening? If it is stalled, write down the link that is jamming it.

**Stronger or weaker after a shock?**
Competition breaks in, technology turns over, the market collapses — does this machine shatter, hold, or eat the shock as fuel? Go through its history: has it taken a hit, and did it come out weaker or stronger?

**Are resources pushed in, or do they come on their own?**
Expansion that takes deal-by-deal negotiation and piece-by-piece buying is pushing. When others pour in on their own, and lose out by staying away, that is gravity. Look for signs of gathering without pushing.

**Overall verdict**, one of three:

- Order-creating machine — the flywheel turns, shocks make it stronger, resources arrive on their own
- Potential — the flywheel structure is there, not yet proven to turn
- Order transport — rearranging what already exists, producing no new order

### 3. Genesis formula

Every order-creating machine has one core algorithm. Write it in a single line. For reference:

- Amazon = profit -> reinvest -> lower costs -> lower prices -> more users -> more profit
- Tesla = hardware collects data -> data trains the algorithm -> the algorithm redefines the hardware
- Google = every time the way humans look for answers shifts, become the default infrastructure of the new way

Then ask two follow-ups: how many times has this formula been validated, and how far? Is anyone else running a similar formula, and where do they differ?

### 4. What the market sees vs. what we see

Timing is decided in this section.

**Where is it on the S-curve?**
Accumulation, inflection, acceleration, or plateau. If it sits before the inflection, write down exactly which conditions would trigger it.

**Through which old eyes is the market looking at it?**
What label has the market attached, what does that label hide, and what does our frame see that the label cannot? How large is that perception gap — this is where excess return comes from. Three signals of a perception discount: you have to work hard to make anyone understand it; pricing is persistently anomalous, with the parts not adding up to the whole; every ready-made analogy misses, it looks like X but is not X.

**What does it control that nobody can take away?**
Is it holding data, distribution, standards, or network effects? Is that control static (brand, patents) or compounding? Then look one step ahead: will the scarcity move elsewhere, and can the project follow it?

**Which free ride is it on?**
Three costs are collapsing right now: the cost of understanding, the cost of coordinating, the cost of acting. Which one is this project riding, and how much of the released energy does it actually capture?

### 5. Trade or not

- **Recommendation**: invest / watch / pass
- **If investing**: suggested size range, key terms
- **Core assumptions**: which assumptions the decision rests on. Give each one an exit signal — what data, if it appears, proves the assumption wrong and says it is time to leave.
- **Open questions**: 3-5 questions that matter to the decision and have no answer yet, ordered by weight.

### Last line

Answer in one sentence: what is this project, in essence — creating new order, or moving old order?

## Output

- Format: org-mode
- Directory: `~/Documents/notes/`
- Denote-style naming: `YYYYMMDDTHHMMSS==z--investment-analysis-PROJECT_NAME.org`, e.g. `20260326153000==z--investment-analysis-example-ai.org`
- Write it with the Write tool, then report the full path back to the user

## Generation rules

1. Use real information only. Mark what you could not find; never bluff, never invent.
2. Take a position. Not a single sentence of "it could go either way".
3. Every judgment carries evidence: data, a quote, a concrete fact.
4. Banned phrases: huge market, excellent team, bright prospects, blue ocean.
5. Length is whatever it takes to say it fully. Two thousand words if two thousand does it; seven thousand if that is what it takes.
6. Write in English.
