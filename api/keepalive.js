// Runs once a day (see "crons" in vercel.json). A free Supabase project pauses
// itself after a week with no activity, which silently empties the shop.
// One tiny read a day keeps it awake.
const URL = "https://iqqdoswqrqqykskidakv.supabase.co";
const KEY = "sb_publishable_7KK8iwAdCziIp0Qo15hC2Q_cxiWPzG2";

module.exports = async (req, res) => {
  try {
    const r = await fetch(`${URL}/rest/v1/products?select=id&limit=1`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    });
    res.status(200).json({ ok: r.ok, status: r.status, at: new Date().toISOString() });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e) });
  }
};
