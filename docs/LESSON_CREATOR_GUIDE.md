# Lesson Creator Guide

A simple guide for creating engaging lessons on the platform.

## Quick Start

### Basic Lesson (No Formatting)
Just write your lesson description normally:

```sql
INSERT INTO lessons (title, description, module_id, order_index)
VALUES (
  'Understanding Business Revenue',
  'Revenue is the total income generated from business operations. In this lesson, we will explore different types of revenue streams and how to calculate them.',
  'your-module-id',
  1
);
```

That's it! The lesson will work perfectly as-is.

## Adding Rich Content

Want to add more detailed content with formatting? Use `\n cnt:` to separate:

```sql
description = 'Brief intro here
\n cnt: # Full Content

Detailed markdown content...'
```

### Business Lesson Example

```sql
INSERT INTO lessons (
  title,
  description,
  module_id,
  order_index,
  youtube_url,
  duration_minutes
) VALUES (
  'Understanding Revenue Streams',
  'Learn how businesses generate income and identify multiple revenue sources.
\n cnt: # Understanding Revenue Streams

## What is Revenue?

**Revenue** is the total amount of money a business receives from its customers in exchange for goods or services. It\'s often called the "top line" because it appears at the top of the income statement.

## Types of Revenue Streams

### 1. Product Sales
Direct sales of physical or digital products.

**Example:**
- Apple selling iPhones
- Netflix selling subscriptions
- Bakery selling bread

### 2. Service Revenue
Income from providing services to customers.

**Example:**
- Consulting fees
- Legal services
- Maintenance contracts

### 3. Subscription Revenue
Recurring payments from customers for ongoing access.

**Example:**
- Software as a Service (SaaS)
- Gym memberships
- Magazine subscriptions

### 4. Advertising Revenue
Money earned from displaying ads or sponsorships.

**Example:**
- Google AdWords
- YouTube ad revenue
- Podcast sponsorships

## Calculating Total Revenue

The basic revenue formula:

```
Revenue = Price × Quantity Sold
```

**Real Example:**
If you sell 100 units at $50 each:
```
Revenue = $50 × 100 = $5,000
```

## Multiple Revenue Streams

Successful businesses often have multiple revenue streams:

1. **Primary Revenue** - Main source of income
2. **Secondary Revenue** - Additional income sources
3. **Passive Revenue** - Income requiring minimal effort

> **Key Insight**: Diversifying revenue streams reduces business risk!

## Case Study: Amazon

Amazon\'s multiple revenue streams:
- **E-commerce** - Product sales
- **AWS** - Cloud services
- **Prime** - Subscription fees
- **Advertising** - Ad placements
- **Devices** - Kindle, Echo, etc.

## Action Steps

1. Identify your current revenue streams
2. Calculate revenue from each stream
3. Look for opportunities to add new streams
4. Monitor and optimize performance

## Key Takeaways

- Revenue is total income before expenses
- Multiple streams provide stability
- Recurring revenue is valuable
- Track each stream separately

**Next:** Learn how to calculate profit margins and understand costs!',
  'your-module-id',
  1,
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
  20
);
```

## Formatting Tips

### Use Headings for Structure
```markdown
# Main Topic
## Subtopic
### Details
```

### Emphasize Important Points
```markdown
**Bold** for important terms
*Italic* for emphasis
```

### Add Lists
```markdown
1. First point
2. Second point
3. Third point

Or bullet points:
- Item one
- Item two
- Item three
```

### Include Examples
Use code blocks for formulas or examples:
````markdown
```
Revenue = Price × Quantity
Profit = Revenue - Costs
```
````

### Highlight Key Information
```markdown
> **Key Point**: This is important information!
```

## Adding Videos

### YouTube Videos
```sql
youtube_url = 'https://www.youtube.com/watch?v=VIDEO_ID'
```

### Vimeo Videos
```sql
youtube_url = 'https://player.vimeo.com/video/VIDEO_ID'
```

### Loom Videos
```sql
youtube_url = 'https://www.loom.com/embed/VIDEO_ID'
```

The video will automatically display above the content!

## Best Practices

### 1. Start Simple
Begin with a short, clear introduction.

### 2. Use Real Examples
Business concepts are easier with real-world examples.

### 3. Break Into Sections
Use headings to organize content into digestible chunks.

### 4. Add Visuals
Include videos or diagrams when possible.

### 5. End with Action
Give learners something to do or think about.

### 6. Keep It Concise
Aim for 10-20 minutes of reading time.

## Complete Example: Marketing Lesson

```sql
INSERT INTO lessons (
  title,
  description,
  module_id,
  order_index,
  youtube_url
) VALUES (
  'The Marketing Mix: 4 Ps',
  'Discover the fundamental framework for marketing strategy: Product, Price, Place, and Promotion.
\n cnt: # The Marketing Mix: 4 Ps

## Introduction

The **Marketing Mix** (also known as the 4 Ps) is a foundation of marketing strategy. It helps businesses make key decisions about how to market their products or services.

## The 4 Ps Explained

### 1. Product 🎯
What you\'re selling - physical goods, services, or digital products.

**Key Questions:**
- What does the customer want?
- What features does it need?
- How is it different from competitors?

**Example:** Apple\'s iPhone combines design, technology, and ecosystem.

### 2. Price 💰
How much customers pay for your product.

**Pricing Strategies:**
- **Premium Pricing** - High price for luxury/quality
- **Penetration Pricing** - Low price to enter market
- **Competitive Pricing** - Match competitor prices
- **Value Pricing** - Price based on perceived value

**Example:** Netflix uses subscription pricing ($9.99-$19.99/month).

### 3. Place 📍
Where and how customers buy your product.

**Distribution Channels:**
- Direct sales (your website)
- Retail stores
- Online marketplaces (Amazon, eBay)
- Wholesalers and distributors

**Example:** Nike sells through their website, Nike stores, and retail partners.

### 4. Promotion 📢
How you communicate with customers about your product.

**Promotion Methods:**
- Advertising (TV, online, print)
- Social media marketing
- Content marketing
- Email campaigns
- Public relations
- Sales promotions

**Example:** Coca-Cola uses TV commercials, social media, and event sponsorships.

## Putting It All Together

Let\'s see how a coffee shop applies the 4 Ps:

| P | Strategy |
|---|----------|
| **Product** | High-quality specialty coffee, pastries, comfortable atmosphere |
| **Price** | Premium pricing ($4-6 per drink) |
| **Place** | Prime downtown location, delivery via app |
| **Promotion** | Instagram posts, loyalty program, local events |

## Modern Addition: The 7 Ps

Service businesses often add 3 more Ps:
- **People** - Staff and service quality
- **Process** - How service is delivered
- **Physical Evidence** - Tangible aspects of service

## Your Turn

Think about a product you use daily:
1. What is the product?
2. How is it priced?
3. Where do you buy it?
4. How did you hear about it?

> **Remember**: All 4 Ps must work together for effective marketing!

## Key Takeaways

✓ Product - What you sell
✓ Price - What customers pay
✓ Place - Where customers buy
✓ Promotion - How you communicate

**Next Lesson:** Learn about digital marketing strategies!',
  'your-module-id',
  2,
  'https://www.youtube.com/watch?v=MARKETING_VIDEO'
);
```

## Testing Your Lesson

Before publishing:
1. ✅ Check spelling and grammar
2. ✅ Verify all links work
3. ✅ Test code examples (if any)
4. ✅ Preview on mobile
5. ✅ Ensure video plays correctly

## Need Help?

- See `LESSON_CONTENT_FORMAT.md` for detailed formatting guide
- See `LESSON_CONTENT_EXAMPLES.md` for more examples
- See `QUICK_REFERENCE.md` for quick syntax reference

## Quick Reference

### Markdown Cheat Sheet
```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold Text**
*Italic Text*

- Bullet point
- Another point

1. Numbered item
2. Another item

[Link Text](https://url.com)

> Quote or callout

`inline code`

```
code block
```
```

Happy teaching! 🎓
