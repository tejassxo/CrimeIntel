import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  // Enforce GET method only
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const jsonPath = path.join(process.cwd(), 'public', 'intelligence_dashboard_data.json');
    
    if (!fs.existsSync(jsonPath)) {
      // Fallback if root level
      const rootJsonPath = path.join(process.cwd(), 'intelligence_dashboard_data.json');
      const data = fs.readFileSync(rootJsonPath, 'utf8');
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(data);
    }

    const data = fs.readFileSync(jsonPath, 'utf8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(data);
  } catch (error) {
    console.error('API /api/intelligence error:', error);
    return res.status(500).json({ error: 'Internal Server Error fetching intelligence data' });
  }
}
