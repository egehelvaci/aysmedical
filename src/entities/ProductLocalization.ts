import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";

@Entity()
@Unique(["productId", "languageCode"])
export class ProductLocalization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  languageCode: string;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  slug: string;

  @ManyToOne("Product", "localizations", {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "productId" })
  product: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 