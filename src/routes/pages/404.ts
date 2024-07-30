import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

router.get('*', (req, res, next) => {
  res.status(404).header('Content-Type', 'text/html');
  const template404 = path.resolve(__dirname, "./templates/404/index.html")
  fs.createReadStream(template404).pipe(res);
});

export default router;
