import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidIdentificationException extends HttpException {
  constructor() {
    super('Identificación inválida', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidPasswordException extends HttpException {
  constructor() {
    super('Contraseña inválida', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidEmailException extends HttpException {
  constructor() {
    super('Email inválido', HttpStatus.BAD_REQUEST);
  }
}
