import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1715000000000 implements MigrationInterface {
    name = 'InitialSchema1715000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Enums
        await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM('admin', 'barber', 'client')`);
        await queryRunner.query(`CREATE TYPE "bookings_status_enum" AS ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show')`);
        await queryRunner.query(`CREATE TYPE "queue_entries_status_enum" AS ENUM('waiting', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "notifications_type_enum" AS ENUM('sms', 'email', 'push')`);
        await queryRunner.query(`CREATE TYPE "notifications_status_enum" AS ENUM('scheduled', 'sent', 'failed')`);

        // Create Tables
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "full_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "users_role_enum" NOT NULL DEFAULT 'client', CONSTRAINT "UQ_97672db88833958108833e89963" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "barbers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "specialties" text NOT NULL DEFAULT '{}', "working_hours" jsonb, "is_active" boolean NOT NULL DEFAULT true, "default_commission_rate" numeric(5,2) NOT NULL DEFAULT '0.6', CONSTRAINT "REL_78931983912389123891238912" UNIQUE ("user_id"), CONSTRAINT "PK_b89123891238912389123891238" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" text, "duration_minutes" integer NOT NULL, "price" numeric(10,2) NOT NULL, "category" character varying, CONSTRAINT "PK_services_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "full_name" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying, "visit_count" integer NOT NULL DEFAULT 0, "notes" text, CONSTRAINT "UQ_clients_phone" UNIQUE ("phone"), CONSTRAINT "PK_clients_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "barber_id" uuid NOT NULL, "client_id" uuid NOT NULL, "service_id" uuid NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "status" "bookings_status_enum" NOT NULL DEFAULT 'pending', "total_price" numeric(10,2) NOT NULL, CONSTRAINT "PK_bookings_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "queue_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "client_id" uuid NOT NULL, "barber_id" uuid, "position" integer NOT NULL, "status" "queue_entries_status_enum" NOT NULL DEFAULT 'waiting', "estimated_wait_minutes" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_queue_entries_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "client_id" uuid NOT NULL, "type" "notifications_type_enum" NOT NULL, "message" text NOT NULL, "scheduled_at" TIMESTAMP NOT NULL, "sent_at" TIMESTAMP, "status" "notifications_status_enum" NOT NULL DEFAULT 'scheduled', CONSTRAINT "PK_notifications_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "commissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "barber_id" uuid NOT NULL, "booking_id" uuid NOT NULL, "amount" numeric(10,2) NOT NULL, "applied_rate" numeric(5,2) NOT NULL, "paid_at" TIMESTAMP, CONSTRAINT "UQ_commissions_booking" UNIQUE ("booking_id"), CONSTRAINT "PK_commissions_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "barber_services" ("barber_id" uuid NOT NULL, "service_id" uuid NOT NULL, CONSTRAINT "PK_barber_services" PRIMARY KEY ("barber_id", "service_id"))`);

        // Add Foreign Keys
        await queryRunner.query(`ALTER TABLE "barbers" ADD CONSTRAINT "FK_barbers_users" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_bookings_barbers" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_bookings_clients" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_bookings_services" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queue_entries" ADD CONSTRAINT "FK_queue_clients" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queue_entries" ADD CONSTRAINT "FK_queue_barbers" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_notifications_clients" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commissions" ADD CONSTRAINT "FK_commissions_barbers" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commissions" ADD CONSTRAINT "FK_commissions_bookings" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "barber_services" ADD CONSTRAINT "FK_bs_barber" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "barber_services" ADD CONSTRAINT "FK_bs_service" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`);

        // Create Indexes
        await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_barbers_active" ON "barbers" ("is_active")`);
        await queryRunner.query(`CREATE INDEX "IDX_clients_phone" ON "clients" ("phone")`);
        await queryRunner.query(`CREATE INDEX "IDX_bookings_barber" ON "bookings" ("barber_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_bookings_client" ON "bookings" ("client_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_bookings_start" ON "bookings" ("start_time")`);
        await queryRunner.query(`CREATE INDEX "IDX_bookings_status" ON "bookings" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_queue_status" ON "queue_entries" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_notifications_scheduled" ON "notifications" ("scheduled_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_commissions_paid" ON "commissions" ("paid_at")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "barber_services"`);
        await queryRunner.query(`DROP TABLE "commissions"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "queue_entries"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "barbers"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "notifications_status_enum"`);
        await queryRunner.query(`DROP TYPE "notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "queue_entries_status_enum"`);
        await queryRunner.query(`DROP TYPE "bookings_status_enum"`);
        await queryRunner.query(`DROP TYPE "users_role_enum"`);
    }
}