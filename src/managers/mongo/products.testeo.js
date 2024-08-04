import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = "productslists";

const ProductSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    category: { type: String, required: true },
    img: { type: String, required: true },
    inCart: { type: Boolean, default: false }
});

ProductSchema.plugin(mongoosePaginate);

const Product = model('Product', ProductSchema, collection); // Especificar el nombre de la colección

export default Product;
