const express = require('express');
const app = require('./app');
const { PORT } = require('./utils/config');

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}` );
})