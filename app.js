require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB:', err);
});

app.use(express.json());

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
});

const Product = mongoose.model('Product', productSchema);

app.get('/', (req, res) => {
    res.send('Welcome to the Product API Server!');
});

// CRUD Endpoints

// get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});


// get a single product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});


// create a new product
app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);

    }catch(err){
        res.status(400).json({ error: 'Failed to create product' });
    }
});


// update a product by ID
app.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!updatedProduct){
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    }catch(err){
        res.status(400).json({ error: 'Failed to update product' });
    }
});


// delete a product by ID
app.delete('/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if(!deletedProduct){
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    }catch(err){
        res.status(500).json({ error: 'Failed to delete product' });
    }
});





app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost: ${PORT}`);
});