const router = require('express')();
const fs = require('fs');
const request = require('request');

router.get('', async (req, res) => {
  try {
    // const path = request('');
    const path = './backend/assets/3. 3- Setting Up the Development.mp4';
    const stats = fs.statSync(path);
    const fileSize = stats.size;
    console.log(fileSize);
    const range = req.headers.range
    console.log(range);
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");

      const start = parseInt(parts[0], 10);
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1;

      const chunksize = (end-start)+1;
      const file = fs.createReadStream(path, {start, end});

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
  } catch(err) {
    console.log(err);
    res.status(400).json(err.message);
  }
});


module.exports = router;
