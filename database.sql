
CREATE DATABASE hireroom;
USE hireroom;

-- =========================
-- 1. USERS
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- admin / user
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- 2. LANDLORDS
-- =========================
CREATE TABLE landlords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    zalo VARCHAR(50),
    facebook VARCHAR(255),
    note TEXT,
    status VARCHAR(30) DEFAULT 'đang hợp tác',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- 3. ROOMS
-- =========================
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    area FLOAT NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    district VARCHAR(100),
    ward VARCHAR(100),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    status VARCHAR(30) DEFAULT 'còn trống',
    type VARCHAR(50),
    electricPrice DECIMAL(10,2),
    waterPrice DECIMAL(10,2),
    internetPrice DECIMAL(10,2),
    maxPeople INT,
    furniture TEXT,
    landlordId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rooms_landlord
        FOREIGN KEY (landlordId) REFERENCES landlords(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- 4. IMAGE_ROOMS
-- =========================
CREATE TABLE image_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roomId INT NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_image_rooms_room
        FOREIGN KEY (roomId) REFERENCES rooms(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- 5. REVIEWS
-- =========================
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    roomId INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    status VARCHAR(30) DEFAULT 'chờ duyệt',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_room
        FOREIGN KEY (roomId) REFERENCES rooms(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- 6. REVIEW_REPLIES
-- =========================
CREATE TABLE review_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reviewId INT NOT NULL,
    staffId INT NOT NULL,
    replyContent TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_replies_review
        FOREIGN KEY (reviewId) REFERENCES reviews(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_review_replies_staff
        FOREIGN KEY (staffId) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- 7. EVENTS
-- =========================
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    startDate DATETIME,
    endDate DATETIME,
    location VARCHAR(255),
    status VARCHAR(30) DEFAULT 'sắp diễn ra',
    createdBy INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_createdBy
        FOREIGN KEY (createdBy) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- 8. CONVERSATIONS
-- =========================
CREATE TABLE conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    staffId INT,
    status VARCHAR(20) DEFAULT 'open',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_conversations_user
        FOREIGN KEY (userId) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_conversations_staff
        FOREIGN KEY (staffId) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- 9. MESSAGES
-- =========================
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversationId INT NOT NULL,
    senderId INT NOT NULL,
    senderType VARCHAR(20) NOT NULL,   -- user / staff
    receiverId INT NOT NULL,
    receiverType VARCHAR(20) NOT NULL, -- user / staff
    messageText TEXT NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_conversation
        FOREIGN KEY (conversationId) REFERENCES conversations(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- 10. AI_CONVERSATIONS
-- =========================
CREATE TABLE ai_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    title VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ai_conversations_user
        FOREIGN KEY (userId) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- 11. AI_MESSAGES
-- =========================
CREATE TABLE ai_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aiConversationId INT NOT NULL,
    senderType VARCHAR(20) NOT NULL, -- user / ai
    messageText TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ai_messages_conversation
        FOREIGN KEY (aiConversationId) REFERENCES ai_conversations(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- 12. FAVORITES
-- =========================
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    roomId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_favorites_user
        FOREIGN KEY (userId) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_favorites_room
        FOREIGN KEY (roomId) REFERENCES rooms(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT uq_favorites_user_room UNIQUE (userId, roomId)
);