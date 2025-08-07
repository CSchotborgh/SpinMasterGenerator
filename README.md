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

## 📝 API Documentation

### Configuration Endpoints
- `GET /api/config` - Retrieve current wheel configuration
- `POST /api/config` - Save wheel configuration
- `GET /api/templates` - List saved templates
- `POST /api/templates` - Create new template

### History Endpoints
- `GET /api/history` - Retrieve spin history
- `POST /api/history` - Add spin result
- `DELETE /api/history` - Clear history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with proper TypeScript types
4. Test thoroughly on Replit
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Ensure accessibility compliance
- Test on multiple screen sizes
- Maintain consistent code formatting

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

**Built with ❤️ for Replit** | **React + TypeScript + Express**