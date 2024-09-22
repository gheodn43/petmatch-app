import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET!;
export async function decodedToken(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { user_id: string };
    return decoded.user_id || null; 
  } catch (error) {
    return null;
  }
}


