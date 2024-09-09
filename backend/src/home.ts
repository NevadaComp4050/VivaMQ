import * as path from 'path';
import { Router, type Request, type Response } from 'express';
import { getLoggedInUser } from '@/utils/authUtils';

const home: Router = Router();

home.get('/', (_req: Request, res: Response) => {
  try {
    res.sendFile(path.join(__dirname, '../public/home.html'));
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.toString(),
    });
  }
});

home.get('/profile', async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message });
  }
});

export default home;
