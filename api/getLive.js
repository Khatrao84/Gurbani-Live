export default async function handler(req, res) {
  const channelId = req.query.channel;
  const apiKey = process.env.YT_API_KEY;

  if (!channelId || !apiKey) {
    return res.status(400).json({ error: "Missing channelId or API key" });
  }

  try {
    const yt = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`
    );
    const data = await yt.json();

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ error: "No live stream found" });
    }

    const videoId = data.items[0].id.videoId;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    res.json({ url: embedUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
