"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getMyProducts = exports.getAllProducts = void 0;
const queries = __importStar(require("../db/queries"));
const express_1 = require("@clerk/express");
const getAllProducts = async (req, res) => {
    try {
        const products = await queries.getAllProducts();
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error getting products:", error);
        res.status(500).json({ error: "Failed to get products" });
    }
};
exports.getAllProducts = getAllProducts;
const getMyProducts = async (req, res) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId)
            return res.status(401).json({ error: "UnAuthorized" });
        const products = await queries.getProductByUserId(userId);
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error getting user products:", error);
        res.status(500).json({ error: "Failed to get user products" });
    }
};
exports.getMyProducts = getMyProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await queries.getProductById(id);
        if (!product)
            return res.status(404).json({ error: "Product not found" });
        res.status(200).json(product);
    }
    catch (error) {
        console.error("Error getting product:", error);
        res.status(500).json({ error: "Failed to get product" });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const { title, description, imageUrl } = req.body;
        if (!title || !description || !imageUrl) {
            res.status(400).json({ error: "Title, description and imageUrl are required" });
            return;
        }
        const product = await queries.createProduct({
            title,
            description,
            imageUrl,
            userId,
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const { id } = req.params;
        const { title, description, imageUrl } = req.body;
        const existingProduct = await queries.getProductById(id);
        if (!existingProduct) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        if (existingProduct.userId !== userId) {
            res.status(403).json({ error: "You can only update your own products" });
            ;
            return;
        }
        const product = await queries.updateProduct(id, {
            title,
            description,
            imageUrl,
        });
    }
    catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Failed to update product" });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const { id } = req.params;
        const existingProduct = await queries.getProductById(id);
        if (!existingProduct) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        if (existingProduct.userId !== userId) {
            res.status(403).json({ error: "You can only delete your own products" });
            ;
            return;
        }
        await queries.deleteProduct(id);
        res.status(200).json({ message: "Product deleted Successfully" });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
};
exports.deleteProduct = deleteProduct;
