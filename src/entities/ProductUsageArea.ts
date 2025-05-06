import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class ProductUsageArea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  languageCode: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @ManyToOne("Product", "usageAreas", {
    onDelete: "CASCADE",
    lazy: true
  })
  @JoinColumn({ name: "productId" })
  product: Promise<any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 