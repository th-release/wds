import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'authEntity' })
export class AuthEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ name: 'isVerify', type: 'bool', nullable: false, default: false })
  isVerify: boolean;

  @Column({ name: 'username', type: 'varchar', length: 24, unique: true, nullable: false })
  username: string;

  @Column({ name: 'password', type: 'text', nullable: false })
  password: string;

  @Column({ name: 'salt', type: 'varchar', length: 32, nullable: false })
  salt: string;
}
