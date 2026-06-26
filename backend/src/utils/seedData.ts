import mongoose from 'mongoose';
import connectDB from '../config/db';
import Category from '../models/Category';
import Product from '../models/Product';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('Data cleared.');

    // Seed Admin & Customer Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shophere.com',
      password: hashedPassword,
      role: 'admin',
      phone: '123-456-7890',
      addresses: [
        {
          street: '100 Infinite Loop',
          city: 'Cupertino',
          state: 'CA',
          postalCode: '95014',
          country: 'United States',
          isDefault: true
        }
      ]
    });

    const customerUser = await User.create({
      name: 'John Doe',
      email: 'customer@shophere.com',
      password: hashedPassword,
      role: 'customer',
      phone: '098-765-4321',
      addresses: [
        {
          street: '1600 Amphitheatre Parkway',
          city: 'Mountain View',
          state: 'CA',
          postalCode: '94043',
          country: 'United States',
          isDefault: true
        }
      ]
    });

    console.log('Users seeded.');

    // Seed Categories
    const categoriesData = [
      {
        name: "Men's Clothing",
        slug: 'mens-clothing',
        description: 'Premium collection of mens apparel',
        image: 'https://images.unsplash.com/photo-1552062407-c551eeda4921?w=500&h=500&fit=crop'
      },
      {
        name: "Women's Clothing",
        slug: 'womens-clothing',
        description: 'Stylish collection of womens apparel',
        image: 'https://images.unsplash.com/photo-1595777707802-51b4c3a5aeef?w=500&h=500&fit=crop'
      },
      {
        name: "Kids",
        slug: 'kids',
        description: 'Comfortable and trendy kids clothing',
        image: 'https://images.unsplash.com/photo-1503884917175-897afba6ff30?w=500&h=500&fit=crop'
      },
      {
        name: "Shoes",
        slug: 'shoes',
        description: 'Latest footwear collection',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop'
      },
      {
        name: "Accessories",
        slug: 'accessories',
        description: 'Premium accessories collection',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop'
      },
      {
        name: "Sportswear",
        slug: 'sportswear',
        description: 'Active and performance wear',
        image: 'https://images.unsplash.com/photo-1506629082632-13f3b5e1df3c?w=500&h=500&fit=crop'
      }
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log('Categories seeded.');

    const catMap = new Map(categories.map(c => [c.slug, c._id]));

    // Seed Products
    const productsData = [
      // MEN'S CLOTHING - T-Shirts (5 products)
      {
        name: "Classic Crew Neck T-Shirt",
        description: "Premium quality 100% cotton crew neck t-shirt. Perfect for everyday wear with exceptional comfort and durability.",
        price: 29.99,
        discountPrice: 24.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "T-Shirts",
        stock: 150,
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"
        ],
        rating: 4.5,
        reviewsCount: 89
      },
      {
        name: "V-Neck Premium T-Shirt",
        description: "Elegant v-neck t-shirt made from premium cotton blend. Sleek design suitable for casual and semi-formal occasions.",
        price: 34.99,
        discountPrice: 27.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "T-Shirts",
        stock: 120,
        images: ["https://images.unsplash.com/photo-1548260cc-2151caa16fd9?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 102
      },
      {
        name: "Henley T-Shirt",
        description: "Classic henley style with buttoned placket. Versatile piece that works for layering or worn alone.",
        price: 39.99,
        discountPrice: 31.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "T-Shirts",
        stock: 95,
        images: ["https://images.unsplash.com/photo-1576959375944-66c28c4dc548?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 76
      },
      {
        name: "Graphic Print T-Shirt",
        description: "Trendy graphic print t-shirt with high-quality design. Express your style with our collection of unique designs.",
        price: 32.99,
        discountPrice: 25.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "T-Shirts",
        stock: 200,
        images: ["https://images.unsplash.com/photo-1503272584311-c55b6b142e11?w=500&h=500&fit=crop"],
        rating: 4.4,
        reviewsCount: 145
      },
      {
        name: "Polo T-Shirt",
        description: "Classic polo shirt perfect for both casual and business casual settings. Made from breathable cotton.",
        price: 44.99,
        discountPrice: 35.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "T-Shirts",
        stock: 110,
        images: ["https://images.unsplash.com/photo-1591883088099-43e2a9d0e657?w=500&h=500&fit=crop"],
        rating: 4.8,
        reviewsCount: 203
      },

      // MEN'S CLOTHING - Shirts (5 products)
      {
        name: "Oxford Button-Down Shirt",
        description: "Timeless oxford cloth button-down shirt. Perfect for office wear or casual outings. Premium quality fabric.",
        price: 69.99,
        discountPrice: 54.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "Shirts",
        stock: 85,
        images: ["https://images.unsplash.com/photo-1596178065887-8f3341c3f86b?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 156
      },
      {
        name: "Casual Flannel Shirt",
        description: "Comfortable flannel shirt ideal for outdoor activities and casual wear. Brushed cotton fabric for warmth.",
        price: 49.99,
        discountPrice: 39.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "Shirts",
        stock: 120,
        images: ["https://images.unsplash.com/photo-1598070330210-20f1f9c7a9f0?w=500&h=500&fit=crop"],
        rating: 4.5,
        reviewsCount: 98
      },
      {
        name: "Denim Shirt",
        description: "Rugged denim shirt suitable for layering or wearing alone. Classic Western style with durability.",
        price: 59.99,
        discountPrice: 47.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "Shirts",
        stock: 95,
        images: ["https://images.unsplash.com/photo-1559856788-ef16ae64d3c2?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 112
      },
      {
        name: "Linen Casual Shirt",
        description: "Lightweight linen shirt perfect for summer. Breathable fabric keeps you cool and comfortable.",
        price: 54.99,
        discountPrice: 43.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "Shirts",
        stock: 110,
        images: ["https://images.unsplash.com/photo-1608531476202-87c6de88c869?w=500&h=500&fit=crop"],
        rating: 4.4,
        reviewsCount: 87
      },
      {
        name: "Checkered Dress Shirt",
        description: "Elegant checkered pattern dress shirt. Suitable for formal occasions and business meetings.",
        price: 74.99,
        discountPrice: 59.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "Shirts",
        stock: 75,
        images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop"],
        rating: 4.8,
        reviewsCount: 134
      },

      // MEN'S CLOTHING - Jeans (5 products)
      {
        name: "Classic Blue Denim Jeans",
        description: "Timeless blue denim jeans with perfect fit and comfort. Suitable for any occasion.",
        price: 69.99,
        discountPrice: 54.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "Jeans",
        stock: 180,
        images: ["https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 267
      },
      {
        name: "Slim Fit Black Jeans",
        description: "Modern slim fit black jeans. Perfect for a sleek and contemporary look.",
        price: 64.99,
        discountPrice: 51.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "Jeans",
        stock: 160,
        images: ["https://images.unsplash.com/photo-1542260408-7cffcfa268e0?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 189
      },
      {
        name: "Distressed Ripped Jeans",
        description: "Trendy distressed jeans with strategic rips. Makes a bold fashion statement.",
        price: 59.99,
        discountPrice: 47.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "Jeans",
        stock: 120,
        images: ["https://images.unsplash.com/photo-1604829a85500-4c17d331c77c?w=500&h=500&fit=crop"],
        rating: 4.5,
        reviewsCount: 143
      },
      {
        name: "Straight Leg Work Jeans",
        description: "Durable straight leg jeans designed for work and outdoor activities. Heavy-duty denim.",
        price: 74.99,
        discountPrice: 59.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "Jeans",
        stock: 95,
        images: ["https://images.unsplash.com/photo-1542374318-f83c18e61dda?w=500&h=500&fit=crop"],
        rating: 4.8,
        reviewsCount: 156
      },
      {
        name: "Skinny Fit Jeans",
        description: "Contemporary skinny fit jeans. Tapered leg design for a modern silhouette.",
        price: 54.99,
        discountPrice: 43.99,
        category: catMap.get('mens-clothing')!,
        subcategory: "Jeans",
        stock: 140,
        images: ["https://images.unsplash.com/photo-1543590149-8e0302a4d310?w=500&h=500&fit=crop"],
        rating: 4.4,
        reviewsCount: 112
      },

      // WOMEN'S CLOTHING - Dresses (5 products)
      {
        name: "Summer Casual Dress",
        description: "Light and breezy casual dress perfect for warm weather. Easy to style and comfortable.",
        price: 49.99,
        discountPrice: 39.99,
        category: catMap.get('womens-clothing')!,
        subcategory: "Dresses",
        stock: 140,
        images: ["https://images.unsplash.com/photo-1572804419425-e33eb04f0ce7?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 178
      },
      {
        name: "Elegant Evening Dress",
        description: "Sophisticated evening dress suitable for special occasions. Premium fabric with elegant design.",
        price: 129.99,
        discountPrice: 99.99,
        category: catMap.get('womens-clothing')!,
        subcategory: "Dresses",
        stock: 65,
        images: ["https://images.unsplash.com/photo-1595777707802-51b4c3a5aeef?w=500&h=500&fit=crop"],
        rating: 4.9,
        reviewsCount: 234
      },
      {
        name: "Midi Wrap Dress",
        description: "Versatile midi wrap dress that flatters all body types. Perfect for casual or business casual.",
        price: 59.99,
        discountPrice: 47.99,
        category: catMap.get('womens-clothing')!,
        subcategory: "Dresses",
        stock: 110,
        images: ["https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 145
      },
      {
        name: "Striped Shirt Dress",
        description: "Classic striped shirt dress. Can be worn as a dress or shirt. Incredibly versatile.",
        price: 69.99,
        discountPrice: 54.99,
        category: catMap.get('womens-clothing')!,
        subcategory: "Dresses",
        stock: 125,
        images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop"],
        rating: 4.5,
        reviewsCount: 98
      },
      {
        name: "Bodycon Pencil Dress",
        description: "Sleek bodycon dress with a flattering silhouette. Perfect for date night or club wear.",
        price: 54.99,
        discountPrice: 43.99,
        category: catMap.get('womens-clothing')!,
        subcategory: "Dresses",
        stock: 85,
        images: ["https://images.unsplash.com/photo-1566683857616-ec6b9f7c8a0f?w=500&h=500&fit=crop"],
        rating: 4.4,
        reviewsCount: 132
      },

      // WOMEN'S CLOTHING - Tops (5 products)
      {
        name: "Basic Tank Top",
        description: "Versatile basic tank top in premium cotton. Wardrobe essential for layering.",
        price: 19.99,
        discountPrice: 14.99,
        category: catMap.get('womens-clothing')!,
        subcategory: "Tops",
        stock: 250,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop"],
        rating: 4.5,
        reviewsCount: 267
      },
      {
        name: "Silk Camisole",
        description: "Luxurious silk camisole perfect for dressing up or lounging. Smooth and comfortable.",
        price: 44.99,
        discountPrice: 35.99,
        category: catMap.get('womens-clothing')!,
        subcategory: "Tops",
        stock: 95,
        images: ["https://images.unsplash.com/photo-1548260cc-2151caa16fd9?w=500&h=500&fit=crop"],
        rating: 4.8,
        reviewsCount: 143
      },
      {
        name: "Crop Top",
        description: "Trendy crop top perfect for summer and casual outings. Comes in various styles.",
        price: 29.99,
        discountPrice: 23.99,
        category: catMap.get('womens-clothing')!,
        subcategory: "Tops",
        stock: 160,
        images: ["https://images.unsplash.com/photo-1590080876186-e41d1b4a59eb?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 189
      },
      {
        name: "Turtleneck Long Sleeve Top",
        description: "Cozy turtleneck top ideal for fall and winter. Soft and warm fabric.",
        price: 39.99,
        discountPrice: 31.99,
        category: catMap.get('womens-clothing')!,
        subcategory: "Tops",
        stock: 120,
        images: ["https://images.unsplash.com/photo-1592652622496-92e567bde722?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 156
      },
      {
        name: "Off-Shoulder Top",
        description: "Stylish off-shoulder top that shows a hint of sophistication. Perfect for casual dates.",
        price: 34.99,
        discountPrice: 27.99,
        category: catMap.get('womens-clothing')!,
        subcategory: "Tops",
        stock: 105,
        images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop"],
        rating: 4.5,
        reviewsCount: 123
      },

      // KIDS (5 products)
      {
        name: "Kids Denim Jacket",
        description: "Classic stretch denim jacket for kids. Durable and fashionable layer for cool days.",
        price: 39.99,
        discountPrice: 31.99,
        category: catMap.get('kids')!,
        subcategory: "Jackets",
        stock: 90,
        images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 42
      },
      {
        name: "Kids Printed Hoodie",
        description: "Cozy cotton fleece hoodie with playful graphics. Perfect everyday sweater for active kids.",
        price: 34.99,
        discountPrice: 27.99,
        category: catMap.get('kids')!,
        subcategory: "Sweaters",
        stock: 110,
        images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&h=500&fit=crop"],
        rating: 4.5,
        reviewsCount: 38
      },
      {
        name: "Kids Cotton T-Shirt",
        description: "Breathable 100% organic cotton t-shirt with flatlock seams to prevent irritation.",
        price: 19.99,
        discountPrice: 14.99,
        category: catMap.get('kids')!,
        subcategory: "T-Shirts",
        stock: 160,
        images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 65
      },
      {
        name: "Kids Casual Shorts",
        description: "Easy pull-on shorts with an elastic drawstring waist. Lightweight and durable cotton canvas.",
        price: 24.99,
        discountPrice: 19.99,
        category: catMap.get('kids')!,
        subcategory: "Shorts",
        stock: 105,
        images: ["https://images.unsplash.com/photo-1519238383828-11df59a44f6b?w=500&h=500&fit=crop"],
        rating: 4.4,
        reviewsCount: 29
      },
      {
        name: "Kids Floral Summer Dress",
        description: "A-line sleeveless summer cotton dress with beautiful floral print details.",
        price: 29.99,
        discountPrice: 24.99,
        category: catMap.get('kids')!,
        subcategory: "Dresses",
        stock: 85,
        images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&h=500&fit=crop"],
        rating: 4.8,
        reviewsCount: 51
      },

      // SHOES - Sneakers (5 products)
      {
        name: "Classic White Sneakers",
        description: "Timeless white sneakers that go with everything. Comfortable for everyday wear.",
        price: 79.99,
        discountPrice: 63.99,
        category: catMap.get('shoes')!,
        subcategory: "Sneakers",
        stock: 200,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 312
      },
      {
        name: "High-Top Basketball Sneakers",
        description: "Premium basketball sneakers with ankle support. Ideal for sports and casual wear.",
        price: 119.99,
        discountPrice: 95.99,
        category: catMap.get('shoes')!,
        subcategory: "Sneakers",
        stock: 145,
        images: ["https://images.unsplash.com/photo-1595348440529-576f5c6238cc?w=500&h=500&fit=crop"],
        rating: 4.8,
        reviewsCount: 267
      },
      {
        name: "Running Sneakers",
        description: "Lightweight running sneakers with excellent cushioning. Perfect for jogging and gym.",
        price: 99.99,
        discountPrice: 79.99,
        category: catMap.get('shoes')!,
        subcategory: "Sneakers",
        stock: 170,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 234
      },
      {
        name: "Slip-On Canvas Sneakers",
        description: "Casual slip-on sneakers made from canvas. Easy to wear and super comfortable.",
        price: 59.99,
        discountPrice: 47.99,
        category: catMap.get('shoes')!,
        subcategory: "Sneakers",
        stock: 190,
        images: ["https://images.unsplash.com/photo-1560343676-04071c5f467b?w=500&h=500&fit=crop"],
        rating: 4.5,
        reviewsCount: 189
      },
      {
        name: "Women's Fashion Sneakers",
        description: "Stylish women's sneakers combining fashion and comfort. Perfect for all-day wear.",
        price: 74.99,
        discountPrice: 59.99,
        category: catMap.get('shoes')!,
        subcategory: "Sneakers",
        stock: 155,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 201
      },

      // SHOES - Formal Shoes (5 products)
      {
        name: "Black Oxford Dress Shoes",
        description: "Classic black oxford shoes perfect for formal occasions and business meetings.",
        price: 129.99,
        discountPrice: 103.99,
        category: catMap.get('shoes')!,
        subcategory: "Formal",
        stock: 85,
        images: ["https://images.unsplash.com/photo-1543163521-9145f931371e?w=500&h=500&fit=crop"],
        rating: 4.8,
        reviewsCount: 178
      },
      {
        name: "Leather Loafers",
        description: "Comfortable leather loafers suitable for both casual and formal settings.",
        price: 114.99,
        discountPrice: 91.99,
        category: catMap.get('shoes')!,
        subcategory: "Formal",
        stock: 110,
        images: ["https://images.unsplash.com/photo-1543163521-9145f931371e?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 145
      },
      {
        name: "Monk Strap Shoes",
        description: "Elegant monk strap shoes with adjustable fit. Perfect for business casual.",
        price: 139.99,
        discountPrice: 111.99,
        category: catMap.get('shoes')!,
        subcategory: "Formal",
        stock: 70,
        images: ["https://images.unsplash.com/photo-1543163521-9145f931371e?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 112
      },
      {
        name: "Women's Heeled Pumps",
        description: "Elegant heeled pumps for formal events. Comfortable with good arch support.",
        price: 99.99,
        discountPrice: 79.99,
        category: catMap.get('shoes')!,
        subcategory: "Formal",
        stock: 95,
        images: ["https://images.unsplash.com/photo-1543163521-9145f931371e?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 156
      },
      {
        name: "Chelsea Boots",
        description: "Chelsea boots suitable for various occasions. Premium leather construction.",
        price: 149.99,
        discountPrice: 119.99,
        category: catMap.get('shoes')!,
        subcategory: "Formal",
        stock: 80,
        images: ["https://images.unsplash.com/photo-1543163521-9145f931371e?w=500&h=500&fit=crop"],
        rating: 4.8,
        reviewsCount: 189
      },

      // SHOES - Casual Shoes (5 products)
      {
        name: "Canvas Casual Shoes",
        description: "Lightweight canvas shoes perfect for casual outings. Available in multiple colors.",
        price: 49.99,
        discountPrice: 39.99,
        category: catMap.get('shoes')!,
        subcategory: "Casual",
        stock: 200,
        images: ["https://images.unsplash.com/photo-1540034519387-ed03d5e7a840?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 234
      },
      {
        name: "Suede Desert Boots",
        description: "Classic suede desert boots with crepe rubber sole. Timeless casual style.",
        price: 104.99,
        discountPrice: 83.99,
        category: catMap.get('shoes')!,
        subcategory: "Casual",
        stock: 120,
        images: ["https://images.unsplash.com/photo-1540034519387-ed03d5e7a840?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 167
      },
      {
        name: "Boat Shoes",
        description: "Comfortable boat shoes perfect for seaside or casual everyday wear.",
        price: 79.99,
        discountPrice: 63.99,
        category: catMap.get('shoes')!,
        subcategory: "Casual",
        stock: 140,
        images: ["https://images.unsplash.com/photo-1540034519387-ed03d5e7a840?w=500&h=500&fit=crop"],
        rating: 4.5,
        reviewsCount: 145
      },
      {
        name: "Flip Flops Sandals",
        description: "Comfortable flip flops perfect for beach or home wear. Available in many colors.",
        price: 24.99,
        discountPrice: 19.99,
        category: catMap.get('shoes')!,
        subcategory: "Casual",
        stock: 300,
        images: ["https://images.unsplash.com/photo-1540034519387-ed03d5e7a840?w=500&h=500&fit=crop"],
        rating: 4.4,
        reviewsCount: 312
      },
      {
        name: "Leather Slip-On Shoes",
        description: "Easy to wear leather slip-on shoes. Perfect for casual or semi-formal occasions.",
        price: 89.99,
        discountPrice: 71.99,
        category: catMap.get('shoes')!,
        subcategory: "Casual",
        stock: 110,
        images: ["https://images.unsplash.com/photo-1540034519387-ed03d5e7a840?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 134
      },

      // ACCESSORIES (10 products)
      {
        name: "Classic Leather Belt",
        description: "Premium leather belt suitable for both casual and formal wear.",
        price: 44.99,
        discountPrice: 35.99,
        category: catMap.get('accessories')!,
        subcategory: "Belts",
        stock: 150,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 123
      },
      {
        name: "Digital Watch",
        description: "Stylish digital watch with multiple functions. Great gift option.",
        price: 59.99,
        discountPrice: 47.99,
        category: catMap.get('accessories')!,
        subcategory: "Watches",
        stock: 100,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 156
      },
      {
        name: "Analog Wrist Watch",
        description: "Classic analog watch with leather strap. Timeless accessory for any occasion.",
        price: 79.99,
        discountPrice: 63.99,
        category: catMap.get('accessories')!,
        subcategory: "Watches",
        stock: 85,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"],
        rating: 4.8,
        reviewsCount: 189
      },
      {
        name: "Wool Knit Scarf",
        description: "Warm and cozy wool scarf perfect for winter. Available in multiple colors.",
        price: 34.99,
        discountPrice: 27.99,
        category: catMap.get('accessories')!,
        subcategory: "Scarves",
        stock: 120,
        images: ["https://images.unsplash.com/photo-1559856788-ef16ae64d3c2?w=500&h=500&fit=crop"],
        rating: 4.5,
        reviewsCount: 98
      },
      {
        name: "Silk Scarf",
        description: "Luxurious silk scarf adds elegance to any outfit. Soft and smooth.",
        price: 64.99,
        discountPrice: 51.99,
        category: catMap.get('accessories')!,
        subcategory: "Scarves",
        stock: 75,
        images: ["https://images.unsplash.com/photo-1559856788-ef16ae64d3c2?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 112
      },
      {
        name: "Baseball Cap",
        description: "Classic baseball cap for casual wear. Available in various colors.",
        price: 24.99,
        discountPrice: 19.99,
        category: catMap.get('accessories')!,
        subcategory: "Caps",
        stock: 200,
        images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop"],
        rating: 4.4,
        reviewsCount: 145
      },
      {
        name: "Beanie Hat",
        description: "Warm and stylish beanie perfect for cold weather. Cozy fit.",
        price: 29.99,
        discountPrice: 23.99,
        category: catMap.get('accessories')!,
        subcategory: "Caps",
        stock: 160,
        images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop"],
        rating: 4.5,
        reviewsCount: 134
      },
      {
        name: "Leather Messenger Bag",
        description: "Durable leather messenger bag perfect for work or travel. Multiple compartments.",
        price: 119.99,
        discountPrice: 95.99,
        category: catMap.get('accessories')!,
        subcategory: "Bags",
        stock: 60,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 167
      },
      {
        name: "Canvas Backpack",
        description: "Lightweight canvas backpack ideal for daily use or travel. Comfortable straps.",
        price: 69.99,
        discountPrice: 55.99,
        category: catMap.get('accessories')!,
        subcategory: "Bags",
        stock: 140,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 189
      },
      {
        name: "Sunglasses",
        description: "Stylish sunglasses with UV protection. Perfect for sunny days.",
        price: 54.99,
        discountPrice: 43.99,
        category: catMap.get('accessories')!,
        subcategory: "Eyewear",
        stock: 180,
        images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop"],
        rating: 4.5,
        reviewsCount: 201
      },

      // SPORTSWEAR (10 products)
      {
        name: "Performance Athletic T-Shirt",
        description: "Moisture-wicking athletic t-shirt perfect for workouts and sports.",
        price: 39.99,
        discountPrice: 31.99,
        category: catMap.get('sportswear')!,
        subcategory: "Activewear",
        stock: 150,
        images: ["https://images.unsplash.com/photo-1506629082632-13f3b5e1df3c?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 234
      },
      {
        name: "Yoga Leggings",
        description: "Comfortable yoga leggings with high waist and pockets. Perfect for yoga and gym.",
        price: 69.99,
        discountPrice: 55.99,
        category: catMap.get('sportswear')!,
        subcategory: "Activewear",
        stock: 120,
        images: ["https://images.unsplash.com/photo-1506629082632-13f3b5e1df3c?w=500&h=500&fit=crop"],
        rating: 4.8,
        reviewsCount: 267
      },
      {
        name: "Sports Bra",
        description: "High-impact sports bra with excellent support. Ideal for intense workouts.",
        price: 49.99,
        discountPrice: 39.99,
        category: catMap.get('sportswear')!,
        subcategory: "Activewear",
        stock: 130,
        images: ["https://images.unsplash.com/photo-1506629082632-13f3b5e1df3c?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 189
      },
      {
        name: "Running Shorts",
        description: "Lightweight running shorts with moisture-wicking technology and pockets.",
        price: 44.99,
        discountPrice: 35.99,
        category: catMap.get('sportswear')!,
        subcategory: "Activewear",
        stock: 140,
        images: ["https://images.unsplash.com/photo-1506629082632-13f3b5e1df3c?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 156
      },
      {
        name: "Gym Hoodie",
        description: "Comfortable gym hoodie with drawstring and kangaroo pocket. Perfect for warm-ups.",
        price: 59.99,
        discountPrice: 47.99,
        category: catMap.get('sportswear')!,
        subcategory: "Activewear",
        stock: 110,
        images: ["https://images.unsplash.com/photo-1506629082632-13f3b5e1df3c?w=500&h=500&fit=crop"],
        rating: 4.5,
        reviewsCount: 145
      },
      {
        name: "Compression Tights",
        description: "Compression tights for better muscle support and recovery. Great for running.",
        price: 79.99,
        discountPrice: 63.99,
        category: catMap.get('sportswear')!,
        subcategory: "Activewear",
        stock: 95,
        images: ["https://images.unsplash.com/photo-1506629082632-13f3b5e1df3c?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 178
      },
      {
        name: "Tank Top with Built-in Bra",
        description: "All-in-one tank top with built-in support. Perfect for high-impact activities.",
        price: 54.99,
        discountPrice: 43.99,
        category: catMap.get('sportswear')!,
        subcategory: "Activewear",
        stock: 115,
        images: ["https://images.unsplash.com/photo-1506629082632-13f3b5e1df3c?w=500&h=500&fit=crop"],
        rating: 4.6,
        reviewsCount: 134
      },
      {
        name: "Cycling Jersey",
        description: "Aerodynamic cycling jersey with moisture-wicking fabric. Multiple pockets.",
        price: 64.99,
        discountPrice: 51.99,
        category: catMap.get('sportswear')!,
        subcategory: "Sports",
        stock: 80,
        images: ["https://images.unsplash.com/photo-1506629082632-13f3b5e1df3c?w=500&h=500&fit=crop"],
        rating: 4.7,
        reviewsCount: 112
      },
      {
        name: "Swim Trunks",
        description: "Quick-dry swim trunks perfect for beach and pool. Comfortable fit.",
        price: 44.99,
        discountPrice: 35.99,
        category: catMap.get('sportswear')!,
        subcategory: "Sports",
        stock: 170,
        images: ["https://images.unsplash.com/photo-1506629082632-13f3b5e1df3c?w=500&h=500&fit=crop"],
        rating: 4.5,
        reviewsCount: 167
      },
      {
        name: "Sports Jacket",
        description: "Lightweight sports jacket perfect for warm-ups or cool weather activities.",
        price: 89.99,
        discountPrice: 71.99,
        category: catMap.get('sportswear')!,
        subcategory: "Sports",
        stock: 75,
        images: ["https://images.unsplash.com/photo-1506629082632-13f3b5e1df3c?w=500&h=500&fit=crop"],
        rating: 4.8,
        reviewsCount: 145
      }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`Seeded ${createdProducts.length} products successfully.`);

    console.log('Database seeding successfully completed.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seed();
