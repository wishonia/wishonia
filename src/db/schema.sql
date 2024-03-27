-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Poll Responses Table
CREATE TABLE poll_responses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    desired_allocation INTEGER NOT NULL,
    actual_allocation INTEGER NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Petitions Table
CREATE TABLE petitions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referrals Table
CREATE TABLE referrals (
    id SERIAL PRIMARY KEY,
    referrer_id INTEGER REFERENCES users(id),
    referred_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Localization (Optional, based on project description for future expansion)
CREATE TABLE localization (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    language VARCHAR(10) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gamification (Optional, based on project description for future expansion)
CREATE TABLE gamification (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    points INTEGER DEFAULT 0,
    badges TEXT, -- Could be a JSON field to store multiple badges
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
