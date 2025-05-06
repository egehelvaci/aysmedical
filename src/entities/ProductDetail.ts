import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class ProductDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  languageCode: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  content: string;

  @ManyToOne("Product", "details", {
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