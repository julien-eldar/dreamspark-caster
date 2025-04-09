const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Google Gemini API
if (!process.env.GOOGLE_API_KEY) {
  console.error('FATAL ERROR: GOOGLE_API_KEY is not set');
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Prompt template
const generateProfilePrompt = (transcript) => `
Rôle / Contexte :
Tu es un assistant chargé de créer des fiches de candidats pour un jeu télévisé style « Loup Garou », en t’appuyant sur des transcripts d’entretiens fournis. Tu analyseras le transcript pour comprendre le profil du candidat, son parcours, ses forces, ses faiblesses, et tu produiras une fiche sous la forme suivante :

Un Titre (court, impactant)
Un Sous-titre (en majuscules, décrivant brièvement la profession/activité principale du candidat)
Un Résumé (un paragraphe complet et développé, mettant en avant parcours, compétences, accomplissements, impact et lien avec le jeu)
Des Forces (liste de qualités pertinentes pour le jeu, en majuscules)
Des Faiblesses (une ou deux faiblesses, en majuscules, adaptées au contexte du jeu)
Le ton doit être factuel, clair et dynamique. Le résumé doit évoquer les réussites professionnelles, les éventuelles publications, distinctions, compétences clés (ex : esprit analytique, intuition, adaptabilité), et montrer comment cela pourrait se traduire en atouts dans une partie du Loup Garou (capacité à manipuler, à convaincre, à observer, à analyser). Le tout doit être fidèle aux données trouvées dans le transcript, sans ajout d’informations non justifiées.

Format et Style :
Le Titre : une formule courte et percutante (ex : « L’as des maths »).
Le Sous-titre : une ligne en majuscules, décrivant le cœur de son activité (ex : « SCIENTIFIQUE NUMÉRICIENNE ET ENTREPRENEUSE SPÉCIALISÉE DANS LES ALGORITHMES »).
Le Résumé : un paragraphe mettant en avant le parcours professionnel, les réalisations, éventuellement des publications ou classements, l’impact social, et la vision du candidat. Insérer au besoin la manière dont ses compétences pourraient se traduire en avantage dans le jeu.
Les Forces : liste à puces, en majuscules (ex : STRATÈGE, VISE L’EXCELLENCE, INTUITIVE, ANALYSE, CONVAINCANTE…).
Les Faiblesses : liste à puces, en majuscules, 1 ou 2 faiblesses en lien avec le jeu (ex : NE LAISSE PAS LA PAROLE, NIVEAU MOYEN DU JEU).

Transcript:
---
${transcript}
---
Candidate Profile:
`;

router.post('/', authenticateToken, upload.single('transcript'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.txt' && ext !== '.docx') {
      return res.status(400).json({ error: 'Only .txt or .docx files allowed' });
    }
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 5MB' });
    }

    let transcript;
    if (ext === '.txt') {
      transcript = file.buffer.toString('utf-8');
    } else {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      transcript = result.value;
    }

    // Generate prompt and call Gemini
    const prompt = generateProfilePrompt(transcript);
    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response || !response.text()) {
      throw new Error('Gemini response was empty or blocked');
    }

    const profileText = response.text();
    const profile = profileText.split('Candidate Profile:')[1]?.trim() || profileText;

    res.json({ profile });
  } catch (error) {
    console.error('Error generating profile:', error.message);
    res.status(500).json({ error: `Failed to generate profile: ${error.message}` });
  }
});

module.exports = router;