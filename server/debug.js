require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Vendor = require('./models/Vendor');

const debugDB = async () => {
  try {
    console.log('🔍 Checking database connection and data...\n');

    // Connect to database
    const mongoURI = process.env.MONGO_URI;
    console.log('📡 Connecting to:', mongoURI);

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to database:', conn.connection.name);
    console.log('🖥️  Host:', conn.connection.host);

    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📂 Collections found:', collections.map(c => c.name));

    // Check products
    console.log('\n🛍️  PRODUCTS:');
    const products = await Product.find({});
    console.log(`Found ${products.length} products:`);

    if (products.length === 0) {
      console.log('❌ No products found in database!');
      console.log('\n💡 Possible issues:');
      console.log('1. You inserted data into wrong database');
      console.log('2. You used wrong collection name (should be "products")');
      console.log('3. Data format doesn\'t match schema');
    } else {
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (${product.state}) - ${product._id}`);
      });
    }

    // Check states
    console.log('\n🇮🇳 STATES:');
    const State = require('./models/State');
    const states = await State.find({});
    console.log(`Found ${states.length} states:`);

    if (states.length > 0) {
      states.forEach((state, index) => {
        console.log(`${index + 1}. ${state.name} (${state.code})`);
      });
    }

    // Check vendors
    console.log('\n🏪 VENDORS:');
    const vendors = await Vendor.find({});
    console.log(`Found ${vendors.length} vendors:`);

    if (vendors.length > 0) {
      vendors.forEach((vendor, index) => {
        console.log(`${index + 1}. ${vendor.shopName} (${vendor.city})`);
      });
    }

    // Show raw collections data
    console.log('\n🔧 RAW COLLECTIONS DATA:');

    const rawProducts = await mongoose.connection.db.collection('products').find({}).toArray();
    console.log(`Raw products count: ${rawProducts.length}`);
    if (rawProducts.length > 0) {
      console.log('Sample raw product:', JSON.stringify(rawProducts[0], null, 2));
    }

    await mongoose.disconnect();
    console.log('\n👋 Disconnected from database');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check MONGO_URI in .env file');
    console.log('3. Verify database name in connection string');
  }
};

debugDB();
