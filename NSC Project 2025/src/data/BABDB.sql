CREATE TABLE profile (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    user_level INT DEFAULT 1,
    user_exp INT DEFAULT 0,
    user_cookie INT DEFAULT 0,
    user_avatar VARCHAR(255),
    user_statistics JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE electronics (
    electronic_id INT PRIMARY KEY AUTO_INCREMENT,
    electronic_name VARCHAR(100) NOT NULL,
    electronic_desc TEXT,
    electronic_picture VARCHAR(255),
    electronic_thumbnail VARCHAR(255),
    electronic_unlocked BOOLEAN DEFAULT FALSE,
    electronic_save BOOLEAN DEFAULT FALSE
);

CREATE TABLE tools (
    tool_id INT PRIMARY KEY AUTO_INCREMENT,
    tool_name VARCHAR(100) NOT NULL,
    tool_desc TEXT,
    tool_picture VARCHAR(255),
    tool_thumbnail VARCHAR(255),
    tool_unlocked BOOLEAN DEFAULT FALSE,
    tool_save BOOLEAN DEFAULT FALSE
);

CREATE TABLE symbols (
    symbol_id INT PRIMARY KEY AUTO_INCREMENT,
    symbol_name VARCHAR(100) NOT NULL,
    symbol_desc TEXT,
    symbol_picture VARCHAR(255),
    symbol_thumbnail VARCHAR(255),
    symbol_unlocked BOOLEAN DEFAULT FALSE,
    symbol_save BOOLEAN DEFAULT FALSE
);