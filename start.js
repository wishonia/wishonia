const app = require('./server');
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
    console.log(`Server running on ${BASE_URL}`);
});