# Admin Guide: How to Add Products and Create Pairings

## Quick Start: Adding Products to Your Shop

### Step 1: Access Admin Dashboard

1. **Login as Admin** - Make sure you're logged in with admin credentials
2. **Go to Admin Dashboard** - Click "🛠️ Admin Dashboard" in the top navigation bar
   - OR click "Admin Dashboard →" from the admin banner on your shop page

### Step 2: Add Coffees

1. **Click "Coffees" card** on the admin dashboard
2. **Click "Add Coffee"** button (top right)
3. **Fill in the form:**
   - **Shop*** - Select your shop from dropdown
   - **Name*** - e.g., "Espresso", "Cappuccino"
   - **Roast** - e.g., "Dark", "Medium", "Light"
   - **Origin** - e.g., "Colombia", "Ethiopia"
   - **Tasting Notes** - Comma-separated: "bold, chocolatey, nutty"
   - **Description** - Full description of the coffee
   - **Image URL** - Paste image URL (e.g., from image hosting service)
   - **Price** - Enter price (e.g., 4.50)
   - **Active** - Check to make it visible on shop page
4. **Click "Create"** button
5. Coffee is now added to your shop!

### Step 3: Add Pastries

1. **Click "Pastries" card** on the admin dashboard
2. **Click "Add Pastry"** button (top right)
3. **Fill in the form:**
   - **Shop*** - Select your shop from dropdown
   - **Name*** - e.g., "Chocolate Croissant", "Blueberry Muffin"
   - **Flavor Profile** - e.g., "sweet, buttery, flaky"
   - **Notes** - Additional notes about the pastry
   - **Image URL** - Paste image URL
   - **Price** - Enter price (e.g., 3.50)
   - **Active** - Check to make it visible
4. **Click "Create"** button
5. Pastry is now added to your shop!

### Step 4: Create Pairings (Link Coffees to Pastries)

1. **Click "Pairings" card** on the admin dashboard
2. **Click "Add Pairing"** button (top right)
3. **Fill in the form:**
   - **Shop*** - Select your shop
   - **Coffee*** - Select a coffee from dropdown (only shows coffees for selected shop)
   - **Pastry*** - Select a pastry from dropdown (only shows pastries for selected shop)
   - **Match Score*** - Enter 1-100 (higher = better match)
     - 90-100: Excellent Match
     - 75-89: Great Match
     - 60-74: Good Match
     - Below 60: Fair Match
   - **Reasoning** - Write 1-2 sentences explaining why this pairing works
     - Example: "The bold intensity of espresso perfectly complements the rich chocolate flavor of the croissant."
   - **Active** - Check to make pairing visible
4. **Click "Create"** button
5. Pairing is now created! When customers select that coffee, they'll see this pastry as a suggestion.

### Step 5: Edit or Delete Items

**To Edit:**
- Go to Coffees, Pastries, or Pairings page
- Click **"Edit"** button next to any item
- Modify the fields
- Click **"Update"**

**To Delete:**
- Click **"Delete"** button next to any item
- Confirm deletion
- Item is permanently removed

## Example Workflow: Setting Up a Complete Shop

### 1. First, Add Your Shop (if not already created)
- Go to **"Shops"** → **"Add Shop"**
- Enter shop name, slug, and description
- Save the QR code shown

### 2. Add 4-7 Coffees
- Go to **"Coffees"** → **"Add Coffee"**
- Select your shop
- Add each coffee with:
  - Name, roast, origin
  - Image URL
  - Price
  - Description

### 3. Add Pastries
- Go to **"Pastries"** → **"Add Pastry"**
- Select your shop
- Add each pastry with:
  - Name
  - Image URL
  - Price
  - Flavor profile

### 4. Create Pairings
- Go to **"Pairings"** → **"Add Pairing"**
- For each coffee, create 1-3 pastry pairings:
  - Select coffee
  - Select pastry
  - Set match score (75-95 recommended)
  - Write reasoning (1-2 sentences)

### 5. View Your Shop
- Go to **"Shops"** → Click **"View"** next to your shop
- See your menu with all coffees and pastries
- Test the pairing flow by clicking on a coffee

## Tips for Best Results

### Pairing Tips:
- **Match Score Guidelines:**
  - 90-100: Perfect combinations (e.g., Espresso + Chocolate Croissant)
  - 75-89: Great matches (e.g., Cappuccino + Blueberry Muffin)
  - 60-74: Good matches (e.g., Latte + Cinnamon Roll)
  
- **Reasoning Best Practices:**
  - Keep it short (1-2 sentences)
  - Explain flavor compatibility
  - Example: "The creamy cappuccino balances beautifully with the fruity sweetness of the blueberry muffin."

### Image Tips:
- Use high-quality images
- Recommended size: 800x600px or larger
- Upload to image hosting service (Imgur, Cloudinary, etc.)
- Copy the direct image URL
- Paste into Image URL field

### Price Tips:
- Enter prices with decimals (e.g., 4.50, not 4.5)
- Prices are optional but recommended
- Display format: $4.50

## Quick Actions from Shop Page

When viewing your shop as admin, you'll see an **Admin Mode** banner with quick buttons:
- **Admin Dashboard** → Full admin panel
- **Add Coffees** → Quick access to add coffees
- **Add Pastries** → Quick access to add pastries
- **Manage Pairings** → Quick access to pairings

## Need Help?

- All forms have required fields marked with *
- Hover over fields to see tooltips
- Use "Cancel" to close forms without saving
- Changes are saved immediately after clicking Create/Update

