# 🎯 Interactive Game Wheel Generator

A dynamic web-based interactive game wheel generator built with React, TypeScript, and Express. This application provides an engaging and customizable spinning experience with advanced interaction mechanics, Fibonacci-based landing logic, and comprehensive customization options.

![Game Wheel Demo](./attached_assets/Screenshot%202025-01-22%20232157.png)

## ✨ Features

### Core Functionality
- **Interactive Wheel Spinning**: Smooth animations with customizable physics
- **Fibonacci Landing Logic**: Predictable landing mechanics using Fibonacci sequences
- **Real-time Configuration**: Live editing of wheel properties and appearance
- **Recording Capabilities**: Export wheel spins as animated GIFs
- **Spin History Tracking**: Complete logging with exportable history
- **File Import/Export**: Support for CSV, TXT, and XLS configuration files

### Customization Options
- **Dynamic Slice Management**: Add, remove, and configure individual slices
- **Color Schemes**: Multiple built-in themes (Default, Pastel, Neon, Monochrome, Sunset, Ocean)
- **Custom Colors**: Per-slice color customization
- **Text Controls**: Rotation, vertical text, font styling, and kerning adjustments
- **Hub Customization**: Configurable center hub with optional images
- **Arrow Styling**: Customizable pointer appearance

### Advanced Features
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Accessibility Support**: Full screen reader compatibility and keyboard navigation
- **Real-time Physics**: Configurable spin speed, duration, friction, and velocity
- **Template System**: Save and load wheel configurations
- **Context Menu Controls**: Right-click slice editing

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
client/src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (Radix UI)
│   ├── WheelCanvas.tsx # Main wheel rendering and interaction
│   ├── WheelControls.tsx # Wheel configuration controls
│   ├── SpinHistory.tsx # Spin tracking and history
│   ├── TemplateControls.tsx # Template management
│   ├── FileControls.tsx # Import/export functionality
│   └── SidePanel.tsx   # Control panel layout
├── lib/                # Utility libraries
│   ├── wheel.ts        # Core wheel rendering and physics
│   ├── files.ts        # File import/export logic
│   ├── templates.ts    # Template management
│   └── utils.ts        # Helper functions
├── pages/              # Application pages
│   └── Home.tsx        # Main application page
└── types/              # TypeScript type definitions
    └── SpinHistory.ts  # Spin tracking types
```

### Backend (Express + TypeScript)
```
server/
├── index.ts           # Express server setup
├── routes.ts          # API endpoints
└── vite.ts           # Vite integration for production
```

### Database (PostgreSQL + Drizzle ORM)
```
db/
├── index.ts          # Database connection
└── schema.ts         # Database schema definitions
```

## 🚀 Deployment on Replit

This application is specifically optimized for deployment on Replit. Follow these steps:

### 1. Setting Up the Project

**Clone or Fork:**
```bash
# If starting from scratch, create a new Replit project
# Select "Import from GitHub" and use this repository
```

**Install Dependencies:**
```bash
npm install
```

### 2. Environment Configuration

**Required Environment Variables:**
```bash
# Database (automatically provided by Replit)
DATABASE_URL=postgresql://...
PGHOST=...
PGUSER=...
PGPASSWORD=...
PGDATABASE=...
PGPORT=...

# Optional: Add any API keys if needed
# EXAMPLE_API_KEY=your_key_here
```

### 3. Database Setup

The application uses PostgreSQL with Drizzle ORM. Replit automatically provides database credentials.

**Initialize Database:**
```bash
# Database tables are automatically created when the app starts
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations
```

### 4. Development Workflow

**Start Development Server:**
```bash
npm run dev
```

The development server will:
- Start the Express backend on port 5000
- Serve the React frontend through Vite
- Enable hot module replacement for instant updates
- Automatically restart on file changes

**Build for Production:**
```bash
npm run build
```

### 5. Replit-Specific Configuration

**Workflow Configuration:**
The project includes a pre-configured workflow in `.replit`:
```toml
run = "npm run dev"
modules = ["nodejs-20"]

[deployment]
run = ["npm", "run", "start"]
```

**Port Configuration:**
- Development: Port 5000 (configured for Replit's networking)
- Production: Port 5000 (automatically detected by Replit)

**File Structure for Replit:**
```
├── .replit              # Replit configuration
├── replit.nix          # Nix environment setup
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tailwind.config.ts  # Tailwind CSS setup
└── tsconfig.json       # TypeScript configuration
```

## 🔧 Technologies Used

### Frontend Stack
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Wouter**: Lightweight routing
- **React Query**: Server state management
- **React Hook Form**: Form handling with validation

### Backend Stack
- **Express**: Web framework for Node.js
- **TypeScript**: Type-safe server development
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL**: Relational database
- **Express Session**: Session management
- **Passport**: Authentication middleware

### Development Tools
- **ESBuild**: Fast JavaScript bundler
- **TSX**: TypeScript execution environment
- **Drizzle Kit**: Database migration toolkit
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## 🎮 Usage Guide

### Basic Operation
1. **Customize Wheel**: Use the side panel to adjust slices, colors, and text
2. **Spin Wheel**: Click the "Spin Wheel" button to start animation
3. **View Results**: See spin history and landing results
4. **Export Data**: Download configurations or spin history

### Advanced Features
- **Right-click Slices**: Access individual slice editing
- **Template Management**: Save and load wheel configurations
- **Recording**: Capture wheel spins as animated GIFs
- **File Import**: Load wheel configurations from external files

### Configuration Options
- **Physics**: Adjust spin speed, duration, friction, and momentum
- **Appearance**: Modify colors, fonts, hub design, and arrow style
- **Content**: Edit slice labels, sizes, and text formatting
- **Behavior**: Configure landing logic and animation preferences

## 🐛 Troubleshooting

### Common Issues

**Development Server Won't Start:**
```bash
# Kill any existing processes on port 5000
pkill -f "node.*5000"
npm run dev
```

**Database Connection Issues:**
```bash
# Check environment variables
echo $DATABASE_URL
# Restart the Replit project if needed
```

**Build Errors:**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors:**
```bash
# Check for missing dependencies
npm run type-check
```

### Replit-Specific Issues

**Port Not Opening:**
- Ensure the server binds to `0.0.0.0:5000`
- Check that no other processes are using port 5000
- Restart the Replit workspace if needed

**File System Permissions:**
- Replit automatically handles file permissions
- Ensure uploaded files are in the correct directories

**Database Access:**
- Database credentials are automatically injected
- Check the Replit database tab for connection status

## 📊 Performance & Optimization

### Replit Performance Tips
- **Memory Usage**: The app is optimized for Replit's memory constraints
- **Bundle Size**: Code splitting reduces initial load time
- **Caching**: Static assets are cached for faster loading
- **Database Queries**: Optimized with proper indexing and connection pooling

### Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: Responsive design works on iOS and Android
- **Canvas Rendering**: Hardware-accelerated where available
- **WebGL Fallback**: Graceful degradation for older devices

## 📝 API Documentation

### Configuration Endpoints
```typescript
GET /api/config
// Retrieve current wheel configuration
Response: WheelConfig

POST /api/config
// Save wheel configuration
Body: WheelConfig
Response: { success: boolean }

GET /api/templates
// List saved templates
Response: Template[]

POST /api/templates
// Create new template
Body: { name: string, config: WheelConfig }
Response: Template
```

### History Endpoints
```typescript
GET /api/history
// Retrieve spin history
Query: ?limit=50&offset=0
Response: SpinHistoryEntry[]

POST /api/history
// Add spin result
Body: SpinHistoryEntry
Response: { success: boolean }

DELETE /api/history
// Clear history
Response: { success: boolean }
```

### File Upload Endpoints
```typescript
POST /api/upload/config
// Upload configuration file
Body: FormData (CSV, TXT, XLS)
Response: WheelConfig

POST /api/upload/hub-image
// Upload hub image
Body: FormData (PNG, JPG, GIF)
Response: { imageUrl: string }
```

## 🎨 Customization Examples

### Creating Custom Color Schemes
```typescript
// Add to colorSchemes in wheel.ts
const customScheme = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
];
```

### Custom Physics Settings
```typescript
const wheelConfig: WheelConfig = {
  spinSpeed: 8,        // Higher = faster initial spin
  spinDuration: 4,     // Seconds for complete spin
  friction: 2.5,       // Higher = stops sooner
  velocityVariation: 0.3, // Random variation
  startRamp: 0.5,      // Acceleration time
  endRamp: 2.0         // Deceleration time
};
```

### Template Configuration
```typescript
const template = {
  name: "Decision Wheel",
  config: {
    slices: 6,
    sliceLabels: ["Yes", "No", "Maybe", "Try Again", "Definitely", "Ask Later"],
    colorScheme: "pastel",
    hubSize: 60
  }
};
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

### Manual Testing Checklist
- [ ] Wheel spins smoothly on desktop and mobile
- [ ] Slice editing works via right-click
- [ ] Configuration import/export functions correctly
- [ ] GIF recording completes successfully
- [ ] Spin history tracks accurately
- [ ] All accessibility features work with screen readers

## 🔒 Security Considerations

### Data Protection
- No sensitive data is stored in localStorage
- File uploads are validated for type and size
- Database queries use parameterized statements
- CORS is properly configured for production

### Replit Security
- Environment variables are automatically secured
- Database credentials are injected securely
- HTTPS is enforced in production deployments

## 🌍 Internationalization

The application is ready for internationalization with:
- Text strings extracted to constants
- Number and date formatting utilities
- RTL language support in CSS
- Accessible labels for screen readers

## 🤝 Contributing

### Getting Started
1. Fork the repository on GitHub
2. Clone to your local Replit workspace
3. Create a feature branch: `git checkout -b feature-name`
4. Make your changes with proper TypeScript types
5. Test thoroughly on Replit
6. Submit a pull request with detailed description

### Development Guidelines
- **TypeScript**: Use strict typing and interfaces
- **Styling**: Tailwind CSS with semantic class names
- **Accessibility**: WCAG 2.1 AA compliance required
- **Testing**: Include unit tests for new features
- **Documentation**: Update README for significant changes
- **Code Style**: Use Prettier formatting and ESLint rules

### Code Review Process
- All PRs require at least one review
- Automated tests must pass
- Documentation must be updated
- Replit deployment must be verified

### Feature Requests
- Open an issue with detailed description
- Include use case and mockups if applicable
- Discuss implementation approach before coding

## 📄 License

This project is open source and available under the MIT License.

## 🚀 Deploy to Replit

[![Deploy to Replit](https://replit.com/badge/github/your-username/wheel-generator)](https://replit.com/@your-username/wheel-generator)

**One-Click Deployment:**
1. Click the "Deploy to Replit" button above
2. Fork the repository to your Replit account
3. The application will automatically build and deploy
4. Access your live application through the Replit preview

---

## 📈 Roadmap

### Upcoming Features
- [ ] **Multiplayer Mode**: Real-time spinning with multiple users
- [ ] **Sound Effects**: Customizable audio feedback
- [ ] **Advanced Analytics**: Detailed spin statistics and trends
- [ ] **Webhook Integration**: Connect to external services
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **3D Wheel**: WebGL-powered 3D rendering option

### Version History
- **v1.0.0** (Current): Core wheel functionality with Fibonacci landing
- **v0.9.0**: Added GIF recording and export features
- **v0.8.0**: Implemented template system and file import/export
- **v0.7.0**: Added accessibility features and keyboard navigation
- **v0.6.0**: Custom color schemes and advanced text controls

## 🎯 Use Cases

### Educational
- **Classroom Activities**: Random student selection, topic choices
- **Language Learning**: Vocabulary practice, conversation starters
- **Decision Making**: Group consensus building, option selection

### Business
- **Team Building**: Icebreakers, activity selection
- **Marketing**: Prize wheels, customer engagement
- **Planning**: Feature prioritization, meeting topics

### Entertainment
- **Game Nights**: Activity selection, team formation
- **Streaming**: Viewer interaction, content decisions
- **Events**: Prize drawings, entertainment choices

## 🔗 Related Projects

- [React Wheel of Fortune](https://github.com/example/react-wheel) - Similar concept with different physics
- [Prize Wheel Generator](https://github.com/example/prize-wheel) - Focus on prize/raffle functionality
- [Decision Wheel App](https://github.com/example/decision-wheel) - Mobile-first approach

## 📞 Support

### Community
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community help and sharing
- **Replit Community**: Platform-specific support

### Documentation
- **API Reference**: Complete endpoint documentation
- **Component Guide**: React component usage examples
- **Deployment Guide**: Step-by-step setup instructions

---

**Built with ❤️ for Replit** | **React + TypeScript + Express**

*Last updated: January 2025* | *Version 1.0.0*