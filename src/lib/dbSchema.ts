export interface Column {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  foreignKeyTarget?: string; // e.g., "users.id"
  isNullable: boolean;
  defaultValue?: string;
  description: string;
}

export interface Relationship {
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  type: 'one-to-many' | 'many-to-one' | 'one-to-one' | 'many-to-many';
}

export interface Table {
  name: string;
  schema: string;
  description: string;
  rowCount: number;
  columns: Column[];
  sampleData: Record<string, any>[];
  sqlDefinition: string;
}

export interface DatabaseSchema {
  schemas: string[];
  tables: Table[];
  relationships: Relationship[];
}

export const mockDatabaseSchema: DatabaseSchema = {
  schemas: ["public", "auth", "analytics"],
  tables: [
    {
      name: "users",
      schema: "public",
      description: "Stores user profiles, roles, and status for the core application.",
      rowCount: 1420,
      columns: [
        { name: "id", type: "uuid", isPrimaryKey: true, isForeignKey: false, isNullable: false, defaultValue: "gen_random_uuid()", description: "Unique identifier for the user profile." },
        { name: "email", type: "varchar(255)", isPrimaryKey: false, isForeignKey: false, isNullable: false, description: "Primary contact email address. Must be unique." },
        { name: "display_name", type: "varchar(100)", isPrimaryKey: false, isForeignKey: false, isNullable: true, description: "User-facing nickname or full name." },
        { name: "role", type: "varchar(50)", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "'member'", description: "Access privileges. Valid roles: 'admin', 'editor', 'member'." },
        { name: "is_active", type: "boolean", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "true", description: "Whether the user account is allowed to log in." },
        { name: "created_at", type: "timestamptz", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "now()", description: "Record creation timestamp." },
        { name: "updated_at", type: "timestamptz", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "now()", description: "Last modification timestamp." }
      ],
      sampleData: [
        { id: "e030b42c-29b4-4b53-9118-47bc638ea120", email: "admin@datadiction.dev", display_name: "Master Admin", role: "admin", is_active: true, created_at: "2026-01-10T14:32:00Z", updated_at: "2026-05-15T09:12:11Z" },
        { id: "a5024fe2-9214-41d6-848e-ff53459c5d1e", email: "johndoe@gmail.com", display_name: "John Doe", role: "member", is_active: true, created_at: "2026-02-18T10:15:30Z", updated_at: "2026-02-18T10:15:30Z" },
        { id: "b2d049fa-ca31-4835-be02-4fb003781290", email: "alice.editor@outlook.com", display_name: "Alice Cooper", role: "editor", is_active: true, created_at: "2026-03-01T22:45:00Z", updated_at: "2026-06-12T18:05:00Z" }
      ],
      sqlDefinition: `CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) NOT NULL UNIQUE,
  display_name varchar(100),
  role varchar(50) NOT NULL DEFAULT 'member',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);`
    },
    {
      name: "dictionaries",
      schema: "public",
      description: "Stores definitions of different glossary/dictionaries created by users.",
      rowCount: 45,
      columns: [
        { name: "id", type: "uuid", isPrimaryKey: true, isForeignKey: false, isNullable: false, defaultValue: "gen_random_uuid()", description: "Unique identifier for the dictionary." },
        { name: "title", type: "varchar(150)", isPrimaryKey: false, isForeignKey: false, isNullable: false, description: "Name of the dictionary glossary." },
        { name: "description", type: "text", isPrimaryKey: false, isForeignKey: false, isNullable: true, description: "Full explanation of the dictionary scope." },
        { name: "owner_id", type: "uuid", isPrimaryKey: false, isForeignKey: true, foreignKeyTarget: "users.id", isNullable: false, description: "References the user who created this dictionary." },
        { name: "is_public", type: "boolean", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "true", description: "Whether guest users can read this dictionary." },
        { name: "created_at", type: "timestamptz", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "now()", description: "Record creation timestamp." }
      ],
      sampleData: [
        { id: "51c4a03e-72f1-4db5-b827-0cfc74577800", title: "Medical Terms Directory", description: "Standard terminology dictionary for clinic employees.", owner_id: "e030b42c-29b4-4b53-9118-47bc638ea120", is_public: true, created_at: "2026-01-11T12:00:00Z" },
        { id: "2810a9cf-9304-4df8-b572-132d7237ad7f", title: "Finance & Accounting Lexicon", description: "Internal ledger terms, currency conversions, and abbreviations.", owner_id: "b2d049fa-ca31-4835-be02-4fb003781290", is_public: false, created_at: "2026-03-02T11:30:15Z" }
      ],
      sqlDefinition: `CREATE TABLE public.dictionaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(150) NOT NULL,
  description text,
  owner_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);`
    },
    {
      name: "terms",
      schema: "public",
      description: "Holds all words, codes, abbreviations, or phrases defined within each dictionary.",
      rowCount: 850,
      columns: [
        { name: "id", type: "uuid", isPrimaryKey: true, isForeignKey: false, isNullable: false, defaultValue: "gen_random_uuid()", description: "Unique identifier for the term." },
        { name: "dictionary_id", type: "uuid", isPrimaryKey: false, isForeignKey: true, foreignKeyTarget: "dictionaries.id", isNullable: false, description: "References the parent dictionary this term belongs to." },
        { name: "category_id", type: "uuid", isPrimaryKey: false, isForeignKey: true, foreignKeyTarget: "categories.id", isNullable: true, description: "References the classification category." },
        { name: "word", type: "varchar(200)", isPrimaryKey: false, isForeignKey: false, isNullable: false, description: "The term/phrase text to define." },
        { name: "definition", type: "text", isPrimaryKey: false, isForeignKey: false, isNullable: false, description: "Clear definition of the term." },
        { name: "synonyms", type: "varchar[]", isPrimaryKey: false, isForeignKey: false, isNullable: true, description: "Array of words with similar meanings." },
        { name: "created_at", type: "timestamptz", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "now()", description: "Record creation timestamp." }
      ],
      sampleData: [
        { id: "e6f9fa12-32b0-4dbb-8ea9-bf9f8892d192", dictionary_id: "51c4a03e-72f1-4db5-b827-0cfc74577800", category_id: "4421b4a0-72f2-4cb6-ab8c-02cfc745781a", word: "Myocardial Infarction", definition: "Commonly known as a heart attack, it occurs when blood flow decreases or stops to a part of the heart, causing damage to the heart muscle.", synonyms: ["Heart attack", "MI"], created_at: "2026-01-12T09:15:00Z" },
        { id: "e82937fa-f18c-4fde-ba4c-0062f8312d8a", dictionary_id: "2810a9cf-9304-4df8-b572-132d7237ad7f", category_id: null, word: "EBITDA", definition: "Earnings Before Interest, Taxes, Depreciation, and Amortization. A metric used to evaluate a company's operating performance.", synonyms: ["Operating cash flow estimate"], created_at: "2026-03-05T14:40:00Z" }
      ],
      sqlDefinition: `CREATE TABLE public.terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dictionary_id uuid NOT NULL REFERENCES public.dictionaries(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  word varchar(200) NOT NULL,
  definition text NOT NULL,
  synonyms varchar[],
  created_at timestamptz NOT NULL DEFAULT now()
);`
    },
    {
      name: "categories",
      schema: "public",
      description: "Classifications for grouping specific glossaries and terms.",
      rowCount: 12,
      columns: [
        { name: "id", type: "uuid", isPrimaryKey: true, isForeignKey: false, isNullable: false, defaultValue: "gen_random_uuid()", description: "Unique identifier for the category." },
        { name: "name", type: "varchar(100)", isPrimaryKey: false, isForeignKey: false, isNullable: false, description: "Display name of the category." },
        { name: "color_hex", type: "varchar(7)", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "'#7c3aed'", description: "Hexadecimal color code for styling tags in UI." },
        { name: "created_at", type: "timestamptz", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "now()", description: "Record creation timestamp." }
      ],
      sampleData: [
        { id: "4421b4a0-72f2-4cb6-ab8c-02cfc745781a", name: "Cardiology", color_hex: "#ef4444", created_at: "2026-01-11T11:45:00Z" },
        { id: "c7fa22b1-098d-4f1a-b328-98e91d8acb34", name: "Acronyms & Abbreviations", color_hex: "#3b82f6", created_at: "2026-01-11T11:48:00Z" }
      ],
      sqlDefinition: `CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  color_hex varchar(7) NOT NULL DEFAULT '#7c3aed',
  created_at timestamptz NOT NULL DEFAULT now()
);`
    },
    {
      name: "users",
      schema: "auth",
      description: "Internal Supabase auth tables mapping registered authentication accounts.",
      rowCount: 1420,
      columns: [
        { name: "id", type: "uuid", isPrimaryKey: true, isForeignKey: false, isNullable: false, description: "Primary identifier matching identity." },
        { name: "email", type: "varchar(255)", isPrimaryKey: false, isForeignKey: false, isNullable: true, description: "Account email address." },
        { name: "encrypted_password", type: "varchar(255)", isPrimaryKey: false, isForeignKey: false, isNullable: true, description: "Hashed password." },
        { name: "last_sign_in_at", type: "timestamptz", isPrimaryKey: false, isForeignKey: false, isNullable: true, description: "Last session connection time." }
      ],
      sampleData: [
        { id: "e030b42c-29b4-4b53-9118-47bc638ea120", email: "admin@datadiction.dev", last_sign_in_at: "2026-06-12T10:00:00Z" }
      ],
      sqlDefinition: `-- Managed by Supabase internally. Do not modify.
CREATE TABLE auth.users (
  id uuid PRIMARY KEY,
  email varchar(255),
  encrypted_password varchar(255),
  last_sign_in_at timestamptz
);`
    },
    {
      name: "audit_logs",
      schema: "analytics",
      description: "Chronological log of administrative actions, user updates, and data edits.",
      rowCount: 8520,
      columns: [
        { name: "id", type: "bigint", isPrimaryKey: true, isForeignKey: false, isNullable: false, description: "Serial primary identifier." },
        { name: "action", type: "varchar(100)", isPrimaryKey: false, isForeignKey: false, isNullable: false, description: "Type of action performed (e.g. 'TERM_CREATE', 'USER_BAN')." },
        { name: "details", type: "jsonb", isPrimaryKey: false, isForeignKey: false, isNullable: true, description: "JSON format metadata parameters about the action." },
        { name: "performed_by", type: "uuid", isPrimaryKey: false, isForeignKey: true, foreignKeyTarget: "users.id", isNullable: true, description: "References the public.users record who executed the action." },
        { name: "ip_address", type: "inet", isPrimaryKey: false, isForeignKey: false, isNullable: true, description: "IP Address where request originated." },
        { name: "created_at", type: "timestamptz", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "now()", description: "Time event occurred." }
      ],
      sampleData: [
        { id: 10524, action: "TERM_CREATE", details: { word: "EBITDA", dictionary_id: "2810a9cf" }, performed_by: "b2d049fa-ca31-4835-be02-4fb003781290", ip_address: "192.168.1.52", created_at: "2026-03-05T14:40:00Z" },
        { id: 10525, action: "USER_LOGIN", details: { method: "oauth_google" }, performed_by: "a5024fe2-9214-41d6-848e-ff53459c5d1e", ip_address: "18.2.190.100", created_at: "2026-06-14T08:21:00Z" }
      ],
      sqlDefinition: `CREATE TABLE analytics.audit_logs (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  action varchar(100) NOT NULL,
  details jsonb,
  performed_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  ip_address inet,
  created_at timestamptz NOT NULL DEFAULT now()
);`
    },
    {
      name: "products",
      schema: "public",
      description: "Inventory items available for order in the ecommerce store system.",
      rowCount: 320,
      columns: [
        { name: "id", type: "uuid", isPrimaryKey: true, isForeignKey: false, isNullable: false, defaultValue: "gen_random_uuid()", description: "Unique identifier for the product." },
        { name: "name", type: "varchar(200)", isPrimaryKey: false, isForeignKey: false, isNullable: false, description: "Name of the product." },
        { name: "description", type: "text", isPrimaryKey: false, isForeignKey: false, isNullable: true, description: "Detailed product description." },
        { name: "price", type: "numeric(10,2)", isPrimaryKey: false, isForeignKey: false, isNullable: false, description: "Product price in USD." },
        { name: "stock", type: "integer", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "0", description: "Current inventory count available." },
        { name: "created_at", type: "timestamptz", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "now()", description: "Record creation timestamp." }
      ],
      sampleData: [
        { id: "3c5fbe60-d29a-41bf-8a50-d4fb01037801", name: "Premium Leather Notebook", description: "A5 hand-stitched notebook with 200 pages.", price: 24.99, stock: 120, created_at: "2026-04-01T10:00:00Z" },
        { id: "e102f9bc-cb32-473d-8ab1-19cd283a0052", name: "Ergonomic Mechanical Keyboard", description: "Hot-swappable 75% layout keyboard with brown switches.", price: 89.00, stock: 45, created_at: "2026-04-05T15:30:00Z" }
      ],
      sqlDefinition: `CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(200) NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);`
    },
    {
      name: "orders",
      schema: "public",
      description: "Customer orders tracking transaction total and order status.",
      rowCount: 1250,
      columns: [
        { name: "id", type: "uuid", isPrimaryKey: true, isForeignKey: false, isNullable: false, defaultValue: "gen_random_uuid()", description: "Unique identifier for the order." },
        { name: "customer_id", type: "uuid", isPrimaryKey: false, isForeignKey: true, foreignKeyTarget: "users.id", isNullable: false, description: "References the purchasing user." },
        { name: "status", type: "varchar(50)", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "'pending'", description: "Current state of order: 'pending', 'completed', 'shipped', 'cancelled'." },
        { name: "total_amount", type: "numeric(10,2)", isPrimaryKey: false, isForeignKey: false, isNullable: false, description: "Sum total of order items after discounts." },
        { name: "created_at", type: "timestamptz", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "now()", description: "Order placement timestamp." }
      ],
      sampleData: [
        { id: "88a2bfd3-0d32-421c-a111-c30ab5f38a1a", customer_id: "a5024fe2-9214-41d6-848e-ff53459c5d1e", status: "completed", total_amount: 113.99, created_at: "2026-04-10T11:20:00Z" }
      ],
      sqlDefinition: `CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.users(id),
  status varchar(50) NOT NULL DEFAULT 'pending',
  total_amount numeric(10,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);`
    },
    {
      name: "order_items",
      schema: "public",
      description: "Line items detailing products and quantities purchased inside an order.",
      rowCount: 3820,
      columns: [
        { name: "id", type: "uuid", isPrimaryKey: true, isForeignKey: false, isNullable: false, defaultValue: "gen_random_uuid()", description: "Unique identifier for the order line item." },
        { name: "order_id", type: "uuid", isPrimaryKey: false, isForeignKey: true, foreignKeyTarget: "orders.id", isNullable: false, description: "References parent order." },
        { name: "product_id", type: "uuid", isPrimaryKey: false, isForeignKey: true, foreignKeyTarget: "products.id", isNullable: false, description: "References purchased product." },
        { name: "quantity", type: "integer", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "1", description: "Quantity of product purchased." },
        { name: "unit_price", type: "numeric(10,2)", isPrimaryKey: false, isForeignKey: false, isNullable: false, description: "Price per unit at time of purchase." }
      ],
      sampleData: [
        { id: "f2c04d10-e221-4f32-ab20-21cd5e9ca330", order_id: "88a2bfd3-0d32-421c-a111-c30ab5f38a1a", product_id: "3c5fbe60-d29a-41bf-8a50-d4fb01037801", quantity: 1, unit_price: 24.99 },
        { id: "a1cd1f50-32d9-482a-a921-bc30e49ca210", order_id: "88a2bfd3-0d32-421c-a111-c30ab5f38a1a", product_id: "e102f9bc-cb32-473d-8ab1-19cd283a0052", quantity: 1, unit_price: 89.00 }
      ],
      sqlDefinition: `CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id),
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL
);`
    },
    {
      name: "reviews",
      schema: "public",
      description: "User submitted product ratings and feedback records.",
      rowCount: 540,
      columns: [
        { name: "id", type: "uuid", isPrimaryKey: true, isForeignKey: false, isNullable: false, defaultValue: "gen_random_uuid()", description: "Unique identifier for review." },
        { name: "product_id", type: "uuid", isPrimaryKey: false, isForeignKey: true, foreignKeyTarget: "products.id", isNullable: false, description: "References product being reviewed." },
        { name: "user_id", type: "uuid", isPrimaryKey: false, isForeignKey: true, foreignKeyTarget: "users.id", isNullable: false, description: "References reviewer profile." },
        { name: "rating", type: "integer", isPrimaryKey: false, isForeignKey: false, isNullable: false, description: "Numerical score from 1 to 5 stars." },
        { name: "comment", type: "text", isPrimaryKey: false, isForeignKey: false, isNullable: true, description: "Reviewer text feedback comments." },
        { name: "created_at", type: "timestamptz", isPrimaryKey: false, isForeignKey: false, isNullable: false, defaultValue: "now()", description: "Review creation time." }
      ],
      sampleData: [
        { id: "e12fbc30-da32-40cf-a201-cf5e9c0b1120", product_id: "3c5fbe60-d29a-41bf-8a50-d4fb01037801", user_id: "a5024fe2-9214-41d6-848e-ff53459c5d1e", rating: 5, comment: "High quality leather, exactly what I was looking for!", created_at: "2026-04-12T14:05:00Z" }
      ],
      sqlDefinition: `CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating integer NOT NULL,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);`
    }
  ],
  relationships: [
    { sourceTable: "dictionaries", sourceColumn: "owner_id", targetTable: "users", targetColumn: "id", type: "many-to-one" },
    { sourceTable: "terms", sourceColumn: "dictionary_id", targetTable: "dictionaries", targetColumn: "id", type: "many-to-one" },
    { sourceTable: "terms", sourceColumn: "category_id", targetTable: "categories", targetColumn: "id", type: "many-to-one" },
    { sourceTable: "audit_logs", sourceColumn: "performed_by", targetTable: "users", targetColumn: "id", type: "many-to-one" },
    { sourceTable: "orders", sourceColumn: "customer_id", targetTable: "users", targetColumn: "id", type: "many-to-one" },
    { sourceTable: "order_items", sourceColumn: "order_id", targetTable: "orders", targetColumn: "id", type: "many-to-one" },
    { sourceTable: "order_items", sourceColumn: "product_id", targetTable: "products", targetColumn: "id", type: "many-to-one" },
    { sourceTable: "reviews", sourceColumn: "product_id", targetTable: "products", targetColumn: "id", type: "many-to-one" },
    { sourceTable: "reviews", sourceColumn: "user_id", targetTable: "users", targetColumn: "id", type: "many-to-one" }
  ]
};
