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
        image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&h=500&fit=crop'
      },
      {
        name: "Women's Clothing",
        slug: 'womens-clothing',
        description: 'Stylish collection of womens apparel',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&h=500&fit=crop'
      },
      {
        name: "Kids",
        slug: 'kids',
        description: 'Comfortable and trendy kids clothing',
        image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&h=500&fit=crop'
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
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&h=500&fit=crop'
      }
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log('Categories seeded.');

    const catMap = new Map(categories.map(c => [c.slug, c._id]));

    // Seed Products
    const productsData = [
      {
        name: "Men High Neck T-shirt",
        description: "Premium Men High Neck T-shirt from Roadster Life Co. Crafted from soft cotton fabric for optimal all-day comfort and athletic styling.",
        price: 1299,
        discountPrice: 999,
        category: catMap.get('mens-clothing')!,
        subcategory: "T-Shirts",
        stock: 100,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/MAY/27/9qUmviFk_e6f5f222fc814339a8e5484f79690c52.jpg"],
        rating: 4.5,
        reviewsCount: 80
      },
      {
        name: "Men High Neck T-shirt",
        description: "Premium Men High Neck T-shirt from Roadster Life Co. Crafted from soft cotton fabric for optimal all-day comfort and athletic styling.",
        price: 1399,
        discountPrice: 1099,
        category: catMap.get('mens-clothing')!,
        subcategory: "T-Shirts",
        stock: 110,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/MAY/27/03hYV2TL_3db618d991f647e48cfd2211cc9e1115.jpg"],
        rating: 4.6,
        reviewsCount: 92
      },
      {
        name: "Men T-shirt",
        description: "Premium Men T-shirt from Roadster Life Co. Crafted from soft cotton fabric for optimal all-day comfort and athletic styling.",
        price: 1499,
        discountPrice: 1199,
        category: catMap.get('mens-clothing')!,
        subcategory: "T-Shirts",
        stock: 120,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/MAY/27/ybmD0M46_9b9c3c47b36d45f0b01e1b5f0e120e25.jpg"],
        rating: 4.7,
        reviewsCount: 104
      },
      {
        name: "Men T-shirt",
        description: "Premium Men T-shirt from Roadster Life Co. Crafted from soft cotton fabric for optimal all-day comfort and athletic styling.",
        price: 1599,
        discountPrice: 1299,
        category: catMap.get('mens-clothing')!,
        subcategory: "T-Shirts",
        stock: 130,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/MAY/27/c610sI4Z_bce6da8069244442b556109cdf0bebf8.jpg"],
        rating: 4.8,
        reviewsCount: 116
      },
      {
        name: "Men High Neck T-shirt",
        description: "Premium Men High Neck T-shirt from Roadster Life Co. Crafted from soft cotton fabric for optimal all-day comfort and athletic styling.",
        price: 1699,
        discountPrice: 1399,
        category: catMap.get('mens-clothing')!,
        subcategory: "T-Shirts",
        stock: 140,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/MAY/27/9qUmviFk_e6f5f222fc814339a8e5484f79690c52.jpg"],
        rating: 4.9,
        reviewsCount: 128
      },
      {
        name: "Men Self-Striped Pullover",
        description: "Cozy premium men self-striped pullover by Roadster. Beautiful knit texture with comfortable stretch fit, perfect for layering.",
        price: 2499,
        discountPrice: 1999,
        category: catMap.get('mens-clothing')!,
        subcategory: "Shirts",
        stock: 80,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/14320068/2021/8/26/95103e09-8da6-4df2-9256-23032d4add461629954610060-Roadster-Men-Sweaters-5701629954609372-1.jpg"],
        rating: 4.4,
        reviewsCount: 95
      },
      {
        name: "Melange Effect Pullover",
        description: "Cozy premium melange effect pullover by Roadster. Beautiful knit texture with comfortable stretch fit, perfect for layering.",
        price: 2699,
        discountPrice: 2149,
        category: catMap.get('mens-clothing')!,
        subcategory: "Shirts",
        stock: 95,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/29998230/2024/11/18/14bd30dd-c22f-405c-9d07-7793792731951731926333520-Roadster-Men-Sweaters-3981731926332930-1.jpg"],
        rating: 4.5,
        reviewsCount: 103
      },
      {
        name: "Men Pullover",
        description: "Cozy premium men pullover by Roadster. Beautiful knit texture with comfortable stretch fit, perfect for layering.",
        price: 2899,
        discountPrice: 2299,
        category: catMap.get('mens-clothing')!,
        subcategory: "Shirts",
        stock: 110,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/14320088/2021/7/16/0288c719-10ef-4fca-9ce8-1d4bab317b4b1626430264579-Roadster-Men-Black-Pullover-1461626430264119-1.jpg"],
        rating: 4.6000000000000005,
        reviewsCount: 111
      },
      {
        name: "Turtle Neck Pullover",
        description: "Cozy premium turtle neck pullover by Roadster. Beautiful knit texture with comfortable stretch fit, perfect for layering.",
        price: 3099,
        discountPrice: 2449,
        category: catMap.get('mens-clothing')!,
        subcategory: "Shirts",
        stock: 125,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/30678859/2024/9/4/b4b28351-2810-4c06-8bce-bb4468f381361725434833496-Roadster-Men-Sweaters-3401725434832986-1.jpg"],
        rating: 4.7,
        reviewsCount: 119
      },
      {
        name: "Solid Cardigan",
        description: "Cozy premium solid cardigan by Roadster. Beautiful knit texture with comfortable stretch fit, perfect for layering.",
        price: 3299,
        discountPrice: 2599,
        category: catMap.get('mens-clothing')!,
        subcategory: "Shirts",
        stock: 140,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/23070586/2023/9/6/51e5cb2c-9611-4211-aeb2-63c6d3870c8c1693993380819-Roadster-Men-Brown-Ribbed-61693993380297-1.jpg"],
        rating: 4.800000000000001,
        reviewsCount: 127
      },
      {
        name: "Men Pure Cotton Jeans",
        description: "Premium regular fit men pure cotton jeans designed by Roadster. Classic structure, durable fabric, and comfortable waist fit.",
        price: 3499,
        discountPrice: 2799,
        category: catMap.get('mens-clothing')!,
        subcategory: "Jeans",
        stock: 120,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/28749636/2025/4/19/49f549c4-84de-4dfd-a1cd-b04613c71b151745001139077-The-Roadster-Lifestyle-Co-Men-Beige-Pure-Cotton-Rigid-Baggy--1.jpg"],
        rating: 4.6,
        reviewsCount: 150
      },
      {
        name: "Relaxed-Fit Regular Trousers",
        description: "Premium regular fit relaxed-fit regular trousers designed by Roadster. Classic structure, durable fabric, and comfortable waist fit.",
        price: 3299,
        discountPrice: 2649,
        category: catMap.get('mens-clothing')!,
        subcategory: "Jeans",
        stock: 110,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/30063129/2024/6/28/dfdba33f-44c6-4dd3-b8f0-0966f8e7e1841719563300433TheRoadsterLifestyleCoLinenRelaxed-FitRegularTrousers1.jpg"],
        rating: 4.699999999999999,
        reviewsCount: 175
      },
      {
        name: "Relaxed-Fit Regular Trousers",
        description: "Premium regular fit relaxed-fit regular trousers designed by Roadster. Classic structure, durable fabric, and comfortable waist fit.",
        price: 3099,
        discountPrice: 2499,
        category: catMap.get('mens-clothing')!,
        subcategory: "Jeans",
        stock: 100,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/30063126/2024/6/28/7acc3d10-9dc7-44ee-9aea-a725d1499abb1719561316991TheRoadsterLifestyleCoLinenRelaxed-FitRegularTrousers1.jpg"],
        rating: 4.8,
        reviewsCount: 200
      },
      {
        name: "Relaxed-Fit Regular Trousers",
        description: "Premium regular fit relaxed-fit regular trousers designed by Roadster. Classic structure, durable fabric, and comfortable waist fit.",
        price: 2899,
        discountPrice: 2349,
        category: catMap.get('mens-clothing')!,
        subcategory: "Jeans",
        stock: 90,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/30063124/2024/6/28/af6c493c-30ec-450e-b588-e565911532a81719562420746TheRoadsterLifestyleCoLinenRelaxed-FitRegularTrousers1.jpg"],
        rating: 4.6,
        reviewsCount: 225
      },
      {
        name: "Men Relaxed Fit Trousers",
        description: "Premium regular fit men relaxed fit trousers designed by Roadster. Classic structure, durable fabric, and comfortable waist fit.",
        price: 2699,
        discountPrice: 2199,
        category: catMap.get('mens-clothing')!,
        subcategory: "Jeans",
        stock: 80,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/30063122/2024/6/28/544f7640-07e8-4fb0-b9fd-e865e400e32f1719575123653TheRoadsterLifestyleCoMenRelaxedFitLinenTrousers1.jpg"],
        rating: 4.699999999999999,
        reviewsCount: 250
      },
      {
        name: "Print Sheath Mini Dress",
        description: "Elegant high-fashion print sheath mini dress from ONLY. Tailored fit, premium finish, and sleek silhouette designed to wow.",
        price: 4999,
        discountPrice: 3999,
        category: catMap.get('womens-clothing')!,
        subcategory: "Dresses",
        stock: 75,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/JANUARY/8/ezztmrlz_db655256d0374fb69b636b6c9ec5d9aa.jpg"],
        rating: 4.5,
        reviewsCount: 120
      },
      {
        name: "Single Breasted Tailored-Fit Blazer",
        description: "Elegant high-fashion single breasted tailored-fit blazer from ONLY. Tailored fit, premium finish, and sleek silhouette designed to wow.",
        price: 5499,
        discountPrice: 4399,
        category: catMap.get('womens-clothing')!,
        subcategory: "Dresses",
        stock: 83,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/JUNE/21/UWA43PWF_5900267673904a57b5a2d9ad23e0df8f.jpg"],
        rating: 4.6,
        reviewsCount: 135
      },
      {
        name: "Notched Lapel Collar Tailored-Fit Double-Breasted Blazer",
        description: "Elegant high-fashion notched lapel collar tailored-fit double-breasted blazer from ONLY. Tailored fit, premium finish, and sleek silhouette designed to wow.",
        price: 5999,
        discountPrice: 4799,
        category: catMap.get('womens-clothing')!,
        subcategory: "Dresses",
        stock: 91,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/27816610/2024/2/23/33f797b6-379b-4e5d-929e-8614f7bce3e61708673303448ONLYWhiteDoubleBreastedBlazer6.jpg"],
        rating: 4.7,
        reviewsCount: 150
      },
      {
        name: "Women Ribbed Pullover with Fuzzy Detail",
        description: "Elegant high-fashion women ribbed pullover with fuzzy detail from ONLY. Tailored fit, premium finish, and sleek silhouette designed to wow.",
        price: 6499,
        discountPrice: 5199,
        category: catMap.get('womens-clothing')!,
        subcategory: "Dresses",
        stock: 99,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2024/NOVEMBER/5/hICF9Ci9_36ca1d53f2484667be8d1b51640d9f75.jpg"],
        rating: 4.8,
        reviewsCount: 165
      },
      {
        name: "Women Self Design Boat Neck Pullover",
        description: "Elegant high-fashion women self design boat neck pullover from ONLY. Tailored fit, premium finish, and sleek silhouette designed to wow.",
        price: 6999,
        discountPrice: 5599,
        category: catMap.get('womens-clothing')!,
        subcategory: "Dresses",
        stock: 107,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/OCTOBER/3/Wh3HSRUt_48d7e94bd6d74d07b66ff435bb752316.jpg"],
        rating: 4.9,
        reviewsCount: 180
      },
      {
        name: "Striped Crop Top",
        description: "Chic and versatile striped crop top from ONLY. Made from high-quality lightweight cotton blend for a perfect daily fit.",
        price: 1699,
        discountPrice: 1299,
        category: catMap.get('womens-clothing')!,
        subcategory: "Tops",
        stock: 150,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/JANUARY/23/gd4EWOdq_f834cbb4e0834132965bda70e9986cc3.jpg"],
        rating: 4.6,
        reviewsCount: 180
      },
      {
        name: "Striped Crop Top",
        description: "Chic and versatile striped crop top from ONLY. Made from high-quality lightweight cotton blend for a perfect daily fit.",
        price: 1799,
        discountPrice: 1399,
        category: catMap.get('womens-clothing')!,
        subcategory: "Tops",
        stock: 140,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/JANUARY/23/muWagagY_947b014ce2e840ecbdcd7896f5aa1a3b.jpg"],
        rating: 4.699999999999999,
        reviewsCount: 200
      },
      {
        name: "Cotton Crop Top",
        description: "Chic and versatile cotton crop top from ONLY. Made from high-quality lightweight cotton blend for a perfect daily fit.",
        price: 1899,
        discountPrice: 1499,
        category: catMap.get('womens-clothing')!,
        subcategory: "Tops",
        stock: 130,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/MARCH/13/mR0Rjmfi_63abd57d3f364bf592a074ee1f42c4db.jpg"],
        rating: 4.8,
        reviewsCount: 220
      },
      {
        name: "Tank Crop Top",
        description: "Chic and versatile tank crop top from ONLY. Made from high-quality lightweight cotton blend for a perfect daily fit.",
        price: 1999,
        discountPrice: 1599,
        category: catMap.get('womens-clothing')!,
        subcategory: "Tops",
        stock: 120,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2024/AUGUST/15/exbfEQTY_2c12707a0af243c2ac365e71d6bca5ca.jpg"],
        rating: 4.8999999999999995,
        reviewsCount: 240
      },
      {
        name: "Tank Top",
        description: "Chic and versatile tank top from ONLY. Made from high-quality lightweight cotton blend for a perfect daily fit.",
        price: 2099,
        discountPrice: 1699,
        category: catMap.get('womens-clothing')!,
        subcategory: "Tops",
        stock: 110,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/MARCH/3/gyAyotgh_08f7c70c17744ea79ba8118bcc9f78db.jpg"],
        rating: 4.6,
        reviewsCount: 260
      },
      {
        name: "Boys Pack of 6 Assorted Trunks",
        description: "Fun and comfortable boys pack of 6 assorted trunks for kids by Bodycare Kids. Breathable fabric, soft seams, and playful style.",
        price: 1299,
        discountPrice: 999,
        category: catMap.get('kids')!,
        subcategory: "Boys & Girls Clothing",
        stock: 110,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/15039858/2021/8/5/caa53702-d1f0-44a3-aef0-0d675a5b84a71628153835572InfantBoysAssortedinnerelasticAssortedTrunkPackOf61.jpg"],
        rating: 4.4,
        reviewsCount: 45
      },
      {
        name: "Boys Printed T-shirt",
        description: "Fun and comfortable boys printed t-shirt for kids by RARE ONES. Breathable fabric, soft seams, and playful style.",
        price: 1399,
        discountPrice: 1099,
        category: catMap.get('kids')!,
        subcategory: "Boys & Girls Clothing",
        stock: 105,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/SEPTEMBER/29/0IKwiSlL_f465b39cdbee4d86a04e6d18954da12a.jpg"],
        rating: 4.5,
        reviewsCount: 52
      },
      {
        name: "Kids Joggers Track Pants",
        description: "Fun and comfortable kids joggers track pants for kids by Marks & Spencer. Breathable fabric, soft seams, and playful style.",
        price: 1499,
        discountPrice: 1199,
        category: catMap.get('kids')!,
        subcategory: "Boys & Girls Clothing",
        stock: 100,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/SEPTEMBER/4/AtaIHDRB_5d255e90278e4385b55b007e54b49f67.jpg"],
        rating: 4.6000000000000005,
        reviewsCount: 59
      },
      {
        name: "Pack of 3 Printed Jogger Pant",
        description: "Fun and comfortable pack of 3 printed jogger pant for kids by KEESOR. Breathable fabric, soft seams, and playful style.",
        price: 1599,
        discountPrice: 1299,
        category: catMap.get('kids')!,
        subcategory: "Boys & Girls Clothing",
        stock: 95,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/JULY/12/jH4aABhF_caf3cb867bf9492c8e8b149dc3151e4a.jpg"],
        rating: 4.7,
        reviewsCount: 66
      },
      {
        name: "Boys Pack Of 4 Assorted Trunks",
        description: "Fun and comfortable boys pack of 4 assorted trunks for kids by Bodycare Kids. Breathable fabric, soft seams, and playful style.",
        price: 1699,
        discountPrice: 1399,
        category: catMap.get('kids')!,
        subcategory: "Boys & Girls Clothing",
        stock: 90,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/17977332/2022/4/21/e8f84fd5-a1d4-41f3-9ebf-e955cd817b851650539990161Trunk1.jpg"],
        rating: 4.800000000000001,
        reviewsCount: 73
      },
      {
        name: "Skechers Go Run Classic Sneaker v1",
        description: "Responsive cushioning training and running sneakers by Skechers. Designed with breathable athletic mesh upper and soft lining.",
        price: 5999,
        discountPrice: 4799,
        category: catMap.get('shoes')!,
        subcategory: "Sneakers",
        stock: 90,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/25921930/2023/12/26/370d28b2-9c41-4835-8c39-698e46ac1b541703577789788-Skechers-Men-Sports-Shoes-3621703577789563-1.jpg"],
        rating: 4.7,
        reviewsCount: 210
      },
      {
        name: "Skechers Go Run Classic Sneaker v2",
        description: "Responsive cushioning training and running sneakers by Skechers. Designed with breathable athletic mesh upper and soft lining.",
        price: 6299,
        discountPrice: 4999,
        category: catMap.get('shoes')!,
        subcategory: "Sneakers",
        stock: 102,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/30591344/2024/8/29/bf3be5fb-15d5-4a7d-afe3-6fb30c9c54c51724915828230-SKECHERS-MEN-SHOE-4321724915827838-1.jpg"],
        rating: 4.8,
        reviewsCount: 240
      },
      {
        name: "Skechers Go Run Classic Sneaker v3",
        description: "Responsive cushioning training and running sneakers by Skechers. Designed with breathable athletic mesh upper and soft lining.",
        price: 6599,
        discountPrice: 5199,
        category: catMap.get('shoes')!,
        subcategory: "Sneakers",
        stock: 114,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/25921930/2023/12/26/370d28b2-9c41-4835-8c39-698e46ac1b541703577789788-Skechers-Men-Sports-Shoes-3621703577789563-1.jpg"],
        rating: 4.9,
        reviewsCount: 270
      },
      {
        name: "Skechers Go Run Classic Sneaker v4",
        description: "Responsive cushioning training and running sneakers by Skechers. Designed with breathable athletic mesh upper and soft lining.",
        price: 6899,
        discountPrice: 5399,
        category: catMap.get('shoes')!,
        subcategory: "Sneakers",
        stock: 126,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/30591344/2024/8/29/bf3be5fb-15d5-4a7d-afe3-6fb30c9c54c51724915828230-SKECHERS-MEN-SHOE-4321724915827838-1.jpg"],
        rating: 4.7,
        reviewsCount: 300
      },
      {
        name: "Skechers Go Run Classic Sneaker v5",
        description: "Responsive cushioning training and running sneakers by Skechers. Designed with breathable athletic mesh upper and soft lining.",
        price: 7199,
        discountPrice: 5599,
        category: catMap.get('shoes')!,
        subcategory: "Sneakers",
        stock: 138,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/25921930/2023/12/26/370d28b2-9c41-4835-8c39-698e46ac1b541703577789788-Skechers-Men-Sports-Shoes-3621703577789563-1.jpg"],
        rating: 4.8,
        reviewsCount: 330
      },
      {
        name: "Black Chelsea Boots",
        description: "Elegant black chelsea boots by Roadster. Features smooth premium synthetic leather, flexible elastic side panels, and durable soles.",
        price: 6999,
        discountPrice: 5499,
        category: catMap.get('shoes')!,
        subcategory: "Formal",
        stock: 75,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/SEPTEMBER/3/oKMEjnYn_17536a1438dd440c9eb81b6d51bd6c90.jpg"],
        rating: 4.6,
        reviewsCount: 140
      },
      {
        name: "Men Mid Top Chelsea Boots",
        description: "Elegant men mid top chelsea boots by Roadster. Features smooth premium synthetic leather, flexible elastic side panels, and durable soles.",
        price: 7399,
        discountPrice: 5799,
        category: catMap.get('shoes')!,
        subcategory: "Formal",
        stock: 81,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/27866276/2024/2/26/30fa540f-d22b-4738-aa6b-6c8475c643171708938616445RoadsterCasualBootsForMen1.jpg"],
        rating: 4.699999999999999,
        reviewsCount: 155
      },
      {
        name: "Block-Heeled Chelsea Boots",
        description: "Elegant block-heeled chelsea boots by Roadster. Features smooth premium synthetic leather, flexible elastic side panels, and durable soles.",
        price: 7799,
        discountPrice: 6099,
        category: catMap.get('shoes')!,
        subcategory: "Formal",
        stock: 87,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/MAY/30/QQsDSx93_ab2e7f766d5f45a5866d3afe442d9836.jpg"],
        rating: 4.8,
        reviewsCount: 170
      },
      {
        name: "Men Casual Chelsea Boots",
        description: "Elegant men casual chelsea boots by Roadster. Features smooth premium synthetic leather, flexible elastic side panels, and durable soles.",
        price: 8199,
        discountPrice: 6399,
        category: catMap.get('shoes')!,
        subcategory: "Formal",
        stock: 93,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/MAY/19/AyZm4UtZ_5eb3c1aff7334b53b21d71ce67529b37.jpg"],
        rating: 4.8999999999999995,
        reviewsCount: 185
      },
      {
        name: "Block-Heeled Chelsea Boots",
        description: "Elegant block-heeled chelsea boots by Roadster. Features smooth premium synthetic leather, flexible elastic side panels, and durable soles.",
        price: 8599,
        discountPrice: 6699,
        category: catMap.get('shoes')!,
        subcategory: "Formal",
        stock: 99,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/34294779/2025/6/16/96c0b61f-c39b-4a28-ac60-5d767a824a0f1750073314841-The-Roadster-Lifestyle-Co-Men-Block-Heeled-Chelsea-Boots-789-1.jpg"],
        rating: 4.6,
        reviewsCount: 200
      },
      {
        name: "Roadster Casual Block-Heeled Chelsea Boots",
        description: "Comfortable casual slip-on block-heeled chelsea boots from Roadster. Perfect for everyday wear, versatile look.",
        price: 3999,
        discountPrice: 3199,
        category: catMap.get('shoes')!,
        subcategory: "Casual",
        stock: 110,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/MAY/30/QQsDSx93_ab2e7f766d5f45a5866d3afe442d9836.jpg"],
        rating: 4.5,
        reviewsCount: 95
      },
      {
        name: "Roadster Casual Men Casual Chelsea Boots",
        description: "Comfortable casual slip-on men casual chelsea boots from Roadster. Perfect for everyday wear, versatile look.",
        price: 3799,
        discountPrice: 3049,
        category: catMap.get('shoes')!,
        subcategory: "Casual",
        stock: 100,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/MAY/19/AyZm4UtZ_5eb3c1aff7334b53b21d71ce67529b37.jpg"],
        rating: 4.6,
        reviewsCount: 113
      },
      {
        name: "Roadster Casual Block-Heeled Chelsea Boots",
        description: "Comfortable casual slip-on block-heeled chelsea boots from Roadster. Perfect for everyday wear, versatile look.",
        price: 3599,
        discountPrice: 2899,
        category: catMap.get('shoes')!,
        subcategory: "Casual",
        stock: 90,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/34294779/2025/6/16/96c0b61f-c39b-4a28-ac60-5d767a824a0f1750073314841-The-Roadster-Lifestyle-Co-Men-Block-Heeled-Chelsea-Boots-789-1.jpg"],
        rating: 4.7,
        reviewsCount: 131
      },
      {
        name: "Roadster Casual Black Chelsea Boots",
        description: "Comfortable casual slip-on black chelsea boots from Roadster. Perfect for everyday wear, versatile look.",
        price: 3399,
        discountPrice: 2749,
        category: catMap.get('shoes')!,
        subcategory: "Casual",
        stock: 80,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/SEPTEMBER/3/oKMEjnYn_17536a1438dd440c9eb81b6d51bd6c90.jpg"],
        rating: 4.8,
        reviewsCount: 149
      },
      {
        name: "Roadster Casual Men Mid Top Chelsea Boots",
        description: "Comfortable casual slip-on men mid top chelsea boots from Roadster. Perfect for everyday wear, versatile look.",
        price: 3199,
        discountPrice: 2599,
        category: catMap.get('shoes')!,
        subcategory: "Casual",
        stock: 70,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/27866276/2024/2/26/30fa540f-d22b-4738-aa6b-6c8475c643171708938616445RoadsterCasualBootsForMen1.jpg"],
        rating: 4.9,
        reviewsCount: 167
      },
      {
        name: "Men 2Pcs Textured Formal Belts",
        description: "Sleek and stylish men 2pcs textured formal belts by Roadster. Designed with premium materials to elevate your daily style.",
        price: 1499,
        discountPrice: 999,
        category: catMap.get('accessories')!,
        subcategory: "Belts",
        stock: 150,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/APRIL/23/jjAjbTqX_39230f9e9e074901aa93f7eb8f54d058.jpg"],
        rating: 4.6,
        reviewsCount: 110
      },
      {
        name: "Leather Reversable Formal Belt",
        description: "Sleek and stylish leather reversable formal belt by Roadster. Designed with premium materials to elevate your daily style.",
        price: 1549,
        discountPrice: 1039,
        category: catMap.get('accessories')!,
        subcategory: "Belts",
        stock: 142,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/DECEMBER/26/B3kWw08J_42dfabdef9464eafb8143fd7b3621236.jpg"],
        rating: 4.699999999999999,
        reviewsCount: 124
      },
      {
        name: "Men Leather Reversible Belt",
        description: "Sleek and stylish men leather reversible belt by Roadster. Designed with premium materials to elevate your daily style.",
        price: 1599,
        discountPrice: 1079,
        category: catMap.get('accessories')!,
        subcategory: "Belts",
        stock: 134,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/SEPTEMBER/4/m15qVuww_3532016b00a046ed80a0a4a763418a61.jpg"],
        rating: 4.8,
        reviewsCount: 138
      },
      {
        name: "Men Set Of 2 Belts",
        description: "Sleek and stylish men set of 2 belts by Roadster. Designed with premium materials to elevate your daily style.",
        price: 1649,
        discountPrice: 1119,
        category: catMap.get('accessories')!,
        subcategory: "Belts",
        stock: 126,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/30048177/2024/JUNE/27/VFGkzcS1_37a9973338754918873a9de1440b907f.jpg"],
        rating: 4.8999999999999995,
        reviewsCount: 152
      },
      {
        name: "Men Set Of 2 Formal Belts",
        description: "Sleek and stylish men set of 2 formal belts by Roadster. Designed with premium materials to elevate your daily style.",
        price: 1699,
        discountPrice: 1159,
        category: catMap.get('accessories')!,
        subcategory: "Belts",
        stock: 118,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/MARCH/21/wCLKuRRC_21aceb0e68ef4d6092d11a66ba018f8a.jpg"],
        rating: 4.6,
        reviewsCount: 166
      },
      {
        name: "Men Leather Casual Belt",
        description: "Sleek and stylish men leather casual belt by Roadster. Designed with premium materials to elevate your daily style.",
        price: 1749,
        discountPrice: 1199,
        category: catMap.get('accessories')!,
        subcategory: "Belts",
        stock: 110,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/APRIL/4/KXDuatvl_18f6d02d3e724b09b8fc13db5e4c4635.jpg"],
        rating: 4.699999999999999,
        reviewsCount: 180
      },
      {
        name: "Men Pack Of 2 Formal Belt",
        description: "Sleek and stylish men pack of 2 formal belt by Roadster. Designed with premium materials to elevate your daily style.",
        price: 1799,
        discountPrice: 1239,
        category: catMap.get('accessories')!,
        subcategory: "Belts",
        stock: 102,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/APRIL/23/COMV3eP8_bcdc4d36a1ac4b0eafbd19fa1f3b8207.jpg"],
        rating: 4.8,
        reviewsCount: 194
      },
      {
        name: "Men Analogue Watches",
        description: "Sleek and stylish men analogue watches by Roadster. Designed with premium materials to elevate your daily style.",
        price: 4349,
        discountPrice: 3279,
        category: catMap.get('accessories')!,
        subcategory: "Watches",
        stock: 94,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/FEBRUARY/26/pXUkPIOA_36e8cbc52f8a4d359012efd2f95d6738.jpg"],
        rating: 4.8999999999999995,
        reviewsCount: 208
      },
      {
        name: "Men Silver-Plated Finger Ring",
        description: "Sleek and stylish men silver-plated finger ring by Roadster. Designed with premium materials to elevate your daily style.",
        price: 1399,
        discountPrice: 1119,
        category: catMap.get('accessories')!,
        subcategory: "Jewelry",
        stock: 86,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/APRIL/16/EpmcytVk_82fdc1f8ca36413e91e99ade9cb6b329.jpg"],
        rating: 4.6,
        reviewsCount: 222
      },
      {
        name: "Men Band Ring",
        description: "Sleek and stylish men band ring by Roadster. Designed with premium materials to elevate your daily style.",
        price: 1449,
        discountPrice: 1159,
        category: catMap.get('accessories')!,
        subcategory: "Jewelry",
        stock: 78,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/FEBRUARY/26/NK22gtEy_dc87d194170e4dd8aa865597128c9568.jpg"],
        rating: 4.699999999999999,
        reviewsCount: 236
      },
      {
        name: "Pure Cotton Denim Shorts",
        description: "High performance pure cotton denim shorts from Roadster. Moisture-wicking stretch fabric ensures maximum freedom of movement.",
        price: 1999,
        discountPrice: 1499,
        category: catMap.get('sportswear')!,
        subcategory: "Sports",
        stock: 130,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/32040344/2024/12/30/14e4eff2-9acb-4bf0-8f68-387a34bb2fe61735547703687-Roadster-Men-Shorts-4301735547703090-1.jpg"],
        rating: 4.5,
        reviewsCount: 135
      },
      {
        name: "Pure Cotton Denim Shorts",
        description: "High performance pure cotton denim shorts from Roadster. Moisture-wicking stretch fabric ensures maximum freedom of movement.",
        price: 2099,
        discountPrice: 1599,
        category: catMap.get('sportswear')!,
        subcategory: "Sports",
        stock: 120,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/32040347/2024/12/30/68597ea3-d89d-4acb-8876-d777ee5577591735547291310-Roadster-Men-Shorts-1301735547290798-1.jpg"],
        rating: 4.6,
        reviewsCount: 147
      },
      {
        name: "Men Regular Fit Regular Shorts",
        description: "High performance men regular fit regular shorts from Roadster. Moisture-wicking stretch fabric ensures maximum freedom of movement.",
        price: 2199,
        discountPrice: 1699,
        category: catMap.get('sportswear')!,
        subcategory: "Sports",
        stock: 110,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/12920482/2021/7/20/90e13380-87bb-412c-a557-b111919ae3591626761072098-Roadster-Men-Off-White-Solid-Regular-Fit-Regular-Shorts-6661-1.jpg"],
        rating: 4.7,
        reviewsCount: 159
      },
      {
        name: "Men Regular Fit Shorts",
        description: "High performance men regular fit shorts from Roadster. Moisture-wicking stretch fabric ensures maximum freedom of movement.",
        price: 2299,
        discountPrice: 1799,
        category: catMap.get('sportswear')!,
        subcategory: "Sports",
        stock: 100,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/11897428/2020/6/17/aa396e48-d972-429e-a1eb-7f15707233781592380567314-Roadster-Men-Shorts-7371592380564840-1.jpg"],
        rating: 4.8,
        reviewsCount: 171
      },
      {
        name: "Men Cargo Shorts",
        description: "High performance men cargo shorts from Roadster. Moisture-wicking stretch fabric ensures maximum freedom of movement.",
        price: 2399,
        discountPrice: 1899,
        category: catMap.get('sportswear')!,
        subcategory: "Sports",
        stock: 90,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/31654379/2025/1/7/5336ca7c-c06a-44ea-8008-bf157796a66c1736249493208-Roadster-Men-Shorts-7051736249492647-1.jpg"],
        rating: 4.9,
        reviewsCount: 183
      },
      {
        name: "Men Pure Cotton Chino Shorts",
        description: "High performance men pure cotton chino shorts from Roadster. Moisture-wicking stretch fabric ensures maximum freedom of movement.",
        price: 2499,
        discountPrice: 1999,
        category: catMap.get('sportswear')!,
        subcategory: "Sports",
        stock: 80,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/26332596/2024/8/13/312e5c92-6a31-4424-9843-ae82cfd746991723535521132-Roadster-Men-Shorts-8221723535520626-1.jpg"],
        rating: 4.5,
        reviewsCount: 195
      },
      {
        name: "Men Shorts",
        description: "High performance men shorts from Roadster. Moisture-wicking stretch fabric ensures maximum freedom of movement.",
        price: 2599,
        discountPrice: 2099,
        category: catMap.get('sportswear')!,
        subcategory: "Sports",
        stock: 70,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/32311514/2025/3/13/74f8e759-e7c6-4e32-bd6b-f4617c30920b1741843103911-Men-Pista-Green-Mid-Rise-Regular-Fit-Stretch-Solid-Shorts-41-1.jpg"],
        rating: 4.6,
        reviewsCount: 207
      },
      {
        name: "Men Solid Cargo Shorts",
        description: "High performance men solid cargo shorts from Roadster. Moisture-wicking stretch fabric ensures maximum freedom of movement.",
        price: 2699,
        discountPrice: 2199,
        category: catMap.get('sportswear')!,
        subcategory: "Sports",
        stock: 60,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/33107549/2025/3/28/cf4ed95f-40da-4684-8512-4d414a282db81743153241299-Roadster-Men-Shorts-2661743153240623-1.jpg"],
        rating: 4.7,
        reviewsCount: 219
      },
      {
        name: "Solid Hooded Sweatshirt",
        description: "High performance solid hooded sweatshirt from Roadster. Moisture-wicking stretch fabric ensures maximum freedom of movement.",
        price: 2799,
        discountPrice: 2299,
        category: catMap.get('sportswear')!,
        subcategory: "Activewear",
        stock: 50,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/11959230/2020/11/12/499bb96c-952d-4e52-bd3a-42caa33c07b71605156585352-Roadster-Men-Sweatshirts-3761605156583661-1.jpg"],
        rating: 4.8,
        reviewsCount: 231
      },
      {
        name: "Pure Cotton Denim Shorts",
        description: "High performance pure cotton denim shorts from Roadster. Moisture-wicking stretch fabric ensures maximum freedom of movement.",
        price: 2899,
        discountPrice: 2399,
        category: catMap.get('sportswear')!,
        subcategory: "Sports",
        stock: 40,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/32040344/2024/12/30/14e4eff2-9acb-4bf0-8f68-387a34bb2fe61735547703687-Roadster-Men-Shorts-4301735547703090-1.jpg"],
        rating: 4.9,
        reviewsCount: 243
      },
      {
        name: "Zeel Hooded Rain Suit",
        description: "High-grade waterproof polyester hooded rain suit by Zeel. Designed with taped seams for absolute leakage protection during heavy downpours.",
        price: 1099,
        discountPrice: 1099,
        category: catMap.get('mens-clothing')!,
        subcategory: "Jackets",
        stock: 120,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/MAY/10/7Lqxb8F5_67ad2bea62ff44aeb1115834e60a0fea.jpg"],
        rating: 4.5,
        reviewsCount: 38
      },
      {
        name: "Zeel Hooded Rain Jacket",
        description: "Backpack-friendly navy rain jacket with adjustable drawstring hood, secure zip closure, and dual side pockets. Designed by Zeel.",
        price: 1299,
        discountPrice: 1299,
        category: catMap.get('mens-clothing')!,
        subcategory: "Jackets",
        stock: 85,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/29962775/2024/6/14/196862f9-6606-4d04-9f96-1c686b1ca02c1718347724465THEULTIMATEBACKPACK-FRIENDLYNAVYRAINCOAT1.jpg"],
        rating: 4.4,
        reviewsCount: 22
      },
      {
        name: "Marks & Spencer Checked Lounge Shorts",
        description: "Premium cotton checked lounge shorts by Marks & Spencer. Comfortable elasticated waistband with drawstring closure, perfect for relaxed weekends.",
        price: 2199,
        discountPrice: 1249,
        category: catMap.get('womens-clothing')!,
        subcategory: "Shorts",
        stock: 110,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/30087230/2024/7/1/e3ad108c-8302-410d-84ec-dd231a4a2bdb1719846931761MarksSpencerWomenCheckedLoungeShorts1.jpg"],
        rating: 4.7,
        reviewsCount: 65
      },
      {
        name: "Enamor Solid Lounge Shorts",
        description: "Super soft stretch cotton cycling lounge shorts with a high-rise waist and comfortable waistband. Sourced from Enamor.",
        price: 399,
        discountPrice: 399,
        category: catMap.get('womens-clothing')!,
        subcategory: "Shorts",
        stock: 150,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/12302864/2024/6/22/9ca7d461-7532-4f23-a9ab-af06e4de2db31719037426110EnamorWomenHuggedFitStretchCottonCyclingShortswithSoftElasti1.jpg"],
        rating: 4.3,
        reviewsCount: 42
      },
      {
        name: "You Got Plan B Solid Crop Top",
        description: "Lightweight and breathable stretch knit cotton crop top, styled for active play and casual wear. Sourced from You Got Plan B.",
        price: 799,
        discountPrice: 599,
        category: catMap.get('kids')!,
        subcategory: "Boys & Girls Clothing",
        stock: 90,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/DECEMBER/7/QwrdbBGt_617c82f82fd04785a8446d818c653203.jpg"],
        rating: 4.2,
        reviewsCount: 19
      },
      {
        name: "Puma Essentials Logo Sweatpants",
        description: "Classic Puma kids sweatpants featuring the iconic Puma logo print. Made from premium fleece-lined cotton for maximum comfort and style.",
        price: 3199,
        discountPrice: 1699,
        category: catMap.get('kids')!,
        subcategory: "Boys & Girls Clothing",
        stock: 140,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/JUNE/11/NN0EhyOY_59274f966da3482b884c0f4c3a101b91.jpg"],
        rating: 4.6,
        reviewsCount: 54
      },
      {
        name: "Skechers Go Run Consistent Shoes",
        description: "High-performance running and training shoes by Skechers. Features responsive Ultra Go cushioning and a breathable mesh upper for supreme endurance.",
        price: 6999,
        discountPrice: 4799,
        category: catMap.get('shoes')!,
        subcategory: "Sneakers",
        stock: 70,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/25921930/2023/12/26/370d28b2-9c41-4835-8c39-698e46ac1b541703577789788-Skechers-Men-Sports-Shoes-3621703577789563-1.jpg"],
        rating: 4.8,
        reviewsCount: 92
      },
      {
        name: "Skechers Go Run Running Shoes",
        description: "Lightweight Skechers running shoes with premium comfort insoles and shock-absorbing midsoles for daily runs and workout sessions.",
        price: 7499,
        discountPrice: 4199,
        category: catMap.get('shoes')!,
        subcategory: "Sneakers",
        stock: 65,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/30591344/2024/8/29/bf3be5fb-15d5-4a7d-afe3-6fb30c9c54c51724915828230-SKECHERS-MEN-SHOE-4321724915827838-1.jpg"],
        rating: 4.7,
        reviewsCount: 88
      },
      {
        name: "WROGN Men Analogue Watch",
        description: "Sleek and classic silver-toned analogue watch by WROGN. Features a round watch dial, date display window, and premium stainless steel strap.",
        price: 3699,
        discountPrice: 949,
        category: catMap.get('accessories')!,
        subcategory: "Watches",
        stock: 95,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/13036796/2021/1/6/bb6d18c9-39c1-4632-bc4a-f452606965ef1609906124788-WROGN-Men-Silver-Toned-Analogue-Watch-WRG00048A-802160990612-1.jpg"],
        rating: 4.5,
        reviewsCount: 76
      },
      {
        name: "Puma Phase Kids Small Backpack",
        description: "Compact kids backpack from Puma. Designed with a zippered main compartment, front pocket, and padded shoulder straps for school or travel.",
        price: 2299,
        discountPrice: 999,
        category: catMap.get('accessories')!,
        subcategory: "Bags",
        stock: 120,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/NOVEMBER/18/WZkmatkg_6fdb9b4a88be4da29c4d217c55f4a228.jpg"],
        rating: 4.4,
        reviewsCount: 47
      },
      {
        name: "Nike Sportswear Club Men's Trouser",
        description: "Classic athletic track trousers by Nike. Sourced from the Nike Sportswear Club series, built with soft brushed fleece for all-day cozy wear.",
        price: 6299,
        discountPrice: 6299,
        category: catMap.get('sportswear')!,
        subcategory: "Activewear",
        stock: 80,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/MARCH/9/zrBbtZyS_ae1fb46b242e48fdb0ffa02396a35113.jpg"],
        rating: 4.6,
        reviewsCount: 61
      },
      {
        name: "BMW MMS MT7 Track Jacket by Puma",
        description: "BMW M Motorsport MT7 Track Jacket by Puma. Features iconic stripe accents, BMW team badges, and comfortable athletic fit.",
        price: 11299,
        discountPrice: 6799,
        category: catMap.get('sportswear')!,
        subcategory: "Activewear",
        stock: 50,
        images: ["https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/DECEMBER/29/ZZkjS6bo_1a3193f16ef3443a996e49a93b43a29a.jpg"],
        rating: 4.8,
        reviewsCount: 79
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
