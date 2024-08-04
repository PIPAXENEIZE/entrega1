import { model, Schema } from 'mongoose';


const ProductSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, 
    title: { type: String, required: true },
    img: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

const CartSchema = new Schema({
    products: [ProductSchema],
});

const Cart = model('Cart', CartSchema);

export default Cart;
