#!/bin/bash
# =============================================================
# MongoDB Init Script - Import NMPetShop Products
# Runs automatically on FIRST container start
# =============================================================

echo "============================================="
echo "  NMPetShop - Seeding Database..."
echo "============================================="

SEED_FILE="/data/seed/petmall_products.json"

# Check if seed file exists
if [ ! -f "$SEED_FILE" ]; then
  echo "ERROR: Seed file not found at $SEED_FILE"
  exit 1
fi

echo "Importing products collection..."
mongoimport \
  --username "$MONGO_INITDB_ROOT_USERNAME" \
  --password "$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase admin \
  --db nmpetshop \
  --collection products \
  --file "$SEED_FILE" \
  --jsonArray \
  --drop

if [ $? -eq 0 ]; then
  echo "Products imported successfully!"
else
  echo "ERROR: Failed to import products!"
  exit 1
fi

echo "Creating indexes..."
mongosh \
  --username "$MONGO_INITDB_ROOT_USERNAME" \
  --password "$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase admin \
  --eval '
    use("nmpetshop");
    db.products.createIndex({ name: "text", description: "text" });
    db.products.createIndex({ category: 1 });
    db.products.createIndex({ brand: 1 });
    db.products.createIndex({ price: 1 });
    db.products.createIndex({ active: 1 });
    db.products.createIndex({ isBestSelling: 1 });
    print("Indexes created!");
    print("Total products: " + db.products.countDocuments());
  '

echo "============================================="
echo "  Database seeding complete!"
echo "============================================="
