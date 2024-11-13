// pages/api/messages.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { recipient, message, intensity } = req.body;

      // Validation
      if (!recipient || !message || typeof intensity !== 'number') {
        return res.status(400).json({ 
          error: 'Missing or invalid fields' 
        });
      }

      if (intensity < 0 || intensity > 100) {
        return res.status(400).json({ 
          error: 'Love intensity must be between 0 and 100' 
        });
      }

      // Let PostgreSQL handle UUID generation
      const result = await sql`
        INSERT INTO love_messages (recipient, message, intensity)
        VALUES (${recipient}, ${message}, ${intensity})
        RETURNING id;
      `;
      
      return res.status(200).json({ id: result.rows[0].id });

    } else if (req.method === 'GET') {
      const { recipient = '' } = req.query;

      if (typeof recipient !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid recipient parameter' 
        });
      }

      const result = await sql`
        SELECT * FROM love_messages
        WHERE recipient ILIKE ${`%${recipient}%`}
        ORDER BY created_at DESC
        LIMIT 50;
      `;
      
      return res.status(200).json(result.rows);

    } else {
      return res.status(405).json({ 
        error: 'Method not allowed' 
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}
