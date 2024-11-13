// pages/api/messages/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    // Basic UUID format validation
    if (!id || typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return res.status(400).json({ error: 'Invalid message ID format' });
    }

    const result = await sql`
      SELECT id, recipient, message, intensity, created_at
      FROM love_messages
      WHERE id = ${id}::uuid
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}