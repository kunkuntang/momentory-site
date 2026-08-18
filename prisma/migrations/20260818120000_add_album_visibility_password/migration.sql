-- AddColumn: is_hidden to albums
ALTER TABLE `albums` ADD COLUMN `is_hidden` BOOLEAN NOT NULL DEFAULT false;

-- AddColumn: password_hash to albums
ALTER TABLE `albums` ADD COLUMN `password_hash` VARCHAR(255) NULL;
