# 🛡️ Watcher - Incident Reporting System

<div align="center">
  <img src="https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2" alt="Security Guard Communication" width="600" style="border-radius: 10px; margin: 20px 0;">
  
  **A secure, scalable incident reporting system for modern organizations**
  
  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)
</div>

## 📋 Overview

Watcher is a comprehensive incident reporting system designed to streamline communication and resolution workflows across different departments in an organization. Whether it's IT issues, HR concerns, security incidents, or facilities problems, Watcher provides a centralized platform for reporting, tracking, and resolving incidents efficiently.

### 🎯 Key Features

- **🔐 Multi-Role Authentication**: Support for Employee, Admin, IT, HR, and Security roles
- **📊 Real-Time Dashboard**: Live analytics with incident trends and status tracking
- **🚨 Incident Management**: Complete lifecycle from reporting to resolution
- **🔔 Live Notifications**: Real-time updates on incident status changes
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🏷️ Advanced Filtering**: Search and filter by category, priority, status, and more
- **📈 Analytics & Reporting**: Visual insights into incident patterns and resolution times
- **👥 Role-Based Permissions**: Granular access control based on user roles

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/watcher-incident-system.git
   cd watcher-incident-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to access the application

## 🔑 Demo Credentials

The application includes demo accounts for testing different user roles:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@company.com | password | Full system access, user management |
| **Employee** | employee@company.com | password | Report incidents, view own reports |
| **IT Support** | it@company.com | password | Manage IT incidents, system settings |

## 🏗️ System Architecture

### Frontend Stack
- **React 18** - Modern UI framework with hooks and context
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling framework
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Data visualization and analytics
- **React Router** - Client-side routing
- **Lucide React** - Beautiful, consistent icons

### Core Components

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication forms
│   ├── Dashboard/      # Dashboard widgets and charts
│   ├── Layout/         # Navigation and layout components
│   └── Notifications/  # Real-time notification system
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── pages/              # Main application pages
└── types/              # TypeScript type definitions
```

## 📱 User Interface

### Dashboard
- **Real-time metrics**: Total incidents, open cases, resolution times
- **Visual analytics**: Trend charts and category breakdowns
- **Recent activity**: Latest incidents and status updates
- **Quick actions**: Fast access to common tasks

### Incident Management
- **Multi-step reporting**: Guided form with validation
- **Rich categorization**: IT, HR, Security, Facilities, and custom categories
- **Priority levels**: Low, Medium, High, Critical with visual indicators
- **File attachments**: Support for documentation and evidence
- **Status tracking**: Open → In Progress → Resolved → Closed

### Notifications
- **Real-time updates**: Instant notifications for status changes
- **Assignment alerts**: Notifications when incidents are assigned
- **Resolution updates**: Automatic updates when incidents are resolved
- **Customizable preferences**: Control notification frequency and types

## 🔒 Security Features

- **Role-based access control**: Granular permissions by user role
- **Secure authentication**: Session management and user validation
- **Data privacy**: Sensitive information protection
- **Audit trails**: Complete history of incident changes
- **Anonymous reporting**: Option for confidential incident submission

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563eb) - Trust and reliability
- **Success**: Green (#10b981) - Positive actions and resolved states
- **Warning**: Orange (#f59e0b) - Attention and medium priority
- **Danger**: Red (#ef4444) - Critical issues and high priority
- **Neutral**: Slate (#64748b) - Text and subtle elements

### Typography
- **Headings**: Inter font family, bold weights
- **Body text**: Inter font family, regular weight
- **Code**: Monospace for technical content

## 📊 Analytics & Reporting

### Key Metrics
- **Incident volume**: Track reporting trends over time
- **Resolution times**: Average time to resolve by category
- **Category distribution**: Most common types of incidents
- **Priority analysis**: Breakdown of incident severity levels
- **User activity**: Reporting patterns by department

### Visual Reports
- **Trend charts**: Historical incident data with resolution tracking
- **Category breakdowns**: Pie charts and bar graphs
- **Performance metrics**: Resolution time analysis
- **Status distribution**: Current incident state overview

## 🚀 Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
```

### Environment Variables
```env
VITE_API_URL=https://api.your-domain.com
VITE_WS_URL=wss://ws.your-domain.com
VITE_APP_NAME=Watcher
```

## 🔧 Configuration

### Customization Options
- **Branding**: Update colors, logos, and company information
- **Categories**: Modify incident categories to match your organization
- **Workflows**: Customize status transitions and approval processes
- **Notifications**: Configure email templates and delivery settings
- **Integrations**: Connect with existing systems (LDAP, Slack, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@watcher-system.com
- 📖 Documentation: [docs.watcher-system.com](https://docs.watcher-system.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/watcher-incident-system/issues)

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Images from [Pexels](https://pexels.com/)
- UI inspiration from modern enterprise applications
- Built with ❤️ for organizational efficiency

---

<div align="center">
  <strong>Watcher - Keeping your organization secure and informed</strong>
</div>