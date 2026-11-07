import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const PETS_FILE = path.join(__dirname, 'data', 'pets.json');
const ADOPTIONS_FILE = path.join(__dirname, 'data', 'adoptions.json');

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Helper functions for reading/writing JSON
async function readJsonFile(filePath, defaultData = []) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeJsonFile(filePath, defaultData);
      return defaultData;
    }
    console.error(`Error reading ${filePath}:`, err);
    throw err;
  }
}

async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PawHome API', timestamp: new Date().toISOString() });
});

// GET /api/pets - return all pets (with optional filtering)
app.get('/api/pets', async (req, res) => {
  try {
    const pets = await readJsonFile(PETS_FILE, []);
    const { type, search, gender, age } = req.query;

    let filtered = pets;

    if (type && type.toLowerCase() !== 'all') {
      filtered = filtered.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }

    if (gender && gender.toLowerCase() !== 'all') {
      filtered = filtered.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
    }

    if (age && age.toLowerCase() !== 'all') {
      filtered = filtered.filter(p => {
        if (age === 'baby') return p.ageYears < 1;
        if (age === 'young') return p.ageYears >= 1 && p.ageYears <= 3;
        if (age === 'adult') return p.ageYears > 3;
        return true;
      });
    }

    if (search) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.breed.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
      );
    }

    res.json(filtered);
  } catch (err) {
    console.error('Failed to get pets:', err);
    res.status(500).json({ error: 'Failed to retrieve pets' });
  }
});

// GET /api/pets/:id - return one pet
app.get('/api/pets/:id', async (req, res) => {
  try {
    const pets = await readJsonFile(PETS_FILE, []);
    const pet = pets.find(p => p.id === req.params.id);

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    res.json(pet);
  } catch (err) {
    console.error('Failed to get pet:', err);
    res.status(500).json({ error: 'Failed to retrieve pet' });
  }
});

// POST /api/pets - add new pet
app.post('/api/pets', async (req, res) => {
  try {
    const { name, type, breed, age, ageYears, gender, size, location, image, story, fee, temperament, healthNotes, vaccinated } = req.body;

    if (!name || !type || !breed) {
      return res.status(400).json({ error: 'Name, type, and breed are required.' });
    }

    const pets = await readJsonFile(PETS_FILE, []);

    const newPet = {
      id: `pet-${Date.now()}`,
      name: name.trim(),
      type: type.trim(),
      breed: breed.trim(),
      age: age ? age.trim() : '1 year',
      ageYears: Number(ageYears) || 1,
      gender: gender || 'Male',
      size: size || 'Medium',
      location: location ? location.trim() : 'San Francisco, CA',
      image: image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=80',
      vaccinated: vaccinated !== undefined ? Boolean(vaccinated) : true,
      neutered: true,
      healthNotes: healthNotes || 'Vaccinated, dewormed, and given full veterinary checkup.',
      story: story || `${name} is an affectionate companion looking for a safe and loving home.`,
      temperament: Array.isArray(temperament) && temperament.length > 0 ? temperament : ['Friendly', 'Playful', 'Sweet'],
      goodWith: {
        kids: true,
        dogs: true,
        cats: true
      },
      fee: Number(fee) || 100
    };

    pets.push(newPet);
    await writeJsonFile(PETS_FILE, pets);

    res.status(201).json({
      message: 'Pet listed for adoption successfully!',
      pet: newPet
    });
  } catch (err) {
    console.error('Failed to create pet:', err);
    res.status(500).json({ error: 'Failed to add pet' });
  }
});

// DELETE /api/pets/:id - remove pet
app.delete('/api/pets/:id', async (req, res) => {
  try {
    const pets = await readJsonFile(PETS_FILE, []);
    const filtered = pets.filter(p => p.id !== req.params.id);

    if (filtered.length === pets.length) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    await writeJsonFile(PETS_FILE, filtered);
    res.json({ message: 'Pet removed successfully' });
  } catch (err) {
    console.error('Failed to delete pet:', err);
    res.status(500).json({ error: 'Failed to remove pet' });
  }
});

// GET /api/adoptions - return all adoption requests
app.get('/api/adoptions', async (req, res) => {
  try {
    const adoptions = await readJsonFile(ADOPTIONS_FILE, []);
    // Sort newest first
    adoptions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    res.json(adoptions);
  } catch (err) {
    console.error('Failed to get adoptions:', err);
    res.status(500).json({ error: 'Failed to retrieve adoption requests' });
  }
});

// POST /api/adoptions - save new adoption request
app.post('/api/adoptions', async (req, res) => {
  try {
    const {
      petId,
      petName,
      petImage,
      petBreed,
      fullName,
      phone,
      email,
      city,
      livingSituation,
      housingType,
      hasOtherPets,
      experience,
      adoptionReason
    } = req.body;

    // Validation
    if (!fullName || !phone || !email || !city || !adoptionReason || !livingSituation) {
      return res.status(400).json({
        error: 'Missing required fields: fullName, phone, email, city, livingSituation, adoptionReason are required.'
      });
    }

    const adoptions = await readJsonFile(ADOPTIONS_FILE, []);

    const newAdoption = {
      id: `adopt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      petId: petId || null,
      petName: petName || 'Undecided / Any Pet',
      petImage: petImage || null,
      petBreed: petBreed || '',
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim(),
      livingSituation: livingSituation.trim(),
      housingType: housingType || 'Apartment / House',
      hasOtherPets: hasOtherPets || 'None',
      experience: experience || 'First-time pet parent',
      adoptionReason: adoptionReason.trim(),
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };

    adoptions.unshift(newAdoption);
    await writeJsonFile(ADOPTIONS_FILE, adoptions);

    res.status(201).json({
      message: 'Adoption application submitted successfully!',
      adoption: newAdoption
    });
  } catch (err) {
    console.error('Failed to save adoption:', err);
    res.status(500).json({ error: 'Failed to submit adoption application' });
  }
});

// PATCH /api/adoptions/:id/status - update status (Pending / Approved / Rejected)
app.patch('/api/adoptions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Approved', 'Rejected'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    }

    const adoptions = await readJsonFile(ADOPTIONS_FILE, []);
    const index = adoptions.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Adoption request not found' });
    }

    adoptions[index].status = status;
    adoptions[index].updatedAt = new Date().toISOString();

    await writeJsonFile(ADOPTIONS_FILE, adoptions);

    res.json({
      message: `Request status updated to ${status}`,
      adoption: adoptions[index]
    });
  } catch (err) {
    console.error('Failed to update adoption status:', err);
    res.status(500).json({ error: 'Failed to update adoption request status' });
  }
});

// DELETE /api/adoptions/:id - delete request
app.delete('/api/adoptions/:id', async (req, res) => {
  try {
    const adoptions = await readJsonFile(ADOPTIONS_FILE, []);
    const filtered = adoptions.filter(a => a.id !== req.params.id);

    if (filtered.length === adoptions.length) {
      return res.status(404).json({ error: 'Adoption request not found' });
    }

    await writeJsonFile(ADOPTIONS_FILE, filtered);
    res.json({ message: 'Adoption application deleted successfully' });
  } catch (err) {
    console.error('Failed to delete adoption:', err);
    res.status(500).json({ error: 'Failed to delete adoption application' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🐾 PawHome Backend Server running on http://localhost:${PORT}`);
});

