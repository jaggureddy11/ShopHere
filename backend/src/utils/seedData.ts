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
        name: 'Phones & Mobile',
        slug: 'phones-mobile',
        description: 'Sleek flagship smartphones and mobile essentials.',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800'
      },
      {
        name: 'Headphones & Audio',
        slug: 'headphones-audio',
        description: 'High-fidelity audio equipment and studio gear.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800'
      },
      {
        name: 'Workstations & Inputs',
        slug: 'workstations-inputs',
        description: 'Precision mechanical keyboards, screens, and mice.',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800'
      },
      {
        name: 'Smart Home & Living',
        slug: 'smart-home-living',
        description: 'Ambient lighting and architectural appliances.',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800'
      }
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log('Categories seeded.');

    const catMap = new Map(categories.map(c => [c.slug, c._id]));

    // Seed Products
    const productsData = [
      // Phones & Mobile
      {
        name: 'ShopHere Flagship Phone X1',
        description: 'Ultra-thin, matte-finished aerospace aluminum frame housing the latest high-performance custom silicon. Experience dynamic refresh rates on a sharp, bezel-less OLED display.',
        price: 999,
        discountPrice: 949,
        category: catMap.get('phones-mobile')!,
        subcategory: 'Smartphones',
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800'],
        stock: 45,
        rating: 4.8,
        reviewsCount: 12
      },
      {
        name: 'ShopHere Lite Mobile X2',
        description: 'Compact design featuring premium styling cues. High-efficiency processor, long-lasting battery life, and high-resolution dual camera setup.',
        price: 599,
        category: catMap.get('phones-mobile')!,
        subcategory: 'Smartphones',
        images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800'],
        stock: 30,
        rating: 4.5,
        reviewsCount: 8
      },
      {
        name: 'Magnetic Qi2 Wireless Charging Pad',
        description: 'Solid machined steel base with a premium dark gray finish. Delivers secure alignment and up to 15W wireless power.',
        price: 79,
        category: catMap.get('phones-mobile')!,
        subcategory: 'Accessories',
        images: ['https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=800'],
        stock: 120,
        rating: 4.6,
        reviewsCount: 22
      },
      {
        name: 'Carbon Fiber Protective Case',
        description: 'Ultra-thin protective shell with sharp edges. Preserves the minimal look Look of your device without adding bulk.',
        price: 49,
        category: catMap.get('phones-mobile')!,
        subcategory: 'Accessories',
        images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800'],
        stock: 80,
        rating: 4.4,
        reviewsCount: 15
      },
      {
        name: 'Leather Travel Organiser Bag',
        description: 'Fine full-grain leather sleeve divided for cords, power banks, and smartphone accessories.',
        price: 129,
        category: catMap.get('phones-mobile')!,
        subcategory: 'Accessories',
        images: ['https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800'],
        stock: 25,
        rating: 4.9,
        reviewsCount: 5
      },

      // Headphones & Audio
      {
        name: 'Ambient Pro Active Noise Cancelling Headphones',
        description: 'Studio-grade acoustics. Custom hybrid active noise cancelling blocks distractions. Features premium micro-knit ear cushions and an editorial steel band.',
        price: 349,
        category: catMap.get('headphones-audio')!,
        subcategory: 'Over-Ear',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800'],
        stock: 60,
        rating: 4.7,
        reviewsCount: 34
      },
      {
        name: 'Acoustic Reference Studio Monitors',
        description: 'Precision bookshelf speakers for accurate spatial audio tracking. Features walnut housing and low-distortion amplifiers.',
        price: 499,
        category: catMap.get('headphones-audio')!,
        subcategory: 'Speakers',
        images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800'],
        stock: 15,
        rating: 4.9,
        reviewsCount: 7
      },
      {
        name: 'Sleek ANC Wireless Earbuds',
        description: 'Sweat-resistant, high-isolation in-ear monitors. Stored in a solid pocket-sized aluminum case with USB-C.',
        price: 199,
        category: catMap.get('headphones-audio')!,
        subcategory: 'Earbuds',
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800'],
        stock: 95,
        rating: 4.3,
        reviewsCount: 40
      },
      {
        name: 'USB-C Studio Broadcast Microphone',
        description: 'Condenser capsule with integrated pop filter and heavy desktop base. Ideal for podcasting and call clarity.',
        price: 149,
        category: catMap.get('headphones-audio')!,
        subcategory: 'Microphones',
        images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800'],
        stock: 40,
        rating: 4.6,
        reviewsCount: 18
      },
      {
        name: 'Hi-Fi Desk Headphone Stand',
        description: 'Machined steel and solid oak block designed to keep your premium headphones presented securely.',
        price: 89,
        category: catMap.get('headphones-audio')!,
        subcategory: 'Accessories',
        images: ['https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=800'],
        stock: 50,
        rating: 4.8,
        reviewsCount: 9
      },

      // Workstations & Inputs
      {
        name: 'Machined 75% Mechanical Keyboard',
        description: 'Constructed from a solid block of anodized gray aluminum. Custom linear switches, double-shot PBT keycaps, and a programmable rotating media knob.',
        price: 189,
        category: catMap.get('workstations-inputs')!,
        subcategory: 'Keyboards',
        images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800'],
        stock: 35,
        rating: 4.9,
        reviewsCount: 19
      },
      {
        name: 'Ultrawide 34-inch IPS Monitor',
        description: 'Curved workstation display. Accurate sRGB calibration, height-adjustable minimalist bracket, and integrated USB-C docking power delivery.',
        price: 799,
        category: catMap.get('workstations-inputs')!,
        subcategory: 'Screens',
        images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800'],
        stock: 12,
        rating: 4.7,
        reviewsCount: 14
      },
      {
        name: 'Ergonomic Vertical Wireless Mouse',
        description: 'Engineered to reduce wrist strain. High-precision sensor, scroll speed toggle, and customizable thumbside keys.',
        price: 99,
        category: catMap.get('workstations-inputs')!,
        subcategory: 'Mice',
        images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800'],
        stock: 65,
        rating: 4.5,
        reviewsCount: 30
      },
      {
        name: 'Felt Desk Pad - Extra Large',
        description: 'Soft wool felt desk mat. Generous workspace width, anti-slip backing, protecting the workstation surface.',
        price: 59,
        category: catMap.get('workstations-inputs')!,
        subcategory: 'Accessories',
        images: ['https://images.unsplash.com/photo-1632292224971-0d45778b3002?q=80&w=800'],
        stock: 150,
        rating: 4.7,
        reviewsCount: 25
      },
      {
        name: 'Modular Aluminum Monitor Arm',
        description: 'Heavy-duty pneumatic arm designed to securely mount flat or curved screens. Integrated cable routing channels.',
        price: 139,
        category: catMap.get('workstations-inputs')!,
        subcategory: 'Accessories',
        images: ['https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800'],
        stock: 30,
        rating: 4.6,
        reviewsCount: 10
      },

      // Smart Home & Living
      {
        name: 'Architectural Ambient Light Column',
        description: 'Standing LED column utilizing indirect light reflection. Full HSL custom configuration controlled via smartphone app or tactile touch ring.',
        price: 249,
        category: catMap.get('smart-home-living')!,
        subcategory: 'Lighting',
        images: ['https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800'],
        stock: 20,
        rating: 4.8,
        reviewsCount: 11
      },
      {
        name: 'Smart Climate Controller',
        description: 'Machined metal frame housing a round glass dial interface. Learns scheduling patterns automatically.',
        price: 229,
        category: catMap.get('smart-home-living')!,
        subcategory: 'Appliances',
        images: ['https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800'], // Fallback smart UI image
        stock: 40,
        rating: 4.4,
        reviewsCount: 16
      },
      {
        name: 'Minimalist Air Purifier Purify-1',
        description: 'Matte plastic frame with custom fabric pre-filter. Triple-stage HEPA filter removes 99.97% of airborne particulate.',
        price: 299,
        category: catMap.get('smart-home-living')!,
        subcategory: 'Appliances',
        images: ['https://images.unsplash.com/photo-1585131838081-300d86e51f4e?q=80&w=800'],
        stock: 18,
        rating: 4.7,
        reviewsCount: 9
      },
      {
        name: 'Ambient Diffuser - Stone Base',
        description: 'Ultrasonic aroma diffuser featuring a custom porcelain cover and a warm integrated ambient underglow.',
        price: 89,
        category: catMap.get('smart-home-living')!,
        subcategory: 'Decor',
        images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800'],
        stock: 75,
        rating: 4.6,
        reviewsCount: 14
      },
      {
        name: 'Home Concierge Smart Hub Screen',
        description: '8-inch smart dashboard display configured to stream surveillance footage, control lights, and display dashboard widgets.',
        price: 199,
        category: catMap.get('smart-home-living')!,
        subcategory: 'Screens',
        images: ['https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=800'],
        stock: 28,
        rating: 4.3,
        reviewsCount: 11
      }
    ];

    await Product.insertMany(productsData);
    console.log('Products seeded.');

    console.log('Database seeding successfully completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
