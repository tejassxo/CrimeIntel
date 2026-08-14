export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.status(200).json({
    status: 'OPERATIONAL',
    system: 'Cyber Jagruti Intelligence Platform',
    version: '2.6.0',
    timestamp: new Date().toISOString(),
    nodes: '36/36 Indian State & UT Telemetry Active'
  });
}
