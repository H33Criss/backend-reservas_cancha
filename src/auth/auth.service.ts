import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

@Injectable()
export class AuthService {
  private client: OAuth2Client;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  }
  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getjwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }
  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
        select: {
          email: true,
          password: true,
          id: true,
          fullName: true,
          imageUrl: true,
          roles: true,
        },
      });
      console.log({ user });
      if (!user) {
        throw new UnauthorizedException('Credenciales no validas');
      }
      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Credenciales no validas');
      }
      delete user.password
      delete user.isActive
      return {
        ...user,
        token: this.getjwtToken({ id: user.id }),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
      // return error;
      // this.handleDbErrors(error);
    }
  }


  private getjwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
  async verifyGoogleToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_CLIENT_ID,
        process.env.WEB_GOOGLE_CLIENT_ID,
      ],
    });
    const payload = ticket.getPayload();
    return payload;
  }

  async renewToken(idToken: string) {
    try {
      // Verificar el token (aunque esté caducado)
      const payload = this.jwtService.decode(idToken) as JwtPayload;

      if (!payload || !payload.id) {
        throw new UnauthorizedException('Token no válido');
      }

      const user = await this.getUserById(payload.id);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Generar un nuevo token JWT
      const newToken = this.getjwtToken({ id: user.id });

      // Devolver el usuario y el nuevo token
      delete user.password;
      delete user.isActive;
      return {
        ...user,
        token: newToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Token no válido');
    }
  }


  //TokenPayload --> from auth-library
  async findOrCreateGoogleUser(payload: TokenPayload) {
    const { email, name, picture } = payload;
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      user = this.userRepository.create({
        fullName: name,
        email,
        imageUrl: picture,
        password: '', // No password for Google users
        roles: ['user'],
      });

      try {
        await this.userRepository.save(user);
      } catch (error) {
        this.handleDbErrors(error);
      }
    }
    const token = this.getjwtToken({ id: user.id });
    delete user.password
    delete user.isActive
    return {
      ...user,
      token,
    };
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);

    throw new InternalServerErrorException(
      'Ocurrio un error no controlado, mirar los Logs.',
    );
  }

}
