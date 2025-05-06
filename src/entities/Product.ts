import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  image_url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany("ProductLocalization", "product", {
    cascade: true,
    onDelete: "CASCADE"
  })
  localizations: any[];

  @OneToMany("ProductFeature", "product", {
    cascade: true,
    onDelete: "CASCADE"
  })
  features: any[];

  @OneToMany("ProductDetail", "product", {
    cascade: true,
    onDelete: "CASCADE"
  })
  details: any[];

  @OneToMany("ProductUsageArea", "product", {
    cascade: true,
    onDelete: "CASCADE"
  })
  usageAreas: any[];
} 