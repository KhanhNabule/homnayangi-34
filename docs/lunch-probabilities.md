# Lunch probabilities calibrated to spending

## Evidence and estimated mean

The iPOS.vn / Nestlé Professional Vietnam F&B Report 2025, published April 2026, covers 3,045 diners across multiple occupations. It is a national dining-out proxy, not a representative office-worker-only estimate. Its lunch-spend table (p.52) is:

| Reported spending bin | Share | Representative price assumed here |
| --- | ---: | ---: |
| Below 30k | 15.16% | 25k |
| 31–50k | 53.05% | 40.5k |
| 51–70k | 19.28% | 60.5k |
| 71–100k | 7.39% | 85.5k |
| Above 100k | 5.12% | 150k |

Estimated mean = sum(bin share × representative price) = 50.9381k, rounded to **51k VND** for the model. This is our grouped-data estimate, not a mean published by the researchers. Substituting 20–25k in the bottom bin and 125–175k in the top bin gives 48.9–52.2k. That is an assumption sensitivity range, not a confidence interval; open-ended bins prevent exact recovery of the mean. No claim is made that office workers in every city spend 51k, or that 2025 spending equals current 2026 spending.

Sources:
- [Publisher and methodology](https://ipos.vn/thong-cao-bao-chi-ipos-vn-va-nestle-professional-cong-bo-bao-cao-thi-truong-kinh-doanh-am-thuc-tai-viet-nam-nam-2025/)
- [Full report mirror, page 52](https://www.slideshare.net/slideshow/ipos-vn-nestle-professional-vietnam-f-b-report-2025_limited-version_low-res-pdf/287074598)

## Model and why it is needed

An average alone cannot determine five tier probabilities: many different distributions share the same mean. We therefore choose the maximum-entropy distribution over the actual meals, subject to:

1. Probabilities sum to one.
2. Expected meal price is 51k.
3. Gold has total probability 0.007, per the user's jackpot requirement, split evenly among gold meals.

Maximum entropy is a modeling choice that maximizes diversity under these constraints; it is not evidence of actual meal preferences. Equal prices receive equal probabilities among non-gold meals, with no arbitrary jumps at tier boundaries. Gold is a deliberate exception for the game.

For gold mean price G and jackpot chance g, the required non-gold mean is M = (51-gG)/(1-g). Non-gold probabilities are:

p_i = (1-g) exp(-lambda × price_i) / sum_j exp(-lambda × price_j).

A binary search solves lambda so that the non-gold mean equals M. Calculation runs once when the module loads, outside the spin click handler. Tier probability is then the sum of the probabilities of its meals. Prices and pool composition drive the resulting tiers; the first three are no longer forced to follow a straight line.

## Result for the current 116 meals

| Tier | Price band | Meals | Probability |
| --- | --- | ---: | ---: |
| Blue | ≤40k | 15 | 41.45% |
| Purple | >40–65k | 31 | 42.11% |
| Pink | >65–100k | 29 | 13.61% |
| Red | >100–130k | 16 | 2.13% |
| Gold | >130k | 25 | 0.70% |

Expected price is exactly 51k within floating-point tolerance, using approximate meal prices in the app. The old tier-first [625,125,25,5,2] distribution put 79.92% of outcomes on only 14 blue meals. Increasing blue pool size alone would never fix that tier dominance.

Independent spins under the new model yield:
- Five consecutive blue results: 1.22%, previously 32.61%.
- Exact same meal on the next spin: 1.89%, previously 4.70%.
- Expected distinct meals in ten spins: 9.20, previously 8.17.
- Any gold: mean waiting time 142.86 spins; chance of at least one gold in five spins 3.45%. These are expectations, not guarantees. There is no pity counter.

## Filters, display, and validation

Filtering conditions the original distribution: P(i | eligible) = p_i / sum(p_j for eligible j). It does not refit to 51k, which might be impossible under a 35k budget. Current restrictive budgets exclude gold; the vegetarian pool includes falafel with pita, so its gold probability is conditional too. Therefore the table applies only to the full pool.

Reel filler uses the same base model with recent filler meals excluded for variety. It does not determine the selected winner. Speed and stopping offset are independent of selection. Inventory sorting uses a copy: tier, price, Vietnamese name.

Run `node tests/selection.cjs`. The seeded one-million-draw check produced 41.3688%, 42.1827%, 13.6153%, 2.1234%, 0.7098%, with average 51.03027k. Tests verify exact mean, normalization, gold mass, every filtered CDF interval, empty/singleton pools, infeasible targets, equal-price pools, and a population without gold.
