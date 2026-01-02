# KAYNETARTSPHERE
# ChicCouture Fashion E-Commerce Application

A full-featured fashion e-commerce platform with custom ordering, ready-made clothes shopping, Paystack payment integration, and comprehensive admin dashboard.

## 🌟 Features

### Customer Features
- **Custom Orders**: Multi-step form for personalized garment creation
  - Style selection (dresses, suits, shirts, etc.)
  - Detailed measurements input
  - Material and fabric selection
  - Design customization with image upload
  - Urgency level selection
  - **50% deposit payment** via Paystack
  
- **Ready-Made Shopping**
  - Browse curated collection
  - Filter by category and size
  - Product detail pages with reviews
  - Shopping cart management
  - **Full payment** via Paystack

- **Secure Payment Integration**
  - Paystack payment gateway
  - Mobile Money, Bank Cards, and Bank Transfer support
  - Secure SSL encryption

### Admin Features
- **Dashboard Overview**
  - Total orders, revenue, and statistics
  - Recent orders table
  - Quick action cards

- **Product Management (CRUD)**
  - Create new products
  - Read/View all products
  - Update product details
  - Delete products
  - Manage stock levels
  - Configure sizes and categories

- **Order Management**
  - View all orders
  - Update order status
  - Track ready-made orders

- **Custom Order Management**
  - Review custom order details
  - View measurements and specifications
  - Track payment status (deposit/balance)
  - Mark orders complete

## 🚀 Tech Stack

- **Frontend**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Payment**: Paystack (react-paystack)
- **State Management**: React Context API

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Paystack account (for payment integration)

### Setup Instructions

1. **Install Dependencies**
```bash
cd fashion-app
npm install
```

2. **Configure Paystack**

Open `src/pages/CheckoutPage.js` and replace the Paystack public key:

```javascript
const paystackPublicKey = 'pk_test_xxxxxxxxxxxxxxxxxxxx'; // Replace with your actual key
```

Get your Paystack API keys from: https://dashboard.paystack.com/#/settings/developer

3. **Configure Tailwind CSS**

Create `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

Create `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Create index.js**

Create `src/index.js`:
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

5. **Create public/index.html**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#9333ea" />
    <meta name="description" content="ChicCouture - Bespoke Fashion Studio" />
    <title>ChicCouture - Custom Fashion & Ready-Made Clothing</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

6. **Run the Application**
```bash
npm start
```

The application will open at `http://localhost:3000`

## 📱 Application Structure

```
fashion-app/
├── src/
│   ├── components/
│   │   └── Layout.js                 # Main layout with header/footer
│   ├── context/
│   │   ├── AuthContext.js            # Authentication state
│   │   └── CartContext.js            # Shopping cart state
│   ├── pages/
│   │   ├── HomePage.js               # Landing page
│   │   ├── CustomOrderPage.js        # Custom order form (50% deposit)
│   │   ├── ReadyMadePage.js          # Browse ready-made products
│   │   ├── ProductDetailPage.js      # Individual product view
│   │   ├── CartPage.js               # Shopping cart
│   │   ├── CheckoutPage.js           # Paystack payment
│   │   ├── OrderSuccessPage.js       # Payment success
│   │   ├── LoginPage.js              # Authentication
│   │   └── admin/
│   │       ├── AdminDashboard.js     # Admin overview
│   │       ├── AdminProducts.js      # CRUD for products
│   │       ├── AdminOrders.js        # Manage orders
│   │       └── AdminCustomOrders.js  # Manage custom orders
│   ├── App.js                        # Main app with routing
│   └── index.js                      # Entry point
├── package.json
└── README.md
```

## 🔐 Login Credentials

### Admin Access
- **Email**: admin@fashion.com
- **Password**: admin123

### Customer Access
- **Email**: Any valid email
- **Password**: Any password

## 💳 Payment Flow

### Custom Orders (50% Deposit)
1. Customer fills multi-step custom order form
2. System calculates total cost
3. Customer pays 50% deposit via Paystack
4. Remaining 50% due upon completion

### Ready-Made Orders (Full Payment)
1. Customer adds items to cart
2. Proceeds to checkout
3. Pays full amount via Paystack
4. Order confirmed immediately

## 🎨 Design Features

- **Elegant Typography**: Playfair Display (serif) + Poppins (sans-serif)
- **Color Scheme**: Purple, pink, and rose gradients
- **Glass Morphism**: Frosted glass effects throughout
- **Smooth Animations**: Fade-in, scale, and slide effects
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Semantic HTML and ARIA labels

## 🛠️ Admin Dashboard Features

### Product Management
- Add new products with all details
- Edit existing products
- Delete products
- Manage stock levels
- Configure available sizes
- Set prices and categories

### Order Management
- View all orders in table format
- Update order status (Pending → Processing → Shipped → Delivered)
- View customer details
- Track order dates

### Custom Order Management
- Review detailed custom requirements
- View measurements and specifications
- Track deposit payments
- Monitor balance due
- Mark orders as complete

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `build` folder.

### Deploy to Hosting Platforms

**Netlify/Vercel:**
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variable for Paystack key

**Traditional Hosting:**
1. Run `npm run build`
2. Upload contents of `build` folder
3. Configure server for single-page app routing

## 🔧 Customization

### Update Paystack Configuration
Edit `src/pages/CheckoutPage.js`:
```javascript
const paystackPublicKey = 'YOUR_PUBLIC_KEY';
```

### Modify Product Categories
Edit category arrays in:
- `src/pages/CustomOrderPage.js`
- `src/pages/ReadyMadePage.js`
- `src/pages/admin/AdminProducts.js`

### Change Color Scheme
Update Tailwind classes in components:
- Primary: `purple-600`, `pink-600`
- Accent: `yellow-300`, `orange-500`

### Add New Features
- Connect to backend API (replace mock data)
- Implement real authentication
- Add image upload for products
- Integrate email notifications
- Add customer reviews system

## 📊 Backend Integration (Future)

To connect to a real backend:

1. **Create API endpoints** for:
   - User authentication
   - Product CRUD
   - Order management
   - Custom order processing
   - Payment verification

2. **Replace mock data** in Context providers
3. **Add API calls** using fetch or axios
4. **Implement proper error handling**
5. **Add loading states**

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Contact: support@chiccouture.com

## 🎉 Acknowledgments

- Design inspired by modern e-commerce platforms
- Icons by Lucide
- Payment powered by Paystack
- Fonts from Google Fonts

---

Built with ❤️ for fashion entrepreneurs in Ghana and beyond.