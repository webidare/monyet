// pages/api/messages.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sql, withTransaction } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Apply rate limiting
    await limiter.check(res, 10, 'CACHE_TOKEN');

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

      // Use transaction for data integrity
      const result = await withTransaction(async (client) => {
        const { rows } = await client.query(
          'INSERT INTO love_messages (recipient, message, intensity) VALUES ($1, $2, $3) RETURNING id',
          [recipient, message, intensity]
        );
        return rows[0];
      });

      return res.status(200).json({ id: result.id });

    } else if (req.method === 'GET') {
      const { recipient = '' } = req.query;

      if (typeof recipient !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid recipient parameter' 
        });
      }

      const { rows } = await sql.query(
        `SELECT * FROM love_messages 
         WHERE recipient ILIKE $1 
         ORDER BY created_at DESC 
         LIMIT 50`,
        [`%${recipient}%`]
      );

      return res.status(200).json(rows);

    } else {
      return res.status(405).json({ 
        error: 'Method not allowed' 
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}