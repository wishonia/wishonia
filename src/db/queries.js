const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Additional configuration might be required here for SSL, etc.
});

const createUser = async (email, password) => {
    const query = `
        INSERT INTO users(email, password)
        VALUES($1, $2)
        RETURNING id, email;
    `;
    const values = [email, password];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error creating user', err.stack);
        throw err;
    }
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT id, email, password
        FROM users
        WHERE email = $1;
    `;
    const values = [email];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error finding user by email', err.stack);
        throw err;
    }
};

const savePollResponse = async (userId, desiredAllocation, actualAllocation) => {
    const query = `
        INSERT INTO poll_responses(user_id, desired_allocation, actual_allocation)
        VALUES($1, $2, $3)
        RETURNING id;
    `;
    const values = [userId, desiredAllocation, actualAllocation];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error saving poll response', err.stack);
        throw err;
    }
};

const getAverageAllocations = async () => {
    const query = `
        SELECT AVG(desired_allocation) AS avg_desired_allocation, AVG(actual_allocation) AS avg_actual_allocation
        FROM poll_responses;
    `;
    try {
        const res = await pool.query(query);
        return res.rows[0];
    } catch (err) {
        console.error('Error getting average allocations', err.stack);
        throw err;
    }
};

const savePetitionSignature = async (userId, name, email, address, city, state, zip) => {
    const query = `
        INSERT INTO petitions(user_id, name, email, address, city, state, zip)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
    `;
    const values = [userId, name, email, address, city, state, zip];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error saving petition signature', err.stack);
        throw err;
    }
};

const getReferralsByUserId = async (userId) => {
    const query = `
        SELECT r.id, u.email, r.created_at
        FROM referrals r
        JOIN users u ON u.id = r.referred_id
        WHERE r.referrer_id = $1;
    `;
    const values = [userId];
    try {
        const res = await pool.query(query, values);
        return res.rows;
    } catch (err) {
        console.error('Error getting referrals by user ID', err.stack);
        throw err;
    }
};

module.exports = {
    createUser,
    findUserByEmail,
    savePollResponse,
    getAverageAllocations,
    savePetitionSignature,
    getReferralsByUserId,
};
