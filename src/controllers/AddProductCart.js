import Cart from '../managers/mongo/cart.testeo.js';
import Product from '../managers/mongo/products.testeo.js';

const addProductCart = async (req, res) => {
  const { productId } = req.body;

  try {
    // Buscar el producto por su productId
    const product = await Product.findById(productId);

    // Verificar si el producto existe
    if (!product) {
      return res.status(400).json({
        mensaje: "Este producto no se encuentra en nuestra base de datos",
      });
    }

    // Buscar el carrito (supongamos que solo hay un carrito)
    let cart = await Cart.findOne();

    // Si no existe un carrito, crear uno nuevo
    if (!cart) {
      cart = new Cart({ products: [] });
    }

    // Verificar si el producto ya está en el carrito
    const productInCart = cart.products.find(p => p.productId.toString() === productId);

    if (productInCart) {
      // Si el producto ya está en el carrito, aumentar la cantidad
      productInCart.quantity += 1;
    } else {
      // Si el producto no está en el carrito, agregarlo
      cart.products.push({
        productId: product._id,
        title: product.title,
        img: product.img,
        price: product.price,
        quantity: 1,
      });
    }

    // Guardar el carrito actualizado
    await cart.save();

    // Respuesta exitosa
    res.json({
      mensaje: `El producto "${product.title}" fue agregado al carrito`,
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Hubo un error al intentar agregar el producto al carrito",
      error: error.message,
    });
  }
};

export default addProductCart;
