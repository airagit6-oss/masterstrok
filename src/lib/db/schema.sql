-- ============================================================
-- DATABASE SCHEMA — SAASHUB MARKETPLACE (ERD READY)
-- ============================================================

-- USERS
CREATE TABLE users (
  id          VARCHAR(36) PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('user', 'admin', 'reseller') NOT NULL DEFAULT 'user',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS
CREATE TABLE products (
  id              VARCHAR(36) PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  macro_category  VARCHAR(100) NOT NULL,
  sub_category    VARCHAR(100),
  micro_category  VARCHAR(100),
  price           DECIMAL(10,2) NOT NULL,
  original_price  DECIMAL(10,2),
  description     TEXT,
  version         VARCHAR(20),
  last_update     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  author_id       VARCHAR(36),
  status          ENUM('trending','new','popular','featured') DEFAULT 'new',
  rating          DECIMAL(3,2) DEFAULT 0,
  reviews_count   INT DEFAULT 0,
  users_count     INT DEFAULT 0,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- PRODUCT SUBSCRIPTION PRICES
CREATE TABLE product_pricing (
  id          VARCHAR(36) PRIMARY KEY,
  product_id  VARCHAR(36) NOT NULL,
  plan        ENUM('monthly','yearly','lifetime') NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- PRODUCT MEDIA (images / video)
CREATE TABLE product_media (
  id          VARCHAR(36) PRIMARY KEY,
  product_id  VARCHAR(36) NOT NULL,
  image_url   TEXT NOT NULL,
  type        ENUM('image','video') DEFAULT 'image',
  sort_order  INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- PRODUCT FEATURES
CREATE TABLE product_features (
  id            VARCHAR(36) PRIMARY KEY,
  product_id    VARCHAR(36) NOT NULL,
  feature_text  VARCHAR(500) NOT NULL,
  sort_order    INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- PRODUCT MODULES
CREATE TABLE product_modules (
  id           VARCHAR(36) PRIMARY KEY,
  product_id   VARCHAR(36) NOT NULL,
  module_name  VARCHAR(255) NOT NULL,
  sort_order   INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- PRODUCT TAGS
CREATE TABLE product_tags (
  id          VARCHAR(36) PRIMARY KEY,
  product_id  VARCHAR(36) NOT NULL,
  tag         VARCHAR(100) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- PRODUCT REVIEWS
CREATE TABLE product_reviews (
  id          VARCHAR(36) PRIMARY KEY,
  product_id  VARCHAR(36) NOT NULL,
  user_id     VARCHAR(36) NOT NULL,
  rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)
);

-- CART
CREATE TABLE cart (
  id          VARCHAR(36) PRIMARY KEY,
  user_id     VARCHAR(36) NOT NULL,
  product_id  VARCHAR(36) NOT NULL,
  quantity    INT NOT NULL DEFAULT 1,
  plan        ENUM('monthly','yearly','lifetime') NOT NULL DEFAULT 'yearly',
  added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cart_item (user_id, product_id),
  FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ORDERS
CREATE TABLE orders (
  id             VARCHAR(36) PRIMARY KEY,
  user_id        VARCHAR(36) NOT NULL,
  product_id     VARCHAR(36) NOT NULL,
  plan           ENUM('monthly','yearly','lifetime') NOT NULL,
  amount         DECIMAL(10,2) NOT NULL,
  status         ENUM('pending','completed','refunded','cancelled') DEFAULT 'pending',
  payment_status ENUM('unpaid','paid','failed') DEFAULT 'unpaid',
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id          VARCHAR(36) PRIMARY KEY,
  user_id     VARCHAR(36) NOT NULL,
  product_id  VARCHAR(36) NOT NULL,
  plan        ENUM('monthly','yearly','lifetime') NOT NULL,
  status      ENUM('active','expired','cancelled') DEFAULT 'active',
  starts_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiry      TIMESTAMP,
  order_id    VARCHAR(36),
  FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id)   REFERENCES orders(id)
);

-- ============================================================
-- RELATIONS SUMMARY
-- ============================================================
-- products        → product_media     (1:N)
-- products        → product_features  (1:N)
-- products        → product_modules   (1:N)
-- products        → product_tags      (1:N)
-- products        → product_pricing   (1:N)
-- products        → product_reviews   (1:N)
-- users           → orders            (1:N)
-- users           → cart              (1:N)
-- users           → subscriptions     (1:N)
-- orders          → subscriptions     (1:1)

-- ============================================================
-- RESELLER EXTENSION TABLES
-- ============================================================

-- RESELLERS (reseller profile linked to users table)
CREATE TABLE resellers (
  id            VARCHAR(36) PRIMARY KEY,
  user_id       VARCHAR(36) NOT NULL UNIQUE,
  name          VARCHAR(255) NOT NULL,
  referral_code VARCHAR(50) UNIQUE,
  commission    DECIMAL(5,2) NOT NULL DEFAULT 30.00,
  status        ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- RESELLER MANAGED USERS (users created / managed by a reseller)
CREATE TABLE reseller_users (
  id               VARCHAR(36) PRIMARY KEY,
  reseller_id      VARCHAR(36) NOT NULL,
  user_id          VARCHAR(36) NOT NULL,
  assigned_product VARCHAR(36),
  plan             VARCHAR(50),
  status           ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_reseller_user (reseller_id, user_id),
  FOREIGN KEY (reseller_id)      REFERENCES resellers(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)          REFERENCES users(id)     ON DELETE CASCADE,
  FOREIGN KEY (assigned_product) REFERENCES products(id)  ON DELETE SET NULL
);

-- RESELLER LEADS
CREATE TABLE reseller_leads (
  id          VARCHAR(36) PRIMARY KEY,
  reseller_id VARCHAR(36) NOT NULL,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255),
  phone       VARCHAR(50),
  source      VARCHAR(100),
  status      ENUM('New Lead','Contacted','Qualified','Converted') NOT NULL DEFAULT 'New Lead',
  notes       TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reseller_id) REFERENCES resellers(id) ON DELETE CASCADE
);

-- RESELLER CONTACTS (CRM)
CREATE TABLE reseller_contacts (
  id          VARCHAR(36) PRIMARY KEY,
  reseller_id VARCHAR(36) NOT NULL,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255),
  phone       VARCHAR(50),
  source      VARCHAR(100),
  linked_lead VARCHAR(36),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reseller_id) REFERENCES resellers(id) ON DELETE CASCADE,
  FOREIGN KEY (linked_lead) REFERENCES reseller_leads(id) ON DELETE SET NULL
);

-- RESELLER CONTACT TAGS
CREATE TABLE reseller_contact_tags (
  id         VARCHAR(36) PRIMARY KEY,
  contact_id VARCHAR(36) NOT NULL,
  tag        VARCHAR(100) NOT NULL,
  FOREIGN KEY (contact_id) REFERENCES reseller_contacts(id) ON DELETE CASCADE
);

-- RESELLER SUBSCRIPTIONS (reseller assigns subscriptions to their users)
CREATE TABLE reseller_subscriptions (
  id            VARCHAR(36) PRIMARY KEY,
  reseller_id   VARCHAR(36) NOT NULL,
  user_id       VARCHAR(36) NOT NULL,
  product_id    VARCHAR(36) NOT NULL,
  plan          VARCHAR(50) NOT NULL,
  status        ENUM('Active','Expired','Disabled') NOT NULL DEFAULT 'Active',
  start_date    DATE NOT NULL,
  expiry_date   DATE NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reseller_id) REFERENCES resellers(id)  ON DELETE CASCADE,
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (product_id)  REFERENCES products(id)   ON DELETE CASCADE
);

-- RESELLER EARNINGS
CREATE TABLE reseller_earnings (
  id          VARCHAR(36) PRIMARY KEY,
  reseller_id VARCHAR(36) NOT NULL,
  source      VARCHAR(255) NOT NULL,
  type        ENUM('Commission','Referral Bonus') NOT NULL DEFAULT 'Commission',
  amount      DECIMAL(10,2) NOT NULL,
  status      ENUM('Paid','Pending') NOT NULL DEFAULT 'Pending',
  earned_at   DATE NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reseller_id) REFERENCES resellers(id) ON DELETE CASCADE
);

-- ============================================================
-- RESELLER RELATIONS SUMMARY
-- ============================================================
-- resellers           → reseller_users         (1:N)
-- resellers           → reseller_leads         (1:N)
-- resellers           → reseller_contacts      (1:N)
-- resellers           → reseller_subscriptions (1:N)
-- resellers           → reseller_earnings      (1:N)
-- reseller_contacts   → reseller_contact_tags  (1:N)
-- reseller_contacts   → reseller_leads         (N:1, optional link)
-- reseller_users      → products               (N:1)
-- reseller_subscriptions → products            (N:1)
