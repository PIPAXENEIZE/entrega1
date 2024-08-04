import mongoose from 'mongoose';

const collection = "carts";

const schema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.SchemaTypes.ObjectId, ref: 'productModel' },
            quantity: { type: Number, default: 1 }
        }
    ]
});

const cartModel = mongoose.model(collection, schema);

export default cartModel;
