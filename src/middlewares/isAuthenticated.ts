import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { Payload } from "../models/interfaces/user/auth/Payload";

export function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Carregar a URL de documentação do .env
  const authorizedUrl = process.env.AUTHORIZED_URL;

  if (request.rawHeaders.includes(authorizedUrl)) {
    return next(); // Deixa que a requisição prossiga
  }

  // Acessar token JWT
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).end();
  }

  const [, token] = authToken.split(" ");

  try {
    // Validar token
    const { sub } = verify(token, process.env.JWT_SECRET as string) as Payload;
    request.user_id = sub;
    return next(); // Deixa que a requisição prossiga
  } catch (error) {
    return response.status(401).end();
  }
}
