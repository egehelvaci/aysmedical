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
    onDelete: "CASCADE",
    lazy: true
  })
  localizations: Promise<any[]>;

  @OneToMany("ProductFeature", "product", {
    cascade: true,
    onDelete: "CASCADE",
    lazy: true
  })
  features: Promise<any[]>;

  @OneToMany("ProductDetail", "product", {
    cascade: true,
    onDelete: "CASCADE",
    lazy: true
  })
  details: Promise<any[]>;

  @OneToMany("ProductUsageArea", "product", {
    cascade: true,
    onDelete: "CASCADE",
    lazy: true
  })
  usageAreas: Promise<any[]>;
} 