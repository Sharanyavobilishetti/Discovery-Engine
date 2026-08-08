from sqlalchemy.orm import Session
from app.models.models import Category, Product, User, Order, OrderItem, Wishlist, SearchHistory
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

CATEGORIES = [
    {
        "name": "Footwear & Sneakers",
        "slug": "footwear",
        "description": "High-performance running shoes, casual sneakers, and formal shoes.",
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    },
    {
        "name": "Activewear & Sportswear",
        "slug": "activewear",
        "description": "Breathable gym wear, athletic shorts, hoodies, and sweatpants.",
        "image_url": "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80"
    },
    {
        "name": "Electronics & Audio",
        "slug": "electronics",
        "description": "Wireless noise-canceling headphones, smartwatches, and earbuds.",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    },
    {
        "name": "Casual Fashion & Denim",
        "slug": "casual-fashion",
        "description": "Premium cotton t-shirts, tailored jackets, jeans, and casual dresses.",
        "image_url": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"
    },
    {
        "name": "Bags & Accessories",
        "slug": "accessories",
        "description": "Leather backpacks, minimalist wallets, sunglasses, and travel duffels.",
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
    }
]

PRODUCTS_SEED = [
    # Category 1: Footwear
    {
        "title": "AeroGlide Stealth Nitro Running Shoes",
        "description": "Ultra-lightweight mesh running shoes with responsive foam cushioning and carbon fiber energy plate. Perfect for long-distance marathon running and daily road training.",
        "price": 2899.0,
        "category_slug": "footwear",
        "brand": "AeroGlide",
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
        "rating": 4.8,
        "reviews_count": 340,
        "is_trending": True,
        "is_new_arrival": False,
        "tags": "running,shoes,black,stealth,breathable,cushioning,lightweight,comfort",
        "features": "Nitrogen-infused midsole|Engineered mesh upper|Reflective night safety strip|Weight: 220g",
        "color": "Black",
        "gender": "Unisex"
    },
    {
        "title": "UrbanPulse Court Low-Top White Sneakers",
        "description": "Classic white leather low-top sneakers designed for everyday street style and effortless casual pairing. Ergonomic cushioned insoles ensure all-day comfort.",
        "price": 2499.0,
        "category_slug": "footwear",
        "brand": "UrbanPulse",
        "image_url": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
        "rating": 4.6,
        "reviews_count": 210,
        "is_trending": True,
        "is_new_arrival": True,
        "tags": "sneakers,white,casual,leather,streetwear,minimalist,comfortable",
        "features": "100% Genuine full-grain leather|Rubber cupsole|Anti-bacterial ortholite insoles",
        "color": "White",
        "gender": "Unisex"
    },
    {
        "title": "TitanGrip Waterproof Trail Hiking Boots",
        "description": "Rugged waterproof outdoor boots featuring high-traction lug soles and ankle stability support for mountainous terrain and tough weather conditions.",
        "price": 4299.0,
        "category_slug": "footwear",
        "brand": "TitanGrip",
        "image_url": "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "reviews_count": 185,
        "is_trending": False,
        "is_new_arrival": True,
        "tags": "boots,hiking,trail,waterproof,brown,outdoor,rugged,grip",
        "features": "DryTech waterproof membrane|Vibram rubber outsole|Reinforced toe cap",
        "color": "Brown",
        "gender": "Men"
    },
    {
        "title": "VeloxFly Lightweight Mesh Knit Trainers",
        "description": "Flex-knit slip-on trainers designed for high-intensity gym workouts, cross-training, and quick sprint intervals.",
        "price": 1999.0,
        "category_slug": "footwear",
        "brand": "AeroGlide",
        "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
        "rating": 4.4,
        "reviews_count": 98,
        "is_trending": True,
        "is_new_arrival": False,
        "tags": "trainers,mesh,blue,knit,gym,flexible,lightweight",
        "features": "3D Knit breathability|Memory foam footbed|Slip-resistant outsole",
        "color": "Teal Blue",
        "gender": "Unisex"
    },
    {
        "title": "Oxford Elite Handcrafted Italian Oxford Formal Shoes",
        "description": "Handcrafted dress shoes made from vegetable-tanned Italian calfskin leather. Ideal for formal galas, corporate meetings, and weddings.",
        "price": 5499.0,
        "category_slug": "footwear",
        "brand": "Oxford Elite",
        "image_url": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80",
        "rating": 4.7,
        "reviews_count": 76,
        "is_trending": False,
        "is_new_arrival": False,
        "tags": "formal,oxford,shoes,black,leather,suit,business,elegant",
        "features": "Hand-stitched Goodyear welt|Polished wax finish|Leather sole with rubber heel patch",
        "color": "Black",
        "gender": "Men"
    },

    # Category 2: Activewear & Sportswear
    {
        "title": "DryPro Performance Compression Running T-Shirt",
        "description": "Moisture-wicking athletic compression top with ventilation zones. Keeps you cool, dry, and focused during sweat-heavy gym sessions.",
        "price": 999.0,
        "category_slug": "activewear",
        "brand": "DryPro",
        "image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80",
        "rating": 4.5,
        "reviews_count": 420,
        "is_trending": True,
        "is_new_arrival": False,
        "tags": "tshirt,activewear,running,gym,black,dryfit,compression,breathable",
        "features": "Quick-dry fabric|Anti-odor antimicrobial treatment|Flatlock anti-chafing seams",
        "color": "Charcoal Black",
        "gender": "Men"
    },
    {
        "title": "FlexZone High-Waisted Seamless Yoga Leggings",
        "description": "Squat-proof 4-way stretch activewear leggings with side phone pockets. Designed for maximum flexibility during yoga, pilates, and fitness routines.",
        "price": 1499.0,
        "category_slug": "activewear",
        "brand": "FlexZone",
        "image_url": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "reviews_count": 512,
        "is_trending": True,
        "is_new_arrival": True,
        "tags": "leggings,yoga,activewear,teal,highwaist,stretch,gym",
        "features": "Nylon-Spandex blend|Non-see-through fabric|Deep double side pockets",
        "color": "Teal",
        "gender": "Women"
    },
    {
        "title": "CoreFit Fleece Pullover Gym Hoodie",
        "description": "Heavyweight French terry cotton hoodie featuring a kangaroo front pocket and lined hood. Perfect for post-workout warmth and athletic lounge wear.",
        "price": 2299.0,
        "category_slug": "activewear",
        "brand": "DryPro",
        "image_url": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
        "rating": 4.7,
        "reviews_count": 280,
        "is_trending": True,
        "is_new_arrival": False,
        "tags": "hoodie,fleece,activewear,grey,pullover,warm,gym,casual",
        "features": "350 GSM Heavyweight cotton fleece|Ribbed cuffs and hem|Custom metal drawstring tips",
        "color": "Slate Grey",
        "gender": "Unisex"
    },
    {
        "title": "AeroPace 2-in-1 Running Shorts with Phone Pocket",
        "description": "Lightweight outer shorts combined with a supportive inner compression liner. Prevents thigh chafing and securely stores your phone while running.",
        "price": 1299.0,
        "category_slug": "activewear",
        "brand": "AeroGlide",
        "image_url": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80",
        "rating": 4.6,
        "reviews_count": 190,
        "is_trending": False,
        "is_new_arrival": True,
        "tags": "shorts,running,activewear,black,2in1,pocket,breathable",
        "features": "Hidden inner compression phone sleeve|Towel loop strap|Zippered back key pocket",
        "color": "Black",
        "gender": "Men"
    },

    # Category 3: Electronics & Audio
    {
        "title": "SonicPro ANC Wireless Noise-Canceling Headphones",
        "description": "Flagship wireless over-ear headphones featuring Hybrid Active Noise Cancellation, 40mm titanium drivers, and 40 hours of battery playback.",
        "price": 8999.0,
        "category_slug": "electronics",
        "brand": "SonicPro",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "reviews_count": 680,
        "is_trending": True,
        "is_new_arrival": False,
        "tags": "headphones,wireless,audio,anc,black,bluetooth,music,noise-canceling",
        "features": "-35dB Active Noise Cancellation|LDAC High-Res Audio Codec|Multi-point Bluetooth 5.3 connection",
        "color": "Matte Black",
        "gender": "Unisex"
    },
    {
        "title": "PulseBuds True Wireless Earbuds with Spatial Audio",
        "description": "Compact TWS earbuds offering immersive 360 spatial audio, quad-mic ENC for crystal-clear calls, and wireless charging case.",
        "price": 3499.0,
        "category_slug": "electronics",
        "brand": "SonicPro",
        "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
        "rating": 4.6,
        "reviews_count": 310,
        "is_trending": True,
        "is_new_arrival": True,
        "tags": "earbuds,wireless,tws,audio,white,bluetooth,spatial,mic",
        "features": "IPX5 Sweat resistance|6-hour earbud battery + 24 hours case|Low-latency gaming mode",
        "color": "White",
        "gender": "Unisex"
    },
    {
        "title": "AeroPulse GPS Fitness Smartwatch & Health Tracker",
        "description": "Advanced smartwatch featuring AMOLED display, dual-band GPS track, SpO2 sensor, continuous heart rate monitoring, and 14-day battery life.",
        "price": 5999.0,
        "category_slug": "electronics",
        "brand": "AeroPulse",
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        "rating": 4.7,
        "reviews_count": 450,
        "is_trending": True,
        "is_new_arrival": False,
        "tags": "smartwatch,fitness,gps,heartrate,black,electronics,gadget,tracker",
        "features": "1.43-inch HD AMOLED touchscreen|100+ Sports tracking modes|5ATM Water resistance",
        "color": "Midnight Grey",
        "gender": "Unisex"
    },

    # Category 4: Casual Fashion & Denim
    {
        "title": "RawDenim Slim-Fit Indigo Selvedge Jeans",
        "description": "Authentic 13.5 oz heavy Japanese selvedge denim woven on traditional shuttle looms. Features slim tailored cut and classic button fly.",
        "price": 2999.0,
        "category_slug": "casual-fashion",
        "brand": "RawDenim",
        "image_url": "https://images.unsplash.com/photo-1542272604-780c36856d61?w=800&auto=format&fit=crop&q=80",
        "rating": 4.7,
        "reviews_count": 230,
        "is_trending": False,
        "is_new_arrival": True,
        "tags": "jeans,denim,indigo,pants,casual,selvedge,slimfit",
        "features": "100% Cotton Raw Selvedge|Custom copper rivets|Chain-stitched hem",
        "color": "Indigo Blue",
        "gender": "Men"
    },
    {
        "title": "OrganicCotton Heavyweight Oversized Tee",
        "description": "240 GSM 100% organic combed cotton t-shirt with relaxed drop-shoulder cut and double-needle collar stitching.",
        "price": 899.0,
        "category_slug": "casual-fashion",
        "brand": "UrbanPulse",
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
        "rating": 4.8,
        "reviews_count": 590,
        "is_trending": True,
        "is_new_arrival": False,
        "tags": "tshirt,oversized,cotton,teal,casual,streetwear,minimal",
        "features": "Pre-shrunk organic cotton|Drop-shoulder trendy fit|Fade-resistant reactive dye",
        "color": "Teal Grey",
        "gender": "Unisex"
    },
    {
        "title": "NordicWeave Wool-Blend Tailored Casual Blazer",
        "description": "Unstructured smart casual jacket constructed from breathable wool-blend fabric. Features soft shoulders and patch pockets.",
        "price": 4999.0,
        "category_slug": "casual-fashion",
        "brand": "Oxford Elite",
        "image_url": "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800&auto=format&fit=crop&q=80",
        "rating": 4.6,
        "reviews_count": 115,
        "is_trending": False,
        "is_new_arrival": False,
        "tags": "blazer,jacket,suit,formal,grey,wool,tailored,casual",
        "features": "Breathable wool-cotton blend|Double rear vents|Internal document pocket",
        "color": "Charcoal Grey",
        "gender": "Men"
    },

    # Category 5: Bags & Accessories
    {
        "title": "NomadCraft Waterproof Canvas Backpack 25L",
        "description": "Heavy-duty waxed canvas backpack with padded 16-inch laptop compartment, quick-access side water bottle pockets, and magnetic leather straps.",
        "price": 3199.0,
        "category_slug": "accessories",
        "brand": "NomadCraft",
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
        "rating": 4.8,
        "reviews_count": 380,
        "is_trending": True,
        "is_new_arrival": False,
        "tags": "backpack,bag,canvas,laptop,travel,waterproof,olive,accessories",
        "features": "Water-resistant waxed canvas|Shockproof laptop sleeve|Luggage pass-through strap",
        "color": "Olive Green",
        "gender": "Unisex"
    },
    {
        "title": "Prism polarized Aviator Sunglasses",
        "description": "Classic aviator sunglasses featuring TAC polarized lenses with 100% UV400 protection and ultra-lightweight stainless steel frame.",
        "price": 1799.0,
        "category_slug": "accessories",
        "brand": "Prism",
        "image_url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
        "rating": 4.7,
        "reviews_count": 270,
        "is_trending": True,
        "is_new_arrival": True,
        "tags": "sunglasses,aviator,polarized,black,eyewear,accessories,summer",
        "features": "TAC Triacetate cellulose polarized lens|Adjustable silicone nose pads|Microfiber cleaning pouch",
        "color": "Black / Gold",
        "gender": "Unisex"
    },
    {
        "title": "Heritage Leather Bifold RFID-Blocking Wallet",
        "description": "Genuine top-grain leather wallet equipped with RFID blocking shield technology to protect your credit cards against electronic theft.",
        "price": 1199.0,
        "category_slug": "accessories",
        "brand": "NomadCraft",
        "image_url": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "reviews_count": 490,
        "is_trending": False,
        "is_new_arrival": False,
        "tags": "wallet,leather,rfid,brown,accessories,bifold,slim",
        "features": "100% Genuine Cowhide leather|13.56 MHz RFID Shield|Holds up to 8 cards + cash billfold",
        "color": "Vintage Brown",
        "gender": "Men"
    }
]

def seed_database(db: Session):
    # Seed Categories
    category_map = {}
    for cat_data in CATEGORIES:
        existing_cat = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
        if not existing_cat:
            cat = Category(**cat_data)
            db.add(cat)
            db.commit()
            db.refresh(cat)
            category_map[cat.slug] = cat.id
        else:
            category_map[existing_cat.slug] = existing_cat.id

    # Seed Products
    for p_data in PRODUCTS_SEED:
        cat_slug = p_data.pop("category_slug")
        category_id = category_map.get(cat_slug, 1)
        existing_p = db.query(Product).filter(Product.title == p_data["title"]).first()
        if not existing_p:
            prod = Product(category_id=category_id, **p_data)
            db.add(prod)
    db.commit()

    # Seed Admin and Test Customer Users
    admin = db.query(User).filter(User.email == "admin@findora.com").first()
    if not admin:
        admin_user = User(
            email="admin@findora.com",
            full_name="Findora Admin",
            hashed_password=pwd_context.hash("admin123"),
            role="admin",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
        )
        db.add(admin_user)

    customer = db.query(User).filter(User.email == "alex@example.com").first()
    if not customer:
        cust_user = User(
            email="alex@example.com",
            full_name="Alex Rivera",
            hashed_password=pwd_context.hash("alex123"),
            role="customer",
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
        )
        db.add(cust_user)

    db.commit()
    print("Database seeding completed successfully!")
