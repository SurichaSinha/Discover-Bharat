const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Vendor = require('./models/Vendor');

const products = [
  {
    name: 'Madhubani Painting',
    description: 'Traditional folk art from Bihar featuring intricate patterns and mythological themes',
    state: 'Bihar',
    category: 'Handicraft',
  },
  {
    name: 'Bengal Silk Saree',
    description: 'Premium silk sarees with traditional Bengali motifs and designs',
    state: 'West Bengal',
    category: 'Textile',
  },
  {
    name: 'Kashmiri Shawl',
    description: 'Finely woven woolen shawls with intricate embroidery from Kashmir',
    state: 'Jammu and Kashmir',
    category: 'Textile',
  },
  {
    name: 'Rajasthani Jewelry',
    description: 'Traditional silver jewelry with colorful gemstones from Rajasthan',
    state: 'Rajasthan',
    category: 'Jewelry',
  },
  {
    name: 'Kerala Coir Products',
    description: 'Eco-friendly coir mats and carpets made from coconut husks',
    state: 'Kerala',
    category: 'Home Decor',
  },
  {
    name: 'Tamil Nadu Bronze Idols',
    description: 'Handcrafted bronze statues of Hindu deities using traditional lost-wax casting',
    state: 'Tamil Nadu',
    category: 'Religious Art',
  },
  {
    name: 'Maharashtra Leather Products',
    description: 'High-quality leather goods including bags, wallets, and footwear',
    state: 'Maharashtra',
    category: 'Leather Goods',
  },
  {
    name: 'Punjab Pottery',
    description: 'Traditional pottery items with blue glaze patterns from Punjab',
    state: 'Punjab',
    category: 'Pottery',
  }
];

const vendors = [
  {
    shopName: 'Traditional Arts Emporium',
    city: 'Patna',
    contactInfo: 'Phone: +91-9876543210, Email: arts@traditional.com',
  },
  {
    shopName: 'Silk Heritage',
    city: 'Kolkata',
    contactInfo: 'Phone: +91-9876543211, Address: 123 Silk Street',
  },
  {
    shopName: 'Kashmir Crafts Hub',
    city: 'Srinagar',
    contactInfo: 'Phone: +91-9876543212',
  },
  {
    shopName: 'Desert Jewels',
    city: 'Jaipur',
    contactInfo: 'Phone: +91-9876543213, Website: desertjewels.com',
  },
  {
    shopName: 'Coir Village',
    city: 'Kochi',
    contactInfo: 'Phone: +91-9876543214',
  },
  {
    shopName: 'Bronze Artisans',
    city: 'Chennai',
    contactInfo: 'Phone: +91-9876543215, Workshop: Bronze Lane',
  }
];

const importData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    await Vendor.deleteMany();

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log('Products imported successfully');

    // Insert vendors linked to products
    const vendorsWithProductIds = vendors.map((vendor, index) => ({
      ...vendor,
      productId: createdProducts[index % createdProducts.length]._id
    }));

    await Vendor.insertMany(vendorsWithProductIds);
    console.log('Vendors imported successfully');

    console.log('Data Import Success!');
    process.exit();
  } catch (error) {
    console.error('Data Import Error:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear all data
    await Product.deleteMany();
    await Vendor.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error('Data Destroy Error:', error);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
