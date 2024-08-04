import { Router } from "express";
import fs from "fs";
import path from "path";
import __dirname from "../utils.js"; // Importar __dirname desde utils.js

const router = Router();
const productsPath = path.resolve(__dirname, "products.json"); // Ruta dinámica del archivo de productos

// Ruta para listar todos los productos, con opción de limitar el número de resultados
router.get("/", (req, res) => {
  fs.readFile(productsPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo", err);
      return res.status(500).send("Error al leer el archivo de productos");
    }

    let products = JSON.parse(data);
    const limit = parseInt(req.query.limit);

    if (limit && !isNaN(limit)) {
      products = products.slice(0, limit);
    }

    res.json(products);
  });
});

// Ruta para obtener un producto por su id
router.get("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);

  fs.readFile(productsPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo", err);
      return res.status(500).send("Error al leer el archivo de productos");
    }

    const products = JSON.parse(data);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.json(product);
  });
});

// Ruta para agregar un nuevo producto
router.post("/", (req, res) => {
  fs.readFile(productsPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo", err);
      return res.status(500).send("Error al leer el archivo de productos");
    }

    let products = JSON.parse(data);

    const newProduct = req.body;
    newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;

    products.push(newProduct);

    fs.writeFile(productsPath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir en el archivo", err);
        return res.status(500).send("Error al guardar el producto");
      }

      res.status(201).send("Producto agregado correctamente");
    });
  });
});

router.put("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);

  fs.readFile(productsPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo", err);
      return res.status(500).send("Error al leer el archivo de productos");
    }

    let products = JSON.parse(data);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).send("Producto no encontrado");
    }

    const updatedProduct = { ...products[productIndex], ...req.body };
    updatedProduct.id = productId; // Asegurarse de que el ID no se modifique

    products[productIndex] = updatedProduct;

    fs.writeFile(productsPath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error("Error A1", err);
        return res.status(500).send("Error A2");
      }

      res.send("Producto actualizado");
    });
  });
});

// Ruta para eliminar un producto por su id
router.delete("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);

  fs.readFile(productsPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo", err);
      return res.status(500).send("Error al leer el archivo de productos");
    }

    let products = JSON.parse(data);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).send("Producto no encontrado");
    }

    products.splice(productIndex, 1);

    fs.writeFile(productsPath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir en el archivo", err);
        return res.status(500).send("Error al eliminar el producto");
      }

      res.send("Producto eliminado correctamente");
    });
  });
});

export default router;
