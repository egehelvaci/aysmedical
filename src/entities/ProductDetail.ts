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
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "productId" })
  product: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 