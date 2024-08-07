import Cart from '../managers/mongo/cart.testeo.js'

const putProduct = async (req, res) => {
  const { productId } = req.params;
  const { query } = req.query;
  const body = req.body;

  /* Buscamos el producto en el carrito */
  const productBuscado = await Cart.findById(productId);

  /* Si no hay query 'add' o 'del' */
  if (!query) {
    res.status(404).json({ mensaje: "Debes enviar una query" });

    /* Si esta el producto en el carrito y quiero agregar */
  } else if (productBuscado && query === "add") {
    body.quantity = body.quantity + 1;

    await Cart.findByIdAndUpdate(productId, body, {
      new: true,
    }).then((product) => {
      res.json({
        mensaje: `El producto: ${product.title} fue actualizado`,
        product,
      });
    });

    /* Si esta el producto en el carrito y quiero sacar */
  } else if (productBuscado && query === "del") {
    body.quantity = body.quantity - 1;

    await Cart.findByIdAndUpdate(productId, body, {
      new: true,
    }).then((product) =>
      res.json({
        mensaje: `El producto: ${product.title} fue actualizado`,
        product,
      })
    );
  } else {
    res.status(400).json({ mensaje: "Ocurrio un error" });
  }
};

export default putProduct;