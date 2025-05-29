# Abbeyhorn Shoehorn Calculator

![Abbeyhorn Logo](/src/assets/abbeyhorn-logo.png)

## Project Overview

The Shoehorn Calculator is an interactive web application that calculates how much time you've spent putting on shoes throughout your life and how much time you could have saved with a shoehorn. This conceptual project for Abbeyhorn showcases how small daily activities can accumulate into significant time expenditures over a lifetime.

### Key Features

- **Basic & Advanced Calculation Modes**
  - Basic Mode: Simple 3-question interface for quick calculations
  - Advanced Mode: Detailed inputs for more precise time estimates
  
- **Personalized Experience**
  - Shoe-specific messaging based on footwear preferences
  - Playful responses to unusual or edge-case inputs
  - Customized time-saving recommendations
  
- **Interactive UI**
  - Intuitive sliders for time and distribution settings
  - Form validation with helpful error messages
  - Responsive design for all devices
  
- **Results & Sharing**
  - Detailed breakdown of time spent and time saved
  - Customized recommendations based on calculation results
  - Social sharing capabilities
  - Special promotional coupon offering

## Demo

You can try the live application at: [https://sarahkitten.github.io/Shoehorn-Calculator/](https://sarahkitten.github.io/Shoehorn-Calculator/)

## Technologies Used

- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe JavaScript
- **Pinia**: State management
- **Vue Router**: Client-side routing
- **Vite**: Build tool and development server
- **Vitest/Playwright**: Testing frameworks

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/shoehorn-calculator.git
   cd shoehorn-calculator
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Development

### Project Structure

```
shoehorn-calculator/
├── public/               # Static assets
├── src/
│   ├── assets/           # CSS and other assets
│   ├── components/       # Vue components
│   ├── router/           # Vue Router configuration
│   ├── stores/           # Pinia stores
│   ├── views/            # Page components
│   ├── App.vue           # Root component
│   └── main.ts           # Application entry point
├── e2e/                  # End-to-end tests
└── ...                   # Config files
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test:unit` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run deploy` - Deploy to GitHub Pages

## Calculation Logic

The calculator uses several factors to determine time spent putting on shoes:

### Basic Mode:
- Age × weeks per year × weekly outings × 2 (on/off) × shoe-specific time

### Advanced Mode:
- Factors in:
  - Custom put-on time
  - Shoe type distribution
  - Age when learned to put on shoes
  - Taking shoes off at home behavior
  - Existing shoehorn ownership

### Shoe Time Constants:
- Big Rubber Clown Shoes: 200 seconds
- Boots: 80 seconds
- Hi Top Sneakers: 60 seconds
- Dress shoes: 50 seconds
- Sneakers: 45 seconds
- Low Top Sneakers: 40 seconds
- High Heels/Velcro Shoes: 15 seconds
- Slip ons/Flats: 10 seconds
- Flip flops/Sandals: 5 seconds
- No Shoes: 0 seconds

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is a creative concept for Abbeyhorn and is not intended for commercial use without permission.

## Acknowledgments

- Created as a conceptual campaign for [Abbeyhorn](https://www.abbeyhorn.co.uk/)
- All time calculations are for entertainment purposes only and are not scientifically validated.

## Contact

If you have any questions or feedback, please reach out at [sarahnkitten@gmail.com](mailto:sarahnkitten@gmail.com).

---

© ${new Date().getFullYear()} Abbeyhorn. This is a conceptual project.
