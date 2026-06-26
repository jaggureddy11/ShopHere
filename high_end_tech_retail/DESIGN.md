---
name: High-End Tech Retail
colors:
  surface: '#fdf8f8'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e6'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dcdddd'
  on-secondary-container: '#5f6161'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1b1a'
  on-tertiary-container: '#868382'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e6e2df'
  tertiary-fixed-dim: '#cac6c4'
  on-tertiary-fixed: '#1c1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#fdf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
spacing:
  base: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system is rooted in high-end, editorial minimalism, tailored for a tech-forward retail experience. It prioritizes clarity, whitespace, and a sophisticated visual hierarchy to allow product photography to remain the focal point. 

The aesthetic draws from modern luxury retail—characterized by a "Less is More" philosophy. It utilizes a **High-Contrast / Modern** style, leaning into sharp edges and structured layouts to evoke a sense of precision, authority, and premium quality. The emotional response should be one of effortless confidence and curated professionalism.

## Colors
The palette is intentionally restrained to maintain a premium retail atmosphere. 

- **Primary (#1A1A1A):** A Deep Charcoal used for all primary text, navigation backgrounds, and high-impact buttons. It provides the "anchor" for the brand.
- **Secondary & Backgrounds:** Crisp White (#FFFFFF) serves as the base for the UI to maximize "breathability." Soft Light Gray (#F4F4F4) is reserved for subtle sectioning, input fields, and UI backgrounds to prevent visual fatigue.
- **Accent (#2E4A62):** A professional Deep Blue used sparingly for interactive cues, text links, and focus states. This ensures a tech-forward feel without breaking the minimal aesthetic.
- **System States:** Success and Error colors are desaturated and "deep" rather than neon, ensuring they feel integrated into the high-end editorial environment.

## Typography
The design system utilizes **Inter** across all levels to create a unified, systematic, and modern feel. The typographic scale is dramatic, using large display sizes to create editorial impact and smaller, tracked-out uppercase labels for navigation and metadata.

- **Headlines:** Use tight letter-spacing and heavy weights to create a sense of presence.
- **Body:** Features generous line-height (1.5x - 1.6x) to ensure readability against high-contrast backgrounds.
- **Labels:** Uppercase styling is preferred for category chips, price points, and small UI triggers to differentiate them from prose.

## Layout & Spacing
This design system employs a **Fixed Grid** philosophy for desktop to maintain an editorial "lookbook" feel, transitioning to a fluid model for mobile devices.

- **Grid:** A 12-column grid is used for desktop (1440px max width) with wide 64px external margins to push content toward the center, mimicking a luxury magazine.
- **Rhythm:** Spacing follows an 8px base unit. Vertical rhythm should be generous; use `stack-lg` (48px) between major sections to emphasize whitespace.
- **Mobile:** On mobile, margins shrink to 20px, and the grid collapses to a 2-column view for product listings to maintain visual density.

## Elevation & Depth
To maintain the minimal and clean aesthetic, depth is achieved through **Tonal Layers** and **Low-contrast outlines** rather than heavy shadows.

- **Surface Levels:** The primary background is White (#FFFFFF). Secondary content (like sidebars or cart drawers) should use the Light Gray (#F4F4F4) to create a subtle stack effect.
- **Shadows:** Only use shadows for floating elements like dropdown menus or modals. These shadows must be "Ambient": very high blur (30px+), very low opacity (4-6%), and no spread, creating a soft glow rather than a hard lift.
- **Borders:** Use hairline borders (1px) in a light gray shade for input fields and dividers.

## Shapes
The shape language is strictly **Sharp (0px)**. This 0px border-radius is a key brand identifier, signaling modernism, architectural precision, and a "high-fashion" tech aesthetic. All buttons, product cards, input fields, and images must adhere to this square-edged rule.

## Components
Consistent component execution is vital for the professional "Retail Giant" look.

- **Buttons:** Primary buttons are solid Deep Charcoal (#1A1A1A) with white uppercase text. Secondary buttons are outlined (1px Deep Charcoal). No rounded corners. Hover states involve a slight opacity shift or a solid background fill for ghost variants.
- **Cards:** Product cards are borderless with no background fill. Images should be 3:4 aspect ratio. Text (title/price) is left-aligned directly below the image with no padding, creating a seamless look.
- **Input Fields:** Minimalist design with a 1px bottom border only, or a very light gray (#F4F4F4) full background. Labels should be small, uppercase, and placed above the field.
- **Navigation:** Top-tier navigation uses slim, 1.5pt stroke icons. Links are Inter Semi-Bold, 14px, uppercase. Use a "sticky" header that shrinks slightly on scroll.
- **Chips/Badges:** Use sharp-edged rectangles with light gray backgrounds and dark text for sizes or categories. For "New" or "Sale" badges, use a solid black or accent blue block placed in the top-left corner of product images.