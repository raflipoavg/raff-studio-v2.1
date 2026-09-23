export default async function handler(req, res) {
  // Hanya benarkan POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { model, contents, generationConfig, customApiKey } = req.body;
  
  // Gunakan Custom API Key (jika pengguna masukkan dalam UI) atau guna Environment Variable Server
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key tiada. Sila letakkan GEMINI_API_KEY dalam tetapan Vercel Environment.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const payload = { contents };
    
    // Tambah konfigurasi imej jika wujud
    if (generationConfig) {
      payload.generationConfig = generationConfig;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Kembalikan data daripada Google ke frontend
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
