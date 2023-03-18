import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'databasesEntity' })
export class DatabasesEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'username', type: 'varchar', length: 24, unique: true, nullable: false })
  username: string;

  @Column({ name: 'ServerName', type: 'varchar', length: 16, nullable: false })
  ServerName: string; //name

  @Column({ name: 'ServerType', type: 'varchar', length: 20, nullable: false })
  ServerType: string; // client

  @Column({ name: 'ServerHost', type: 'text', nullable: false })
  ServerHost: string;

  @Column({ name: 'ServerPort', type: 'int', nullable: false })
  ServerPort: number;

  @Column({ name: 'ServerUsername', type: 'text', nullable: false })
  ServerUsername: string;

  @Column({ name: 'ServerPassword', type: 'text', nullable: false })
  ServerPassword: string;

  @Column({ name: 'DatabaseName', type: 'text', nullable: false })
  DatabaseName: string;
}
