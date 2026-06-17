const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

// Pipeline Middlewares
app.use(cors());
app.use(express.json());

// Main Lead Generation Endpoint
app.post('/api/leads', async (req, res) => {
    const { name, email, phone } = req.body;

    // Validation Guard
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'All fields (name, email, phone) are required.' });
    }

    try {
        // Save using Prisma
        const generatedLead = await prisma.lead.create({
            data: {
                name: name,
                email: email,
                phone: phone
            }
        });

        return res.status(201).json({ 
            message: 'Lead verified and captured successfully!', 
            id: generatedLead.id 
        });
        
    } catch (dbError) {
        console.error('Database insertion error:', dbError);
        return res.status(500).json({ error: 'Internal database error saving records.' });
    }
});

// App State Termination Handler
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`[CCTV Service Pipeline] Active on port validation address http://localhost:${PORT}`);
});