import type { PoolClient } from "pg";

/** Sum of hero_points minus completed + processing redemptions = spendable balance. */
export async function getAvailablePoints(client: PoolClient, userId: string): Promise<number> {
  const earnedR = await client.query<{ v: string }>(
    `SELECT COALESCE(SUM(amount), 0)::text AS v FROM hero_points WHERE user_id = $1`,
    [userId]
  );
  const spentR = await client.query<{ v: string }>(
    `
    SELECT COALESCE(SUM(points_spent), 0)::text AS v
    FROM point_redemptions
    WHERE user_id = $1 AND status IN ('completed', 'processing')
    `,
    [userId]
  );
  const earned = Number(earnedR.rows[0]?.v ?? 0);
  const spent = Number(spentR.rows[0]?.v ?? 0);
  return earned - spent;
}
