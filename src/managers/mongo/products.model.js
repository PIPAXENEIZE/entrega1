import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = "productslistss";

const schema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    quantity: Number,
    category: String,
    status: String,
    carrito: [
        {
            product: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'cart'
            }
        }
    ]
});

schema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection, schema);

export default productModel;
