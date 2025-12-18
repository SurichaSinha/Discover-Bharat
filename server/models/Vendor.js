const mongoose = require('mongoose');
const { Schema } = mongoose;

const VendorSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    contactInfo: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model('Vendor', VendorSchema);
